
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateAdminInput {
    email: string;
    password: string;
}

export interface CreateSenderInput {
    email: string;
    password: string;
}

export interface Admin {
    id: number;
    email: string;
}

export interface IQuery {
    hello(): string | Promise<string>;
}

export interface IMutation {
    auth_RegisterAdmin(input: CreateAdminInput): Admin | Promise<Admin>;
    auth_RegisterSender(input: CreateSenderInput): Admin | Promise<Admin>;
}

type Nullable<T> = T | null;
