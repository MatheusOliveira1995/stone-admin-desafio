import http from "src/settings/http";
import { Status } from "src/app/definitions";
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

export default async function saveAudit({ before, after }: AuditType) {
    debugger
    const payload: AuditApi = {
        createdAt: formatDate({ dateValue: (new Date()), pattern: 'us' }),
        after: after,
        before: before,
        requestedBy: 1,
        type: Object.keys(before).length === 0 ? 'created' : 'updated',
    }
    try {
        const response = await http.post('/audits', payload)
        return response.data
    } catch (error) {

    }
}