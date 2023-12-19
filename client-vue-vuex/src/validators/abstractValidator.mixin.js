import { validationMixin } from 'vuelidate';
import {
    BAD_REQUEST,
    UNAUTHORIZED,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR
} from 'http-status-codes';

export default {
    mixins: [validationMixin],
    data() {
        return {
            serverErrors: {}
        };
    },
    computed: {
        isValid() {
            return !this.$v.$invalid;
        }
    },
    methods: {
        checkForServerFormErrors(error) {
            if (
                error.response.status &&
                [
                    BAD_REQUEST,
                    UNAUTHORIZED,
                    NOT_FOUND,
                    INTERNAL_SERVER_ERROR
                ].includes(error.response.status)
            ) {
                error.response.data.forEach(error => {
                    if (this.serverErrors[error.param]) {
                        this.serverErrors[error.param] = [];
                        this.serverErrors[error.param].push(error.message);
                    }
                });

                if (
                    error.response.status === BAD_REQUEST ||
                    (error.response.status === UNAUTHORIZED &&
                        this.$router.currentRoute.name === 'login')
                ) {
                    this.$notify({
                        group: 'app',
                        type: 'error',
                        title: 'Form error - check the form'
                    });
                }

                return true;
            }

            return false;
        },
        clearAllServerErrors() {
            const properties = Object.keys(this.serverErrors);

            properties.forEach(property => (this.serverErrors[property] = []));
        },
        checkServerErrors(inputName) {
            const errors = [],
                serverErrors = this.serverErrors[inputName];

            serverErrors.length &&
                serverErrors.forEach(err => errors.push(err));

            return errors;
        },
        checkRequired(inputName, formName = 'formData') {
            const errors = [],
                input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            !input.required && errors.push('This field is required');

            return errors;
        },
        checkEmail(inputName, formName = 'formData') {
            const errors = [],
                input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            !input.email && errors.push('This is not correct e-mail');

            return errors;
        },
        checkLength(inputName, formName = 'formData') {
            const errors = [],
                input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            (!input.minLength || !input.maxLength) &&
                errors.push(
                    `This field must contain from ${input.$params.minLength.min} to ${input.$params.maxLength.max} characters`
                );

            return errors;
        },
        checkErrors(inputName, formName = 'formData') {
            let errors = [];

            const input = this.$v[formName][inputName];

            if (!input.$dirty) {
                return errors;
            }

            if (input.$params.required) {
                errors = errors.concat(this.checkRequired(inputName, formName));
            }

            if (input.$params.email) {
                errors = errors.concat(this.checkEmail(inputName, formName));
            }

            if (input.$params.minLength || input.$params.maxLength) {
                errors = errors.concat(this.checkLength(inputName, formName));
            }

            errors = errors.concat(this.checkServerErrors(inputName));

            return errors;
        }
    }
};
