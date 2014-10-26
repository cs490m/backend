/**
 * Created by jcm1317 on 10/13/14.
 */

var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:8080');

describe('backend api server', function() {
    var userId = 'test42';

    it('post an object', function(done){
        api.post('/api/user_data')
            .send({ data: {
                id: userId,
                time: '1000',
                type: 'none',
                value: '66666666'
            }})
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('post an object as single element array', function(done) {
        api.post('/api/user_data')
            .send([
            {
                id: userId,
                time: '1000',
                type: 'none',
                value: '44444444'
            }
            ])
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('post an array of objects', function(done) {
        api.post('/api/user_data')
            .send([
                {
                    id: userId,
                    time: '2000',
                    type: 'super sensor',
                    value: '11111111'
                },
                {
                    id: userId,
                    time: '3000',
                    type: 'TYPE_ACCELEROMETER',
                    value: [111.2222, 222.3333, 333.4444]
                },
                {
                    id: userId,
                    time: '4000',
                    type: 'TYPE_LIGHT',
                    value: ['111.2222', '222.3333', '333.4444']
                },
            ])
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('get data for a user & time range', function(done) {
        api.get('/api/user_data?id=' + userId + '&start=0&end=10000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });

    it('get data fail: missing necessary params', function(done) {
        api.get('/api/user_data?dog=domino&cat=cello')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done)
    });
});