import http from "src/settings/http";
import { Users } from "src/app/definitions";

export async function getUsers(): Promise<Users> {
    const response = await http.get('/users')
    const data = response.data
    return data
}