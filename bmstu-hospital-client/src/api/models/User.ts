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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface User
 */
export interface User {
    /**
     * 
     * @type {number}
     * @memberof User
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    readonly url?: string;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     * @type {string}
     * @memberof User
     */
    username: string;
    /**
     * 
     * @type {Set<string>}
     * @memberof User
     */
    readonly groups?: Set<string>;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    readonly patient?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    readonly doctor?: string;
}

/**
 * Check if a given object implements the User interface.
 */
export function instanceOfUser(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "username" in value;

    return isInstance;
}

export function UserFromJSON(json: any): User {
    return UserFromJSONTyped(json, false);
}

export function UserFromJSONTyped(json: any, ignoreDiscriminator: boolean): User {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'url': !exists(json, 'url') ? undefined : json['url'],
        'username': json['username'],
        'groups': !exists(json, 'groups') ? undefined : json['groups'],
        'patient': !exists(json, 'patient') ? undefined : json['patient'],
        'doctor': !exists(json, 'doctor') ? undefined : json['doctor'],
    };
}

export function UserToJSON(value?: User | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'username': value.username,
    };
}
