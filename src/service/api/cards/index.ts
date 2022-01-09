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
        const metaDatas = card.metadatas as Record<string, unknown>
        return{
            id: card.id as number,
            status: card.status as Status,
            userId: card.user_id as number,
            createdAt: card.createdAt ? new Date(card.createdAt as string) : '-',
            metaDatas: {
                name: metaDatas.name ? metaDatas.name as string : '',
                digits: metaDatas.digits ? metaDatas.digits as string : '',
                limit: metaDatas.limit ? metaDatas.limit as number : 0
            },
            updatedAt: card.updatedAt ? new Date(card.updatedAt as string) : '-',
        }
    })
    return cards
}