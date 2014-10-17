var express = require('express');
var router = express.Router();

/**
 * post data on user. For now we assume the userid is unique and persitant to each user.
 */
router.route('/user_data').post(function(req, res) {
    console.log(req.body);

    //Currently not doing any error checking.
    var db = req.db;
    db.collection('datalist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 *  Get data on user :id, from start time :start until end time :end
 */
router.route('/user_data/:id/:start/:end').get(function(req, res) {
    var db = req.db;
    console.log(req.params);

    db.collection('datalist').find({
        'id': req.params.id,
        'time': {
            '$gte': req.params.start,
            '$lt': req.params.end
        }
    }).toArray(function(err, result) {
        res.send((err === null) ? result : { msg:'error: ' + err });
    });
});

/**
 *  Get data with query string
 */
router.route('/user_data').get(function(req, res) {
    var db = req.db;

    var query = {};
    if (req.query.id != null)
        query["id"] = req.query.id;
    if (req.query.start != null || req.query.end != null)
        query["time"] = {};
    if (req.query.start != null)
        query.time["$gte"] = parseInt(req.query.start);
    if (req.query.end != null)
        query.time["$lte"] = parseInt(req.query.end);
    console.log(query);

    db.collection('datalist').find(query).toArray(function(err, result) {
        res.send((err === null) ? result : { msg:'error: ' + err });
    });
});


module.exports = router;
