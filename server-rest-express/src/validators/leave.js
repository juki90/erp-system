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

            const isAdmin = await req.loggedUser.isAdmin();

            if (!isAdmin && req.loggedUser.id !== userId) {
                return Promise.reject('You can not add or edit leaves of other users');
            }
        }),

    body('isConfirmed').custom(async (isConfirmed, { req }) => {
        const isAdmin = await req.loggedUser.isAdmin();

        if (!isAdmin && isConfirmed) {
            return Promise.reject('You are not allowed to add or edit confirmed leaves');
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

    body('endDate')
        .trim()
        .not()
        .isEmpty()
        .withMessage('End date is not provided')
        .bail()
        .isISO8601()
        .withMessage('End date is in wrong format or is unreal')
        .custom((params, { req }) => moment(req.body.endDate).diff(moment(req.body.startDate), 'days') >= 0)
        .withMessage('Start date must be before end date'),

    body(['startDate', 'endDate'])
        .custom(async (fields, { req }) => {
            const { startDate, endDate, userId, id: leaveId } = req.body;

            const di = req.app.get('di');
            const leaveRepository = di.get('repositories.leave');

            const leave = await leaveRepository.findOneByDateAndUser(
                startDate,
                endDate,
                userId,
                leaveId ? { id: { [Op.not]: leaveId } } : {}
            );

            if (leave) {
                return Promise.reject('There is existing leave in this range of time');
            }
        })
        .bail()
        .custom(async (fields, { req }) => {
            const { startDate, endDate, userId } = req.body;

            const di = req.app.get('di');
            const contractRepository = di.get('repositories.contract');

            const contract = await contractRepository.findOneWithinDate(startDate, endDate, userId);

            if (!contract) {
                return Promise.reject('Leave must be in the time of existing contract');
            }
        })
];
