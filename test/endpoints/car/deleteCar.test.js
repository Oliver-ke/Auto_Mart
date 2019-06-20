/* global describe it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';

chai.use(chaiHttp);
chai.should();
describe('DELETE', () => {
  it('Should accept delete request for any car from admin user', (done) => {
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
        .delete('/api/v1/car/3')
        .set('authorization', `Bearer ${res.body.data.token}`)
        .end((carErr, carRes) => {
          carRes.should.have.status(200);
          carRes.body.should.be.a('object');
          done();
        });
    });
  });
  it('Should delete car for car owner', (done) => {
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
      // make a new car post
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
          // issue a delete
          chai
            .request(app)
            .delete(`/api/v1/car/${carRes.body.data.id}`)
            .set('authorization', `Bearer ${res.body.data.token}`)
            .end((deleteErr, deleteRes) => {
              deleteRes.should.have.status(200);
              done();
            });
        });
    });
  });
  it('Should prevent none car owner', (done) => {
    // sign up a user to get auth token
    const user = {
      email: 'Jaroh@gmail.com',
      password: 'smith',
      first_name: 'Jades',
      last_name: 'Johnson',
      address: 'Rumuikurishi Port harcourt',
      is_admin: false,
    };
    chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
      chai
        .request(app)
        .delete('/api/v1/car/2')
        .set('authorization', `Bearer ${res.body.data.token}`)
        .end((deleteErr, deleteRes) => {
          deleteRes.should.have.status(403);
          done();
        });
    });
  });
});
