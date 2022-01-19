import http from "src/settings/http";
import { Cards, Card, Status } from "src/app/definitions";
import saveAudit from 'src/service/api/audits'

import { formatDate } from 'src/util/date'

type ApiCard = {
    id?: string | number,
    createdAt: string,
    updatedAt?: string,
    status: Status,
    user_id: number,
    metadatas: {
        name?: string,
        digits?: string,
        limit?: number
    }
}
type SubmitType = {
    data: Record<string, unknown>,
    before: Card | undefined
}

export async function getCards(): Promise<Cards> {
    let response
    try {
        response = await http.get('/cards')
    } catch (error) {
        return { cards: [] }
    }
    const data = response.data
    const cards = data.map((card: Record<string, unknown>): Card => {
        const metaDatas = card.metadatas as Record<string, any>
        return {
            id: card.id as number,
            status: card.status as Status,
            userId: card.user_id as number,
            createdAt: card.createdAt ? new Date(card.createdAt as string) : '-',
            metaDatas: {
                name: metaDatas?.name ?? '',
                digits: metaDatas?.digits ?? '',
                limit: metaDatas?.limit as number ?? 0
            },
            updatedAt: card.updatedAt ? new Date(card.updatedAt as string) : undefined,
        }
    })
    return cards
}
export async function deleteCard(card: number) {
    try {
        return http.delete(`/cards/${card}`)
    } catch (error) {

    }
}
export async function saveCard({ data, before } : SubmitType) {
    let url = '/cards'

    let payloadBefore: Record<string, unknown> = {}
    const payload: ApiCard = {
        status: data.status as Status,
        user_id: data.userId as number,
        createdAt: data.createdAt as string,
        metadatas: {
            name: data.name as string,
            digits: data.digits as string,
            limit: data.limit as number
        }
    }
    if (data.id) {
        payload.id = data.id as number
        payload.updatedAt = formatDate({ dateValue: (new Date()), pattern: 'us' })
        url = url.concat(`/${data.id}`)
    }
    if(before){
        payloadBefore = {
            id: before.id,
            status: before.status,
            user_id: before.userId,
            createdAt: before.createdAt,
            updatedAt: before.updatedAt,
            metadatas:{
                name: before.metaDatas.name,
                digits: before.metaDatas.digits,
                limit: before.metaDatas.limit
            }
        }
    }
    try {
        let response
        if (payload.id) {
            response = await http.put(url, payload)
        }else{
            response = await http.post(url, payload)
        }

        await saveAudit({after: response.data, before: payloadBefore})
        return response.data

    } catch (error) {
        return {}
    }


}