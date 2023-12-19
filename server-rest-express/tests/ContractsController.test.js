const { OK, UNAUTHORIZED, CREATED, BAD_REQUEST, FORBIDDEN, NOT_FOUND, NO_CONTENT } = require('http-status-codes');
const faker = require('faker');
const moment = require('moment');
const logout = require('./utilities/logout');
const loginAs = require('./utilities/loginAs');
const truncateDatabase = require('./utilities/truncateDatabase');
const runSeeders = require('./utilities/runSeeders');
const findFieldErrorMessage = require('./utilities/findFieldErrorMessage');
const ContractFactory = require('./factories/contract');
const { sequelize, User } = require('../src/models');

const app = require('../src/index');
const request = require('supertest-session')(app);

let exampleContract, userId;

beforeAll(async () => {
    await runSeeders();

    const user = await User.findOne({ where: { email: 'user@erpemployee.test' }, raw: true });
    const { id: adminId } = await User.findOne({ where: { email: 'admin@erpemployee.test' }, raw: true });

    userId = user.id;

    exampleContract = await ContractFactory.create({ userId, startDate: '2020-01-01' });
    await ContractFactory.create({ userId, startDate: '2020-02-01' });
    await ContractFactory.create({ userId: adminId, startDate: '2020-01-01' });
    await ContractFactory.create({ userId: adminId, startDate: '2020-02-01' });
    await ContractFactory.create({ userId: adminId, startDate: '2020-03-01' });
});

afterAll(async () => {
    const redisClient = app.get('redisClient');

    await truncateDatabase();
    await sequelize.close();
    await redisClient.quit();
});

