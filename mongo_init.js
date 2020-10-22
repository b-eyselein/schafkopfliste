db.auth('root', '1234');

db.createUser({
    user: 'skl',
    pwd: '1234',
    roles: [{role: 'readWrite', db: 'skl'}]
});

const ruleSetsCollection = db.getCollection('ruleSets');

ruleSetsCollection.createIndex({name: 1}, {unique: true});
