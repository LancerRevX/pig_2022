import {requestInit, SERVER} from './types'
import {
  ForbiddenError, UnknownError, BadRequest, NotFoundError, ServerError
} from './errors'
import { getCsrfToken } from "@/csrf"

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
  let url = new URL(SERVER + 'patients/')
  let response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken() as string,
    }
  })
  if (response.status == 200) {
    let json = await response.json()
    let patients: Patient[] = []
    for (let rawPatient of json) {
      patients.push(await patientFromRaw(rawPatient))
    }
    return patients
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

export async function getPatient(id: number): Promise<Patient> {
  // let rawPatient = await patientsApi.patientsRead({id}, {credentials: 'include',
  // headers: {
  //   'X-CSRFToken': getCsrfToken() as string,
  //   // 'Content-Type': 'application/json'
  // }})
  let response = await fetch(SERVER + 'patients/' + String(id) + '/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken() as string,
      // 'Content-Type': 'application/json'
    }
  })
  let json = await response.json()
  return patientFromRaw(json)
}

export async function patientFromRaw(rawPatient: any): Promise<Patient> {
  return {
    id: rawPatient.id as number,
    name: rawPatient.full_name as string,
    age: rawPatient.age as number,
    birthDate: rawPatient.birth_date,
    gender: rawPatient.gender
  }
}