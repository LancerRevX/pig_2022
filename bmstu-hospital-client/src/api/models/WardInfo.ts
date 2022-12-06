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
 * @interface WardInfo
 */
export interface WardInfo {
    /**
     * 
     * @type {number}
     * @memberof WardInfo
     */
    readonly id?: number;
    /**
     * 
     * @type {number}
     * @memberof WardInfo
     */
    number: number;
    /**
     * 
     * @type {number}
     * @memberof WardInfo
     */
    capacity: number;
}

/**
 * Check if a given object implements the WardInfo interface.
 */
export function instanceOfWardInfo(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "number" in value;
    isInstance = isInstance && "capacity" in value;

    return isInstance;
}

export function WardInfoFromJSON(json: any): WardInfo {
    return WardInfoFromJSONTyped(json, false);
}

export function WardInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): WardInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'number': json['number'],
        'capacity': json['capacity'],
    };
}

export function WardInfoToJSON(value?: WardInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'number': value.number,
        'capacity': value.capacity,
    };
}

