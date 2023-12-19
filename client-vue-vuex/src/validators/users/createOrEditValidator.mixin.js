import {
    required,
    email,
    minLength,
    maxLength,
    requiredIf
} from 'vuelidate/lib/validators';
import abstractValidatorMixin from '@/validators/abstractValidator.mixin';

export default {
    mixins: [abstractValidatorMixin],
    data() {
        return {
            serverErrors: {
                firstName: [],
                lastName: [],
                birthDate: [],
                email: [],
                password: [],
                general: []
            }
        };
    },
    validations: {
        formData: {
            firstName: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(32)
            },
            lastName: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(32)
            },
            birthDate: { required },
            email: { required, email },
            password: {
                required: requiredIf(function() {
                    return !this.isEdit;
                }),
                minLength: minLength(8),
                maxLength: maxLength(32)
            }
        }
    },
    computed: {
        firstNameErrors() {
            return this.checkErrors('firstName');
        },
        lastNameErrors() {
            return this.checkErrors('lastName');
        },
        birthDateErrors() {
            return this.checkErrors('birthDate');
        },
        emailErrors() {
            return this.checkErrors('email');
        },
        passwordErrors() {
            return this.checkErrors('password');
        }
    }
};
