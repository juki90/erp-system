class CalculateLeaveDaysOnUserService {
    constructor(moment, userRepository) {
        this.moment = moment;
        this.userRepository = userRepository;
    }

    async create(userModel, startDate, endDate) {
        const { numberOfLeaveDays } = userModel.dataValues;
        const updatedLeaveDays = numberOfLeaveDays - this.moment(endDate).diff(this.moment(startDate), 'days') - 1;

        await userModel.update({ numberOfLeaveDays: updatedLeaveDays });
    }

    async update(leaveData, newStartDate, newEndDate) {
        const { startDate: oldStartDate, endDate: oldEndDate, userId } = leaveData;

        const user = await this.userRepository.findById(userId);
        const { numberOfLeaveDays } = user.dataValues;

        const oldDaysOfLeave = this.moment(oldEndDate).diff(this.moment(oldStartDate), 'days') + 1;
        const newDaysOfLeave = this.moment(newEndDate).diff(this.moment(newStartDate), 'days') + 1;
        const updatedLeaveDays = numberOfLeaveDays - newDaysOfLeave + oldDaysOfLeave;

        await user.update({ numberOfLeaveDays: updatedLeaveDays });
    }

    async delete(leaveModel) {
        const { startDate, endDate, userId } = leaveModel.dataValues;

        const user = await this.userRepository.findById(userId);
        const { numberOfLeaveDays } = user.dataValues;

        const updatedLeaveDays = numberOfLeaveDays + this.moment(endDate).diff(this.moment(startDate), 'days') + 1;

        await user.update({ numberOfLeaveDays: updatedLeaveDays });
    }
}

module.exports = CalculateLeaveDaysOnUserService;
