var express = require('express');
var router = express.Router();

/**
 * post data on user. For now we assume the userid is unique and persitant to each user.
 */
router.route('/user_data').post(function(req, res) {
    var db = req.db;
    var result = {};
    result.received = req.body.length;
    result.inserted = 0;
    var status;
    for (i = 0; i < result.received; i++) {
        if (req.body[i].id != null && req.body[i].type != null && req.body[i].time != null) {
            req.body[i].time = parseInt(req.body[i].time); // important so we can do range queries on time
            result.inserted++;
        } else {
            status = 400;
        }
    }
    if (!status) {
        db.collection('datalist').insert(req.body, function(err, result) {
            if (err != null) {
                console.log('Error inserting data: ' + err);
                res.status(500).send({ error: 'Internal database error. Please try again later.' });
            } else {
                result.msg = "received " + result.received + ", inserted " + result.inserted;
                res.send(result);
            }
        });
    } else {
        res.status(400).send({error: 'Expected an id, type, and time.'});
    }
});

/**
 *  Get data on user :id, from start time :start until end time :end
 */
router.route('/user_data/:id/:start/:end').get(function(req, res) {
    var db = req.db;

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
    var valid = false;

    // collect the request params
    if (req.query.id != null) {
        query["id"] = req.query.id;
        valid = true;
    }
    if (req.query.type != null) {
        query["type"] = req.query.type;
        valid = true;
    }
    if (req.query.start != null || req.query.end != null) {
        query["time"] = {};
        valid = true;
    }
    if (req.query.start != null) {
        query.time["$gte"] = parseInt(req.query.start);
        valid = true;
    }
    if (req.query.end != null) {
        query.time["$lt"] = parseInt(req.query.end);
        valid = true;
    }

    if (valid) {
        console.log("Performing query : " + JSON.stringify(query));

        db.collection('datalist').find(query).toArray(function(err, result) {
            res.send((err === null) ? result : { msg:'error: ' + err });
        });
    } else {
        res.status(400).send({error: 'Expected an id, type, or start/end time.'});
    }
});

module.exports = router;