/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('User car test', () => {
  describe('GET', () => {
    it('should get car belonging to a user', (done) => {
      // sign up a user to get auth token
      const user = {
        email: 'testUser2@gmail.com',
        password: 'password',
        first_name: 'Dominic',
        last_name: 'Paul',
        address: 'block 9 flat two elekahia estate ph',
        is_admin: false,
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        // Add a new car post from the new user
        const newCarAd = {
          state: 'used',
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
          .end(() => {
            // send a request to get cars
            chai
              .request(app)
              .get('/api/v1/car/users/posts')
              .set('authorization', `Bearer ${res.body.data.token}`)
              .send(newCarAd)
              .end((getErr, getRes) => {
                getRes.should.have.status(200);
                getRes.body.data.should.be.a('array');
                done();
              });
          });
      });
    });
  });
});
