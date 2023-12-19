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
                email: [],
                password: [],
                general: []
            }
        };
    },
    validations: {
        formData: {
            email: {
                required,
                email,
                minLength: minLength(8),
                maxLength: maxLength(32)
            },
            password: {
                required,
                minLength: minLength(8),
                maxLength: maxLength(32)
            }
        }
    },
    computed: {
        emailErrors() {
            return this.checkErrors('email');
        },
        passwordErrors() {
            return this.checkErrors('password');
        }
    }
};
