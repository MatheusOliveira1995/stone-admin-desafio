
export enum Status{
    REQUESTED ='requested',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export type Feature = {
    id: number | string,
    name: string
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
    BirthDate?: Date,
    createdAt?: Date,
    updatedAt?: Date,
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