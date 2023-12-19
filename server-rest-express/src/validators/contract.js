const { body } = require('express-validator');
const moment = require('moment');
const { Op } = require('sequelize');

module.exports = [
    body('userId')
        .trim()
        .not()
        .isEmpty()
        .withMessage('User id should not be empty')
        .bail()
        .isUUID(4)
        .withMessage('Incorrect UUIDv4')
        .bail()
        .custom(async (userId, { req }) => {
            const di = req.app.get('di');
            const userRepository = di.get('repositories.user');

            const user = await userRepository.findById(userId);

            if (!user) {
                return Promise.reject('User with this id does not exist');
            }
        }),

    body('startDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Start date is not provided')
        .bail()
        .isISO8601()
        .withMessage('Start date is in wrong format or is unreal'),

    body('duration')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Duration is not provided')
        .bail()
        .custom(duration => [1, 3, 6, 12].includes(parseInt(duration)))
        .withMessage('Wrong duration of the contract'),

    body(['startDate', 'duration']).custom(async (fields, { req }) => {
        const { startDate, duration, userId, id: contractId } = req.body;
        const endDate = moment(startDate).add(duration, 'M').subtract(1, 'd');
        req.body.endDate = endDate;

        const di = req.app.get('di');
        const contractRepository = di.get('repositories.contract');

        const contract = await contractRepository.findOneByDateAndUser(
            startDate,
            endDate,
            userId,
            contractId ? { id: { [Op.not]: contractId } } : {}
        );

        if (contract) {
            return Promise.reject('There is existing contract in this range of time');
        }
    }),

    body('daysOff')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Days off are not provided')
        .bail()
        .custom(daysOff => [20, 26].includes(parseInt(daysOff)))
        .withMessage('Wrong days off of the contract')
];
