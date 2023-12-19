const { CREATED, NOT_FOUND, NO_CONTENT, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Contract } = require('../models');

class ContractsController {
    constructor(contractRepository, userRepository, calculateContractLeaveDaysOnUserService) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.calculateContractLeaveDaysOnUserService = calculateContractLeaveDaysOnUserService;
    }

    async index(req, res) {
        try {
            const { id } = req.loggedUser;

            const contracts = await this.contractRepository.fetchAll({ where: { userId: id } });

            return res.json(contracts);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async store(req, res) {
        try {
            const { userId, daysOff, duration } = req.body;

            const user = await this.userRepository.findById(userId);

            const createdContract = await this.contractRepository.create(req.body, {
                fields: Contract.UPDATABLE_FIELDS
            });
            await this.calculateContractLeaveDaysOnUserService.create(user, daysOff, duration);

            return res.status(CREATED).json(createdContract);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async update(req, res) {
        try {
            const { id: contractId } = req.params;
            const { daysOff, duration } = req.body;

            const contract = await this.contractRepository.findById(contractId);

            if (!contract) {
                return res.sendStatus(NOT_FOUND);
            }

            const contractData = { ...contract.dataValues };
            const contractToSend = await contract.update(req.body, { fields: Contract.UPDATABLE_FIELDS });

            await this.calculateContractLeaveDaysOnUserService.update(contractData, daysOff, duration);

            return res.json(contractToSend);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }

    async delete(req, res) {
        try {
            const { id: contractId } = req.params;

            const contract = await this.contractRepository.findById(contractId);

            if (contract) {
                await contract.destroy();
                await this.calculateContractLeaveDaysOnUserService.delete(contract);
            }

            return res.sendStatus(NO_CONTENT);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = ContractsController;
