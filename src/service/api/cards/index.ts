import http from "src/settings/http";
import { Cards, Card, Status } from "src/app/definitions";

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

export async function createCard(card: Record<string, unknown>) {
    const payload = {
        status: Status.REQUESTED,
        user_id: card.userId,
        createdAt: card.createdAt,
        metadatas: {
            name: card.userName,
            digits: card.digits,
            limit: card.limit
        }
    }
    try {
      const response = await http.post('/cards', payload)
      return response.data  
    } catch (error) {
        return {}
    }   
    
    
}