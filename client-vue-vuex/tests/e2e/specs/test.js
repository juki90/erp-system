const waitAmount = 500;

describe('NAVIGATING PAGE when NOBODY IS LOGGED IN', () => {
    it('redirects to LOGIN page when visiting HOME page', () => {
        cy.visit('/');
        cy.url().should('contain', '/login');
    });

    it('redirects to LOGIN page when visiting PROFILE page', () => {
        cy.visit('/profile');
        cy.url().should('contain', '/login');
    });

    it('redirects to LOGIN page when visiting EMPLOYEES page', () => {
        cy.visit('/employees');
        cy.url().should('contain', '/login');
    });
});

describe('LOGIN FORM INTERACTION when WHEN NOBODY IS LOGGED IN', () => {
    it("shows ERRORS on inputs' blur action when NOTHING IS TYPED", () => {
        cy.visit('/login');
        cy.get('#email').focus();
        cy.get('#password')
            .focus()
            .blur();

        cy.get('#email')
            .parents('.v-input')
            .contains('.v-messages__message', 'This field is required');
        cy.get('#password')
            .parents('.v-input')
            .contains('.v-messages__message', 'This field is required');
    });

    it("shows ERRORS on inputs' blur action when INVALID DATA IS TYPED", () => {
        cy.visit('/login');
        cy.get('#email').type('wrong@.mail.com');
        cy.get('#password')
            .type('pass')
            .blur();

        cy.get('#email')
            .parents('.v-input')
            .contains('.v-messages__message', 'This is not correct e-mail');
        cy.get('#password')
            .parents('.v-input')
            .contains(
                '.v-messages__message',
                'This field must contain from 8 to 32 characters'
            );
    });

    it("shows ERROR on form's submit sending WRONG EMAIL OR PASSWORD", () => {
        cy.visit('/login');
        cy.get('#email').type('notexisting@gmail.com');
        cy.get('#password')
            .type('password')
            .blur();
        cy.get('.v-card__actions .v-btn').click();

        cy.get('#general-error').contains('Wrong email or password');
    });
});

describe('LOGGING IN as ADMIN and CREATING USER', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('#email').type('john@erpemployee.test');
        cy.get('#password')
            .type('88888888')
            .blur();
        cy.get('.v-card__actions .v-btn').click();

        cy.wait(waitAmount);
    });

    it('shows admin specific elements when logged as ADMIN', () => {
        cy.get('.v-card__text p')
            .eq(0)
            .contains('Welcome to Employee ERP App');

        cy.get('.navigation [href="/profile"]').contains('a', 'Profile');
        cy.get('.navigation [href="/employees"]').contains('a', 'Employees');
        cy.get('.navigation [href="/"]').contains('a', 'Logout');
    });

    it('shows EMPLOYEE LIST when logged as ADMIN', () => {
        cy.get('.navigation [href="/employees"]').click();

        cy.wait(waitAmount);

        cy.get('.v-toolbar__title').should('have.length', 2);
    });

    it('trying to CREATE USER with empty data as ADMIN', () => {
        cy.get('.navigation [href="/employees"]').click();

        cy.wait(waitAmount);

        cy.get('.v-card button').click();

        cy.wait(waitAmount);

        cy.get('.v-card__actions .v-btn')
            .eq(2)
            .click();

        cy.get('#firstName')
            .parents('.v-input')
            .contains('.v-messages__message', 'This field is required');
        cy.get('#lastName')
            .parents('.v-input')
            .contains('.v-messages__message', 'This field is required');
        cy.get('#birthDate')
            .parents('.v-input')
            .contains('.v-messages__message', 'This field is required');
        cy.get('#email')
            .parents('.v-input')
            .contains('.v-messages__message', 'This field is required');
        cy.get('#password')
            .parents('.v-input')
            .contains('.v-messages__message', 'This field is required');

        cy.wait(waitAmount);
    });

    it('trying to CREATE USER with invalid data as ADMIN', () => {
        cy.get('.navigation [href="/employees"]').click();

        cy.wait(waitAmount);

        cy.get('.v-card button').click();

        cy.wait(waitAmount);
        cy.get('#firstName').type('Jo');
        cy.get('#lastName').type('Do');
        cy.get('#email').type('incorrect@.gmail.com');
        cy.get('#password')
            .type('4444')
            .blur();

        cy.get('.v-card__actions .v-btn')
            .eq(2)
            .click();

        cy.get('#firstName')
            .parents('.v-input')
            .contains(
                '.v-messages__message',
                'This field must contain from 3 to 32 characters'
            );
        cy.get('#lastName')
            .parents('.v-input')
            .contains(
                '.v-messages__message',
                'This field must contain from 3 to 32 characters'
            );
        cy.get('#email')
            .parents('.v-input')
            .contains('.v-messages__message', 'This is not correct e-mail');
        cy.get('#password')
            .parents('.v-input')
            .contains(
                '.v-messages__message',
                'This field must contain from 8 to 32 characters'
            );
    });

    it('CREATES USER with valid data as ADMIN and DELETES him', () => {
        cy.get('.navigation [href="/employees"]').click();

        cy.wait(waitAmount);

        cy.get('.v-card button').click();

        cy.wait(waitAmount);

        cy.get('#firstName')
            .clear()
            .type('John');
        cy.get('#lastName')
            .clear()
            .type('Doe');
        cy.get('#birthDate')
            .click()
            .get('.v-picker .v-btn')
            .eq(10)
            .click();
        cy.get('#email')
            .clear()
            .type('johndoe@gmail.com');
        cy.get('#password')
            .clear()
            .type('88888888')
            .blur();

        cy.get('.v-card__actions .v-btn')
            .eq(2)
            .click();

        cy.wait(waitAmount);

        cy.get('.v-toolbar__title').should('have.length', 3);

        cy.get('#employees .v-btn')
            .eq(0)
            .click();

        cy.wait(waitAmount);

        cy.get('.v-card .v-btn')
            .eq(2)
            .click();

        cy.wait(waitAmount);

        cy.get('.v-dialog .v-btn')
            .eq(1)
            .click();

        cy.get('.navigation [href="/"]').click();
    });
});
