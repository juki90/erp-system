class CheckIfUserHasEnoughLeaveDays {
    constructor(moment, userRepository) {
        this.moment = moment;
        this.userRepository = userRepository;
    }

    async check(requestBody, leave = null) {
        const { startDate: newStartDate, endDate: newEndDate, userId } = requestBody;

        const newDaysToTake = this.moment(newEndDate).diff(this.moment(newStartDate), 'days') + 1;

        const { numberOfLeaveDays } = await this.userRepository.findById(userId, { raw: true });

        if (leave) {
            const { startDate: oldStartDate, endDate: oldEndDate } = leave;

            const oldDaysToTake = this.moment(oldEndDate).diff(this.moment(oldStartDate), 'days') + 1;

            if (newDaysToTake - oldDaysToTake <= numberOfLeaveDays) {
                return null;
            }

            return 'Not enough leave days available';
        }

        if (newDaysToTake > numberOfLeaveDays) {
            return 'Not enough leave days available';
        }

        return null;
    }
}

module.exports = CheckIfUserHasEnoughLeaveDays;
