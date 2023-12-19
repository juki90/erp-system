const { OK, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } = require('http-status-codes');
const faker = require('faker');
const logout = require('./utilities/logout');
const loginAs = require('./utilities/loginAs');
const truncateDatabase = require('./utilities/truncateDatabase');
const runSeeders = require('./utilities/runSeeders');
const ContractFactory = require('./factories/contract');
const LeaveFactory = require('./factories/leave');
const { sequelize, User } = require('../src/models');

const app = require('../src/index');
const request = require('supertest-session')(app);

let userId;

beforeAll(async () => {
    await runSeeders();

    const { id } = await User.findOne({ where: { email: 'user@erpemployee.test' }, raw: true });

    userId = id;

    await ContractFactory.create({ userId, startDate: '2020-01-01' });
    await LeaveFactory.create({ userId, startDate: '2020-01-02' });
    await LeaveFactory.create({ userId, startDate: '2020-01-03' });
    await LeaveFactory.create({ userId, startDate: '2020-01-04' });
});

afterAll(async () => {
    const redisClient = app.get('redisClient');

    await truncateDatabase();
    await sequelize.close();
    await redisClient.quit();
});

describe('UserLeavesController', () => {
    afterEach(async () => await logout(request));

    describe('GET /users/:id/leaves', () => {
        it('returns OK when logged as ADMIN', async () => {
            await loginAs(request, 'admin');

            const response = await request.get(`/users/${userId}/leaves`);

            expect(response.status).toBe(OK);
            expect(response.body).toHaveLength(3);
        });

        it('returns NOT_FOUND sending invalid id as ADMIN', async () => {
            await loginAs(request, 'admin');

            const fakeId = faker.random.uuid();

            const response = await request.get(`/users/${fakeId}/leaves`);

            expect(response.status).toBe(NOT_FOUND);
        });

        it('returns FORBIDDEN when logged as USER', async () => {
            await loginAs(request, 'user');

            const response = await request.get(`/users/${userId}/leaves`);

            expect(response.status).toBe(FORBIDDEN);
        });

        it('returns UNAUTHORIZED when NOBODY IS LOGGED IN', async () => {
            const response = await request.get(`/users/${userId}/leaves`);

            expect(response.status).toBe(UNAUTHORIZED);
        });
    });
});
