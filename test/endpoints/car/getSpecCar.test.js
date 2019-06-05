/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('api/v1/car/{car_id}', () => {
  describe('GET', () => {
    it('Should get car with the given car_id', (done) => {
      chai.request(app).get('/api/v1/car/2').end((carErr, carRes) => {
        carRes.should.have.status(200);
        carRes.body.should.be.a('object');
        carRes.body.should.have.property('data');
        done();
      });
    });
    it('Should error for none existing car_id', (done) => {
      chai.request(app).get('/api/v1/car/1000').end((carErr, carRes) => {
        carRes.should.have.status(404);
        carRes.body.should.be.a('object');
        carRes.body.should.have.property('error');
        done();
      });
    });
    it('Should error for invalid car_id', (done) => {
      chai.request(app).get('/api/v1/car/ftk987').end((carErr, carRes) => {
        carRes.should.have.status(400);
        carRes.body.should.be.a('object');
        carRes.body.should.have.property('error');
        done();
      });
    });
  });
});
