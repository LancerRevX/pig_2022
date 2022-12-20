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

let patientsApi = new PatientsApi()

export type Patient = {
  id: number,
  name: string,
  gender: number,
  birthDate: Date,
  age: number
}

export type PatientsFilter = {
  userId?: number
}

export async function getPatients(filter?: PatientsFilter): Promise<Patient[]> {
  let patientsListRequest: PatientsListRequest = {
    user: filter?.userId ? String(filter.userId) : undefined
  }
  try {
    let rawPatients = await patientsApi.patientsList(patientsListRequest, requestInit())
    let patients: Patient[] = []
    for (let rawPatient of rawPatients) {
      patients.push(await patientFromRaw(rawPatient))
    }
    return patients
  } catch (error) {
    if (error instanceof ResponseError && error.response.status == 403) {
      throw new ForbiddenError
    } else {
      throw error
    }
  }
}

export async function getPatient(id: number): Promise<Patient> {
  let rawPatient = await patientsApi.patientsRead({id}, requestInit())
  return patientFromRaw(rawPatient)
}

export async function patientFromRaw(rawPatient: RawPatient): Promise<Patient> {
  return {
    id: rawPatient.id as number,
    name: rawPatient.fullName as string,
    age: rawPatient.age as number,
    birthDate: rawPatient.birthDate,
    gender: rawPatient.gender
  }
}