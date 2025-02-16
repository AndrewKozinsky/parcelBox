
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface AddBookInput {
    title: string;
    price: number;
}

export interface RegisterAdminInput {
    name: string;
    email: string;
    password: string;
}

export interface Book {
    id: string;
    title: string;
    price?: Nullable<number>;
}

export interface IQuery {
    books(): Book[] | Promise<Book[]>;
    book(id: string): Book | Promise<Book>;
}

export interface IMutation {
    addBook(input: AddBookInput): Book | Promise<Book>;
    registerAdmin(input: RegisterAdminInput): RegisterAdminResponse | Promise<RegisterAdminResponse>;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface AdminError {
    isError: boolean;
    errorMessage: string;
}

export type RegisterAdminResponse = Admin | AdminError;
type Nullable<T> = T | null;
