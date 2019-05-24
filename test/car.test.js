/* global describe it */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
chai.should();
describe('Car endpoint', () => {
  describe('api/v1/car', () => {
    describe('POST', () => {
      it('should accept car post from authenticated users', (done) => {
        // sign up a user to get auth token
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
          first_name: 'john',
          last_name: 'Doe',
          address: 'block 9 flat two elekahia estate ph',
          is_admin: true,
        };
        chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
          const newCarAd = {
            state: 'new',
            status: 'available',
            price: '123000098889.5',
            manufacturer: 'Toyota',
            model: 'Land Cruiser',
            body_type: 'Jeep',
          };
          chai
            .request(app)
            .post('/api/v1/car')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newCarAd)
            .end((carErr, carRes) => {
              carRes.should.have.status(201);
              carRes.body.should.be.a('object');
              done();
            });
        });
      });
      it('Response should Have all necessary fields', (done) => {
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          // post with missing body_type
          const newCarAd = {
            state: 'new',
            price: '12300.5',
            manufacturer: 'Toyota',
            model: 'Honda',
            body_type: 'jeep',
          };
          chai
            .request(app)
            .post('/api/v1/car')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newCarAd)
            .end((carErr, carRes) => {
              carRes.should.have.status(201);
              carRes.body.should.be.a('object');
              carRes.body.should.property('status');
              carRes.body.should.property('data');
              carRes.body.data.should.property('owner');
              carRes.body.data.should.property('id');
              carRes.body.data.should.property('manufacturer');
              carRes.body.data.should.property('email');
              carRes.body.data.should.property('price');
              carRes.body.data.should.property('state');
              carRes.body.data.should.property('status');
              done();
            });
        });
      });
      it('should prevent request with invalid token', (done) => {
        const newCarAd = {
          state: 'new',
          status: 'available',
          price: '12300.5',
          manufacturer: 'Range Rover',
          model: 'Sport',
          body_type: 'Jeep',
        };
        chai
          .request(app)
          .post('/api/v1/car')
          .set('authorization', 'Bearer fakenuthtoken')
          .send(newCarAd)
          .end((carErr, carRes) => {
            carRes.should.have.status(401);
            carRes.body.should.be.a('object');
            carRes.should.have.property('error');
            done();
          });
      });
      it('Should default status to available when not provided', (done) => {
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          const newCarAd = {
            state: 'new',
            price: '12300.5',
            manufacturer: 'Toyota',
            model: 'Honda Accord',
            body_type: 'car',
          };
          chai
            .request(app)
            .post('/api/v1/car')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newCarAd)
            .end((carErr, carRes) => {
              carRes.should.have.status(201);
              carRes.body.should.be.a('object');
              carRes.body.data.should.have.property('status');
              done();
            });
        });
      });
      it('Should Error on missing parameters except status', (done) => {
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          // post with missing body_type
          const newCarAd = {
            state: 'new',
            price: '12300.5',
            manufacturer: 'Toyota',
            model: 'Honda',
          };
          chai
            .request(app)
            .post('/api/v1/car')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newCarAd)
            .end((carErr, carRes) => {
              carRes.should.have.status(400);
              carRes.body.should.be.a('object');
              carRes.body.should.property('errors');
              done();
            });
        });
      });
      it('Should Error when given prince is not a number', (done) => {
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          // post with missing body_type
          const newCarAd = {
            state: 'new',
            price: 'none number price',
            manufacturer: 'Toyota',
            model: 'Honda',
          };
          chai
            .request(app)
            .post('/api/v1/car')
            .set('authorization', `Bearer ${res.body.data.token}`)
            .send(newCarAd)
            .end((carErr, carRes) => {
              carRes.should.have.status(400);
              carRes.body.should.be.a('object');
              carRes.body.should.have.property('errors');
              carRes.body.errors.should.have.property('price');
              done();
            });
        });
      });
    });
    describe('GET', () => {
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
              carRes.should.have.status(401);
              carRes.body.should.be.a('object');
              carRes.body.should.have.property('error');
              done();
            });
        });
      });
    });
  });
  describe('api/v1/car/{car_id}/status', () => {
    describe('PATCH', () => {
      it('Should update car status', (done) => {
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          chai
            .request(app)
            .patch('/api/v1/car/4/status')
            .send({ status: 'sold' })
            .set('authorization', `Bearer ${res.body.data.token}`)
            .end((carErr, carRes) => {
              carRes.should.have.status(200);
              carRes.body.should.be.a('object');
              carRes.body.data.should.have.property('status');
              carRes.body.data.status.should.equal('sold');
              done();
            });
        });
      });
      it('Should error invalid request parameters', (done) => {
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          chai
            .request(app)
            .patch('/api/v1/car/wrongId/status')
            .send({ status: 'sold' })
            .set('authorization', `Bearer ${res.body.data.token}`)
            .end((carErr, carRes) => {
              carRes.should.have.status(400);
              carRes.body.should.be.a('object');
              carRes.body.should.have.property('error');
              done();
            });
        });
      });
    });
  });
  describe('api/v1/car/{car_id}/price', () => {
    describe('PATCH', () => {
      it('Should update car price', (done) => {
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          chai
            .request(app)
            .patch('/api/v1/car/4/price')
            .send({ price: 45990.99 })
            .set('authorization', `Bearer ${res.body.data.token}`)
            .end((carErr, carRes) => {
              carRes.should.have.status(200);
              carRes.body.should.be.a('object');
              carRes.body.data.should.have.property('status');
              done();
            });
        });
      });
      it('Should error invalid request parameters', (done) => {
        const user = {
          email: 'JohnDoe@gmail.com',
          password: 'hello',
        };
        chai.request(app).post('/api/v1/auth/signin').send(user).end((err, res) => {
          chai
            .request(app)
            .patch('/api/v1/car/wrongId/price')
            .send({ price: 98884.66 })
            .set('authorization', `Bearer ${res.body.data.token}`)
            .end((carErr, carRes) => {
              carRes.should.have.status(400);
              carRes.body.should.be.a('object');
              carRes.body.should.have.property('error');
              done();
            });
        });
      });
    });
  });
  describe('api/v1/car/{car_id}', () => {
    describe('GET', () => {
      it('Should get car with the given car_id', (done) => {
        chai.request(app).get('/api/v1/car/2').end((carErr, carRes) => {
          carRes.should.have.status(200);
          carRes.body.should.be.a('object');
          carRes.body.should.have.property('data');
          done();
        });
      });
      it('Should error for none existing car_id', (done) => {
        chai.request(app).get('/api/v1/car/1000').end((carErr, carRes) => {
          carRes.should.have.status(404);
          carRes.body.should.be.a('object');
          carRes.body.should.have.property('error');
          done();
        });
      });
      it('Should error for invalid car_id', (done) => {
        chai.request(app).get('/api/v1/car/ftk987').end((carErr, carRes) => {
          carRes.should.have.status(400);
          carRes.body.should.be.a('object');
          carRes.body.should.have.property('error');
          done();
        });
      });
    });
  });
  describe('api/v1/car?status=available || min_price&max_prce', () => {
    describe('GET', () => {
      it('Should get cars with status available', (done) => {
        chai.request(app).get('/api/v1/car?status=available').end((carErr, carRes) => {
          carRes.should.have.status(200);
          carRes.body.should.be.a('object');
          carRes.body.should.have.property('data');
          carRes.body.data[0].status.should.equal('available');
          done();
        });
      });
      it('Should error for invalid query parameter', (done) => {
        chai.request(app).get('/api/v1/car?status=34jjdkr').end((carErr, carRes) => {
          carRes.should.have.status(400);
          carRes.body.should.be.a('object');
          carRes.body.should.have.property('error');
          done();
        });
      });
      it('Should accept max_price and min_price query', (done) => {
        chai.request(app).get('/api/v1/car?status=available&min_price=1500&max_price=20000').end((carErr, carRes) => {
          carRes.should.have.status(200);
          carRes.body.should.be.a('object');
          carRes.body.data[0].price.should.be.above(1499);
          carRes.body.data[0].price.should.be.below(20001);
          carRes.body.should.have.property('data');
          carRes.body.data.should.be.a('array');
          done();
        });
      });
    });
  });
});
