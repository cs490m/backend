var express = require('express');
var router = express.Router();

/**
 * post data on user. For now we assume the userid is unique and persitant to each user.
 */
router.route('/user_data').post(function(req, res) {
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
    db.collection('datalist').find({
        'id': req.params.id,
        'time': {
            '$gte': req.params.start,
            '$lt': req.params.end
        }
    }).toArray(function(err, result) {
        res.send((err === null) ? res.json(result) : { msg:'error: ' + err });
    });
});


module.exports = router;
