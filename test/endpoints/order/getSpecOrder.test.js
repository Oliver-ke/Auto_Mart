/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('Get Order', () => {
  describe('GET', () => {
    it('should get specific order', (done) => {
      chai.request(app).get('/api/v1/order/1').end((getErr, getRes) => {
        getRes.should.have.status(200);
        getRes.body.data.should.be.a('object');
        done();
      });
    });
    it('should send 404 status for none existing order', (done) => {
      chai.request(app).get('/api/v1/order/4000').end((getErr, getRes) => {
        getRes.should.have.status(404);
        getRes.body.should.have.property('error');
        done();
      });
    });
  });
});
