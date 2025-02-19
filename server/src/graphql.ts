
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface ConfirmEmailInput {
    code: string;
}

export interface CreateAdminInput {
    email: string;
    password: string;
}

export interface CreateSenderInput {
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AdminOutModel {
    id: number;
    email: string;
}

export interface UserOutModel {
    id: number;
    email: string;
}

export interface LoginOutModel {
    accessToken: string;
    user: UserOutModel;
}

export interface SenderOutModel {
    id: number;
    email: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    passportNum?: Nullable<string>;
    balance: number;
    active: boolean;
}

export interface IQuery {
    auth_confirmEmail(input: ConfirmEmailInput): boolean | Promise<boolean>;
}

export interface IMutation {
    auth_RegisterAdmin(input: CreateAdminInput): AdminOutModel | Promise<AdminOutModel>;
    auth_RegisterSender(input: CreateSenderInput): SenderOutModel | Promise<SenderOutModel>;
    auth_login(input: LoginInput): LoginOutModel | Promise<LoginOutModel>;
}

type Nullable<T> = T | null;
