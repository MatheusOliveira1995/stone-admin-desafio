import http from "src/settings/http";
import { Cards, Card, Status } from "src/app/definitions";

import {formatDate} from 'src/util/date'

type ApiCard = {
    id?: string | number,
    createdAt: string,
    updatedAt?: string,
    status: Status,
    user_id: number,
    metadatas:{
        name?:string,
        digits?: string,
        limit?: number
    }
}
export async function getCards(): Promise<Cards> {
    let response
    try {
        response = await http.get('/cards')
    } catch (error) {
        return { cards: [] }
    }
    const data = response.data
    const cards = data.map((card: Record<string, unknown>):Card => {
        const metaDatas = card.metadatas as Record<string, any>
        return{
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

export async function saveCard(card: Record<string, unknown>) {
    let url = '/cards'
    const payload: ApiCard = {
        status: Status.REQUESTED,
        user_id: card.userId as number,
        createdAt: card.createdAt as string,
        metadatas: {
            name: card.name as string,
            digits: card.digits as string,
            limit: card.limit as number
        }
    }
    if(card.id){
        payload.id = card.id as number
        payload.updatedAt = formatDate({dateValue:(new Date()), pattern: 'us'})
        url = url.concat(`/${card.id}`)
    }
    try {
      let response
      if(payload.id){
        response = await http.put(url, payload)
        return response.data
      }

      response = await http.post(url, payload)
      return response.data  

    } catch (error) {
        return {}
    }   
    
    
}