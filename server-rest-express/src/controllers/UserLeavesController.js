const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes');

class UserLeavesController {
    constructor(userRepository, leaveRepository) {
        this.userRepository = userRepository;
        this.leaveRepository = leaveRepository;
    }
    async index(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userRepository.findById(id);

            if (!user) {
                return res.sendStatus(NOT_FOUND);
            }

            const leaves = await this.leaveRepository.fetchAll({ where: { userId: id } });

            return res.json(leaves);
        } catch (err) {
            console.error(err);

            return res.sendStatus(INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UserLeavesController;
