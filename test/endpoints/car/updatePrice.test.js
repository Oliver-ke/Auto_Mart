/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();

describe('api/v1/car/{car_id}/status', () => {
  describe('PATCH', () => {
    it('Should update car price', (done) => {
      const user = {
        email: 'unclebob@gmail.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        const newCarAd = {
          state: 'used',
          price: '8999990',
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
              .patch(`/api/v1/car/${carPostRes.body.data.id}/price`)
              .send({ price: 600000 })
              .set('authorization', `Bearer ${res.body.data.token}`)
              .end((carErr, carRes) => {
                carRes.should.have.status(200);
                carRes.body.should.be.a('object');
                carRes.body.data.should.have.property('price');
                carRes.body.data.price.should.equal(600000);
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
          .patch('/api/v1/car/10004/price')
          .send({ price: 500080000 })
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((carErr, carRes) => {
            carRes.should.have.status(404);
            carRes.body.should.be.a('object');
            carRes.body.should.have.property('error');
            done();
          });
      });
    });
    it('Should only update car owned by the current user', (done) => {
      const user = {
        email: 'unclebob@gmail.com',
        password: 'password',
      };
      // this use does not have car with id 1
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .patch('/api/v1/car/1/price')
          .send({ price: 328889900.98 })
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
