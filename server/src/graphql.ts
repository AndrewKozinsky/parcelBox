
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

export interface CreateParcelBoxTypeInput {
    name: string;
}

export interface CreateCellTypeInput {
    name: string;
    width: number;
    height: number;
    depth: number;
    parcelBoxTypeId: number;
}

export interface CreateParcelBoxInput {
    parcelBoxTypeId: number;
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

export interface CellTypeOutModel {
    id: number;
    name: string;
    width: number;
    height: number;
    depth: number;
    parcelBoxTypeId: number;
}

export interface ParcelBoxOutModel {
    id: number;
    parcelBoxTypeId: number;
    createdAt: DateTime;
    cells: ParcelBoxCellOutModel[];
}

export interface ParcelBoxCellOutModel {
    id: number;
    name: string;
    cellTypeId: number;
    parcelBoxId: number;
}

export interface ParcelBoxTypeOutModel {
    id: number;
    name: string;
}

export interface IQuery {
    auth_confirmEmail(input: ConfirmEmailInput): boolean | Promise<boolean>;
    auth_getMe(): AdminOrSender | Promise<AdminOrSender>;
}

export interface IMutation {
    auth_registerAdmin(input: RegisterAdminInput): AdminOutModel | Promise<AdminOutModel>;
    auth_registerSender(input: RegisterSenderInput): SenderOutModel | Promise<SenderOutModel>;
    auth_login(input: LoginInput): AdminOrSender | Promise<AdminOrSender>;
    auth_resendConfirmationEmail(input: ResendConfirmationEmailInput): boolean | Promise<boolean>;
    auth_refreshToken(): boolean | Promise<boolean>;
    auth_logout(): boolean | Promise<boolean>;
    parcelBoxType_create(input: CreateParcelBoxTypeInput): ParcelBoxTypeOutModel | Promise<ParcelBoxTypeOutModel>;
    cellType_create(input: CreateCellTypeInput): CellTypeOutModel | Promise<CellTypeOutModel>;
    parcelBox_create(input: CreateParcelBoxInput): ParcelBoxOutModel | Promise<ParcelBoxOutModel>;
}

export type DateTime = any;
export type AdminOrSender = SenderOutModel | AdminOutModel;
type Nullable<T> = T | null;
