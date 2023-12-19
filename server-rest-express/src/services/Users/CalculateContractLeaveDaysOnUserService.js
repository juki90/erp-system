class CalculateContractLeaveDaysOnUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async create(userModel, daysOff, duration) {
        const { numberOfLeaveDays } = userModel.dataValues;
        const updatedLeaveDays = numberOfLeaveDays + Math.round((daysOff * duration) / 12);

        await userModel.update({ numberOfLeaveDays: updatedLeaveDays });
    }

    async update(contractData, newDaysOff, newDuration) {
        const { userId, daysOff: oldDaysOff, duration: oldDuration } = contractData;

        const user = await this.userRepository.findById(userId);
        const { numberOfLeaveDays } = user.dataValues;

        const updatedLeaveDays =
            numberOfLeaveDays -
            Math.round((oldDaysOff * oldDuration) / 12) +
            Math.round((newDaysOff * newDuration) / 12);

        await user.update({ numberOfLeaveDays: updatedLeaveDays });
    }

    async delete(contractModel) {
        const { userId, daysOff, duration } = contractModel.dataValues;

        const user = await this.userRepository.findById(userId);
        const { numberOfLeaveDays } = user.dataValues;
        const updatedLeaveDays = numberOfLeaveDays - Math.round((daysOff * duration) / 12);

        await user.update({ numberOfLeaveDays: updatedLeaveDays });
    }
}

module.exports = CalculateContractLeaveDaysOnUserService;
