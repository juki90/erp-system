import { required } from 'vuelidate/lib/validators';
import abstractValidatorMixin from '@/validators/abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                userId: [],
                startDate: [],
                endDate: [],
                general: []
            }
        };
    },
    validations: {
        formData: {
            userId: { required },
            startDate: { required },
            endDate: { required }
        }
    },
    computed: {
        startDateErrors() {
            return this.checkErrors('startDate');
        },
        endDateErrors() {
            return this.checkErrors('endDate');
        }
    }
};
