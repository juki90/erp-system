<template>
    <v-container class="activator-button py-0">
        <v-row>
            <v-dialog v-model="isVisible" persistent max-width="600px">
                <v-card class="pa-2">
                    <v-card-title>
                        <span class="headline">
                            {{ title }}
                        </span>
                    </v-card-title>
                    <v-card-text class="px-4">
                        <v-container>
                            <v-row>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <p class="text--primary font-weight-bold"
                                        >Start date</p
                                    >
                                </v-col>
                                <v-col cols="12" xs="12">
                                    <v-menu
                                        v-model="isStartDatePickerVisible"
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
                                                :value="formData.startDate"
                                                class="pt-0 mt-0 mb-4"
                                                type="string"
                                                prepend-icon="mdi-calendar"
                                                readonly
                                                :error-messages="
                                                    startDateErrors
                                                "
                                                v-bind="attrs"
                                                v-on="on"
                                            />
                                        </template>
                                        <v-date-picker
                                            v-model="formData.startDate"
                                            no-title
                                            @input="
                                                isStartDatePickerVisible = false;
                                                clearAllServerErrors();
                                            "
                                        />
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <p class="text--primary font-weight-bold"
                                        >End date</p
                                    >
                                </v-col>
                                <v-col cols="12" xs="12">
                                    <v-menu
                                        v-model="isEndDatePickerVisible"
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
                                                :value="formData.endDate"
                                                class="pt-0 mt-0 mb-4"
                                                type="string"
                                                prepend-icon="mdi-calendar"
                                                readonly
                                                :error-messages="endDateErrors"
                                                v-bind="attrs"
                                                v-on="on"
                                            />
                                        </template>
                                        <v-date-picker
                                            v-model="formData.endDate"
                                            no-title
                                            @input="
                                                isEndDatePickerVisible = false;
                                                clearAllServerErrors();
                                            "
                                        />
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="pa-4">
                        <v-btn text @click="onClose">Close</v-btn>
                        <v-btn text @click="onSave"> Save </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { BAD_REQUEST } from 'http-status-codes';
import createOrEditValidator from '~/validators/leave/createOrEditValidator.mixin';

export default {
    name: 'CreateOrUpdateLeave',

    mixins: [createOrEditValidator],

    props: {
        leave: {
            type: Object,
            required: true,
            default: () => ({})
        },
        isRequest: {
            type: Boolean,
            required: false,
            default: false
        },
        isVisible: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        const defaultFormData = {
            startDate: '',
            endDate: '',
            isConfirmed: !this.isRequest
        };

        return {
            isStartDatePickerVisible: false,
            isEndDatePickerVisible: false,
            defaultFormData,
            formData: this.leave.id ? { ...this.leave } : { ...defaultFormData }
        };
    },

    computed: {
        ...mapGetters({ getLoggedUser: 'users/getLoggedUser' }),

        title() {
            const request = this.isRequest ? 'request' : '';

            return this.leave.id
                ? `Edit leave ${request}`
                : `Add leave ${request}`;
        }
    },

    watch: {
        leave() {
            this.formData = this.leave.id
                ? { ...this.leave }
                : { ...this.defaultFormData };
        }
    },

    created() {
        this.formData.userId = this.$route.params.id || this.getLoggedUser.id;
    },

    methods: {
        ...mapActions({ saveLeave: 'leaves/saveLeave' }),

        async onSave() {
            this.$v.$touch();

            if (!this.isValid) {
                return;
            }

            try {
                await this.saveLeave({
                    leaveData: this.formData,
                    isInProfile: this.$route.name === 'profile'
                });

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Saved leave ${
                        this.isRequest ? 'request' : ''
                    } successfully`
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
                        title: `An error occured saving this leave ${
                            this.isRequest ? 'request' : ''
                        }`
                    });
                }

                console.error(err);
            }
        },
        onClose() {
            this.formData = {
                ...this.defaultFormData,
                userId: this.$route.params.id || this.getLoggedUser.id
            };
            this.$v.$reset();

            this.$emit('close');
        }
    }
};
</script>
