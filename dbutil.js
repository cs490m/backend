// Database Connection
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/sensors", { native_parser:true });

/* Retrieves all sensor data based on the given request.
  req: An object that defines the query in the form:
  {
    'userId': 'some user id',
    'start': 'the start of a time interval',
    'end': 'the end of a time interval'
  }

  callback: A function to call to deliver the results as an array of objects.
*/
function getUserData (req, callback) {
  db.collection('datalist').find({
    'id': req.userId,
    'time': {
      '$gte': req.start,
      '$lt': req.end
    }
  }).toArray(callback);
};


/* Saves the provided sensor data.
  data: The data to save. Can provide an object or an array of objects.
  callback: A function to call to deliver the success/failure of the save.
*/
function saveData (data, callback) {
  db.collection('datalist').insert(data, callback);
}