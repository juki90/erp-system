const { CREATED, NOT_FOUND, NO_CONTENT, BAD_REQUEST, INTERNAL_SERVER_ERROR, FORBIDDEN } = require('http-status-codes');
const { Leave } = require('../models');

class LeavesController {
    constructor(userRepository, leaveRepository, calculateLeaveDaysOnUserService, checkIfUserHasEnoughLeaveDays) {
        this.userRepository = userRepository;
        this.leaveRepository = leaveRepository;
        this.calculateLeaveDaysOnUserService = calculateLeaveDaysOnUserService;
        this.checkIfUserHasEnoughLeaveDays = checkIfUserHasEnoughLeaveDays;
    }

    async index(req, res) {
        try {
            const { id } = req.loggedUser;

            const leaves = await this.leaveRepository.fetchAll({ where: { userId: id } });

            return res.json(leaves);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async store(req, res) {
        try {
            const errorMessage = await this.checkIfUserHasEnoughLeaveDays.check(req.body);

            if (errorMessage) {
                return res.status(BAD_REQUEST).json([
                    { message: errorMessage, param: 'startDate' },
                    { message: errorMessage, param: 'endDate' }
                ]);
            }

            const createdLeave = await this.leaveRepository.create(req.body, { fields: Leave.UPDATABLE_FIELDS });

            const { userId, startDate, endDate } = req.body;

            const user = await this.userRepository.findById(userId);
            await this.calculateLeaveDaysOnUserService.create(user, startDate, endDate);

            return res.status(CREATED).json(createdLeave);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id: leaveId } = req.params;

            const leave = await this.leaveRepository.findById(leaveId);

            if (!leave) {
                return res.sendStatus(NOT_FOUND);
            }

            const errorMessage = await this.checkIfUserHasEnoughLeaveDays.check(req.body, leave);

            if (errorMessage) {
                return res.status(BAD_REQUEST).json([
                    { message: errorMessage, param: 'startDate' },
                    { message: errorMessage, param: 'endDate' }
                ]);
            }

            const { startDate, endDate } = req.body;

            const leaveData = { ...leave.dataValues };
            const leaveToSend = await leave.update(req.body, { fields: Leave.UPDATABLE_FIELDS });
            await this.calculateLeaveDaysOnUserService.update(leaveData, startDate, endDate);

            return res.json(leaveToSend);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async confirm(req, res) {
        try {
            const { id: leaveId } = req.params;

            const leave = await this.leaveRepository.findById(leaveId);

            if (!leave) {
                return res.sendStatus(NOT_FOUND);
            }

            const leaveToSend = await leave.update({ isConfirmed: true }, { fields: Leave.UPDATABLE_FIELDS });

            return res.json(leaveToSend);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async delete(req, res) {
        try {
            const { id: leaveId } = req.params;

            const leave = await this.leaveRepository.findById(leaveId);

            if (leave) {
                const isAdmin = await req.loggedUser.isAdmin();

                if (!isAdmin && (leave.isConfirmed || leave.userId !== req.loggedUser.id)) {
                    return res.sendStatus(FORBIDDEN);
                }

                await leave.destroy();
                await this.calculateLeaveDaysOnUserService.delete(leave);
            }

            return res.sendStatus(NO_CONTENT);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = LeavesController;
