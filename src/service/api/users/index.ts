import http from "src/settings/http";
import { Users, User } from "src/app/definitions";

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

export async function getUserByDocument(document: string): Promise<User[]> {
    const url = `/users?document=${document}`
    let response
    try {
        response = await http.get(url)
    } catch (error) {
        return[
            {
                id: 0,
                name: '',
                document: ''
            }
        ]
    }

    return response.data
}