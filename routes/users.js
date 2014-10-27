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
        if (req.body[i].id != null &&
            req.body[i].type != null &&
            req.body[i].time != null &&
            req.body[i].value != null) {

            req.body[i] = parseValues(req.body[i]);
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
            if (err == null) {
                if (req.query.queryFunc != null) {
                    try {
                        var data = result;
                        var func = new Function('data', req.query.queryFunc);
                        data = func(data);
                        console.log(typeof data);
                        res.send({ 'result' : data });
                        // var func = new Function('data', 'res', req.query.queryFunc + " res.send(data);");
                        // func(data, res);
                    }
                    catch (err) {
                        console.log(err);
                        res.send({ msg:'bad function : ' + err.message});
                    }
                } else
                    res.send(result);
            } else {
                res.send({ msg:'error: ' + err });
            }
        });
    } else {
        res.status(400).send({error: 'Expected an id, type, or start/end time.'});
    }
});

function parseValues(data) {
    var floatTypes = [
        'TYPE_ACCELEROMETER',
        'TYPE_AMBIENT_TEMPERATURE',
        'TYPE_GAME_ROTATION_VECTOR',
        'TYPE_GEOMAGNETIC_ROTATION_VECTOR',
        'TYPE_GRAVITY',
        'TYPE_GYROSCOPE',
        'TYPE_GYROSCOPE_UNCALIBRATED',
        'TYPE_LIGHT',
        'TYPE_LINEAR_ACCELERATION',
        'TYPE_MAGNETIC_FIELD',
        'TYPE_MAGNETIC_FIELD_UNCALIBRATED',
        'TYPE_ORIENTATION',
        'TYPE_PRESSURE',
        'TYPE_PROXIMITY',
        'TYPE_RELATIVE_HUMIDITY',
        'TYPE_ROTATION_VECTOR',
        'TYPE_SIGNIFICANT_MOTION',
        'TYPE_STEP_COUNTER',
        'TYPE_STEP_DETECTOR',
        'TYPE_TEMPERATURE'
    ];

    // important so we can do range queries on time
    data.time = parseInt(data.time);

    // parse data fields
    if (floatTypes.indexOf(data.type) != -1) {
        data.value = JSON.parse(data.value).map(function(item) { return parseFloat(item); });
    }

    return data;
}

module.exports = router;