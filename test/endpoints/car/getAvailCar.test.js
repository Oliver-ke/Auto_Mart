/* global describe it */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server');

chai.use(chaiHttp);
chai.should();
describe('api/v1/car?status=available || min_price&max_prce', () => {
  describe('GET', () => {
    it('Should get cars with status available', (done) => {
      chai.request(app).get('/api/v1/car?status=available').end((carErr, carRes) => {
        carRes.should.have.status(200);
        carRes.body.should.be.a('object');
        carRes.body.should.have.property('data');
        carRes.body.data[0].status.should.equal('available');
        done();
      });
    });
    it('Should error for invalid query parameter', (done) => {
      chai.request(app).get('/api/v1/car?status=34jjdkr').end((carErr, carRes) => {
        carRes.should.have.status(400);
        carRes.body.should.be.a('object');
        carRes.body.should.have.property('error');
        done();
      });
    });
    it('Should accept max_price and min_price query', (done) => {
      chai
        .request(app)
        .get('/api/v1/car?status=available&min_price=1500&max_price=20000')
        .end((carErr, carRes) => {
          carRes.should.have.status(200);
          carRes.body.should.be.a('object');
          carRes.body.data[0].price.should.be.above(1499);
          carRes.body.data[0].price.should.be.below(20001);
          carRes.body.should.have.property('data');
          carRes.body.data.should.be.a('array');
          done();
        });
    });
  });
});
