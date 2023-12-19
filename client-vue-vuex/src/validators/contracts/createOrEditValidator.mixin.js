import { required } from 'vuelidate/lib/validators';
import abstractValidatorMixin from '@/validators/abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                userId: [],
                startDate: [],
                duration: [],
                daysOff: [],
                general: []
            }
        };
    },
    validations: {
        formData: {
            userId: { required },
            startDate: { required },
            duration: { required },
            daysOff: { required }
        }
    },
    computed: {
        startDateErrors() {
            return this.checkErrors('startDate');
        },
        durationErrors() {
            return this.checkErrors('duration');
        },
        daysOffErrors() {
            return this.checkErrors('daysOff');
        }
    }
};
