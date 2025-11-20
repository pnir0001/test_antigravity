/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMemoRequest } from '../models/CreateMemoRequest';
import type { Memo } from '../models/Memo';
import type { UpdateMemoRequest } from '../models/UpdateMemoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * List memos
     * @returns Memo Successful response
     * @throws ApiError
     */
    public static listMemos(): CancelablePromise<Array<Memo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/memos',
        });
    }
    /**
     * Create a new memo
     * @param requestBody
     * @returns Memo Memo created
     * @throws ApiError
     */
    public static createMemo(
        requestBody: CreateMemoRequest,
    ): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/memos',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get a memo by ID
     * @param id
     * @returns Memo Successful response
     * @throws ApiError
     */
    public static getMemo(
        id: string,
    ): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/memos/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Memo not found`,
            },
        });
    }
    /**
     * Update a memo
     * @param id
     * @param requestBody
     * @returns Memo Memo updated
     * @throws ApiError
     */
    public static updateMemo(
        id: string,
        requestBody: UpdateMemoRequest,
    ): CancelablePromise<Memo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/memos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Memo not found`,
            },
        });
    }
    /**
     * Delete a memo
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteMemo(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/memos/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Memo not found`,
            },
        });
    }
}
