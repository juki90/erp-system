const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes');

class UserContractsController {
    constructor(userRepository, contractRepository) {
        this.userRepository = userRepository;
        this.contractRepository = contractRepository;
    }

    async index(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userRepository.findById(id);

            if (!user) {
                return res.sendStatus(NOT_FOUND);
            }

            const contracts = await this.contractRepository.fetchAll({ where: { userId: id } });

            return res.json(contracts);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UserContractsController;
