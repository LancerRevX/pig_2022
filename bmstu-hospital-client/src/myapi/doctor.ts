import {
  DoctorsApi,
  type Doctor as RawDoctor,
  type DoctorsListRequest,
  ResponseError,
WardsApi
} from "../api"

import {type Speciality, getSpeciality} from "./speciality"
import type {User} from './user'
import {requestInit, SERVER} from './types'
import {
  ForbiddenError, UnknownError, BadRequest, NotFoundError
} from './errors'
import { getCsrfToken } from "@/csrf"

export type Doctor = {
  id: number,
  name: string,
  firstName: string,
  lastName: string,
  patronymic: string,
  speciality: Speciality,
  photo: string,
  gender: number,
  work_record: number,
  cost: number
}

export type DoctorsFilter = {
  speciality?: Speciality,
  minCost?: number,
  maxCost?: number,
  userId?: number
}

let doctorsApi = new DoctorsApi()

export async function getDoctors(filter?: DoctorsFilter, specialityDoctorsList = false): Promise<Doctor[]> {
  // let doctorsApi = new DoctorsApi(new Configuration(getConfig()))
  try {
    let doctorsListRequest: DoctorsListRequest = {
      speciality: filter?.speciality?.id ? String(filter.speciality.id) : undefined,
      minCost: filter?.minCost,
      maxCost: filter?.maxCost,
      user: filter?.userId ? String(filter.userId) : undefined
    }
    let rawDoctors = await doctorsApi.doctorsList(doctorsListRequest, requestInit())
    let doctors: Doctor[] = []
    for (let rawDoctor of rawDoctors) {
      doctors.push(await doctorFromRaw(rawDoctor, specialityDoctorsList))
    }
    return doctors
  } catch (error) {
    if (error instanceof ResponseError && error.response.status == 403) {
      throw new ForbiddenError
    } else {
      throw error
    }
  }
}

export async function getDoctor(id: number, specialityDoctorsList: boolean): Promise<Doctor> {
  let rawDoctor = await doctorsApi.doctorsRead({id})
  return doctorFromRaw(rawDoctor, specialityDoctorsList)
}

export async function updateDoctor(doctor: Doctor) {
  let response = await fetch(`${SERVER}doctors/${doctor.id}/`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      first_name: doctor.firstName,
      last_name: doctor.lastName,
      patronymic: doctor.patronymic,
      gender: doctor.gender,
      speciality: doctor.speciality.id,
      cost: doctor.cost,
    })
  })
  switch (response.status) {
    case 200:
      return true
    case 403:
      throw new ForbiddenError
    default:
      throw new UnknownError
  }
}

export async function createDoctor(doctor: Doctor, user: User) {
  let response = await fetch(`${SERVER}doctors/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      first_name: doctor.firstName,
      last_name: doctor.lastName,
      patronymic: doctor.patronymic,
      gender: doctor.gender,
      speciality: doctor.speciality.id,
      cost: doctor.cost,
      user: user.id
    })
  })
  switch (response.status) {
    case 201:
    case 200:
      return true
    case 400:
      throw new BadRequest
    case 403:
      throw new ForbiddenError
    default:
      throw new UnknownError
  }
}

export async function deleteDoctor(doctor: Doctor) {
  let response = await fetch(`${SERVER}doctors/${doctor.id}/`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
      'Content-Type': 'application/json'
    }
  })
  switch (response.status) {
    case 204:
    case 200:
      return true
    case 404:
      throw new NotFoundError
    case 403:
      throw new ForbiddenError
    default:
      throw new UnknownError
  }
}

export async function doctorFromRaw(rawDoctor: RawDoctor, specialityDoctorsList: boolean): Promise<Doctor> {
  let speciality = await getSpeciality(rawDoctor.speciality, specialityDoctorsList)
  speciality.doctors = speciality.doctors.filter(doctor => doctor.id != rawDoctor.id)
  return {
    id: rawDoctor.id as number,
    name: rawDoctor.fullName as string,
    firstName: rawDoctor.firstName,
    lastName: rawDoctor.lastName,
    patronymic: rawDoctor.patronymic,
    speciality,
    photo: rawDoctor.photo as string,
    gender: rawDoctor.gender,
    work_record: rawDoctor.workRecord as number,
    cost: rawDoctor.cost
  }
}