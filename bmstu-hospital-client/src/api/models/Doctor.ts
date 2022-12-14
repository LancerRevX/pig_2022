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
 * @interface Doctor
 */
export interface Doctor {
    /**
     * 
     * @type {number}
     * @memberof Doctor
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof Doctor
     */
    readonly url?: string;
    /**
     * 
     * @type {number}
     * @memberof Doctor
     */
    user: number;
    /**
     * 
     * @type {number}
     * @memberof Doctor
     */
    speciality: number;
    /**
     * 
     * @type {string}
     * @memberof Doctor
     */
    lastName: string;
    /**
     * 
     * @type {string}
     * @memberof Doctor
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof Doctor
     */
    patronymic: string;
    /**
     * 
     * @type {string}
     * @memberof Doctor
     */
    readonly fullName?: string;
    /**
     * 
     * @type {string}
     * @memberof Doctor
     */
    readonly photo?: string | null;
    /**
     * 
     * @type {number}
     * @memberof Doctor
     */
    readonly workRecord?: number;
    /**
     * 
     * @type {number}
     * @memberof Doctor
     */
    gender: number;
    /**
     * 
     * @type {number}
     * @memberof Doctor
     */
    cost: number;
}

/**
 * Check if a given object implements the Doctor interface.
 */
export function instanceOfDoctor(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "speciality" in value;
    isInstance = isInstance && "lastName" in value;
    isInstance = isInstance && "firstName" in value;
    isInstance = isInstance && "patronymic" in value;
    isInstance = isInstance && "gender" in value;
    isInstance = isInstance && "cost" in value;

    return isInstance;
}

export function DoctorFromJSON(json: any): Doctor {
    return DoctorFromJSONTyped(json, false);
}

export function DoctorFromJSONTyped(json: any, ignoreDiscriminator: boolean): Doctor {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'url': !exists(json, 'url') ? undefined : json['url'],
        'user': json['user'],
        'speciality': json['speciality'],
        'lastName': json['last_name'],
        'firstName': json['first_name'],
        'patronymic': json['patronymic'],
        'fullName': !exists(json, 'full_name') ? undefined : json['full_name'],
        'photo': !exists(json, 'photo') ? undefined : json['photo'],
        'workRecord': !exists(json, 'work_record') ? undefined : json['work_record'],
        'gender': json['gender'],
        'cost': json['cost'],
    };
}

export function DoctorToJSON(value?: Doctor | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'user': value.user,
        'speciality': value.speciality,
        'last_name': value.lastName,
        'first_name': value.firstName,
        'patronymic': value.patronymic,
        'gender': value.gender,
        'cost': value.cost,
    };
}

