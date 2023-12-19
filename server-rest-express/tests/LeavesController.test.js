const { OK, UNAUTHORIZED, CREATED, BAD_REQUEST, FORBIDDEN, NOT_FOUND, NO_CONTENT } = require('http-status-codes');
const faker = require('faker');
const moment = require('moment');
const logout = require('./utilities/logout');
const loginAs = require('./utilities/loginAs');
const truncateDatabase = require('./utilities/truncateDatabase');
const runSeeders = require('./utilities/runSeeders');
const findFieldErrorMessage = require('./utilities/findFieldErrorMessage');
const ContractFactory = require('./factories/contract');
const LeaveFactory = require('./factories/leave');
const { sequelize, User } = require('../src/models');

const app = require('../src/index');
const request = require('supertest-session')(app);

let userId, adminId, exampleLeave, exampleLeaveRequest, anotherExampleLeave;

beforeAll(async () => {
    await runSeeders();

    const user = await User.findOne({ where: { email: 'user@erpemployee.test' }, raw: true });
    const admin = await User.findOne({ where: { email: 'admin@erpemployee.test' }, raw: true });

    userId = user.id;
    adminId = admin.id;

    await ContractFactory.create({ userId: adminId, startDate: '2020-01-01' });

    exampleLeave = await LeaveFactory.create({ userId, startDate: '2020-01-02' });
    anotherExampleLeave = await LeaveFactory.create({ userId, startDate: '2020-01-03' });
    exampleLeaveRequest = await LeaveFactory.create({ userId, startDate: '2020-01-04', isConfirmed: false });
    await LeaveFactory.create({ userId: adminId, startDate: '2020-01-02' });
    await LeaveFactory.create({ userId: adminId, startDate: '2020-01-03' });
});

afterAll(async () => {
    const redisClient = app.get('redisClient');

    await truncateDatabase();
    await sequelize.close();
    await redisClient.quit();
});

