import http from "src/settings/http";
import { Audit, Audits, Card, Status } from "src/app/definitions";
import { formatDate } from "src/util/date";

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

interface AuditType {
    before: Record<string, unknown>,
    after: Record<string, unknown>
}
type AuditApi = {
    id?: number | string,
    createdAt?: string,
    type: string,
    before: ApiCard | {},
    after: ApiCard | {},
    requestedBy: number | string,
}

export async function saveAudit({ before, after }: AuditType) {
    let type = Object.keys(before).length === 0 ? 'created' : 'updated'
    //if status is different of default status REQUESTED, then the update is status change
    if(Object.keys(before).length > 0 && before.status !== after.status){
        type = 'card-status-change'
    }
    const payload: AuditApi = {
        createdAt: formatDate({ dateValue: (new Date()), pattern: 'us' }),
        after: after,
        before: before,
        requestedBy: 1,
        type: type,
    }
    try {
        const response = await http.post('/audits', payload)
        return response.data
    } catch (error) {

    }
}

export async function getAudits(): Promise<Audits> {

    try {
        const response = await http.get('/audits')
        const data = response.data

        const audits = data.map((audit: Record<string, unknown>): Audit => {
            const before = audit.before as Record<string, unknown>
            const after = audit.after as Record<string, unknown>
            const afterMetadatas = after.metadatas as Record<string, unknown>
            const beforeMetadatas = before.metadatas as Record<string, unknown>
            return {
                after: {
                    id: after.id as number,
                    createdAt: formatDate({dateValue: after.createdAt as string, pattern: 'us'}) ?? '-',
                    metaDatas:{
                        digits: afterMetadatas?.digits as string,
                        limit: afterMetadatas?.limit as number,
                        name: afterMetadatas?.name as string
                    },
                    status: after.status as Status,
                    userId: after.user_id as number,
                    updatedAt: formatDate({dateValue: after.updatedAt as string, pattern: 'us'}) ?? '-',
                },
                before: {
                    id: before.id as number,
                    createdAt: formatDate({dateValue: before.createdAt as string, pattern: 'us'}) ?? '-',
                    metaDatas:{
                        digits: beforeMetadatas?.digits as string,
                        limit: beforeMetadatas?.limit as number,
                        name: beforeMetadatas?.name as string
                    },
                    status: before.status as Status,
                    userId: before.user_id as number,
                    updatedAt: formatDate({dateValue: before.updatedAt as string, pattern: 'us'}) ?? '-',
                },
                id: audit.id as number,
                createdAt: formatDate({dateValue: audit.createdAt as string, pattern: 'us'}) ?? '-',
                requestedBy: audit.requestedBy as number,
                type: audit.type as string
            }
        })

        return audits

    } catch (error) {
        return { audits: [] }
    }
}