import { authApi } from 'api/auth';
import { initializeStore } from 'store';
import DefaultLayout from 'layout/DefaultLayout';
import PasswordResetForm from 'components/auth/PasswordResetForm';

import type { FC } from 'react';
import type { GetServerSideProps } from 'next';
import type { GetServerSideForgotPasswordProps } from 'types';

export const getServerSideProps: GetServerSideProps<
    GetServerSideForgotPasswordProps
> = async context => {
    const token = context.params?.token as string;
    const props: GetServerSideForgotPasswordProps = { fetchErrors: {} };

    try {
        const store = initializeStore();

        const result = await store.dispatch(
            authApi.endpoints.checkPasswordResetRequest.initiate(token)
        );

        if (result?.isSuccess) {
            props.isTokenVerfied = true;
        }

        if (result?.isError) {
            props.fetchErrors!.isTokenFetchFailed = true;
        }
    } catch (error) {
        console.error(
            'Error during checking password reset token on server side:',
            error
        );
    }

    return {
        props
    };
};

const PasswordResetPage: FC = () => (
    <DefaultLayout>
        <PasswordResetForm />
    </DefaultLayout>
);

export default PasswordResetPage;
