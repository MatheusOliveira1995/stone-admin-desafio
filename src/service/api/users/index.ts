import http from "src/settings/http";
import { Users, User, Feature } from "src/app/definitions";

import { formatDate } from "src/util/date";

/**
 * @param data 
 * @return User
 */
function mapUser(data: Record<string, unknown>): User {
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
        birthDate: data.BirthDate ? formatDate({ dateValue: data.BirthDate as string, pattern: 'us' }) : '-',
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
}
/**
 * @return Promise<Users> 
 */
export async function getUsers(): Promise<Users> {
    let response
    try {
        response = await http.get('/users')
        const data = response.data
        const users = data.map((user: Record<string, unknown>): User => mapUser(user))
        return users
    } catch (error) {
        return { users: [] }
    }
}

/**
 * @param userId 
 * @return Promise<User|undefined>
 */
export async function getUserById(userId: number): Promise<User|undefined> {
    const url = `/users/${userId}`
    let response
    try {
        response = await http.get(url)
        const data = response.data
        if (!data) return;

        return mapUser(data)

    } catch (error) {
        return
    }
}

/**
 * @param document 
 * @return Promise<User | undefined> 
 */
export async function getUserByDocument(document: string): Promise<User | undefined> {
    const url = `/users?document=${document}`
    let response
    try {
        response = await http.get(url)
        const data = response.data.shift() as Record<string, unknown>
        if (!data) return;

        return mapUser(data)

    } catch (error) {
        return

    }
}