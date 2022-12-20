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

import { type Doctor, getDoctors } from "./doctor"

let specialitiesApi = new SpecialitiesApi()

export type Speciality = {
  id: number,
  name: string,
  description: string,
  doctors: Doctor[]
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
    speciality.doctors = await getDoctors({speciality}, false)
  }
  return speciality
}