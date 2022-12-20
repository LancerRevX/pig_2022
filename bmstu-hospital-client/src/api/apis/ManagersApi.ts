/* tslint:disable */
/* eslint-disable */
/**
 * Snippets API
 * Test description
 *
 * The version of the OpenAPI document: v1
 * Contact: contact@snippets.local
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  Manager,
} from '../models';
import {
    ManagerFromJSON,
    ManagerToJSON,
} from '../models';

export interface ManagersCreateRequest {
    data: Manager;
}

export interface ManagersDeleteRequest {
    id: number;
}

export interface ManagersPartialUpdateRequest {
    id: number;
    data: Manager;
}

export interface ManagersReadRequest {
    id: number;
}

export interface ManagersUpdateRequest {
    id: number;
    data: Manager;
}

/**
 * 
 */
export class ManagersApi extends runtime.BaseAPI {

    /**
     */
    async managersCreateRaw(requestParameters: ManagersCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Manager>> {
        if (requestParameters.data === null || requestParameters.data === undefined) {
            throw new runtime.RequiredError('data','Required parameter requestParameters.data was null or undefined when calling managersCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/managers/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ManagerToJSON(requestParameters.data),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ManagerFromJSON(jsonValue));
    }

    /**
     */
    async managersCreate(requestParameters: ManagersCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Manager> {
        const response = await this.managersCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async managersDeleteRaw(requestParameters: ManagersDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling managersDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/managers/{id}/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async managersDelete(requestParameters: ManagersDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.managersDeleteRaw(requestParameters, initOverrides);
    }

    /**
     */
    async managersListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Manager>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/managers/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ManagerFromJSON));
    }

    /**
     */
    async managersList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Manager>> {
        const response = await this.managersListRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async managersPartialUpdateRaw(requestParameters: ManagersPartialUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Manager>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling managersPartialUpdate.');
        }

        if (requestParameters.data === null || requestParameters.data === undefined) {
            throw new runtime.RequiredError('data','Required parameter requestParameters.data was null or undefined when calling managersPartialUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/managers/{id}/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ManagerToJSON(requestParameters.data),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ManagerFromJSON(jsonValue));
    }

    /**
     */
    async managersPartialUpdate(requestParameters: ManagersPartialUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Manager> {
        const response = await this.managersPartialUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async managersReadRaw(requestParameters: ManagersReadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Manager>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling managersRead.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/managers/{id}/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ManagerFromJSON(jsonValue));
    }

    /**
     */
    async managersRead(requestParameters: ManagersReadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Manager> {
        const response = await this.managersReadRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async managersUpdateRaw(requestParameters: ManagersUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Manager>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling managersUpdate.');
        }

        if (requestParameters.data === null || requestParameters.data === undefined) {
            throw new runtime.RequiredError('data','Required parameter requestParameters.data was null or undefined when calling managersUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/managers/{id}/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ManagerToJSON(requestParameters.data),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ManagerFromJSON(jsonValue));
    }

    /**
     */
    async managersUpdate(requestParameters: ManagersUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Manager> {
        const response = await this.managersUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
