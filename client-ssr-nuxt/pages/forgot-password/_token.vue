<template>
    <v-container>
        <v-row>
            <v-col align-self="center">
                <v-card class="mx-auto pt-7" max-width="480">
                    <v-card-text class="py-0">
                        <p class="display-1 text--primary text-center mb-7"
                            >Enter new password</p
                        >
                        <v-form ref="form">
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <p class="text--primary mb-0"
                                            >Password</p
                                        >
                                        <v-text-field
                                            id="password"
                                            v-model="formData.password"
                                            class="mb-4 pt-0"
                                            type="password"
                                            placeholder="********"
                                            :error-messages="passwordErrors"
                                            :disabled="
                                                isConfirmationVisible ||
                                                isTokenInvalidMessageVisible
                                            "
                                            @blur="
                                                $v.formData.password.$touch()
                                            "
                                            @keyup="clearAllServerErrors"
                                        />
                                        <p class="text--primary mb-0"
                                            >Repeat password</p
                                        >
                                        <v-text-field
                                            id="password-repeat"
                                            v-model="formData.passwordRepeat"
                                            class="mb-4 pt-0"
                                            type="password"
                                            placeholder="********"
                                            :error-messages="
                                                passwordRepeatErrors
                                            "
                                            :disabled="
                                                isConfirmationVisible ||
                                                isTokenInvalidMessageVisible
                                            "
                                            @blur="
                                                $v.formData.passwordRepeat.$touch()
                                            "
                                            @keyup="clearAllServerErrors"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-card-text>
                    <v-card-text v-if="isConfirmationVisible">
                        <p class="green--text mx-2"
                            >Your password is changed!</p
                        >
                        <p class="mx-2"
                            >Go back to
                            <nuxt-link to="/login">login page</nuxt-link></p
                        >
                    </v-card-text>
                    <v-card-text v-if="isTokenInvalidMessageVisible">
                        <p class="red--text mx-2"
                            >Incorrect reset password token!</p
                        >
                        <p class="mx-2"
                            >Please, go to
                            <nuxt-link to="/forgot-password"
                                >password reset page</nuxt-link
                            ></p
                        >
                        <p class="mx-2"
                            >or to
                            <nuxt-link to="/login">login page</nuxt-link></p
                        >
                    </v-card-text>
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <v-col cols="12" class="px-5 py-0 pb-3">
                                    <v-btn
                                        color="primary"
                                        @click="onSave"
                                        :disabled="
                                            isConfirmationVisible ||
                                            isTokenInvalidMessageVisible
                                        "
                                        >Save</v-btn
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
import passwordValidatorMixin from '~/validators/forgotPassword/passwordValidator.mixin';

export default {
    mixins: [passwordValidatorMixin],

    layout: 'unauthorized',

    async asyncData({ store, route }) {
        try {
            await store.dispatch(
                'forgotPassword/checkPasswordReset',
                route.params.token
            );

            return {
                isTokenInvalidMessageVisible: false
            };
        } catch (err) {
            console.error(err);

            return {
                isTokenInvalidMessageVisible: true
            };
        }
    },

    data() {
        return {
            isConfirmationVisible: false,
            formData: {
                password: '',
                passwordRepeat: ''
            }
        };
    },

    methods: {
        ...mapActions({
            resetPassword: 'forgotPassword/resetPassword'
        }),

        async onSave() {
            this.$v.$touch();

            if (!this.isValid) {
                return;
            }

            try {
                await this.resetPassword({
                    token: this.$route.params.token,
                    passwords: this.formData
                });

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: 'Successfully changed password'
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
                        title: 'An error occured changing the password'
                    });
                }

                console.error(err);
            }
        }
    }
};
</script>
