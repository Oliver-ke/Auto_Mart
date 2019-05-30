/* global describe it */
const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../../../server');

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
        chai
          .request(app)
          .patch('/api/v1/order/4/price')
          .send({ price: 300000 })
          .set('authorization', `Bearer ${res.body.data.token}`)
          .end((orderErr, orderRes) => {
            orderRes.should.have.status(200);
            orderRes.body.should.be.a('object');
            orderRes.body.should.property('status');
            orderRes.body.should.property('data');
            orderRes.body.data.new_price_offered.should.equal(300000);
            done();
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
                updateRes.should.have.status(400);
                updateRes.body.should.be.a('object');
                updateRes.body.should.have.property('error');
                done();
              });
          });
      });
    });
  });
});
