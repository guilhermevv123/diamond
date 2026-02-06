import { 
  type Account, 
  type Pipeline, 
  type Lead, 
  type Proposal, 
  type Category, 
  type User, 
  type Tag,
  LeadStatus 
} from '~/types'
import { useMockData } from './useMockData'


export const useApp = () => {
  // Mock Data Initialization
  const { mockLeads, mockProposals, mockCategories, mockUsers } = useMockData()

  // --- Account State ---
  const account = useState<Account>('account', () => ({
    id: '1',
    name: 'Minha Solar Ltda',
    cnpj: '00.000.000/0001-00',
    email: 'admin@minhasolar.com.br',
    plan: 'Pro'
  }))

  const updateAccount = (updates: Partial<Account>) => {
    account.value = { ...account.value, ...updates }
  }

  // --- Pipelines State ---
  const initialPipelines: Pipeline[] = [
    {
      id: 'p1',
      name: 'Vendas',
      columns: [
        { id: 'new', title: 'ENTRADA', status: LeadStatus.NEW, color: 'border-t-4 border-slate-400' },
        { id: 'contacted', title: 'CONTATO FEITO', status: LeadStatus.CONTACTED, color: 'border-t-4 border-blue-500' },
        { id: 'negotiation', title: 'EM NEGOCIAÇÃO', status: LeadStatus.NEGOTIATION, color: 'border-t-4 border-amber-500' },
        { id: 'qualified', title: 'QUALIFICADO', status: LeadStatus.QUALIFIED, color: 'border-t-4 border-primary' },
        { id: 'closed', title: 'FECHADOS', status: LeadStatus.CLOSED, color: 'border-t-4 border-purple-500' },
      ],
      customFieldDefs: [
        { id: 'inversor', label: 'Inversor', type: 'text', required: false, placeholder: 'Ex: Growatt 5kW' },
        { id: 'placas', label: 'Placas', type: 'number', required: false, placeholder: 'Qtd de Módulos' }
      ]
    }
  ]
  // --- Finance State ---
  const transactions = useState<any[]>('transactions', () => [
    { id: '1', desc: 'Venda Sistema Solar - Residencial', value: 15000, type: 'in', cat: 'Vendas', date: '2023-11-20' },
    { id: '2', desc: 'Compra de Kits Solares', value: 8000, type: 'out', cat: 'Custos', date: '2023-11-21' },
    { id: '3', desc: 'Marketing Instagram', value: 1500, type: 'out', cat: 'Marketing', date: '2023-11-22' },
    { id: '4', desc: 'Manutenção Veículos', value: 450, type: 'out', cat: 'Despesas Op.', date: '2023-11-23' },
  ])

  const categories = useState<any[]>('categories', () => [
    { id: 'c1', name: 'Vendas', type: 'Receita', color: 'bg-emerald-500', subcategories: [] },
    { id: 'c2', name: 'Custos', type: 'Despesa', color: 'bg-red-500', subcategories: [] },
    { id: 'c3', name: 'Marketing', type: 'Despesa', color: 'bg-blue-500', subcategories: [] },
    { id: 'c4', name: 'Despesas Op.', type: 'Despesa', color: 'bg-orange-500', subcategories: [] },
  ])

  const addTransaction = (t: any) => {
    transactions.value.unshift({ ...t, id: Math.random().toString(36).substr(2, 9) })
  }

  const deleteTransaction = (id: string) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  const addCategory = (c: any) => {
    categories.value.push({ ...c, id: Math.random().toString(36).substr(2, 9), subcategories: [] })
  }
  
  const deleteCategory = (id: string) => {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  const addSubcategory = (parentId: string, name: string) => {
    const cat = categories.value.find(c => c.id === parentId)
    if (cat) {
        cat.subcategories.push({ id: Math.random().toString(36).substr(2, 9), name })
    }
  }

  const pipelines = useState<Pipeline[]>('pipelines', () => initialPipelines)
  
  const addPipeline = (name: string) => {
    pipelines.value.push({
      id: Math.random().toString(36).substr(2, 9),
      name,
      columns: [
        { id: 'new', title: 'Novos', status: LeadStatus.NEW, color: 'border-t-primary' },
        { id: 'contacted', title: 'Contatados', status: LeadStatus.CONTACTED, color: 'border-t-blue-500' },
        { id: 'negotiation', title: 'Negociação', status: LeadStatus.NEGOTIATION, color: 'border-t-amber-500' },
        { id: 'closed', title: 'Fechados', status: LeadStatus.CLOSED, color: 'border-t-green-500' }
      ]
    })
  }

  // --- Leads State ---
  const leads = useState<Lead[]>('leads', () => mockLeads as unknown as Lead[])
  
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }
    leads.value = [newLead, ...leads.value]
  }

  const deleteLead = (id: string) => {
    leads.value = leads.value.filter(l => l.id !== id)
  }

  // --- Proposals State ---
  const proposals = useState<Proposal[]>('proposals', () => mockProposals as unknown as Proposal[])

  // --- Users State ---
  const users = useState<User[]>('users', () => mockUsers as unknown as User[])

  // --- Tags State ---
  const tags = useState<Tag[]>('tags', () => [
    { id: 't1', name: 'Quente', color: '#EF4444' },
    { id: 't2', name: 'Morno', color: '#F59E0B' },
    { id: 't3', name: 'Frio', color: '#3B82F6' },
  ])

  // --- Events State (Schedule) ---
  const events = useState<any[]>('events', () => [
    { id: 'e1', title: 'Vistoria Técnica - Sr. João', date: '2023-11-10', time: '09:00', type: 'vistoria' },
    { id: 'e2', title: 'Reunião de Fechamento', date: '2023-11-10', time: '14:30', type: 'reuniao' },
    { id: 'e3', title: 'Instalação - Cond. Flores', date: '2023-11-12', time: '08:00', type: 'instalacao' },
  ])

  const addEvent = (e: any) => {
    events.value.push({ ...e, id: Math.random().toString(36).substr(2, 9) })
  }

  const deleteEvent = (id: string) => {
    events.value = events.value.filter(e => e.id !== id)
  }

  // --- Workflows State (Automation) ---
  const workflows = useState<any[]>('workflows', () => [
    { id: 'w1', title: 'Boas-vindas Lead', type: 'Vendas', active: true, lastRun: 'Hoje 10:30', nodes: [] },
    { id: 'w2', title: 'Recuperação de Carrinho', type: 'Recuperação', active: false, lastRun: 'Ontem 18:00', nodes: [] },
    { id: 'w3', title: 'Pós-Venda NPS', type: 'Pós-Venda', active: true, lastRun: '23/10 09:00', nodes: [] },
  ])

  const addWorkflow = (w: any) => {
    workflows.value.push({ ...w, id: Math.random().toString(36).substr(2, 9), active: true, lastRun: 'Nunca' })
  }

  const deleteWorkflow = (id: string) => {
    workflows.value = workflows.value.filter(w => w.id !== id)
  }

  const toggleWorkflow = (id: string) => {
    const w = workflows.value.find(w => w.id === id)
    if (w) w.active = !w.active
  }

  // --- Missing Actions ---
  const addProposal = (p: any) => {
    proposals.value.unshift({ ...p, id: Math.random().toString(36).substr(2, 9) })
  }

  const deleteProposal = (id: string) => {
    proposals.value = proposals.value.filter(p => p.id !== id)
  }

  const addUser = (u: any) => {
    users.value.push({ ...u, id: Math.random().toString(36).substr(2, 9) })
  }

  const deleteUser = (id: string) => {
    users.value = users.value.filter(u => u.id !== id)
  }

  const toggleUserStatus = (id: string) => {
    const u = users.value.find(u => u.id === id)
    if (u) u.active = !u.active
  }

  const updatePipeline = (id: string, updates: Partial<Pipeline>) => {
    const idx = pipelines.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      pipelines.value[idx] = { ...pipelines.value[idx], ...updates } as Pipeline
    }
  }

  return {
    account,
    updateAccount,
    transactions,
    addTransaction,
    deleteTransaction,
    categories,
    addCategory,
    deleteCategory,
    addSubcategory,
    pipelines,
    addPipeline,
    updatePipeline,
    leads,
    addLead,
    deleteLead,
    proposals,
    addProposal,
    deleteProposal,
    users,
    addUser,
    deleteUser,
    toggleUserStatus,
    tags,
    events,
    addEvent,
    deleteEvent,
    workflows,
    addWorkflow,
    deleteWorkflow,
    toggleWorkflow
  }
}
