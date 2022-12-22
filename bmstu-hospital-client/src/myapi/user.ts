import {type Doctor, getDoctor} from "./doctor"
import {type Patient, getPatient} from './patient'
import { type Manager, getManager } from "./manager"

import {requestInit, SERVER} from './types'
import {
  ForbiddenError, UnknownError, BadRequest, ServerError, UsernameTaken
} from './errors'
import { getCsrfToken } from "@/csrf"

export type User = {
  id: number,
  username: string,
  groups: string[],
  doctor?: Doctor,
  patient?: Patient,
  manager?: Manager,
}

export async function login(username?: string, password?: string): Promise<User | null> {
  let response: Response
  if (username !== undefined && password !== undefined) {
    response = await fetch(SERVER + 'login/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfToken() as string,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
  } else {
    response = await fetch(SERVER + 'login/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfToken() as string,
        'Content-Type': 'application/json'
      },
    })
  }
  if (response.status == 200) {
    let json = await response.json()
    return userFromRaw(json)
  } else {
    return null
  }
}

export interface SignupParams {
  username: string,
  password: string,
  password_repeat: string,
  first_name: string,
  last_name: string,
  patronymic: string,
  birth_date: Date,
  gender: number
}

export async function signup(params: SignupParams) {
  let response = await fetch(SERVER + 'signup/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  switch (response.status) {
    case 200:
      return true
    case 400:
      throw new BadRequest
    case 403:
      throw new UsernameTaken
    case 500:
      throw new ServerError
    default:
      throw new UnknownError
  }
}

export async function logout() {
  await fetch('http://127.0.0.1:8000/api/logout/', {
    method: 'DELETE',
    ...requestInit()
  })
}

export async function getUsers(): Promise<User[]> {
  let response = await fetch(SERVER + 'users/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
    }
  })
  if (response.status == 200) {
    let rawUsers = await response.json()
    let users: User[] = []
    for (let rawUser of rawUsers) {
      users.push(await userFromRaw(rawUser))
    }
    return users
  } else {
    switch (response.status) {
      case 403:
        throw new ForbiddenError
      case 500:
        throw new ServerError
      default:
        throw new UnknownError
    }
  }
}

export async function createUser(username: string, password: string): Promise<User> {
  let response = await fetch(SERVER + 'users/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username, password
    })
  })
  switch (response.status) {
    case 201:
    case 200:
      return await userFromRaw(await response.json())
    case 400:
      throw new BadRequest
    case 403:
      throw new UsernameTaken
    case 500:
      throw new ServerError
    default:
      throw new UnknownError
  }
}

export async function userFromRaw(rawUser: any): Promise<User> {
  let user: User = {
    id: rawUser.id,
    username: rawUser.username,
    groups: rawUser.groups
  }
  if (rawUser.doctor) {
    user.doctor = await getDoctor(rawUser.doctor, false)
  }
  if (rawUser.patient) {
    user.patient = await getPatient(rawUser.patient)
  }
  if (rawUser.manager) {
    user.manager = await getManager(rawUser.manager)
  }
  return user
}