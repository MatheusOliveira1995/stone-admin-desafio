import http from "src/settings/http";
import { Audit, Audits, Status } from "src/app/definitions";
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
    after: Record<string, unknown>,
    requestedBy: number|string
}
type AuditApi = {
    id?: number | string,
    createdAt?: string,
    type: string,
    before: ApiCard | {},
    after: ApiCard | {},
    requestedBy: number | string,
}

/**
 * @param AuditType 
 * @return void
 */
export async function saveAudit({ before, after, requestedBy }: AuditType) {
    let type = Object.keys(before).length === 0 ? 'created' : Object.keys(after).length === 0 ? 'deleted' : 'updated'
    //if type is different of DELETED and status is different of default status REQUESTED, then the update is status change
    if(type !== 'deleted' && (Object.keys(before).length > 0 && before.status !== after.status)){
        type = 'card-status-change'
    }
    const payload: AuditApi = {
        createdAt: formatDate({ dateValue: undefined, pattern: 'us' }),
        after: after,
        before: before,
        requestedBy: requestedBy,
        type: type,
    }
    try {
        const response = await http.post('/audits', payload)
        return response.data
    } catch (error) {

    }
}

/**
 * @return Promise<Audit>
 */
export async function getAudits(): Promise<Audits> {

    try {
        const response = await http.get('/audits')
        const data = response.data

        const audits = data.map((audit: Record<string, unknown>): Audit => {
            const before = audit.before as Record<string, unknown>
            const after = audit.after as Record<string, unknown>
            const afterMetadatas = after.metadatas ? after.metadatas as Record<string, unknown> : {}
            const beforeMetadatas = before.metadatas ? before.metadatas as Record<string, unknown> : {}
            return {
                after: {
                    id: after.id as number ?? '',
                    createdAt: after.createdAt ? formatDate({dateValue: after.createdAt as string}) : '',
                    metaDatas:{
                        digits: afterMetadatas.digits as string ?? '',
                        limit: afterMetadatas.limit as number ?? 0,
                        name: afterMetadatas.name as string ?? ''
                    },
                    status: after.status as Status ?? undefined,
                    userId: after.user_id as number ?? '',
                    updatedAt: after.updatedAt ? formatDate({dateValue: after.updatedAt as string}) : '',
                },
                before: {
                    id: before.id as number ?? '',
                    createdAt: before.createdAt ? formatDate({dateValue: before.createdAt as string}) : '',
                    metaDatas:{
                        digits: beforeMetadatas.digits as string ?? '',
                        limit: beforeMetadatas.limit as number ?? 0,
                        name: beforeMetadatas.name as string ?? ''
                    },
                    status: before.status as Status ?? undefined,
                    userId: before.user_id as number ?? '',
                    updatedAt: before.updatedAt ? formatDate({dateValue: before.updatedAt as string}) : '',
                },
                id: audit.id as number,
                createdAt: formatDate({dateValue: audit.createdAt as string}) ?? '-',
                requestedBy: audit.requestedBy as number,
                type: audit.type as string
            }
        })

        return audits

    } catch (error) {
        return { audits: [] }
    }
}