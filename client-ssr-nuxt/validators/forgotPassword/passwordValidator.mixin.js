import {
    required,
    minLength,
    maxLength,
    sameAs
} from 'vuelidate/lib/validators';
import abstractValidatorMixin from '~/validators/abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                password: [],
                passwordRepeat: []
            }
        };
    },
    validations: {
        formData: {
            password: {
                required,
                minLength: minLength(8),
                maxLength: maxLength(32)
            },
            passwordRepeat: {
                required,
                minLength: minLength(8),
                maxLength: maxLength(32),
                sameAsPassword: sameAs('password')
            }
        }
    },
    computed: {
        passwordErrors() {
            return this.checkErrors('password');
        },
        passwordRepeatErrors() {
            return this.checkErrors('passwordRepeat');
        }
    }
};
