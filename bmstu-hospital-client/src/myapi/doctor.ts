import {type Speciality, getSpeciality} from "./speciality"
import type {User} from './user'
import {requestInit, SERVER} from './types'
import {
  ForbiddenError, UnknownError, BadRequest, NotFoundError, ServerError
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

export async function getDoctors(filter?: DoctorsFilter, specialityDoctorsList = false): Promise<Doctor[]> {
  let url = new URL(SERVER + 'doctors/')
  filter?.speciality && url.searchParams.append('speciality', String(filter.speciality.id))
  filter?.userId && url.searchParams.append('user', String(filter.userId))
  filter?.minCost && url.searchParams.append('min_cost', String(filter.minCost))
  filter?.maxCost && url.searchParams.append('max_cost', String(filter.maxCost))
  let response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken() as string,
    }
  })
  if (response.status == 200) {
    let json = await response.json()
    let doctors: Doctor[] = []
    for (let rawDoctor of json) {
      doctors.push(await doctorFromRaw(rawDoctor, specialityDoctorsList))
    }
    return doctors
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

export async function getDoctor(id: number, specialityDoctorsList: boolean): Promise<Doctor> {
  let response = await fetch(SERVER + 'doctors/' + String(id) + '/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken() as string,
    }
  })
  if (response.status == 200) {
    let json = await response.json()
    return await doctorFromRaw(json, specialityDoctorsList)
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

export async function doctorFromRaw(rawDoctor: any, specialityDoctorsList: boolean): Promise<Doctor> {
  let speciality = await getSpeciality(rawDoctor.speciality, specialityDoctorsList)
  speciality.doctors = speciality.doctors.filter(doctor => doctor.id != rawDoctor.id)
  return {
    id: rawDoctor.id as number,
    name: rawDoctor.full_name as string,
    firstName: rawDoctor.first_name,
    lastName: rawDoctor.last_name,
    patronymic: rawDoctor.patronymic,
    speciality,
    photo: rawDoctor.photo as string,
    gender: rawDoctor.gender,
    work_record: rawDoctor.work_record as number,
    cost: rawDoctor.cost
  }
}