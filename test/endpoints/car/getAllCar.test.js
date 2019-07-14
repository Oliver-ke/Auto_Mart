/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();

describe('api/v1/car/', () => {
  describe('GET', () => {
    it('should get all cars for admin', (done) => {
      const user = {
        email: 'isAdmin@gmail.com',
        password: 'admin',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .get('/api/v1/car/')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((carErr, carRes) => {
            carRes.should.have.status(200);
            carRes.body.should.be.a('object');
            carRes.body.should.have.property('data');
            carRes.body.data.should.be.a('array');
            done();
          });
      });
    });
  });
});
