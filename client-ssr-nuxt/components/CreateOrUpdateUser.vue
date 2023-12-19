<template>
    <v-container class="py-0">
        <v-row class="px-0">
            <v-dialog v-model="isVisible" persistent max-width="600px">
                <v-card class="pa-2">
                    <v-card-title>
                        <span class="headline">{{ title }}</span>
                    </v-card-title>
                    <v-card-text class="px-4">
                        <v-container>
                            <v-row>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <p class="text--primary font-weight-bold"
                                        >First and last name</p
                                    >
                                </v-col>
                                <v-col cols="12" xs="12">
                                    <v-text-field
                                        id="firstName"
                                        v-model="formData.firstName"
                                        class="pt-0 mt-0 mb-4"
                                        type="string"
                                        label="First name"
                                        :error-messages="firstNameErrors"
                                        @blur="$v.formData.firstName.$touch"
                                        @keyup="clearAllServerErrors"
                                    />
                                    <v-text-field
                                        id="lastName"
                                        v-model="formData.lastName"
                                        class="pt-0 mt-0 mb-4"
                                        type="string"
                                        label="Last name"
                                        :error-messages="lastNameErrors"
                                        @blur="$v.formData.lastName.$touch"
                                        @keyup="clearAllServerErrors"
                                    />
                                </v-col>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <p class="text--primary font-weight-bold"
                                        >The date of birth</p
                                    >
                                </v-col>
                                <v-col cols="12" xs="12">
                                    <v-menu
                                        v-model="isBirthDatePickerVisible"
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <v-text-field
                                                id="birthDate"
                                                :value="formData.birthDate"
                                                class="pt-0 mt-0 mb-4"
                                                type="string"
                                                prepend-icon="mdi-calendar"
                                                v-bind="attrs"
                                                readonly
                                                :error-messages="
                                                    birthDateErrors
                                                "
                                                v-on="on"
                                            />
                                        </template>
                                        <v-date-picker
                                            v-model="formData.birthDate"
                                            no-title
                                            @input="
                                                isBirthDatePickerVisible = false;
                                                clearAllServerErrors;
                                            "
                                        />
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <p class="text--primary font-weight-bold"
                                        >E-Mail Address</p
                                    >
                                </v-col>
                                <v-col cols="12" xs="12">
                                    <v-text-field
                                        id="email"
                                        v-model="formData.email"
                                        class="pt-0 mt-0 mb-4"
                                        type="string"
                                        label="E-mail address"
                                        :error-messages="emailErrors"
                                        @blur="$v.formData.email.$touch"
                                        @keyup="clearAllServerErrors"
                                    />
                                </v-col>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <p class="text--primary font-weight-bold">
                                        {{
                                            formData.id
                                                ? 'Password (leave empty if not changing)'
                                                : 'Password'
                                        }}
                                    </p>
                                </v-col>
                                <v-col cols="12" xs="12">
                                    <v-text-field
                                        id="password"
                                        v-model="formData.password"
                                        class="pt-0 mt-0 mb-4"
                                        type="password"
                                        label="Password"
                                        :error-messages="passwordErrors"
                                        @blur="$v.formData.password.$touch"
                                        @keyup="clearAllServerErrors"
                                    />
                                </v-col>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <p class="text--primary font-weight-bold"
                                        >User with admin rights</p
                                    >
                                </v-col>
                                <v-col cols="12" xs="12">
                                    <v-checkbox
                                        v-model="formData.adminRights"
                                        :label="`Admin rights: ${
                                            formData.adminRights ? 'YES' : 'NO'
                                        }`"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="pa-4">
                        <v-btn text @click="onClose">Close</v-btn>
                        <v-btn text @click="onSave">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import { BAD_REQUEST } from 'http-status-codes';
import createOrEditValidator from '~/validators/users/createOrEditValidator.mixin';

export default {
    name: 'CreateOrUpdateUser',

    mixins: [createOrEditValidator],

    props: {
        user: {
            type: Object,
            required: false,
            default: () => ({})
        },
        isVisible: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        const defaultFormData = {
            firstName: '',
            lastName: '',
            birthDate: '',
            email: '',
            password: '',
            adminRights: false
        };

        return {
            isBirthDatePickerVisible: false,
            defaultFormData,
            formData: this.user.id ? { ...this.user } : { ...defaultFormData }
        };
    },

    computed: {
        title() {
            return this.user.id ? 'Edit employee' : 'Create employee';
        }
    },

    methods: {
        ...mapActions({
            saveUser: 'users/saveUser'
        }),

        async onSave() {
            this.$v.$touch();

            if (!this.isValid) {
                return;
            }

            try {
                await this.saveUser(this.formData);

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Saved user successfully`
                });

                this.onClose();
            } catch (err) {
                this.checkForServerFormErrors(err);

                if (
                    !err.response ||
                    (err.response && err.response.status !== BAD_REQUEST)
                ) {
                    this.$notify({
                        group: 'app',
                        type: 'error',
                        title: `An error occured during saving this user`
                    });
                }

                console.error(err);
            }
        },

        onClose() {
            this.clearAllServerErrors();

            this.formData = this.user.id
                ? { ...this.user }
                : { ...this.defaultFormData };
            this.$v.$reset();

            this.$emit('close');
        }
    }
};
</script>
