import http from "src/settings/http";
import { Users, User, Feature } from "src/app/definitions";

import { formatDate } from "src/util/date";

export async function getUsers(): Promise<Users> {
    let response
    try {
        response = await http.get('/users')
    } catch (error) {
        return { users: [] }
    }

    const data = response.data as Users
    return data
}

export async function getUserById(userId: number): Promise<User> {
    const url = `/users/${userId}`
    let response
    try {
        response = await http.get(url)
    } catch (error) {
        return {
            id: 0,
            name: '',
            document: ''
        }
    }

    return response.data
}

export async function getUserByDocument(document: string): Promise<User|undefined> {
    const url = `/users?document=${document}`
    let response
    try {
        response = await http.get(url)
        const data = response.data.shift() as Record<string, unknown>
        if(!data) return
        
        const address = data.address as Record<string, unknown>
        const metaDatas = data.metadatas as Record<string, unknown>
        const enabledFeatures = data.enabledFeatures as []

        const features = enabledFeatures.map((feature: number): Feature => {
            return {
                id: feature as number,
                name: undefined
            }
        })


        const user: User = {
            id: data.id as number,
            document: data.document as string,
            name: data.name as string,
            email: data.email as string ?? '',
            birthDate: data.BirthDate ? formatDate({dateValue: data.BirthDate as string, pattern:'us'}) : '-',
            createdAt: formatDate({ dateValue: data.createdAt as string, pattern: 'us' }) ?? '-',
            updatedAt: data.updatedAt ? formatDate({ dateValue: data.updatedAt as string, pattern: 'us' }) : undefined,
            salaryBase: data.salaryBase as number,
            address: {
                streetNumber: address.streetNumber as number,
                city: address.city as string,
                neighborhood: address.neighborhood as string,
                state: address.state as string,
                postalCode: address.postalCode as string
            },
            metaDatas: {
                validDocument: metaDatas?.validDocument as boolean ?? false,
                verified: metaDatas?.verified as boolean ?? false
            },
            enabledFeatures: features

        }

        return user
        
    } catch (error) {
        return
        
    }
}