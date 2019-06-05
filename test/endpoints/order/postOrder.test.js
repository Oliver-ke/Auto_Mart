/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
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
    it('status can only pending, accepted or rejected', (done) => {
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
    it('Should authenticate request', (done) => {
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
          amount: 'another none number',
        };
        chai
          .request(app)
          .post('/api/v1/order')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newOrder)
          .end((orderErr, orderRes) => {
            orderRes.should.have.status(400);
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
    it('Should error missing parameters', (done) => {
      const user = {
        email: 'Bobmartins2@gmail.com',
        password: 'bobbing',
      };
      chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
        // Order
        const newOrder = {};
        chai
          .request(app)
          .post('/api/v1/order')
          .set('authorization', `Bearer ${res.body.data.token}`)
          .send(newOrder)
          .end((orderErr, orderRes) => {
            orderRes.body.status.should.equal(400);
            orderRes.body.should.have.property('errors');
            orderRes.body.errors.should.have.property('car_id');
            orderRes.body.errors.should.have.property('amount');
            done();
          });
      });
    });
  });
});
