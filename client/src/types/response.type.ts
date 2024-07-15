import {PaginationInterface} from "@/types/pagination.type.ts";

export type ResponseType<T> = {
    message: string;
    code: number;
    isSuccess: boolean;
    pagination?: PaginationInterface;
    data?: T;

    errors?: [
        {
            field?: string;
            message: string;
        }
    ] | [];
}



