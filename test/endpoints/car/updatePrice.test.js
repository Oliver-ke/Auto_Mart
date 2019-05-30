/* global describe it */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server');

chai.use(chaiHttp);
chai.should();
describe('api/v1/car/{car_id}/price', () => {
  describe('PATCH', () => {
    it('Should update car price', (done) => {
      const user = {
        email: 'test@gmail.com',
        password: 'test',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .patch('/api/v1/car/4/price')
          .send({ price: 45990.99 })
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((carErr, carRes) => {
            carRes.should.have.status(200);
            carRes.body.should.be.a('object');
            carRes.body.data.should.have.property('status');
            done();
          });
      });
    });
    it('Should error invalid request parameters', (done) => {
      const user = {
        email: 'JohnDoe@gmail.com',
        password: 'hello',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .patch('/api/v1/car/wrongId/price')
          .send({ price: 98884.66 })
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((carErr, carRes) => {
            carRes.should.have.status(400);
            carRes.body.should.be.a('object');
            carRes.body.should.have.property('error');
            done();
          });
      });
    });
  });
});
