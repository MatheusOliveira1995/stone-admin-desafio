
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
    id: number | string,
    name: string,
    email: string,
    birthDate?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    enabledFeatures?: Feature[],
    document: string,
    metaDatas?: {
        validDocument: boolean,
        verified: boolean
    },
    address: Address,
    salaryBase: number
}

export interface Users {
    users: User[]
}