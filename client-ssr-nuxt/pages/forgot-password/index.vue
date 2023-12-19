<template>
    <v-container>
        <v-row>
            <v-col align-self="center">
                <v-card class="mx-auto pt-7" max-width="480">
                    <v-card-text class="py-0">
                        <p class="display-1 text--primary text-center mb-7"
                            >Reset password</p
                        >
                        <v-form ref="form">
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <p class="text--primary mb-0"
                                            >E-Mail Address</p
                                        >
                                        <v-text-field
                                            id="email"
                                            v-model="email"
                                            class="mb-4 pt-0"
                                            type="string"
                                            placeholder="first.last.name@email.com"
                                            :disabled="isConfirmationVisible"
                                            :error-messages="emailErrors"
                                            @blur="$v.email.$touch()"
                                            @keyup="clearAllServerErrors"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-card-text>
                    <v-card-text>
                        <p v-if="isConfirmationVisible" class="green--text mx-2"
                            >An email has been sent to you with details on how
                            to set a new password</p
                        >
                        <p class="mx-2"
                            >Go back to
                            <nuxt-link to="/login">login page</nuxt-link></p
                        >
                    </v-card-text>
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <v-col cols="12" class="px-5 py-0 pb-3">
                                    <v-btn
                                        color="primary"
                                        @click="onSubmit"
                                        :disabled="isConfirmationVisible"
                                        >Submit</v-btn
                                    >
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { BAD_REQUEST } from 'http-status-codes';
import { mapActions } from 'vuex';
import emailValidatorMixin from '~/validators/forgotPassword/emailValidator.mixin';

export default {
    mixins: [emailValidatorMixin],

    layout: 'unauthorized',

    data() {
        return {
            isConfirmationVisible: false,
            email: ''
        };
    },

    methods: {
        ...mapActions({
            requestPasswordReset: 'forgotPassword/requestPasswordReset'
        }),

        async onSubmit() {
            this.$v.$touch();

            if (!this.isValid) {
                return;
            }

            try {
                await this.requestPasswordReset(this.email);

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: 'Accepted password reset - check your email'
                });

                this.isConfirmationVisible = true;
            } catch (err) {
                this.checkForServerFormErrors(err);

                if (
                    !err.response ||
                    (err.response && err.response.status !== BAD_REQUEST)
                ) {
                    this.$notify({
                        group: 'app',
                        type: 'error',
                        title: 'An error occured making reset password request'
                    });
                }

                console.error(err);
            }
        }
    }
};
</script>
