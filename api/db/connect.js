const { MongoClient, ServerApiVersion } = require('mongodb');

const username = encodeURIComponent(process.env.MONGO_USERID);

const userpass = encodeURIComponent(process.env.MONGO_USERPASS);

const uri = `mongodb+srv://${username}:${userpass}@cluster0.vxrxnqu.mongodb.net/?retryWrites=true&w=majority`;

let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, function(err, database) {
   db = database;
   console.log(db); // shows stuff
});

module.exports = {
  db
}
