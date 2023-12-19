import type { ApiErrorResponse } from 'types/api/shared';

type Role = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    UserRole: {
        roleId: string;
        userId: string;
    };
};

type LoggedUser = {
    fullName: string;
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    numberOfLeaveDays: number;
    createdAt: string;
    updatedAt: string;
    roles: Role[] | string[];
};

type LoginRequest = {
    email: string;
    password: string;
};

type LoginResponse = LoggedUser | ApiErrorResponse | string;

type ResetPasswordRequestRequest = {
    email: string;
};

type ResetPasswordRequest = {
    password: string;
    passwordRepeat: string;
};

export type {
    LoginRequest,
    LoginResponse,
    ResetPasswordRequest,
    ResetPasswordRequestRequest,
    LoggedUser,
    Role
};