describe('ContractsController', () => {
    afterEach(async () => await logout(request));

    describe('GET /contracts', () => {
        it('returns OK when logged as ADMIN', async () => {
            await loginAs(request, 'admin');

            const response = await request.get(`/contracts`);

            expect(response.status).toBe(OK);
            expect(response.body).toHaveLength(3);
        });

        it('returns OK when logged as USER', async () => {
            await loginAs(request, 'user');

            const response = await request.get(`/contracts`);

            expect(response.status).toBe(OK);
            expect(response.body).toHaveLength(2);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const response = await request.get(`/contracts`);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('POST /contracts', () => {
        it('returns CREATED sending valid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const contractData = ContractFactory.generate({ userId, startDate: '2021-01-01' });

            const response = await request.post('/contracts').send(contractData);

            const { numberOfLeaveDays } = await User.findOne({ where: { id: userId }, raw: true });

            expect(response.status).toBe(CREATED);
            expect(numberOfLeaveDays).toBe(2);
            expect(response.body.startDate).toBe(contractData.startDate);
        });

        it('returns BAD_REQUEST sending blank data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const contractData = {
                userId: '',
                startDate: '',
                duration: '',
                daysOff: ''
            };

            const response = await request.post('/contracts').send(contractData);

            expect(findFieldErrorMessage(response, 'userId')).toBe('User id should not be empty');
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Start date is not provided');
            expect(findFieldErrorMessage(response, 'duration')).toBe('Duration is not provided');
            expect(findFieldErrorMessage(response, 'daysOff')).toBe('Days off are not provided');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const contractData = {
                userId: faker.random.uuid(),
                startDate: '2030-13-13',
                duration: '2',
                daysOff: '10'
            };

            const response = await request.post('/contracts').send(contractData);

            expect(findFieldErrorMessage(response, 'userId')).toBe('User with this id does not exist');
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Start date is in wrong format or is unreal');
            expect(findFieldErrorMessage(response, 'duration')).toBe('Wrong duration of the contract');
            expect(findFieldErrorMessage(response, 'daysOff')).toBe('Wrong days off of the contract');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending colliding startDate as ADMIN', async () => {
            await loginAs(request, 'admin');

            const contractData = ContractFactory.generate({ userId, startDate: '2021-01-15' });
            const response = await request.post('/contracts').send(contractData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe(
                'There is existing contract in this range of time'
            );
            expect(findFieldErrorMessage(response, 'duration')).toBe(
                'There is existing contract in this range of time'
            );
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');

            const response = await request.post(`/contracts`, ContractFactory.generate({ userId }));

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const response = await request.post(`/contracts`, ContractFactory.generate({ userId }));

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('PUT /contracts/:id', () => {
        it('returns OK sending valid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: contractId } = exampleContract;

            const contractData = ContractFactory.generate({ userId, startDate: '2022-06-01' });

            const response = await request.put(`/contracts/${contractId}`).send(contractData);

            expect(response.status).toBe(OK);
            expect(response.body.startDate).toBe(contractData.startDate);
        });

        it('returns BAD_REQUEST sending blank data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: contractId } = exampleContract;

            const contractData = {
                userId: '',
                startDate: '',
                duration: '',
                daysOff: ''
            };

            const response = await request.put(`/contracts/${contractId}`).send(contractData);

            expect(findFieldErrorMessage(response, 'userId')).toBe('User id should not be empty');
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Start date is not provided');
            expect(findFieldErrorMessage(response, 'duration')).toBe('Duration is not provided');
            expect(findFieldErrorMessage(response, 'daysOff')).toBe('Days off are not provided');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: contractId } = exampleContract;

            const contractData = {
                userId: faker.random.uuid(),
                startDate: '2030-13-13',
                duration: '2',
                daysOff: '10'
            };

            const response = await request.put(`/contracts/${contractId}`).send(contractData);

            expect(findFieldErrorMessage(response, 'userId')).toBe('User with this id does not exist');
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Start date is in wrong format or is unreal');
            expect(findFieldErrorMessage(response, 'duration')).toBe('Wrong duration of the contract');
            expect(findFieldErrorMessage(response, 'daysOff')).toBe('Wrong days off of the contract');
            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns NOT_FOUND sending not existing id as ADMIN', async () => {
            await loginAs(request, 'admin');

            const contractId = faker.random.uuid();

            const contractData = ContractFactory.generate({ userId, startDate: '2022-02-01' });

            const response = await request.put(`/contracts/${contractId}`).send(contractData);

            expect(response.status).toBe(NOT_FOUND);
        });

        it('returns BAD_REQUEST sending colliding startDate as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: contractId } = exampleContract;

            const contractData = ContractFactory.generate({ userId, startDate: '2022-06-15' });

            const response = await request.put(`/contracts/${contractId}`).send(contractData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe(
                'There is existing contract in this range of time'
            );
            expect(findFieldErrorMessage(response, 'duration')).toBe(
                'There is existing contract in this range of time'
            );
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');

            const { id: contractId } = exampleContract;

            const response = await request.put(
                `/contracts/${contractId}`,
                ContractFactory.generate({ userId, startDate: '2022-03-01' })
            );

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const { id: contractId } = exampleContract;

            const response = await request.put(
                `/contracts/${contractId}`,
                ContractFactory.generate({ userId, startDate: '2022-03-01' })
            );

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('DELETE /contracts/:id', () => {
        it('returns NO_CONTENT when logged in as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: contractId, userId } = exampleContract;

            const response = await request.delete(`/contracts/${contractId}`);

            const { numberOfLeaveDays } = await User.findOne({ where: { id: userId }, raw: true });

            expect(response.status).toBe(NO_CONTENT);
            expect(numberOfLeaveDays).toBe(0);
        });

        it('returns NO_CONTENT sending not existing id as ADMIN', async () => {
            await loginAs(request, 'admin');

            const fakeId = faker.random.uuid();

            const response = await request.delete(`/contracts/${fakeId}`);

            expect(response.status).toBe(NO_CONTENT);
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');

            const { id: contractId } = exampleContract;

            const response = await request.delete(`/contracts/${contractId}`);

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const { id: contractId } = exampleContract;

            const response = await request.delete(`/contracts/${contractId}`);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });
});
