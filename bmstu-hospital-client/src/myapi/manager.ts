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
  ForbiddenError, UnknownError, BadRequest, NotFoundError
} from './errors'
import { getCsrfToken } from "@/csrf"

export type Manager = {
  id: number,
  name: string,
}

export async function getManager(id: number): Promise<Manager> {
  let response = await fetch(SERVER + 'managers/' + String(id) + '/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken() as string,
      // 'Content-Type': 'application/json'
    }
  })
  let json = await response.json()
  return await managerFromRaw(json)
}

export async function managerFromRaw(rawManager: any): Promise<Manager> {
  return {
    id: rawManager.id,
    name: rawManager.full_name
  }
}