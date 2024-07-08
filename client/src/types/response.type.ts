import {PaginationInterface} from "@/types/pagination.type.ts";

export type ResponseType<T> = {
    message: string;
    code: number;
    status: string;
    data: {
        pagination?: PaginationInterface;
        data?: T;
    };
    errors: [
        {
            field: string;
            message: string;
        }
    ] | [];
}



