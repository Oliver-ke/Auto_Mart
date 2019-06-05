/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('post', () => {
  describe('api/v1/flag', () => {
    it('Should accept flag request', (done) => {
      const user = {
        email: 'JohnDoe@gmail.com',
        password: 'hello',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        const newFlag = {
          reason: 'price',
          car_id: '3',
          description: 'Fraudulent car price, paid but did not send my order',
        };
        chai
          .request(app)
          .post('/api/v1/flag/')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newFlag)
          .end((flagErr, flagRes) => {
            flagRes.should.have.status(201);
            flagRes.body.should.be.a('object');
            done();
          });
      });
    });
    it('Should only allow authenticated users having authorized headers', (done) => {
      const newFlag = {
        reason: 'price',
        car_id: '3',
        description: 'Fraudulent car price, paid but did not send my order',
      };
      chai.request(app).post('/api/v1/flag/').send(newFlag).end((flagErr, flagRes) => {
        flagRes.should.have.status(401);
        flagRes.body.should.have.property('error');
        done();
      });
    });
    it('Should error missing parameters', (done) => {
      const user = {
        email: 'JohnDoe@gmail.com',
        password: 'hello',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        const newFlag = {};
        chai
          .request(app)
          .post('/api/v1/flag/')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newFlag)
          .end((flagErr, flagRes) => {
            flagRes.should.have.status(400);
            flagRes.body.error.should.have.property('description');
            flagRes.body.error.should.have.property('car_id');
            flagRes.body.error.should.have.property('reason');
            done();
          });
      });
    });
  });
});
