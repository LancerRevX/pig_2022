export type Doctor = {
  id: number,
  name: string,
  speciality: Speciality,
  photo: string,
  gender: number,
  work_record: number,
  cost: number
}

export type Appointment = {
  id: number,
  patient: Patient,
  doctor: Doctor,
  datetime: Date
}

export type Speciality = {
  id: number,
  name: string,
  description: string,
  doctors: Doctor[]
}

export type Patient = {
  id: number,
  name: string,
  gender: number,
  birthDate: Date,
  age: number
}
  
export type Ward = {
  number: number,
  capacity: number,
  patients: Patient[]
}

export type User = {
  id: number,
  username: string,
  doctor?: Doctor,
  patient?: Patient,
}

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

import {getCsrfToken} from '@/csrf'
import { ForbiddenError } from "./errors"

const SERVER = 'http://127.0.0.1:8000/api/'

let getConfig: () => ConfigurationParameters = () => ({
  credentials: 'include',
  headers: {
    'X-CSRFToken': getCsrfToken() as string
  }
})
let requestInit: () => RequestInit = () => ({
  credentials: 'include',
  headers: {
    'X-CSRFToken': getCsrfToken() as string,
    // 'Content-Type': 'application/json'
  }
})
let specialitiesApi = new SpecialitiesApi()
let doctorsApi = new DoctorsApi()
let patientsApi = new PatientsApi()
let appointmentsApi = new AppointmentsApi()
let wardsApi = new WardsApi()
let casesApi = new CasesApi()

export async function login(username?: string, password?: string): Promise<User | null> {
  let response: Response
  if (username !== undefined && password !== undefined) {
    response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfToken() as string,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
  } else {
    response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'GET',
      ...requestInit()
    })
  }
  if (response.status == 200) {
    let json = await response.json()
    return userFromRaw(json)
  } else {
    return null
  }
}

export async function logout() {
  await fetch('http://127.0.0.1:8000/api/logout/', {
    method: 'DELETE',
    ...requestInit()
  })
}

export async function userFromRaw(rawUser: any): Promise<User> {
  let user: User = {
    id: rawUser.id,
    username: rawUser.username
  }
  if (rawUser.doctor) {
    user.doctor = await getDoctor(rawUser.doctor, false)
  }
  if (rawUser.patient) {
    user.patient = await getPatient(rawUser.patient)
  }
  return user
}

export async function getSpecialities(doctorsList: boolean): Promise<Speciality[]> {
  let rawSpecialitiesList = await specialitiesApi.specialitiesList()
  let specialities: Speciality[] = []
  for (let rawSpeciality of rawSpecialitiesList) {
    specialities.push(await specialityFromRaw(rawSpeciality, doctorsList))
  }
  return specialities
}

export async function getSpeciality(id: number, doctorsList: boolean): Promise<Speciality> {
  let rawSpeciality = await specialitiesApi.specialitiesRead({id})
  return specialityFromRaw(rawSpeciality, doctorsList)
}

export async function specialityFromRaw(rawSpeciality: RawSpeciality, doctorsList: boolean): Promise<Speciality> {
  let speciality: Speciality = {
    id: rawSpeciality.id as number,
    name: rawSpeciality.name,
    description: rawSpeciality.description,
    doctors: []
  }
  if (doctorsList) {
    let rawDoctors = await doctorsApi.doctorsList({speciality: String(speciality.id)})
    for (let rawDoctor of rawDoctors) {
      speciality.doctors.push(await doctorFromRaw(rawDoctor, false))
    }
  }
  return speciality
}

export type DoctorsFilter = {
  speciality?: Speciality,
  minCost?: number,
  maxCost?: number,
  userId?: number
}

export async function getDoctors(filter: DoctorsFilter, specialityDoctorsList: boolean): Promise<Doctor[]> {
  // let doctorsApi = new DoctorsApi(new Configuration(getConfig()))
  let doctorsListRequest: DoctorsListRequest = {
    speciality: filter.speciality?.id ? String(filter.speciality.id) : undefined,
    minCost: filter?.minCost,
    maxCost: filter?.maxCost,
    user: filter.userId ? String(filter.userId) : undefined
  }
  console.log(requestInit())
  let rawDoctors = await doctorsApi.doctorsList(doctorsListRequest, requestInit())
  let doctors: Doctor[] = []
  for (let rawDoctor of rawDoctors) {
    doctors.push(await doctorFromRaw(rawDoctor, specialityDoctorsList))
  }
  return doctors
}

export async function getDoctor(id: number, specialityDoctorsList: boolean): Promise<Doctor> {
  let rawDoctor = await doctorsApi.doctorsRead({id})
  return doctorFromRaw(rawDoctor, specialityDoctorsList)
}

export async function doctorFromRaw(rawDoctor: RawDoctor, specialityDoctorsList: boolean): Promise<Doctor> {
  return {
    id: rawDoctor.id as number,
    name: rawDoctor.fullName as string,
    speciality: await getSpeciality(rawDoctor.speciality, specialityDoctorsList),
    photo: rawDoctor.photo as string,
    gender: rawDoctor.gender,
    work_record: rawDoctor.workRecord as number,
    cost: rawDoctor.cost
  }
}

export type PatientsFilter = {
  userId?: number
}

export async function getPatients(filter: PatientsFilter): Promise<Patient[]> {
  let patientsListRequest: PatientsListRequest = {
    user: filter.userId ? String(filter.userId) : undefined
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

export async function getAppointments(): Promise<Appointment[]> {
  try {
    let rawAppointments = await appointmentsApi.appointmentsList(requestInit())
    let appointments: Appointment[] = []
    for (let rawAppointment of rawAppointments) {
      appointments.push(await appointmentFromRaw(rawAppointment))
    }
    return appointments
  } catch (error) {
    if (error instanceof ResponseError && error.response.status == 403) {
      throw new ForbiddenError
    } else {
      throw error
    }
  }
}

export async function appointmentFromRaw(rawAppointment: RawAppointment): Promise<Appointment> {
  return {
    id: rawAppointment.id as number,
    patient: await getPatient(rawAppointment.patient as number),
    doctor: await getDoctor(rawAppointment.doctor, false),
    datetime: rawAppointment.datetime
  }
}

export async function createAppointment(doctor: Doctor, datetime: Date): Promise<boolean> {
  let response = await fetch(SERVER + 'appointments/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
    body: JSON.stringify({
      doctor: doctor.id,
      datetime
    })
  })
  return response.status == 200
}

export async function deleteAppointment(appointment: Appointment): Promise<boolean> {
  try {
    await appointmentsApi.appointmentsDelete({id: appointment.id})
    return true
  } catch(responseError) {
    console.log(responseError)
    return false
  }
}

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