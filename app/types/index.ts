export enum LeadStatus {
  // Vendas
  NEW = 'Novo',
  QUALIFIED = 'Qualificado',
  CONTACTED = 'Contatado',
  NEGOTIATION = 'Negociação',
  CLOSED = 'Fechado',
  
  // Onboarding / Pós-Venda
  WAITING_INFO = 'Aguardando Info',
  PROCESSING = 'Em Processamento',
  APPROVED = 'Aprovado',
  
  // Entrega / Execução
  PREPARING = 'Preparando',
  IN_PROGRESS = 'Em Execução',
  COMPLETED = 'Concluído',
  SUPPORT = 'Suporte'
}

export type PipelineGroup = string;

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  status: LeadStatus;
}

// Definição do Esquema do Campo (Configuração)
export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: string[]; // Usado se type === 'select'
  required?: boolean;
  placeholder?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  columns: KanbanColumn[];
  customFieldDefs?: CustomFieldDefinition[]; // Campos específicos deste funil
}

export interface LeadFile {
  id: string;
  name: string;
  url: string;
  date: string;
}

export interface LeadNote {
  id: string;
  text: string;
  author: string;
  date: string;
}

export interface ActivityLog {
    id: string;
    type: 'status_change' | 'note_added' | 'file_added' | 'info_update' | 'creation' | 'proposal_sent';
    description: string;
    date: string;
    author: string;
}

// Dados Pessoais / PJ Completos
export interface ContactInfo {
    personType: 'PF' | 'PJ';
    cpf_cnpj?: string;
    rg_ie?: string;
    issuingBody?: string; // Órgão Expedidor
    issueDate?: string;
    nationality?: string;
    fathersName?: string;
    mothersName?: string;
    birthDate?: string;
    profession?: string;
    maritalStatus?: string;
    secondaryEmail?: string;
    secondaryPhone?: string;
    whatsapp1?: string;
    whatsapp2?: string;
    indication?: string;
}

// Endereço
export interface AddressInfo {
    cep?: string;
    city?: string;
    state?: string; // UF
    neighborhood?: string; // Bairro
    street?: string; // Logradouro
    number?: string;
    complement?: string;
}

// Dados Financeiros
export interface FinancialInfo {
    patrimony?: number;
    monthlyIncome?: number;
    bankReference?: string;
}

// Valor preenchido no Lead
export interface CustomFieldData {
    id: string; // Deve corresponder ao id da CustomFieldDefinition
    value: string;
}

// Rastreamento de Tráfego (UTMs)
export interface TrackingInfo {
    utm_source?: string;   // Ex: facebook, google
    utm_medium?: string;   // Ex: cpc, organic
    utm_campaign?: string; // Ex: black_friday
    utm_content?: string;  // Ex: banner_v1
    utm_term?: string;     // Ex: energia solar
    referrer?: string;     // URL de onde veio
    click_id?: string;     // gclid, fbclid
}

export interface LeadDetails {
    productInterest: string; 
    description?: string; // Campo de descrição geral/pagamentos
    requirements?: string;
    deadline?: string;
    origin?: string;
    campaign?: string;
    adName?: string;
    adLink?: string;
    businessType?: string; // Comercial, Judicial, etc.
    budget?: number; // Orçamento criado
}

export interface Lead {
  id: string;
  name: string;
  type: 'Pessoa Física' | 'Empresa'; 
  location: string;
  value: number; // Valor potencial
  status: LeadStatus;
  group: PipelineGroup;
  source: string;
  createdAt: string;
  tags: string[]; 
  files?: LeadFile[]; 
  notes?: LeadNote[];
  details?: LeadDetails;
  contact?: ContactInfo;
  address?: AddressInfo;
  financials?: FinancialInfo;
  customFields?: CustomFieldData[]; // Valores preenchidos
  tracking?: TrackingInfo; // Dados de rastreamento
  activities?: ActivityLog[];
  phone?: string;
  email?: string;
}

export interface Proposal {
  id: string;
  clientName: string;
  value: number;
  product: string; 
  status: 'Rascunho' | 'Enviada' | 'Assinada' | 'Recusada';
  date: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  change: number;
  icon: string;
  trend: 'up' | 'down';
}

export interface SubCategory {
  id: string;
  name: string;
  type: 'Receita' | 'Despesa';
}

export interface Category {
  id: string;
  name: string;
  type: 'Receita' | 'Despesa';
  color: string;
  subcategories: SubCategory[];
}

export interface Account {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  plan: 'Basic' | 'Pro' | 'Enterprise' | 'Corporate';
}

export type UserRole = 'Administrador' | 'Gerente' | 'Supervisor' | 'Vendedor';

export interface User {
  id: string;
  code: number;
  name: string;
  email: string;
  phone?: string;
  store?: string;
  profile: string; // Ex: Administrador
  function: string; // Ex: Gerente de Unidade
  team?: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  lastActive: string;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface QuickTemplate {
    id: string;
    title: string;
    content: string;
    type: 'text' | 'audio' | 'video' | 'sticker' | 'image';
    folder: string;
}

export interface AiAgent {
    id: string;
    name: string;
    role: string;
    active: boolean;
}
