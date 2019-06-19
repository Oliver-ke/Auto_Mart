/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('get', () => {
  describe('api/v1/flag', () => {
    it('Should get flags if user is admin', (done) => {
      const user = {
        email: 'Joeman@gmail.com',
        password: 'password',
        first_name: 'Benson',
        last_name: 'Joe',
        address: 'Ikorodu road, lagos',
        is_admin: true,
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        chai
          .request(app)
          .get('/api/v1/flag/')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((flagErr, flagRes) => {
            flagRes.should.have.status(200);
            flagRes.body.data.should.be.a('array');
            flagRes.body.should.be.a('object');
            done();
          });
      });
    });
    it('Should prevent none admin users', (done) => {
      const user = {
        email: 'Paul@gmail.com',
        password: 'paulin77',
        first_name: 'Okon',
        last_name: 'Paul',
        address: 'Oshodi road, lagos',
        is_admin: false,
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        chai
          .request(app)
          .get('/api/v1/flag/')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((flagErr, flagRes) => {
            flagRes.should.have.status(403);
            flagRes.body.should.have.property('error');
            done();
          });
      });
    });
  });
});
