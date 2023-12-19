<template>
    <v-container class="activator-button">
        <v-row>
            <v-dialog
                v-model="isCreateOrEditDialogVisible"
                persistent
                max-width="600px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="ml-4 mb-3"
                        color="primary"
                        left
                        v-bind="attrs"
                        v-on="on"
                        >{{ contract ? 'Edit' : 'Create contract' }}</v-btn
                    >
                </template>
                <v-card class="pa-2">
                    <v-card-title>
                        <span class="headline"
                            >{{ contract ? 'Edit' : 'Create' }} contract</span
                        >
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
                        <v-btn
                            text
                            @click="
                                isCreateOrEditDialogVisible = false;
                                clearAllServerErrors();
                            "
                            >Close</v-btn
                        >
                        <v-btn text @click="onSave">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import createOrEditValidator from '@/validators/contracts/createOrEditValidator.mixin';
import { BAD_REQUEST } from 'http-status-codes';

export default {
    name: 'createOrUpdateContract',
    props: {
        contract: {
            type: Object,
            required: false,
            default: null
        }
    },
    mixins: [createOrEditValidator],
    data() {
        const defaultFormData = {
            userId: this.$route.params.id,
            startDate: '',
            daysOff: 20,
            duration: 1
        };

        return {
            isCreateOrEditDialogVisible: false,
            isStartDatePickerVisible: false,
            durationValues: [
                { text: '1 Month', value: 1 },
                { text: '3 Months', value: 3 },
                { text: '6 Months', value: 6 },
                { text: '12 Months', value: 12 }
            ],
            defaultFormData,
            formData: this.contract
                ? { ...this.contract }
                : { ...defaultFormData }
        };
    },
    methods: {
        ...mapActions(['saveContract']),

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
            } catch (err) {
                this.checkForServerFormErrors(err);

                if (err.response && err.response.status !== BAD_REQUEST) {
                    this.$notify({
                        group: 'app',
                        type: 'error',
                        title: `An error occured during saving this contract`
                    });
                }

                console.error(err);

                return;
            }

            if (!this.contract) {
                this.formData = { ...this.defaultFormData };
                this.$v.$reset();
            }

            this.isCreateOrEditDialogVisible = false;
        }
    }
};
</script>
