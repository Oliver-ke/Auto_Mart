/* global describe it */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server');

chai.use(chaiHttp);
chai.should();
describe('DELETE', () => {
  it('Should accept delete request from admin', (done) => {
    // sign up a user to get auth token
    const user = {
      email: 'isAdmin@gmail.com',
      password: 'admin',
      first_name: 'Martins',
      last_name: 'John',
      address: 'GRA phase 2 Port harcourt',
      is_admin: true,
    };
    chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
      chai
        .request(app)
        .delete('/api/v1/car/5')
        .set('authorization', `Bearer ${res.body.data.token}`)
        .end((carErr, carRes) => {
          carRes.should.have.status(200);
          carRes.body.should.be.a('object');
          done();
        });
    });
  });
  it('Should prevent delete request from none admin', (done) => {
    // sign up a user to get auth token
    const user = {
      email: 'smith@gmail.com',
      password: 'smith',
      first_name: 'Jades',
      last_name: 'Johnson',
      address: 'Rumuikurishi Port harcourt',
      is_admin: false,
    };
    chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
      chai
        .request(app)
        .delete('/api/v1/car/5')
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
