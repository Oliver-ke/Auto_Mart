/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('api/v1/auth/signup', () => {
  describe('POST', () => {
    it('should add a user', (done) => {
      const user = {
        email: 'kelechi22@gmail.com',
        password: 'hello',
        first_name: 'kelech',
        last_name: 'oliver',
        address: 'block 9 flat two elekahia estate ph',
        is_admin: true,
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
    });
    it('Should have a response token and status', (done) => {
      const user = {
        email: 'kelechi223@gmail.com',
        password: 'hello',
        first_name: 'kelech',
        last_name: 'oliver',
        address: 'block 9 flat two elekahia estate ph',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.data.should.have.property('token');
        done();
      });
    });
    it('Should prevent adding users with existing mail', (done) => {
      const user = {
        email: 'kelechi223@gmail.com',
        password: 'hellopassword',
        first_name: 'kelech',
        last_name: 'oliver',
        address: 'block 9 flat two elekahia estate ph',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.status(400);
        done();
      });
    });
    it('Should reject invalid mail', (done) => {
      const user = {
        email: 'oliver223.com',
        password: 'hellopassword',
        first_name: 'kelech',
        last_name: 'oliver',
        address: 'block 9 flat two elekahia estate ph',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.status(400);
        done();
      });
    });
    it('Should error missing property except is_admin', (done) => {
      const user = {
        email: 'oliver223@gmail.com',
        last_name: 'oliver',
        address: 'block 9 flat two elekahia estate ph',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
    });
    it('Should Error when adding none alphabets as names', (done) => {
      const user = {
        email: 'oliver223@gmail.com',
        password: 'hellopassword',
        first_name: '88990',
        last_name: '0097',
        address: 'block 9 flat two elekahia estate ph',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
    });
  });
});
