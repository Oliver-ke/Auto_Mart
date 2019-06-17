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
        email: 'unclebob@gmail.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        const newCarAd = {
          state: 'new',
          price: '12300.5',
          manufacturer: 'Toyota',
          model: 'Honda',
          body_type: 'jeep',
        };
        chai
          .request(app)
          .post('/api/v1/car')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newCarAd)
          .end((carPostErr, carPostRes) => {
            chai
              .request(app)
              .patch(`/api/v1/car/${carPostRes.body.data.id}/status`)
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
    });
    it('Should error for none exiting car id', (done) => {
      const user = {
        email: 'testUser@gmail.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .patch('/api/v1/car/10004/status')
          .send({ status: 'sold' })
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((carErr, carRes) => {
            carRes.should.have.status(404);
            carRes.body.should.be.a('object');
            carRes.body.should.have.property('error');
            done();
          });
      });
    });
  });
});
