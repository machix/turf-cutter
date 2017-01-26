const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;

dotenv.load();

const dbUrl = process.env.MLAB_DB_URL;
const dbUser = process.env.MLAB_DB_USER;
const dbPass = process.env.MLAB_DB_PASS;

let db;

module.exports = {
  connectToServer (callback) {
    MongoClient.connect(`mongodb://${dbUser}:${dbPass}@${dbUrl}`,
      (err, database) => {
        if (err) throw err;

        db = database;
        return callback(err);
      });
  },

  getDb() {
    return db;
  }
};
