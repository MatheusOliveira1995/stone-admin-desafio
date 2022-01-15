// eslint-disable-next-line import/no-anonymous-default-export
export default {
    add: {
        title: 'Novo pedido de cartão',
        document: 'Documento',
        limit: 'Limite pretendido',
        digits: 'Dígitos',
        createdAt: 'Data da solicitação',
        clientName: 'Nome do cliente',
        status: 'Status',
        statuses: {
            requested: 'Solicitado',
            approved: 'Aprovado',
            rejected: 'Rejeitado'
        }
    },
    validation: {
        required: 'Campo obrigatório',
        user: 'Usuário não encontrado'
    },
    actions: {
        new: 'Novo',
        delete: 'Deletar',
        details: 'Detalhes',
        save: 'Salvar',
        cancel: 'Cancelar'
    }
}