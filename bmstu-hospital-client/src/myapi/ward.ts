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

import { type Patient, getPatient } from "./patient"

import {requestInit, SERVER} from './types'
import {
  ForbiddenError, UnknownError, BadRequest, NotFoundError
} from './errors'
import { getCsrfToken } from "@/csrf"

export type Ward = {
  number: number,
  capacity: number,
  patients: Patient[]
}

let wardsApi = new WardsApi()

export async function getWards(): Promise<Ward[]> {
  try {
    let rawWards = await wardsApi.wardsList(requestInit())
    let wards: Ward[] = []
    for (let rawWard of rawWards) {
      wards.push(await wardFromRaw(rawWard))
    }
    return wards
  } catch (error) {
    if (error instanceof ResponseError && error.response.status == 403) {
      throw new ForbiddenError
    } else {
      throw error
    }
  }
}

export async function getWard(id: number): Promise<Ward> {
  try {
    let rawWard = await wardsApi.wardsRead({id}, requestInit())
    return wardFromRaw(rawWard)
  } catch (error) {
    if (error instanceof ResponseError && error.response.status == 403) {
      throw new ForbiddenError
    } else {
      throw error
    }
  }
}

async function wardFromRaw(rawWard: any): Promise<Ward> {
  let ward: Ward = {
    number: rawWard.number,
    capacity: rawWard.capacity,
    patients: []
  }
  if (rawWard.patients) {
    for (let patientId of rawWard.patients) {
      ward.patients.push(await getPatient(Number(patientId)))
    }
  }
  return ward
}