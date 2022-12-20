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
  ForbiddenError, UnknownError, BadRequest, NotFoundError, ServerError
} from './errors'
import { getCsrfToken } from "@/csrf"

import { type Patient, getPatient } from "./patient"
import { type Doctor, getDoctor } from "./doctor"
import type { App } from "vue"

let appointmentsApi = new AppointmentsApi()

export type Appointment = {
  id: number,
  patient: Patient,
  doctor: Doctor,
  datetime: Date,
  status: AppointmentStatus
}

export type AppointmentStatus = {
  name: string,
  value: number
}

export type AppointmentFilter = {
  datetimeAfter?: Date,
  datetimeBefore?: Date,
  patient?: Patient,
  doctor?: Doctor,
  status?: AppointmentStatus
}

export async function getAppointments(filter?: AppointmentFilter): Promise<Appointment[]> {
  try {
    let rawAppointments = await appointmentsApi.appointmentsList(
      {
        doctor: filter?.doctor ? String(filter.doctor.id) : undefined,
        patient: filter?.patient ? String(filter.patient.id) : undefined,
        status: filter?.status ? String(filter.status.value) : undefined,
        datetimeAfter: filter?.datetimeAfter ? filter.datetimeAfter.toISOString() : undefined,
        datetimeBefore: filter?.datetimeBefore ? filter.datetimeBefore.toISOString() : undefined,
      },
      requestInit())
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
  let statuses = await getAppointmentStatuses()
  return {
    id: rawAppointment.id as number,
    patient: await getPatient(rawAppointment.patient as number),
    doctor: await getDoctor(rawAppointment.doctor, false),
    datetime: rawAppointment.datetime,
    status: statuses.find(status => status.value == rawAppointment.status) as AppointmentStatus
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

export async function updateAppointment(appointment: Appointment) {
  let response = await fetch(`${SERVER}appointments/${appointment.id}/`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: appointment.status.value,
      datetime: appointment.datetime,
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

export async function deleteAppointment(appointment: Appointment): Promise<boolean> {
  let response = await fetch(`${SERVER}appointments/${appointment.id}/`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    }
  })
  switch (response.status) {
    case 200:
      return true
    case 403:
      throw new ForbiddenError
    case 500:
      throw new ServerError
    default:
      throw new UnknownError
  }
}

export async function getAppointmentStatuses(): Promise<AppointmentStatus[]> {
  let statuses: AppointmentStatus[] = []
  let response = await fetch(SERVER + 'appointment-statuses/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
  })
  let json = await response.json()
  for (let rawStatusInfo of json) {
    statuses.push({
      name: rawStatusInfo[1],
      value: rawStatusInfo[0]
    })
  }
  return statuses
}

