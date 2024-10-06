import request from 'supertest';
import { app, connectToDatabase } from '../../server/index';
import mongoose from 'mongoose';
import { UserModel, VenueModel, ContactModel, OffenderModel, IncidentModel, WarningModel, BanModel } from '../../server/models';
import Dashboard from 'src/components/Dashboard';

describe('Incident Reporting System Tests', () => {
  let adminCookie: string;
  let staffCookie: string;
  let staffUser: any;
  let adminUser: any;

  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await VenueModel.deleteMany({});
    await ContactModel.deleteMany({});
    await OffenderModel.deleteMany({});
    await IncidentModel.deleteMany({});
    await WarningModel.deleteMany({});
    await BanModel.deleteMany({});

    // Create an admin user and a staff user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'admin', email: 'admin@test.com', password: 'password', role: 'admin' });
    adminUser = adminResponse.body.user;

    const staffResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'staff', email: 'staff@test.com', password: 'password', role: 'staff' });
    staffUser = staffResponse.body.user;

    // Login and get cookies
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password' });
    adminCookie = adminLogin.headers['set-cookie']?.[0] || '';

    const staffLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'staff@test.com', password: 'password' });
    staffCookie = staffLogin.headers['set-cookie']?.[0] || '';

  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newuser', email: 'newuser@test.com', password: 'password', role: 'staff' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
    });

    it('should login an existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'staff@test.com', password: 'password' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });

    describe('Bans', () => {
      it('should create a new ban', async () => {
        const offender = await OffenderModel.create({ firstName: 'Bob', lastName: 'Smith', dateOfBirth: '1985-05-05' });
        const venue = await VenueModel.create({ name: 'Ban Venue', address: '101 Ban St' });
        const incident = await IncidentModel.create({ date: new Date(), description: 'Ban incident', venue: venue._id, submittedBy: staffUser._id });
        const warning = await WarningModel.create({ date: new Date(), offender: offender._id, incidents: [incident._id], submittedBy: staffUser._id });
        
        const response = await request(app)
          .post('/api/bans')
          .set('Cookie', staffCookie)
          .send({ date: new Date(), offender: offender._id, warnings: [warning._id], submittedBy: staffUser._id });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('ban');
        
      });
  
      it('should get all bans', async () => {
        const response = await request(app)
          .get('/api/bans')
          .set('Cookie', staffCookie);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
      });
    });

    describe('Warnings', () => {
  it('should create a new warning', async () => {
    const offender = await OffenderModel.create({ firstName: 'Jane', lastName: 'Doe', dateOfBirth: '1990-01-01' });
    const venue = await VenueModel.create({ name: 'Warning Venue', address: '789 Warning St' });
    const incident = await IncidentModel.create({ date: new Date(), description: 'Warning incident', venue: venue._id, submittedBy: staffUser._id });
    
    const response = await request(app)
      .post('/api/wwarnings') 
      .set('Cookie', staffCookie)
      .send({ date: new Date(), incidents: [incident._id], submittedBy: staffUser._id });
    expect(response.status).toBe(201); 
    expect(response.body).toHaveProperty('warning'); 
    expect(response.body.warning).toHaveProperty('_id');
  });

  it('should get all warnings', async () => {
    const response = await request(app)
      .get('/api/wwarnings') 
      .set('Cookie', staffCookie);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy(); 
  });
});


    describe('Venues', () => {
      it('should create a new venue', async () => {
        const response = await request(app)
          .post('/api/venues')
          .set('Cookie', adminCookie)
          .send({ name: 'Test Venue', address: '123 Test St' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('venue');
        expect(response.body.venue).toHaveProperty('_id');
        expect(response.body.message).toBe('Venue created successfully');
      });
  
      it('should get all venues', async () => {
        const response = await request(app)
          .get('/api/venues')
          .set('Cookie', staffCookie);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
      });
    });
  });
});