/* global describe it */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

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
  });
});
