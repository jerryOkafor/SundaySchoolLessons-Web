const admin = require('firebase-admin');
const fs = require('fs')

var serviceAccount = require("./ssl-dev-service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const dumped = {};

const schema = {
    Users: {},
    Posts: {
        Comments: {},
        Likes: {}
    },
    Books: {
        Lessons: {
            Readers: {}
        },

    }
};


var db = admin.firestore();
const dump = (dbRef, aux, curr) => {
    return Promise.all(Object.keys(aux).map((collection) => {
        return dbRef.collection(collection).get()
            .then((data) => {
                let promises = [];
                data.forEach((doc) => {
                    const data = doc.data();
                    if (!curr[collection]) {
                        curr[collection] = {
                            data: {},
                            type: 'collection',
                        };
                        curr[collection].data[doc.id] = {
                            data,
                            type: 'document',
                        }
                    } else {
                        curr[collection].data[doc.id] = data;
                    }
                    promises.push(dump(dbRef.collection(collection).doc(doc.id), aux[collection], curr[collection].data[doc.id]));
                })
                return Promise.all(promises);
            });
    })).then(() => {
        return curr;
    })
};
let aux = { ...schema };
let answer = {};
dump(db, aux, answer).then((answer) => {
    var jsonData = JSON.stringify(answer, null, 4);
    fs.writeFile("export-" + Date() + ".json", jsonData, function (err) {
        if (err) {
            console.log(err)
        }
    })
});