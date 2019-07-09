/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('Get user orders', () => {
  describe('Buyers', () => {
    it('should get orders belonging to a user', (done) => {
      // sign up a user to get auth token
      const user = {
        email: 'Bobmartins2@gmail.com',
        password: 'bobbing',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .get('/api/v1/order')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((getErr, getRes) => {
            getRes.should.have.status(200);
            getRes.body.data[0].buyer.should.equal(+res.body.data.id);
            getRes.body.data.should.be.a('array');
            done();
          });
      });
    });
  });
  describe('Sellers', () => {
    it('should get orders for a seller post', (done) => {
      // sign up a user to get auth token
      const user = {
        email: 'Bobmartins2@gmail.com',
        password: 'bobbing',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .get('/api/v1/order/seller/orders')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((getErr, getRes) => {
            getRes.should.have.status(200);
            getRes.body.data.should.be.a('array');
            done();
          });
      });
    });
  });
});
