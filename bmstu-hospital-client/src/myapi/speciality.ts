import {
  SpecialitiesApi, DoctorsApi, AppointmentsApi, PatientsApi, CasesApi,
  type Doctor as RawDoctor,
  type DoctorsListRequest,
  type Speciality as RawSpeciality,
  type Patient as RawPatient,
  type PatientsListRequest,
  type Appointment as RawAppointment,
  type Case as RawCase,
  Configuration, type ConfigurationParameters,
  ResponseError,
WardsApi
} from "../api"

import {requestInit, SERVER} from './types'
import {
  ForbiddenError, UnknownError, BadRequest, NotFoundError, ServerError
} from './errors'
import { getCsrfToken } from "@/csrf"

import { type Doctor, getDoctors } from "./doctor"

let specialitiesApi = new SpecialitiesApi()

export type Speciality = {
  id: number,
  name: string,
  description: string,
  doctors: Doctor[]
}

export async function getSpecialities(doctorsList: boolean): Promise<Speciality[]> {
  let response = await fetch(SERVER + 'specialities/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken() as string,
    }
  })
  if (response.status == 200) {
    let json = await response.json()
    let specialities: Speciality[] = []
    for (let rawSpeciality of json) {
      specialities.push(await specialityFromRaw(rawSpeciality, doctorsList))
    }
    return specialities
  }
  switch (response.status) {
    case 403:
      throw new ForbiddenError
    case 500:
      throw new ServerError
    default:
      throw new UnknownError
  }
}

export async function getSpeciality(id: number, doctorsList: boolean): Promise<Speciality> {
  let response = await fetch(SERVER + 'specialities/' + String(id) + '/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken() as string,
    }
  })
  if (response.status == 200) {
    let json = await response.json()
    return await specialityFromRaw(json, doctorsList)
  }
  switch (response.status) {
    case 403:
      throw new ForbiddenError
    case 500:
      throw new ServerError
    default:
      throw new UnknownError
  }
}

export async function specialityFromRaw(rawSpeciality: any, doctorsList: boolean): Promise<Speciality> {
  let speciality: Speciality = {
    id: rawSpeciality.id as number,
    name: rawSpeciality.name,
    description: rawSpeciality.description,
    doctors: []
  }
  if (doctorsList) {
    speciality.doctors = await getDoctors({speciality}, false)
  }
  return speciality
}