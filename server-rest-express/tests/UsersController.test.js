const { OK, UNAUTHORIZED, CREATED, BAD_REQUEST, FORBIDDEN, NOT_FOUND, NO_CONTENT } = require('http-status-codes');
const faker = require('faker');
const logout = require('./utilities/logout');
const loginAs = require('./utilities/loginAs');
const truncateDatabase = require('./utilities/truncateDatabase');
const runSeeders = require('./utilities/runSeeders');
const findFieldErrorMessage = require('./utilities/findFieldErrorMessage');
const UserFactory = require('./factories/user');
const { sequelize, User } = require('../src/models');

const app = require('../src/index');
const request = require('supertest-session')(app);

let editableUserId;

beforeAll(async () => {
    await runSeeders();

    const { id } = await User.findOne({ where: { email: 'editable@erpemployee.test' }, raw: true });

    editableUserId = id;

    await UserFactory.create();
    await UserFactory.create();
});

afterAll(async () => {
    const redisClient = app.get('redisClient');

    await truncateDatabase();
    await sequelize.close();
    await redisClient.quit();
});

describe('UsersController', () => {
    afterEach(async () => await logout(request));

    describe('GET /users', () => {
        it('returns OK when logged as ADMIN', async () => {
            await loginAs(request, 'admin');

            const response = await request.get('/users');

            expect(response.status).toBe(OK);
            expect(response.body).toHaveLength(5);
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');

            const response = await request.get('/users');

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const response = await request.get('/users');

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('GET /users/:id', () => {
        it('returns OK when logged as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id, email } = await User.findOne({ where: { email: 'user@erpemployee.test' }, raw: true });

            const response = await request.get(`/users/${id}`);

            expect(response.status).toBe(OK);
            expect(response.body.email).toBe(email);
        });

        it('returns NOT_FOUND sending not existing id as ADMIN', async () => {
            await loginAs(request, 'admin');
            const fakeId = faker.random.uuid();

            const response = await request.get(`/users/${fakeId}`);

            expect(response.status).toBe(NOT_FOUND);
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');

            const { id } = User.findOne({ where: { email: 'user@erpemployee.test' }, raw: true });

            const response = await request.get(`/users/${id}`);

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const response = await request.get('/users');

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('POST /users', () => {
        it('returns CREATED sending valid data as ADMIN', async () => {
            await loginAs(request, 'admin');
            const userData = UserFactory.generate({
                email: faker.internet.email().toLowerCase()
            });

            const response = await request.post('/users').send(userData);

            expect(response.body.email).toBe(userData.email);
            expect(response.body.password).toBeFalsy();
            expect(response.status).toBe(CREATED);
        });

        it('returns BAD_REQUEST sending blank data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const userData = {
                firstName: '',
                lastName: '',
                birthDate: '',
                password: '',
                email: ''
            };

            const response = await request.post('/users').send(userData);

            expect(findFieldErrorMessage(response, 'firstName')).toBe('First name can not be empty');
            expect(findFieldErrorMessage(response, 'lastName')).toBe('Last name can not be empty');
            expect(findFieldErrorMessage(response, 'email')).toBe('Email can not be empty');
            expect(findFieldErrorMessage(response, 'password')).toBe('Password can not be empty');
            expect(findFieldErrorMessage(response, 'birthDate')).toBe('Date is not provided');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const userData = {
                firstName: 'Ed',
                lastName: 'over32LengthStringThatIsWayTooLong',
                birthDate: '1913-13-13',
                password: 'pass',
                email: 'incorrect@.email.com'
            };

            const response = await request.post('/users').send(userData);

            expect(findFieldErrorMessage(response, 'firstName')).toBe('First name should contain 3-32 letters');
            expect(findFieldErrorMessage(response, 'lastName')).toBe('Last name should contain 3-32 letters');
            expect(findFieldErrorMessage(response, 'email')).toBe('Email address is not in correct format');
            expect(findFieldErrorMessage(response, 'password')).toBe('Password must be 8-32 characters in length');
            expect(findFieldErrorMessage(response, 'birthDate')).toBe('Birth date is in wrong format or is unreal');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending existing email as ADMIN', async () => {
            await loginAs(request, 'admin');
            const userData = UserFactory.generate();
            userData.email = 'admin@erpemployee.test';

            const response = await request.post('/users').send(userData);

            expect(findFieldErrorMessage(response, 'email')).toBe('User with this email already exists');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');
            const userData = UserFactory.generate();

            const response = await request.post('/users').send(userData);

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const userData = UserFactory.generate();

            const response = await request.post('/users').send(userData);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('PUT /users/:id', () => {
        it('returns OK sending valid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const newUserData = UserFactory.generate();

            const { email } = newUserData;

            const response = await request.put(`/users/${editableUserId}`).send(newUserData);

            expect(response.status).toBe(OK);
            expect(response.body.password).toBeFalsy();
            expect(response.body.email).toBe(email);
        });

        it('returns BAD_REQUEST sending blank data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const userData = {
                firstName: '',
                lastName: '',
                birthDate: '',
                password: '',
                email: ''
            };

            const response = await request.put(`/users/${editableUserId}`).send(userData);

            expect(findFieldErrorMessage(response, 'firstName')).toBe('First name can not be empty');
            expect(findFieldErrorMessage(response, 'lastName')).toBe('Last name can not be empty');
            expect(findFieldErrorMessage(response, 'email')).toBe('Email can not be empty');
            expect(findFieldErrorMessage(response, 'birthDate')).toBe('Date is not provided');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            await loginAs(request, 'admin');
            const userData = {
                firstName: 'Ed',
                lastName: 'over32LengthStringThatIsWayTooLong',
                birthDate: '1913-13-13',
                password: 'pass',
                email: 'incorrect@.email.com'
            };

            const response = await request.put(`/users/${editableUserId}`).send(userData);

            expect(findFieldErrorMessage(response, 'firstName')).toBe('First name should contain 3-32 letters');
            expect(findFieldErrorMessage(response, 'lastName')).toBe('Last name should contain 3-32 letters');
            expect(findFieldErrorMessage(response, 'email')).toBe('Email address is not in correct format');
            expect(findFieldErrorMessage(response, 'password')).toBe('Password must be 8-32 characters in length');
            expect(findFieldErrorMessage(response, 'birthDate')).toBe('Birth date is in wrong format or is unreal');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending not existing id as ADMIN', async () => {
            await loginAs(request, 'admin');

            const userData = await User.findOne({ where: { email: 'user@erpemployee.test' }, raw: true });

            const fakeId = faker.random.uuid();

            const response = await request.put(`/users/${fakeId}`).send(userData);

            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending email that exists as ADMIN', async () => {
            await loginAs(request, 'admin');

            const userData = await User.findOne({ where: { email: 'user@erpemployee.test' }, raw: true });

            const { id } = userData;
            userData.email = 'admin@erpemployee.test';

            const response = await request.put(`/users/${id}`).send(userData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'email')).toBe('User with this email already exists');
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');
            const fakeId = faker.random.uuid();

            const response = await request.put(`/users/${fakeId}`).send();

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const fakeId = faker.random.uuid();

            const response = await request.put(`/users/${fakeId}`).send();

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('DELETE /users/:id', () => {
        it('returns NO_CONTENT when logged in as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id } = User.findOne({ where: { email: 'user@erpemployee.test' }, raw: true });

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(NO_CONTENT);
        });

        it('returns NO_CONTENT sending not existing id as ADMIN', async () => {
            await loginAs(request, 'admin');
            const fakeId = faker.random.uuid();

            const response = await request.delete(`/users/${fakeId}`);

            expect(response.status).toBe(NO_CONTENT);
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');
            const fakeId = faker.random.uuid();

            const response = await request.delete(`/users/${fakeId}`);

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const fakeId = faker.random.uuid();

            const response = await request.delete(`/users/${fakeId}`);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });
});
