
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum USER_ROLE {
    admin = "admin",
    sender = "sender"
}

export interface ConfirmEmailInput {
    code: string;
}

export interface RegisterAdminInput {
    email: string;
    password: string;
}

export interface RegisterSenderInput {
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface ResendConfirmationEmailInput {
    email: string;
}

export interface AdminOutModel {
    id: number;
    email: string;
    role: USER_ROLE;
}

export interface SenderOutModel {
    id: number;
    email: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    passportNum?: Nullable<string>;
    balance: number;
    active: boolean;
    role: USER_ROLE;
}

export interface UserOutModel {
    id: number;
    email: string;
    role: string;
}

export interface IQuery {
    auth_confirmEmail(input: ConfirmEmailInput): boolean | Promise<boolean>;
    auth_getMe(): GetMeResponse | Promise<GetMeResponse>;
}

export interface IMutation {
    auth_registerAdmin(input: RegisterAdminInput): AdminOutModel | Promise<AdminOutModel>;
    auth_registerSender(input: RegisterSenderInput): SenderOutModel | Promise<SenderOutModel>;
    auth_login(input: LoginInput): UserOutModel | Promise<UserOutModel>;
    auth_resendConfirmationEmail(input: ResendConfirmationEmailInput): boolean | Promise<boolean>;
    auth_logout(): boolean | Promise<boolean>;
    auth_refreshToken(): boolean | Promise<boolean>;
}

export type GetMeResponse = SenderOutModel | UserOutModel;
type Nullable<T> = T | null;
