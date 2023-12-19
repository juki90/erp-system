import {
    required,
    minLength,
    maxLength,
    email
} from 'vuelidate/lib/validators';
import abstractValidatorMixin from '~/validators/abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                email: []
            }
        };
    },
    validations: {
        email: {
            required,
            email,
            minLength: minLength(8),
            maxLength: maxLength(32)
        }
    },
    computed: {
        emailErrors() {
            return this.checkErrors('email');
        }
    }
};
