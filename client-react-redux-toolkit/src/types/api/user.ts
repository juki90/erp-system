type User = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    birthDate: string;
    email: string;
    numberOfLeaveDays: number;
    createdAt: string;
    updatedAt: string;
    roles?: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        UserRole: {
            roleId: string;
            userId: string;
        };
    }[];
};

type UserCreateRequest = {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    password: string;
    adminRights: boolean;
};

type UserUpdateRequest = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    adminRights: boolean;
};

type UserCreateResponse = User;

type UserUpdateResponse = User;

export type {
    User,
    UserCreateRequest,
    UserUpdateRequest,
    UserCreateResponse,
    UserUpdateResponse
};