describe('LeavesController', () => {
    afterEach(async () => await logout(request));

    describe('GET /leaves', () => {
        it('returns OK when logged as ADMIN', async () => {
            await loginAs(request, 'admin');

            const response = await request.get(`/leaves`);

            expect(response.status).toBe(OK);
            expect(response.body).toHaveLength(2);
        });

        it('returns OK when logged as USER', async () => {
            await loginAs(request, 'user');

            const response = await request.get(`/leaves`);

            expect(response.status).toBe(OK);
            expect(response.body).toHaveLength(3);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const response = await request.get(`/leaves`);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('POST /leaves', () => {
        it('returns CREATED sending valid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-05' });

            await request.post('/contracts').send(ContractFactory.generate({ userId, startDate: '2020-01-01' }));

            const response = await request.post('/leaves').send(leaveData);

            const { numberOfLeaveDays } = await User.findOne({ where: { id: userId }, raw: true });

            expect(response.status).toBe(CREATED);
            expect(numberOfLeaveDays).toBe(1);
            expect(response.body.startDate).toBe(leaveData.startDate);
        });

        it('returns CREATED sending valid data with isConfirmed=false as USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-06', isConfirmed: false });

            const response = await request.post('/leaves').send(leaveData);

            const { numberOfLeaveDays } = await User.findOne({ where: { id: userId }, raw: true });

            expect(response.status).toBe(CREATED);
            expect(numberOfLeaveDays).toBe(0);
            expect(response.body.startDate).toBe(leaveData.startDate);
        });

        it('returns BAD_REQUEST sending blank data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = {
                startDate: '',
                endDate: '',
                isConfirmed: true
            };

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Start date is not provided');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('End date is not provided');
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = {
                userId,
                startDate: '2024-13-13',
                endDate: '2020-13-13',
                isConfirmed: true
            };

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Start date is in wrong format or is unreal');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('End date is in wrong format or is unreal');
        });

        it('returns BAD_REQUEST sending id of not existing user as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = LeaveFactory.generate({ userId: faker.random.uuid(), startDate: '2020-01-07' });

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'userId')).toBe('User with this id does not exist');
        });

        it('returns BAD_REQUEST sending id of not existing user as USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({
                userId: faker.random.uuid(),
                startDate: '2020-01-21',
                isConfirmed: false
            });

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending id of different user as USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({
                userId: adminId,
                startDate: '2020-01-21',
                isConfirmed: false
            });

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending date of not existing contract as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = {
                userId,
                startDate: '2019-01-01',
                endDate: '2019-01-01',
                isConfirmed: true
            };

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Leave must be in the time of existing contract');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('Leave must be in the time of existing contract');
        });

        it('returns BAD_REQUEST sending date of existing leave ADMIN', async () => {
            await loginAs(request, 'admin');

            const { userId, startDate, endDate } = exampleLeave;

            const leaveData = {
                userId,
                startDate,
                endDate,
                isConfirmed: true
            };

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('There is existing leave in this range of time');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('There is existing leave in this range of time');
        });

        it('returns BAD_REQUEST sending to many days of leave as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-08' });
            leaveData.endDate = moment(leaveData.startDate).add(10, 'd').format('YYYY-MM-DD');

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Not enough leave days available');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('Not enough leave days available');
        });

        it('returns BAD_REQUEST sending endDate before startDate as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-09', endDate: '2020-01-08' });

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'endDate')).toBe('Start date must be before end date');
        });

        it('returns BAD_REQUEST sending valid data with isConfirmed=true as USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-11', isConfirmed: true });

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'isConfirmed')).toBe(
                'You are not allowed to add or edit confirmed leaves'
            );
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-12' });

            const response = await request.post('/leaves').send(leaveData);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('PUT /leaves/:id', () => {
        it('returns OK sending valid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-13' });
            const { id: leaveId } = exampleLeave;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(OK);
            expect(response.body.startDate).toBe(leaveData.startDate);
        });

        it('returns OK sending valid data with isConfirmed=false as USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-14', isConfirmed: false });
            const { id: leaveId } = exampleLeaveRequest;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(OK);
            expect(response.body.startDate).toBe(leaveData.startDate);
        });

        it('returns NOT_FOUND sending id of not existing leave ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-15' });
            const leaveId = faker.random.uuid();

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(NOT_FOUND);
        });

        it('returns NOT_FOUND sending id of not existing leave USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-15', isConfirmed: false });
            const leaveId = faker.random.uuid();

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(NOT_FOUND);
        });

        it('returns BAD_REQUEST sending blank data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = {
                userId,
                startDate: '',
                endDate: '',
                isConfirmed: true
            };
            const { id: leaveId } = exampleLeave;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Start date is not provided');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('End date is not provided');
        });

        it('returns BAD_REQUEST sending invalid data as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = {
                userId,
                startDate: '2024350-13-13',
                endDate: '2020-13-13',
                isConfirmed: true
            };
            const { id: leaveId } = exampleLeave;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Start date is in wrong format or is unreal');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('End date is in wrong format or is unreal');
        });

        it('returns BAD_REQUEST sending id of not existing user as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = LeaveFactory.generate({ userId: faker.random.uuid(), startDate: '2020-01-16' });
            const { id: leaveId } = leaveData;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending id of not existing user as USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({
                userId: faker.random.uuid(),
                startDate: '2020-01-16',
                isConfirmed: false
            });
            const { id: leaveId } = leaveData;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending id of different user as USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({
                userId: adminId,
                startDate: '2020-01-21',
                isConfirmed: false
            });

            const { id: leaveId } = exampleLeave;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
        });

        it('returns BAD_REQUEST sending date of not existing contract as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = {
                userId,
                startDate: '2019-01-01',
                endDate: '2019-01-01',
                isConfirmed: true
            };

            const { id: leaveId } = exampleLeave;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Leave must be in the time of existing contract');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('Leave must be in the time of existing contract');
        });

        it('returns BAD_REQUEST sending date of existing leave as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: leaveId } = exampleLeave;
            const { userId, startDate, endDate } = anotherExampleLeave;

            const leaveData = {
                userId,
                startDate,
                endDate,
                isConfirmed: true
            };

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('There is existing leave in this range of time');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('There is existing leave in this range of time');
        });

        it('returns BAD_REQUEST sending to many days of leave as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: leaveId, userId, startDate } = exampleLeave;
            const leaveData = {
                userId,
                startDate: moment(startDate).add(5, 'd').format('YYYY-MM-DD'),
                endDate: moment(startDate).add(10, 'd').format('YYYY-MM-DD'),
                isConfirmed: true
            };

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'startDate')).toBe('Not enough leave days available');
            expect(findFieldErrorMessage(response, 'endDate')).toBe('Not enough leave days available');
        });

        it('returns BAD_REQUEST sending endDate before startDate as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-09', endDate: '2020-01-08' });

            const { id: leaveId } = exampleLeave;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'endDate')).toBe('Start date must be before end date');
        });

        it('returns BAD_REQUEST sending valid data with isConfirmed=true as USER', async () => {
            await loginAs(request, 'user');

            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-20', isConfirmed: true });
            const { id: leaveId } = exampleLeave;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(BAD_REQUEST);
            expect(findFieldErrorMessage(response, 'isConfirmed')).toBe(
                'You are not allowed to add or edit confirmed leaves'
            );
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const leaveData = LeaveFactory.generate({ userId, startDate: '2020-01-17' });
            const { id: leaveId } = exampleLeave;

            const response = await request.put(`/leaves/${leaveId}`).send(leaveData);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('PUT /leaves/:id/confirm', () => {
        it('returns OK when logged as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: leaveId } = exampleLeaveRequest;

            const response = await request.put(`/leaves/${leaveId}/confirm`);

            expect(response.status).toBe(OK);
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');

            const { id: leaveId } = exampleLeaveRequest;

            const response = await request.put(`/leaves/${leaveId}/confirm`);

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const { id: leaveId } = exampleLeaveRequest;

            const response = await request.put(`/leaves/${leaveId}/confirm`);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });

    describe('DELETE /leaves/:id', () => {
        it('returns NO_CONTENT when logged as ADMIN', async () => {
            await loginAs(request, 'admin');

            const { id: leaveId, userId } = exampleLeave;

            const response = await request.delete(`/leaves/${leaveId}`);

            const { numberOfLeaveDays } = await User.findOne({ where: { id: userId }, raw: true });

            expect(response.status).toBe(NO_CONTENT);
            expect(numberOfLeaveDays).toBe(1);
        });

        it('returns NO_CONTENT sending not existing id as ADMIN', async () => {
            await loginAs(request, 'admin');

            const leaveId = faker.random.uuid();

            const response = await request.delete(`/leaves/${leaveId}`);

            expect(response.status).toBe(NO_CONTENT);
        });

        it('returns NO_CONTENT sending not existing id as USER', async () => {
            await loginAs(request, 'user');

            const leaveId = faker.random.uuid();

            const response = await request.delete(`/leaves/${leaveId}`);

            expect(response.status).toBe(NO_CONTENT);
        });

        it('returns NO_CONTENT sending id of isConfirmed=false leave as USER', async () => {
            await loginAs(request, 'user');

            const leaveRequest = await LeaveFactory.create({ userId, startDate: '2020-01-18', isConfirmed: false });

            const { id: leaveId } = leaveRequest;

            const response = await request.delete(`/leaves/${leaveId}`);

            expect(response.status).toBe(NO_CONTENT);
        });

        it("returns FORBIDDEN sending different user's leave id as USER", async () => {
            await loginAs(request, 'user');

            const { id: differentUsersId } = await User.findOne({
                where: { email: 'editable@erpemployee.test' },
                raw: true
            });

            const { id: leaveId } = await LeaveFactory.create({ userId: differentUsersId, isConfirmed: false });

            const response = await request.delete(`/leaves/${leaveId}`);

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns FORBIDDEN sending id of isConfirmed=true leave as USER', async () => {
            await loginAs(request, 'user');

            const { id: leaveId } = anotherExampleLeave;

            const response = await request.delete(`/leaves/${leaveId}`);

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const { id: leaveId } = anotherExampleLeave;

            const response = await request.delete(`/leaves/${leaveId}`);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });
});
