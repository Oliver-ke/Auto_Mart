/* global describe it */
const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../server');

chai.use(chaiHttp);
chai.should();
describe('Car Order endpoints', () => {
  describe('api/v1/order', () => {
    describe('POST', () => {
      it('Response should Have all necessary fields', (done) => {
        const user = {
          email: 'Bobmartins2@gmail.com',
          password: 'bobbing',
          first_name: 'Bob',
          last_name: 'Martins',
          address: 'block 4 flat two elekahia estate ph',
          is_admin: false,
        };
        chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
          // Order
          const newOrder = {
            car_id: '1',
            amount: '223456',
            status: 'pending',
          };
          chai
            .request(app)
            .post('/api/v1/order')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newOrder)
            .end((orderErr, orderRes) => {
              orderRes.should.have.status(201);
              orderRes.body.should.be.a('object');
              orderRes.body.should.property('status');
              orderRes.body.should.property('data');
              orderRes.body.data.should.property('price_offered');
              orderRes.body.data.should.property('id');
              orderRes.body.data.should.property('car_id');
              orderRes.body.data.should.property('buyer');
              orderRes.body.data.should.property('status');
              orderRes.body.data.should.property('created_on');
              orderRes.body.data.should.property('price');
              done();
            });
        });
      });
      it('Should error for wrong status field', (done) => {
        const user = {
          email: 'Bobmartins2@gmail.com',
          password: 'bobbing',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          // Order
          const newOrder = {
            car_id: '1',
            amount: '223456',
            status: 'wrong status',
          };
          chai
            .request(app)
            .post('/api/v1/order')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newOrder)
            .end((orderErr, orderRes) => {
              orderRes.should.have.status(400);
              orderRes.body.should.be.a('object');
              orderRes.body.should.have.property('errors');
              orderRes.body.errors.should.have.property('status');
              done();
            });
        });
      });
      it('Should default status to pending when not provided', (done) => {
        const user = {
          email: 'Bobmartins2@gmail.com',
          password: 'bobbing',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          // Order
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
              orderRes.should.have.status(201);
              orderRes.body.should.be.a('object');
              orderRes.body.should.have.property('data');
              orderRes.body.data.should.have.property('status');
              orderRes.body.data.status.should.equals('pending');
              done();
            });
        });
      });
      it('Should prevent unauthorized token on request header', (done) => {
        // Order
        const newOrder = {
          car_id: '1',
          amount: '223456',
        };
        chai
          .request(app)
          .post('/api/v1/order')
          .set('authorization', 'Bearer faketoken')
          .send(newOrder)
          .end((orderErr, orderRes) => {
            orderRes.should.have.status(401);
            orderRes.body.should.be.a('object');
            orderRes.body.should.have.property('error');
            done();
          });
      });
      it('Should enforce type check, car_id and amount must be a number', (done) => {
        const user = {
          email: 'Bobmartins2@gmail.com',
          password: 'bobbing',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          // Order
          const newOrder = {
            car_id: 'none number',
            amount: 'anothe none number',
          };
          chai
            .request(app)
            .post('/api/v1/order')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newOrder)
            .end((orderErr, orderRes) => {
              orderRes.should.have.status(400);
              orderRes.body.should.be.a('object');
              orderRes.body.should.have.property('errors');
              orderRes.body.errors.should.have.property('car_id');
              orderRes.body.errors.should.have.property('amount');
              done();
            });
        });
      });
      it('Should add order only  when car with the given id exist', (done) => {
        const user = {
          email: 'Bobmartins2@gmail.com',
          password: 'bobbing',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          // Order
          const newOrder = {
            car_id: '400',
            amount: '45563',
          };
          chai
            .request(app)
            .post('/api/v1/order')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newOrder)
            .end((orderErr, orderRes) => {
              orderRes.should.have.status(404);
              orderRes.body.should.be.a('object');
              orderRes.body.should.have.property('error');
              done();
            });
        });
      });
    });
  });
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
});
