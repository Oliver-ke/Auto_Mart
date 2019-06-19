/* the file naming convention adopted here was to dictects
 the execution order, as some action needs to be
carried out before others, eg signup -> login
*/

/* global describe it */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';
import initializeDb from '../../../src/db/initDb';
import pool from '../../../src/db/index';

chai.use(chaiHttp);
chai.should();

describe('api/v1/auth/signup', () => {
  describe('POST', () => {
    it('Initialize db and clear priv data', async () => {
      await pool.clearDb();
      const res = await initializeDb();
      chai.assert.isTrue(res);
    });
    it('should add a user', (done) => {
      const user = {
        email: 'unclebob@gmail.com',
        password: 'password',
        first_name: 'Bob',
        last_name: 'John',
        address: 'block 9 flat two elekahia estate ph',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
    });
    it('Should have a response token and status', (done) => {
      const user = {
        email: 'JohnDoe@gmail.com',
        password: 'password',
        first_name: 'Doe',
        last_name: 'John',
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
        email: 'JohnDoe@gmail.com',
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

// beforeEach(async function () {
//   await db.clear();
//   await db.save([tobi, loki, jane]);
// });

// describe('#find()', function () {
//   it('responds with matching records', async function () {
//     const users = await db.find({ type: 'User' });
//     users.should.have.length(3);
//   });
// });
