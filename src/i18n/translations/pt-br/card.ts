// eslint-disable-next-line import/no-anonymous-default-export
export default {
    gridDataEmpty: 'Nenhum registro encontrado!',
    helpText: 'Dicas: Selecione um pedido na lista de solicitações em aberto para avaliar. Com um pedido selecionado é possível visualizar os detalhes clicando no botão "DETALHES". Selecione o nome do titular para atualizar o nome impresso no cartão ',
    add: {
        title: 'Novo pedido de cartão',
        document: 'Documento',
        limit: 'Limite pretendido',
        digits: 'Dígitos',
        createdAt: 'Data da solicitação',
        clientName: 'Nome impresso',
        status: 'Status',
        statuses: {
            requested: 'Solicitado',
            approved: 'Aprovado',
            rejected: 'Rejeitado'
        }
    },
    update:{
        title: 'Editando pedido de cartão',
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
        cancel: 'Cancelar',
        approve: 'Aprovar',
        reject: 'Rejeitar'
    }
}