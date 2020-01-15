const functions = require('firebase-functions');
const admin = require('firebase-admin')
const app = require('express')();
admin.initializeApp();

const config = {
    apiKey: "AIzaSyD-4HqlcLaMHkgDYwVs9khqMIeiPuwh1Rc",
    authDomain: "socialapp-d637d.firebaseapp.com",
    databaseURL: "https://socialapp-d637d.firebaseio.com",
    projectId: "socialapp-d637d",
    storageBucket: "socialapp-d637d.appspot.com",
    messagingSenderId: "1052041606852",
    appId: "1:1052041606852:web:6a5114c1e8bb1817d73b91"
};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/screams', (req, res) => {
    db
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let screams = [];
            data.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(screams);
        })
        .catch(err => console.error(err));
});

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db
        .collection('screams')
        .add(newScream)
        .then(doc => {
            return res.json( {message: `document ${doc.id} created successfully` });
        })
        .catch(err => {
            res.status(500).json( {error: 'something went wrong'} );
            console.error(err);
        });
});

const isEmail = (email) => {
    const regEx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

// Signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    let errors = {};

    if(isEmpty(newUser.email)) {
        errors.email = "Must not be empty";
    }
    else if (!isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address';
    }

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must be the same';
    if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty';

    if(Object.keys(errors).length > 0) { return res.status(400).json(errors);}

    let token, userId;
    db
        .doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if(doc.exists){
                return res.status(400).json({ handle: 'this handle is already taken'});
            }
            else {
                return firebase
                            .auth()
                            .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            db
                .doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json( { token });
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already in use' });
            }
            else {
                return res.status(500).json( {error: err.code} );
            }
        });


});

// Login route

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {};

    if(isEmpty(user.email)) errors.email = 'Must not be empty';
    if(isEmpty(user.password)) errors.password = 'Must not be empty';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json( {token} );
        })
        .catch((err) => {
            console.error(err);
            if(err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                return res.status(403).json({ general: 'Wrong credentials, please try again'});
            }
            else {
                return res.status(500).json( {error: err.code });
            }
        });
})

exports.api = functions.https.onRequest(app);