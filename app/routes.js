/**
 * Created by jcm1317 on 10/6/14.
 */

module.exports = function(app, router) {

    /**
     * Show the homepage
     */
    router.get('/', function(req, res) {
        res.render('/var/www/html/index.ejs')
    });


    // post data on user. For now we assume the userid is unique and persitant to each user.
    //
    router.route('/get_users').post(function(req, res) {

        if (!req.body.hasOwnProperty('userId') ||
            !req.body.hasOwnProperty('timestamp') ||
            !req.body.hasOwnProperty('sensorData')) {

            // log bad request
            res.statusCode = 400;
            return res.send('Error 400 : missing request data');
        }
        //myDb.add_data(req.body.userId, req.body.timestamp, req.body.sensorData);
    });

    app.use('/api', router);

};
