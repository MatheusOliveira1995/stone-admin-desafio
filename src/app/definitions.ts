
export enum Status{
    REQUESTED ='requested',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export type Feature = {
    id: number | string,
    name?: string
}
export type Address = {
    streetNumber: number,
    city: string,
    state: string,
    neighborhood: string,
    postalCode: string
  }
export type User = {
    id: number,
    name: string,
    email?: string,
    birthDate?: Date | string,
    createdAt?: Date | string,
    updatedAt?: Date | string | undefined,
    enabledFeatures?: Feature[],
    document: string,
    metaDatas?: {
        validDocument: boolean,
        verified: boolean
    },
    address?: Address,
    salaryBase?: number
}

export interface Users {
    users: User[]
}
export type Card = {
    id: string | number,
    createdAt: Date | string,
    updatedAt?: Date | string,
    status: Status | undefined,
    userId: number,
    metaDatas:{
        name?:string,
        digits?: string,
        limit?: number
    }
}

export enum Role{
    N1= 'n1',
    N2= 'n2'
}

export type Analyst = {
    id: number|string,
    userId: number|string,
    email: string,
    password?: string,
    roles: Role[]
}

export type Audit = {
  id: string | number,
  createdAt: Date | string,
  type: string,
  before: Card,
  after: Card,
  requestedBy: number | string,
}

export interface Audits {
    audits: Audit[]
}
export interface Cards{
    cards: Card[]
}