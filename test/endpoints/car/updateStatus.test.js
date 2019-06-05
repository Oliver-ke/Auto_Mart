/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();

describe('api/v1/car/{car_id}/status', () => {
  describe('PATCH', () => {
    it('Should update car status', (done) => {
      const user = {
        email: 'test@gmail.com',
        password: 'test',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .patch('/api/v1/car/4/status')
          .send({ status: 'sold' })
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((carErr, carRes) => {
            carRes.should.have.status(200);
            carRes.body.should.be.a('object');
            carRes.body.data.should.have.property('status');
            carRes.body.data.status.should.equal('sold');
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
          .patch('/api/v1/car/wrongId/status')
          .send({ status: 'sold' })
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
