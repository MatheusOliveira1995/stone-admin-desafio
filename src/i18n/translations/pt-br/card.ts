// eslint-disable-next-line import/no-anonymous-default-export
export default {
    gridDataEmpty: 'Nenhum registro encontrado!',
    helpText: 'Dicas: Selecione um pedido na lista de solicitações em aberto para avaliar. Com um pedido selecionado é possível visualizar os detalhes clicando no botão "DETALHES". Selecione o nome do titular para atualizar o nome impresso no cartão ',
    add: {
        error: 'Houve um erro ao salvar o pedido tente novamente!',
        tooltip:'Abre o cadastro de um novo pedido de cartão',
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
        error: 'Houve um erro ao atualizar o pedido, tente novamente!'
    },
    delete:{
      error: 'Houve um erro ao deletar o pedido, tente novamente!',
      tooltip: 'Deleta o registro selecionado'
    },
    datagridFields:{
        cardHolderName: 'Nome impresso',
        digits: 'Número do cartão',
        limit: 'Limite do cartão',
        status: 'Status do pedido',
        createdAt: 'Criado em',
        updatedAt: 'Atualizado em',
        edit: 'Editar',
        userId: 'Id do usuário'
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