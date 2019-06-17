/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('api/v1/car', () => {
  describe('POST', () => {
    it('should prevent unauthorized users', (done) => {
      const newCarAd = {
        state: 'new',
        status: 'available',
        price: '123000098889.5',
        manufacturer: 'Toyota',
        model: 'Land Cruiser',
        body_type: 'Jeep',
      };
      chai
        .request(app)
        .post('/api/v1/car')
        .set('authorization', 'Bearer faketoken')
        .send(newCarAd)
        .end((carErr, carRes) => {
          carRes.should.have.status(401);
          carRes.body.should.have.property('error');
          done();
        });
    });
    it('should accept car post from authenticated users', (done) => {
      // sign up a user to get auth token
      const user = {
        email: 'testUser@gmail.com',
        password: 'password',
        first_name: 'Dominic',
        last_name: 'Paul',
        address: 'block 9 flat two elekahia estate ph',
        is_admin: false,
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
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
          .end((carErr, carRes) => {
            carRes.should.have.status(201);
            carRes.body.should.be.a('object');
            done();
          });
      });
    });
    it('Response should Have all necessary fields', (done) => {
      const user = {
        email: 'testUser@gmail.com',
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
          .end((carErr, carRes) => {
            carRes.should.have.status(201);
            carRes.body.should.be.a('object');
            carRes.body.should.property('status');
            carRes.body.should.property('data');
            carRes.body.data.should.property('owner');
            carRes.body.data.should.property('id');
            carRes.body.data.should.property('manufacturer');
            carRes.body.data.should.property('email');
            carRes.body.data.should.property('price');
            carRes.body.data.should.property('state');
            carRes.body.data.should.property('status');
            done();
          });
      });
    });
    it('Should default status to available when not provided', (done) => {
      const user = {
        email: 'testUser@gmail.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        const newCarAd = {
          state: 'new',
          price: '12300.5',
          manufacturer: 'Toyota',
          model: 'Honda Accord',
          body_type: 'car',
        };
        chai
          .request(app)
          .post('/api/v1/car')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newCarAd)
          .end((carErr, carRes) => {
            carRes.should.have.status(201);
            carRes.body.should.be.a('object');
            carRes.body.data.should.have.property('status');
            done();
          });
      });
    });
    it('State, status can either be used or new and sold, or available respectively', (done) => {
      const user = {
        email: 'testUser@gmail.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        const newCarAd = {
          state: 'something else',
          status: 'something else again',
          price: '12300.5',
          manufacturer: 'Toyota',
          model: 'Honda Accord',
          body_type: 'car',
        };
        chai
          .request(app)
          .post('/api/v1/car')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newCarAd)
          .end((carErr, carRes) => {
            carRes.should.have.status(400);
            carRes.body.errors.should.have.property('state');
            carRes.body.errors.should.have.property('status');
            done();
          });
      });
    });
    it('Should Error on missing parameters except status', (done) => {
      const user = {
        email: 'testUser@gmail.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        // post with missing body_type
        const newCarAd = {
          state: 'new',
        };
        chai
          .request(app)
          .post('/api/v1/car')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newCarAd)
          .end((carErr, carRes) => {
            carRes.should.have.status(400);
            carRes.body.should.property('errors');
            carRes.body.errors.should.have.property('price');
            carRes.body.errors.should.have.property('manufacturer');
            carRes.body.errors.should.have.property('model');
            done();
          });
      });
    });
    it('Should Error when given prince is not a number', (done) => {
      const user = {
        email: 'testUser@gmail.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        // post with missing body_type
        const newCarAd = {
          state: 'new',
          price: 'none number price',
          manufacturer: 'Toyota',
          model: 'Honda',
        };
        chai
          .request(app)
          .post('/api/v1/car')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newCarAd)
          .end((carErr, carRes) => {
            carRes.should.have.status(400);
            carRes.body.should.be.a('object');
            carRes.body.should.have.property('errors');
            carRes.body.errors.should.have.property('price');
            done();
          });
      });
    });
  });
});
