import http from "src/settings/http";
import { Analyst, Role } from "src/app/definitions";


/**
 * @param email 
 * @param password 
 * @return Promise<Analyst | undefined>
 */
export async function login(email: string, password: string): Promise<Analyst | undefined> {

    try {
        const response = await http.get(`/analysts?email=${email}`)
        const data = response.data.shift() as Record<string, unknown>

        if (!data) {
            return
        }

        if (!(data.password === password)) {
            return
        }

        const userRoles = data.roles as []
        const roles = userRoles.map((role: string): Role => {
            return role as Role
        })
        const analyst: Analyst = {
            id: data.id as number,
            email: data.email as string,
            password: data.password as string,
            userId: data.user_id as number,
            roles: roles
        }

        return analyst

    } catch (error) {
        return
    }


}