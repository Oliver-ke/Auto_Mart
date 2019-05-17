/* global describe it */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

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
    it('Should set is_admin to false when not given or not valid', (done) => {
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
        res.body.data.is_admin.should.equal(false);
        done();
      });
    });
    it('Response should always have a status property', (done) => {
      const user = {
        email: 'oliver223@gmail.com',
        password: 'hellopassword',
        first_name: 'kelech',
        last_name: 'oliver',
        address: 'block 9 flat two elekahia estate ph',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        done();
      });
    });
    it('Should prevent users with existing mail', (done) => {
      const user = {
        email: 'oliver223@gmail.com',
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
