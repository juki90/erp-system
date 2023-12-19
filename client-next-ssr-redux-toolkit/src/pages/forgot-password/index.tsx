import DefaultLayout from 'layout/DefaultLayout';
import PasswordResetRequestForm from 'components/auth/PasswordResetRequestForm';

import type { FC } from 'react';

const ForgotPasswordPage: FC = () => (
    <DefaultLayout>
        <PasswordResetRequestForm />
    </DefaultLayout>
);

export default ForgotPasswordPage;
