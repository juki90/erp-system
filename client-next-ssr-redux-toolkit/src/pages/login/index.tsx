import DefaultLayout from 'layout/DefaultLayout';
import LoginForm from 'components/auth/LoginForm';

import type { FC } from 'react';

const LoginPage: FC = () => (
    <DefaultLayout>
        <LoginForm />
    </DefaultLayout>
);

export default LoginPage;
