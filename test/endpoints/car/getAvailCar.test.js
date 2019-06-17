/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

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
    it('Should get car between max_price and min_price query', (done) => {
      chai
        .request(app)
        .get('/api/v1/car?status=available&min_price=1000&max_price=20000')
        .end((carErr, carRes) => {
          const firstItemPrice = Number(carRes.body.data[0].price);
          carRes.should.have.status(200);
          carRes.body.should.be.a('object');
          firstItemPrice.should.be.above(999);
          firstItemPrice.should.be.below(20001);
          carRes.body.should.have.property('data');
          carRes.body.data.should.be.a('array');
          done();
        });
    });
    // it('Should get cars of a particular state', (done) => {
    //   chai.request(app).get('/api/v1/car?status=available&state=new').end((carErr, carRes) => {
    //     carRes.should.have.status(200);
    //     carRes.body.should.be.a('object');
    //     carRes.body.data[0].state.should.equal('new');
    //     carRes.body.data[0].status.should.equal('available');
    //     carRes.body.should.have.property('data');
    //     carRes.body.data.should.be.a('array');
    //     done();
    //   });
    // });
    // it('Should get cars of specific body_type', (done) => {
    //   chai.request(app).get('/api/v1/car?status=available&body_type=jeep').end((carErr, carRes) => {
    //     carRes.should.have.status(200);
    //     carRes.body.should.be.a('object');
    //     carRes.body.data[0].body_type.should.equal('jeep');
    //     carRes.body.data[0].status.should.equal('available');
    //     carRes.body.should.have.property('data');
    //     carRes.body.data.should.be.a('array');
    //     done();
    //   });
    // });
  });
});
