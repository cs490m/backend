/**
 * Created by jcm1317 on 10/13/14.
 */

var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:8080');

describe('backend api server', function() {
    var userId = 42;

    it('posts an object', function(done){
        api.post('/api/user_data')
            .send({ data: {
                id: userId,
                time: '1000',
                sensorData: 'none'
            }})
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('gets an object', function() {
        api.get('/api/get_user_data/' + userId + '/0/10000')
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null);
                expect(typeof res.body).to.eql('object');
                expect(res.body._id).to.eql(userId);
                done()
            });
    });
});
