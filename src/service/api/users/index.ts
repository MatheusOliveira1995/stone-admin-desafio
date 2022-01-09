import http from "src/settings/http";
import { Users, User } from "src/app/definitions";

export async function getUsers(): Promise<Users> {
    let response
    try {
        response = await http.get('/users')
    } catch (error) {
        return {users: []}
    }

    const data = response.data as Users
    return data
}

export async function getUser(userId: number): Promise<User> {
    let response
    try {
        response = await http.get(`/users/${userId}`)
    } catch (error) {
        return {
            id: 0,
            name: '',
            email: '',
            document: '',
            address: {
                city: '',
                neighborhood: '',
                postalCode: '',
                state: '',
                streetNumber: 0
            },
            salaryBase: 0
            
        }
    }
    const data = response.data
    return {
        id: data.id,
        name: data.name,
        document: data.document,
        email: data.email,
        address: data.address,
        salaryBase: data.salaryBase
    }
}