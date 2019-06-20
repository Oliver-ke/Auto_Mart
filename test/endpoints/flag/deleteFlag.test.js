/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('get', () => {
  describe('api/v1/flag', () => {
    it('Should delete flags if user is admin', (done) => {
      const user = {
        email: 'Kingsley@gmail.com',
        password: 'abbeh34',
        first_name: 'Benson',
        last_name: 'Joe',
        address: 'Ikorodu road, lagos',
        is_admin: true,
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        chai
          .request(app)
          .delete('/api/v1/flag/1')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((flagErr, flagRes) => {
            flagRes.should.have.status(200);
            flagRes.body.data.should.be.a('string');
            flagRes.body.should.be.a('object');
            done();
          });
      });
    });
    it('Should prevent none admin users', (done) => {
      const user = {
        email: 'Paulsamuel@gmail.com',
        password: 'paulin77',
        first_name: 'Okon',
        last_name: 'Paul',
        address: 'Oshodi road, lagos',
        is_admin: false,
      };
      chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
        chai
          .request(app)
          .delete('/api/v1/flag/2')
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
