/* global describe it */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server');

chai.use(chaiHttp);
chai.should();

describe('api/v1/auth/signin', () => {
  describe('POST', () => {
    it('should sign in a user with correct password', (done) => {
      const user = {
        email: 'test@gmail.com',
        password: 'test',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
    });

    it('should prevent access to users with incorrect password', (done) => {
      const user = {
        email: 'test@gmail.com',
        password: 'some incorrect password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
    });
  });
});
