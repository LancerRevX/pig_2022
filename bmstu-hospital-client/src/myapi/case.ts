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
import { type Doctor, getDoctor } from "./doctor"
import {type Ward, getWard} from './ward'

import {requestInit, SERVER} from './types'
import {
  ForbiddenError, UnknownError, BadRequest, NotFoundError
} from './errors'
import { getCsrfToken } from "@/csrf"

export type Case = {
  id: number,
  patient: Patient,
  doctor: Doctor,
  wardNumber: number,
  description: string,
  startDate: Date,
  endDate: Date | null,
  active: boolean
}

let casesApi = new CasesApi()

export async function getCases(): Promise<Case[]> {
  try {
    let rawCases = await casesApi.casesList(requestInit())
    let cases: Case[] = []
    for (let rawCase of rawCases) {
      cases.push(await caseFromRaw(rawCase))
    }
    return cases
  } catch (error) {
    if (error instanceof ResponseError && error.response.status == 403) {
      throw new ForbiddenError
    } else {
      throw error
    }
  }
}

async function caseFromRaw(rawCase: RawCase): Promise<Case> {
  let case_: Case = {
    id: rawCase.id as number,
    patient: await getPatient(rawCase.patient),
    doctor: await getDoctor(rawCase.doctor, false),
    startDate: rawCase.startDate,
    endDate: rawCase.endDate as Date | null,
    wardNumber: (await getWard(rawCase.ward as number)).number,
    description: rawCase.description,
    active: rawCase.active as boolean
  }
  return case_
}