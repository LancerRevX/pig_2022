import { type Patient, getPatient } from "./patient"
import { type Doctor, getDoctor } from "./doctor"
import {type Ward, getWard} from './ward'

import {requestInit, SERVER} from './types'
import {
  ForbiddenError, UnknownError, BadRequest, NotFoundError, ServerError
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

export async function getCases(): Promise<Case[]> {
  let url = new URL(SERVER + 'cases/')
  let response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken() as string,
    }
  })
  if (response.status == 200) {
    let json = await response.json()
    let cases: Case[] = []
    for (let rawCase of json) {
      cases.push(await caseFromRaw(rawCase))
    }
    return cases
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

async function caseFromRaw(rawCase: any): Promise<Case> {
  let case_: Case = {
    id: rawCase.id as number,
    patient: await getPatient(rawCase.patient),
    doctor: await getDoctor(rawCase.doctor, false),
    startDate: rawCase.start_date,
    endDate: rawCase.end_date as Date | null,
    wardNumber: (await getWard(rawCase.ward as number)).number,
    description: rawCase.description,
    active: rawCase.active as boolean
  }
  return case_
}