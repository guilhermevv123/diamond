import { LeadStatus } from '~/types'

export const useMockData = () => {
  const metrics = [
    { title: 'Conversas atuais', value: '699', change: 12, icon: 'chat', trend: 'up' },
    { title: 'Mensagens trocadas', value: '11.992', change: 5, icon: 'forum', trend: 'up' },
    { title: 'Mensagens não lidas', value: '398', change: 8, icon: 'mark_chat_unread', trend: 'up' },
    { title: 'Funis Ativos', value: '3', change: 0, icon: 'filter_list', trend: 'up' }
  ]

  const chartData = [
    { date: '31/01', total: 40, finalizadas: 24, pendentes: 10, atrasadas: 6 },
    { date: '01/02', total: 30, finalizadas: 13, pendentes: 10, atrasadas: 7 },
    { date: '02/02', total: 20, finalizadas: 10, pendentes: 5, atrasadas: 5 },
    { date: '03/02', total: 27, finalizadas: 15, pendentes: 8, atrasadas: 4 },
    { date: '04/02', total: 18, finalizadas: 10, pendentes: 5, atrasadas: 3 },
    { date: '05/02', total: 23, finalizadas: 12, pendentes: 8, atrasadas: 3 },
    { date: '06/02', total: 34, finalizadas: 20, pendentes: 10, atrasadas: 4 },
  ]

  const mockLeads = [
    {
      id: '1',
      name: 'Gabriel Robalo',
      type: 'Pessoa Física',
      location: 'Porto Alegre, RS',
      value: 4500,
      status: LeadStatus.NEW,
      group: 'Vendas',
      source: 'Instagram Ads',
      createdAt: '2025-02-21',
      tags: ['Quente', 'Consultoria'],
      phone: '(51) 99999-8888',
      email: 'gabriel.robalo@email.com',
      notes: [{ id: 'n1', text: 'Cliente prefere contato após as 18h.', author: 'Wellington', date: '2025-02-21 10:00' }]
    },
    {
      id: '2',
      name: 'Tech Solutions Ltda',
      type: 'Empresa',
      location: 'São Paulo, SP',
      value: 125000,
      status: LeadStatus.CONTACTED,
      group: 'Vendas',
      source: 'Indicação',
      createdAt: '2025-02-15',
      tags: ['Enterprise']
    }
  ]

  const mockProposals = [
    { id: 'P1', clientName: 'Gabriel Robalo', value: 4500, product: 'Consultoria Financeira', status: 'Enviada', date: '2023-11-01' }
  ]

  const mockCategories = [
    { id: 'cat1', name: 'Vendas', type: 'Receita', color: 'bg-emerald-500', subcategories: [] },
    { id: 'cat2', name: 'Custos', type: 'Despesa', color: 'bg-red-500', subcategories: [] }
  ]

  const mockUsers = [
    { id: 'u1', code: 2, name: 'Financeiro', email: 'ab.lobo@hotmail.com', profile: 'Administrador', function: 'Administrador', role: 'Administrador', active: true, lastActive: 'Agora' },
    { id: 'u2', code: 5, name: 'DIEGO HENRIQUE', email: 'diegohenrique4@gmail.com', profile: 'Gerente', function: 'Gerente de Unidade', role: 'Gerente', active: true, lastActive: '2h atrás' }
  ]

  const mockQuickTemplates = [
    { id: 't1', title: 'Boas-vindas', content: 'Olá! Como podemos ajudar?', type: 'text', folder: 'Saudação' },
    { id: 't2', title: 'Áudio Intro', content: 'Explicação detalhada', type: 'audio', folder: 'Vendas' }
  ]

  const mockAiAgents = [
    { id: 'a1', name: 'Sofia', role: 'Vendas', active: true },
    { id: 'a2', name: 'Max', role: 'Suporte', active: true }
  ]

  return {
    metrics,
    chartData,
    mockLeads,
    mockProposals,
    mockCategories,
    mockUsers,
    mockQuickTemplates,
    mockAiAgents
  }
}


