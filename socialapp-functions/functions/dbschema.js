let db = {
    users: [
        {
            userId: 'M0ZNXoNVHceGCsdIR9hNAFIQYuN2',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2019-03-15T11:59:01.798Z',
            imageUrl: 'image/zfsdfdfdgs',
            bio: 'Hello, my name is user',
            website: 'https://user.com',
            location: 'London, UK'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'This is a sample scream',
            createdAt: '2019-03-15T10:59:52.798Z',
            likeCount: 5,
            commentCount: 3
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: 'kdjsfgdksuufhgkdsufky',
            body: 'nice one mate!',
            createdAt: '2019-03-15T10:59:52.798Z'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john',
            read: 'true | false',
            screamId: 'kdjsfgdksuufhgkdsufky',
            type: 'like | comment',
            createdAt: '2019-03-15T10:59:52.798Z'
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
        bio: 'Hello2',
        createdAt: '2020-01-15T17:49:33.178Z',
        email: 'user@email.com',
        handle: 'user',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/socialapp-d637d.appspot.com/o/840761152997.png?alt=media',
        location: 'Mtl, CANADA',
        userId: 'M0ZNXoNVHceGCsdIR9hNAFIQYuN2',
        website: 'https://user.com'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: '6SCcYmSYwDNtm6fNH7X7'
        },
        {
            userHandle: 'user',
            screamId: 'Gc9cJXRrZC31xZyYeqT0'
        },
    ]
};