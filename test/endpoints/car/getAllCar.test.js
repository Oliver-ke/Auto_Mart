/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();

describe('api/v1/car/admin/cars', () => {
  describe('GET', () => {
    it('should get all cars for admin users', (done) => {
      const user = {
        email: 'isAdmin@gmail.com',
        password: 'admin',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .get('/api/v1/car/admin/cars')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((carErr, carRes) => {
            carRes.should.have.status(200);
            carRes.body.should.be.a('object');
            carRes.body.should.have.property('data');
            carRes.body.data.should.be.a('array');
            carRes.body.data[3].status.should.equal('sold');
            done();
          });
      });
    });
    it('should prevent access to none admin useers', (done) => {
      const user = {
        email: 'test@gmail.com',
        password: 'test',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .get('/api/v1/car/admin/cars')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((carErr, carRes) => {
            carRes.should.have.status(403);
            carRes.body.should.be.a('object');
            carRes.body.should.have.property('error');
            done();
          });
      });
    });
  });
});
