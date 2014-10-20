var express = require('express');
var router = express.Router();

/**
 * post data on user. For now we assume the userid is unique and persitant to each user.
 */
router.route('/user_data').post(function(req, res) {
    //console.log(req.body);
    var db = req.db;
    var result = {};
    result.received = req.body.length;
    result.inserted = 0;
    for (var i = 0; i < result.received; i++) {
        var tuple = req.body[i];
        console.log(tuple);
        if (tuple.id != null && tuple.type != null && tuple.time != null) {
            tuple.time = parseInt(tuple.time); // important so we can do range queries on time
            result.inserted++;
            db.collection('datalist').insert(tuple, function(err, result) {
                if (err != null) {
                    console.log(err);
                    res.status(500).send({ error: 'Internal database error. Please try again later.' });
                } else {
                    result.msg = "received " + result.received + ", inserted " + result.inserted;
                    res.send(result);
                }
            });
        } else {
            res.status(400).send({error: 'Expected an id, type, and time.'});
        }
    }
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
    if (req.query.type != null)
        query["type"] = req.query.type;
    if (req.query.start != null || req.query.end != null)
        query["time"] = {};
    if (req.query.start != null)
        query.time["$gte"] = parseInt(req.query.start);
    if (req.query.end != null)
        query.time["$lt"] = parseInt(req.query.end);

    console.log("Performing query : " + JSON.stringify(query));

    db.collection('datalist').find(query).toArray(function(err, result) {
        res.send((err === null) ? result : { msg:'error: ' + err });
    });
});


module.exports = router;
