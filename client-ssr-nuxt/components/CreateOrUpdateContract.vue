<template>
    <v-container class="py-0">
        <v-row>
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
                                        >Duration</p
                                    >
                                </v-col>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <v-select
                                        v-model="formData.duration"
                                        label="Choose duration"
                                        :items="durationValues"
                                        item-value="value"
                                        :error-messages="durationErrors"
                                        @blur="$v.formData.duration.$touch()"
                                        @input="clearAllServerErrors"
                                    />
                                </v-col>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <p class="text--primary font-weight-bold"
                                        >Number of days off</p
                                    >
                                </v-col>
                                <v-col cols="12" xs="12" class="pb-0 pt-5">
                                    <v-radio-group
                                        v-model="formData.daysOff"
                                        class="mt-0"
                                        :error-messages="daysOffErrors"
                                        @blur="$v.formData.daysOff.$touch()"
                                        @keyup="clearAllServerErrors"
                                    >
                                        <v-radio label="20 days" :value="20" />
                                        <v-radio label="26 days" :value="26" />
                                    </v-radio-group>
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
import { mapActions } from 'vuex';
import { BAD_REQUEST } from 'http-status-codes';
import createOrEditValidator from '~/validators/contracts/createOrEditValidator.mixin';

export default {
    name: 'CreateOrUpdateContract',

    mixins: [createOrEditValidator],

    props: {
        contract: {
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
            userId: this.$route.params.id,
            startDate: '',
            daysOff: 20,
            duration: 1
        };

        return {
            isStartDatePickerVisible: false,
            durationValues: [
                { text: '1 Month', value: 1 },
                { text: '3 Months', value: 3 },
                { text: '6 Months', value: 6 },
                { text: '12 Months', value: 12 }
            ],
            defaultFormData,
            formData: this.contract.id
                ? { ...this.contract }
                : { ...defaultFormData }
        };
    },

    computed: {
        title() {
            return this.contract.id ? 'Edit contract' : 'Create contract';
        }
    },

    watch: {
        contract() {
            this.formData = this.contract.id
                ? { ...this.contract }
                : { ...this.defaultFormData };
        }
    },

    methods: {
        ...mapActions({ saveContract: 'contracts/saveContract' }),

        async onSave() {
            this.$v.$touch();

            if (!this.isValid) {
                return;
            }

            try {
                await this.saveContract(this.formData);

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Saved contract successfully`
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
                        title: `An error occured during saving this contract`
                    });
                }

                console.error(err);
            }
        },
        onClose() {
            this.clearAllServerErrors();
            this.formData = { ...this.defaultFormData };
            this.$v.$reset();

            this.$emit('close');
        }
    }
};
</script>
