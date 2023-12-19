import Vue from 'vue';
import Vuetify from 'vuetify';
import { mount, createLocalVue } from '@vue/test-utils';
import ConfirmDialog from './../../../src/components/ConfirmDialog.vue';

const localVue = createLocalVue();
Vue.use(Vuetify);

describe('COMPONENT ConfirmDialog.vue', () => {
    let wrapper;

    beforeAll(() => {
        wrapper = mount(ConfirmDialog, {
            localVue,
            vuetify: new Vuetify(),
            propsData: {
                title: 'Title',
                message: 'Message',
                buttonText: 'Delete'
            }
        });
    });

    it('displays activator BUTTON when dialog is not visible', () => {
        const button = wrapper.find('.v-btn__content');

        expect(button.exists()).toBeTruthy();
        expect(button.text()).toBe('Delete');
    });

    it('clicking activator BUTTON opens dialog', async () => {
        const button = wrapper.find('.v-btn');

        button.trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.isConfirmDialogVisible).toBeTruthy();
    });

    it('displays TITLE with given prop', () => {
        const title = wrapper.find('.v-card__title');

        expect(title.exists()).toBeTruthy();
        expect(title.text()).toBe('Title');
    });

    it('displays MESSAGE with given prop', () => {
        const message = wrapper.find('.v-card__text');

        expect(message.exists()).toBeTruthy();
        expect(message.text()).toBe('Message');
    });

    it("displays BUTTON with 'Cancel' text", () => {
        const button = wrapper.find(
            '.v-card__actions > button:nth-of-type(1) > .v-btn__content'
        );

        expect(button.exists()).toBeTruthy();
        expect(button.text()).toBe('Cancel');
    });

    it("displays BUTTON with 'Yes' text", () => {
        const button = wrapper.find(
            '.v-card__actions > button:nth-of-type(2)  > .v-btn__content'
        );

        expect(button.exists()).toBeTruthy();
        expect(button.text()).toBe('Yes');
    });

    it("click BUTTON with 'Cancel' text closes modal", async () => {
        const button = wrapper.find('.v-card__actions > button:nth-of-type(1)');

        button.trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.isConfirmDialogVisible).toBeFalsy();
    });

    it("click BUTTON with 'Yes' text closes modal", async () => {
        const confirmDialogMethod = jest.spyOn(
            ConfirmDialog.methods,
            'confirmDialog'
        );

        const wrapper = mount(ConfirmDialog, {
            localVue,
            vuetify: new Vuetify(),
            propsData: {
                title: 'Title',
                message: 'Message',
                buttonText: 'Delete'
            }
        });

        const activatorButton = wrapper.find('button');

        activatorButton.trigger('click');

        await wrapper.vm.$nextTick();

        const confirmButton = wrapper.find(
            '.v-card__actions > button:nth-of-type(2)'
        );

        confirmButton.trigger('click');

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.isConfirmDialogVisible).toBeFalsy();
        expect(confirmDialogMethod).toHaveBeenCalled();
    });
});
