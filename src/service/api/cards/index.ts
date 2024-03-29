import http from "src/settings/http";
import { Cards, Card, Status } from "src/app/definitions";
import { saveAudit } from 'src/service/api/audits'

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
    before: Card | undefined,
    requestedBy: number|string
}
type DeleteType = {
    cardId: number | string,
    before: Card | undefined,
    requestedBy: number|string
}

/**
 * @return Promise<Cards> 
 */
export async function getCards(): Promise<Cards> {
    let response
    try {
        response = await http.get('/cards')
        const data = response.data
        const cards = data.map((card: Record<string, unknown>): Card => {
            const metaDatas = card.metadatas as Record<string, any>
            return {
                id: card.id as number,
                status: card.status as Status,
                userId: card.user_id as number,
                createdAt: formatDate({ dateValue: card.createdAt as string, pattern: 'us' }) ?? '-',
                metaDatas: {
                    name: metaDatas?.name ?? '',
                    digits: metaDatas?.digits ?? '',
                    limit: metaDatas?.limit as number ?? 0
                },
                updatedAt: card.updatedAt ? formatDate({ dateValue: card.updatedAt as string, pattern: 'us' }) : undefined,
            }
        })
        return cards
    } catch (error) {
        return { cards: [] }
    }

}
/**
 * @param DeleteType 
 * @return void
 */
export async function deleteCard({ cardId, before, requestedBy }: DeleteType) {
    let payloadBefore: Record<string, unknown> = {}

    if (before) {
        payloadBefore = {
            id: before.id,
            status: before.status,
            user_id: before.userId,
            createdAt: before.createdAt,
            updatedAt: before.updatedAt,
            metadatas: {
                name: before.metaDatas.name,
                digits: before.metaDatas.digits,
                limit: before.metaDatas.limit
            }
        }
    }
    try {
        const response = await http.delete(`/cards/${cardId}`)
        await saveAudit({ after: {}, before: payloadBefore, requestedBy: requestedBy })
        return response
    } catch (error) {

    }
}
/**
 * @param SubmitType 
 * @return void
 */
export async function saveCard({ data, before, requestedBy }: SubmitType) {
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
        payload.updatedAt = formatDate({ dateValue: undefined, pattern: 'us' })
        url = url.concat(`/${data.id}`)
    }
    if (before) {
        payloadBefore = {
            id: before.id,
            status: before.status,
            user_id: before.userId,
            createdAt: before.createdAt,
            updatedAt: before.updatedAt,
            metadatas: {
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
        } else {
            response = await http.post(url, payload)
        }

        await saveAudit({ after: response.data, before: payloadBefore, requestedBy: requestedBy })
        return response.data

    } catch (error) {
        return {}
    }


}