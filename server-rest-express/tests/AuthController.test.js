const { OK, UNAUTHORIZED, BAD_REQUEST } = require('http-status-codes');

const logout = require('./utilities/logout');
const loginAs = require('./utilities/loginAs');
const truncateDatabase = require('./utilities/truncateDatabase');
const runSeeders = require('./utilities/runSeeders');
const findFieldErrorMessage = require('./utilities/findFieldErrorMessage');
const { sequelize } = require('../src/db');

const app = require('../src/index');
const request = require('supertest-session')(app);

beforeAll(async () => {
    await runSeeders();
});

afterAll(async () => {
    const redisClient = app.get('redisClient');

    await truncateDatabase();
    await sequelize.close();
    await redisClient.quit();
});

describe('AuthController', () => {
    describe('GET /me', () => {
        it('returns OK when logged as USER', async () => {
            await loginAs(request, 'user');

            const response = await request.get('/me');

            await logout(request);

            expect(response.body.email).toEqual('user@erpemployee.test');
            expect(response.status).toEqual(OK);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const response = await request.get('/me');

            expect(response.status).toEqual(UNAUTHORIZED);
        });
    });
    describe('GET /logout', () => {
        it('returns OK when logged as ADMIN', async () => {
            await loginAs(request, 'admin');

            const response = await request.get('/logout');

            await logout(request);

            expect(response.status).toEqual(OK);
        });

        it('returns OK when NOBODY IS LOGGED IN', async () => {
            const response = await request.get('/logout');

            expect(response.status).toEqual(OK);
        });
    });
    describe('POST /login', () => {
        it('returns OK sending valid data', async () => {
            const response = await loginAs(request, 'admin');

            await logout(request);

            expect(response.body.email).toEqual('admin@erpemployee.test');
            expect(response.body.password).toBeFalsy();
            expect(response.status).toEqual(OK);
        });

        it('returns BAD_REQUEST sending blank data', async () => {
            const response = await request.post('/login').send({
                email: '',
                password: ''
            });

            expect(findFieldErrorMessage(response, 'email')).toEqual('Email is required');
            expect(findFieldErrorMessage(response, 'password')).toEqual('Password is required');
            expect(response.status).toEqual(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending too short password and invalid email format', async () => {
            const response = await request.post('/login').send({
                email: 'adminadmin@.pl',
                password: 'pass'
            });

            expect(findFieldErrorMessage(response, 'email')).toEqual('This is not correct email format');
            expect(findFieldErrorMessage(response, 'password')).toEqual('Password must contain 8-32 characters');
            expect(response.status).toEqual(BAD_REQUEST);
        });

        it('returns UNAUTHORIZED sending not existing email', async () => {
            const response = await request.post('/login').send({
                email: 'notexisting@email.test',
                password: 'password'
            });

            expect(findFieldErrorMessage(response, 'general')).toEqual('Wrong email or password');
            expect(response.status).toEqual(UNAUTHORIZED);
        });

        it('returns UNAUTHORIZED sending wrong password', async () => {
            const response = await request.post('/login').send({
                email: 'admin@erpemployee.test',
                password: 'wrongpassword'
            });

            expect(findFieldErrorMessage(response, 'general')).toEqual('Wrong email or password');
            expect(response.status).toEqual(UNAUTHORIZED);
        });
    });
});
