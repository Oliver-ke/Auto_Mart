/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();

describe('api/v1/auth/signup', () => {
  describe('POST', () => {
    it('should reset password if new_password and password is provided', (done) => {
      const user = {
        email: 'wisdom@gmail.com',
        password: 'williams34',
        first_name: 'wisdom',
        last_name: 'williams',
        address: 'Oshodi lagos',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end(() => {
        const reset = {
          password: user.password,
          new_password: 'wisdom4life',
        };
        chai.request(app).post(`/api/v1/users/${user.email}/reset_password`).send(reset).end((err, res) => {
          res.should.have.status(204);
          done();
        });
      });
    });
    it('New password must be at least 6 characters', (done) => {
      const reset = {
        password: 'wisdom4life',
        new_password: 'life',
      };
      chai.request(app).post('/api/v1/users/isdom@gmail.com/reset_password').send(reset).end((err, res) => {
        res.should.have.status(400);
        done();
      });
    });
    it('should generate and send password as email if request body is empty', (done) => {
      const user = {
        email: 'kelechioliver96@gmail.com',
        password: 'benson',
        first_name: 'Etuk',
        last_name: 'Benson',
        address: 'Rumukalagbor PH, rivers state',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end(() => {
        chai.request(app).post(`/api/v1/users/${user.email}/reset_password`).send({}).end((err, res) => {
          res.should.have.status(204);
          done();
        });
      });
    }).timeout(6000);
    it('should  Ensure user with email exist', (done) => {
      // this user is not in the database
      chai.request(app).post('/api/v1/users/noMail@gmail.com/reset_password').send({}).end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });
});
