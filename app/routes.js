/**
 * Created by jcm1317 on 10/6/14.
 */

module.exports = function(app, router) {

    var dbUtil = require('../dbutil.js');
    /**
     * Show the homepage
     */
    app.get('/', function(req, res) {
        res.render('../views/index.ejs')
    });


    // post data on user. For now we assume the userid is unique and persitant to each user.
    //
    router.route('/user_data').post(function(req, res) {

        console.log('Attempted POST' + req.body);

        if (!req.body.hasOwnProperty('data')) {
            // log bad request
            res.statusCode = 400;
            return res.send('Error 400 : missing request data');
        }
        dbUtil.saveData(req.body.data, function(err, results) {
            if (err) {
                res.statusCode = 500;
                res.send('Error 500: Failed to add to database');
            } else {
                res.send(200);
            }
        });

    });

    router.route('/get_user_data/:id/:start/:end').get(function(req, res) {
        console.log('Attempted GET' + req.params);

        var data = getUserData(req.params, function(err, results) {
            if (err) {
                res.statusCode = 500;
                res.send('Error 500: Failed to retrieve from database')
            } else {
                res.send(results)
            }
        });
    });

    app.use('/api', router);

};
