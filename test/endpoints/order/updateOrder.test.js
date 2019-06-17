/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('api/v1/order/<:order_id>/price', () => {
  describe('PATCH', () => {
    it('Should accept update price request', (done) => {
      const user = {
        email: 'Bobmartins2@gmail.com',
        password: 'bobbing',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        const newOrder = {
          car_id: '1',
          amount: '223456',
        };
        chai
          .request(app)
          .post('/api/v1/order')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newOrder)
          .end((orderErr, orderRes) => {
            chai
              .request(app)
              .patch(`/api/v1/order/${orderRes.body.data.id}/price`)
              .send({ price: 34550 })
              .set('authorization', `Bearer ${res.body.data.token}`)
              .end((updateErr, updateRes) => {
                updateRes.should.have.status(200);
                updateRes.body.should.be.a('object');
                updateRes.body.should.have.property('data');
                done();
              });
          });
      });
    });
    it('Should only update order with status pending', (done) => {
      const user = {
        email: 'Bobmartins2@gmail.com',
        password: 'bobbing',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        const newOrder = {
          car_id: '1',
          amount: '223456',
          status: 'accepted',
        };
        chai
          .request(app)
          .post('/api/v1/order')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newOrder)
          .end((orderErr, orderRes) => {
            chai
              .request(app)
              .patch(`/api/v1/order/${orderRes.body.data.id}/price`)
              .send({ price: 34550 })
              .set('authorization', `Bearer ${res.body.data.token}`)
              .end((updateErr, updateRes) => {
                updateRes.should.have.status(403);
                updateRes.body.should.be.a('object');
                updateRes.body.should.have.property('error');
                done();
              });
          });
      });
    });
    it('Shoud ensure order belongs to the logged in user', (done) => {
      // uncle bob has no order with id=1
      const user = {
        email: 'unclebob@gmail.com',
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        chai
          .request(app)
          .patch('/api/v1/order/1/price')
          .send({ price: 34550 })
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((updateErr, updateRes) => {
            updateRes.should.have.status(403);
            updateRes.body.should.be.a('object');
            updateRes.body.should.have.property('error');
            done();
          });
      });
    });
  });
});
