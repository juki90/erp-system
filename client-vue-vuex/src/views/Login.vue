<template>
    <v-container>
        <v-row>
            <v-col align-self="center">
                <v-card class="mx-auto pt-7" max-width="480">
                    <v-card-text class="py-0">
                        <p class="display-1 text--primary text-center mb-7">Please, log in</p>
                        <v-form ref="form">
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <p class="text--primary mb-0">E-Mail Address</p>
                                        <v-text-field
                                            v-model="formData.email"
                                            id="email"
                                            class="mb-4 pt-0"
                                            type="string"
                                            placeholder="first.last.name@email.com"
                                            :error-messages="emailErrors"
                                            @blur="$v.formData.email.$touch()"
                                            @keyup="clearAllServerErrors"
                                        />
                                        <p class="text--primary mb-0">Password</p>
                                        <v-text-field
                                            v-model="formData.password"
                                            id="password"
                                            class="mb-4 pt-0"
                                            type="password"
                                            placeholder="********"
                                            :error-messages="passwordErrors"
                                            @blur="
                                                $v.formData.password.$touch()
                                            "
                                            @keyup="clearAllServerErrors"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                        <p
                            v-if="serverErrors.general.length"
                            id="general-error"
                            class="red--text px-3"
                        >{{ serverErrors.general.join('. ') }}.</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <v-col cols="12" class="px-5 py-0 pb-3">
                                    <v-btn color="primary" @click="onLogin">Log in</v-btn>
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
import { mapActions } from 'vuex';
import loginValidatorMixin from '@/validators/login/loginValidator.mixin';
import { BAD_REQUEST, UNAUTHORIZED } from 'http-status-codes';

export default {
    name: 'loginView',
    mixins: [loginValidatorMixin],
    data() {
        return {
            formData: {
                email: '',
                password: ''
            }
        };
    },
    methods: {
        ...mapActions(['login']),

        async onLogin() {
            this.$v.$touch();

            if (!this.isValid) {
                return;
            }

            try {
                await this.login(this.formData);

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: 'Logged in successfully'
                });

                this.$router.push({ name: 'home' });
            } catch (err) {
                this.checkForServerFormErrors(err);

                if (
                    err.response &&
                    err.response.status !== BAD_REQUEST &&
                    err.response.status !== UNAUTHORIZED
                ) {
                    this.$notify({
                        group: 'app',
                        type: 'error',
                        title: 'An error occured during logging in'
                    });
                }

                console.error(err);
            }
        }
    }
};
</script>

