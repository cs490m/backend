/**
 * Created by jcm1317 on 10/6/14.
 */

module.exports = function(app) {

    /**
     * Show the homepage
     */
    app.get('/', function(req, res) {
        res.render('index.ejs')
    });

};