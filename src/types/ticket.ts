type TicketType = {
  modifiedTime: string;
  subCategory: string | null;
  statusType: string;
  subject: string;
  dueDate: string | null;
  departmentId: string | null;
  channel: string;
  onholdTime: string | null;
  language: string;
  source: {
    appName: string | null;
    extId: string | null;
    permalink: string | null;
    type: string;
    appPhotoURL: string | null;
  };
  resolution: string | null;
  sharedDepartments: string[];
  closedTime: string | null;
  approvalCount: string;
  isOverDue: boolean;
  isTrashed: boolean;
  createdTime: string;
  id: string;
  isResponseOverdue: boolean;
  customerResponseTime: string | null;
  productId: string | null;
  contactId: string | null;
  threadCount: string;
  secondaryContacts: string[];
  priority: string;
  classification: string | null;
  commentCount: string;
  taskCount: string;
  accountId: string | null;
  phone: string | null;
  webUrl: string;
  isSpam: boolean;
  status: string;
  entitySkills: string[];
  ticketNumber: string;
  sentiment: string | null;
  customFields: {
    "Subcategoria Solicitações": string | null;
    "Categoria Profissional": string | null;
    "Nome Concessionário": string | null;
    TRIM: string | null;
    "Nome do colaborador badge": string | null;
    "Data Fim Viatura de Substituição": string | null;
    "Subcategoria Connected Services": string | null;
    Telemóvel: string | null;
    Morada: string | null;
    Contencioso: string | null;
    "Inscrição Programa de Certificação": string | null;
    "Subcategoria myHyundai": string | null;
    "É proprietário de um Hyundai?": string | null;
    "É proprietário de um BYD?": string | null;
    "PWA Frente": string | null;
    Matrícula: string | null;
    "Nome do colaborador": string | null;
    Pedido: string | null;
    "PWA Atrás": string | null;
    "Estado do Pedido": string | null;
    "Subcategoria myHonda": string | null;
    "Status do Pedido": string | null;
    "Data Inicio Viatura Substituição": string | null;
    Localidade: string | null;
    "Nº Aprovação": string | null;
    "Subcategoria Blue E": string | null;
    Concessionário: string | null;
    Modelo: string | null;
    "É proprietário Nissan?": string | null;
    "Tipo de Pedido": string | null;
    PAINT: string | null;
    "Subcategoria Click to Buy": string | null;
    TRANSM: string | null;
    Concessão: string | null;
    GVW: string | null;
    Detalhe: string | null;
    Valor: string | null;
    "Detalhe Solicitações": string | null;
    "Status Pedido": string | null;
    Crítico: string | null;
    Reincidência: string | null;
    "Subcategoria Reclamação": string | null;
    "Data de Resolução": string | null;
    Instalação: string | null;
    "Peso Combinado": string | null;
    "Subcategoria Pedido de Informação": string | null;
    "Digitalização do DUA - Anexo": string | null;
    "Subcategoria Recall EV": string | null;
    "Categoria 2": string | null;
    AXLE: string | null;
    "Categoria 1": string | null;
    "Detalhe Subcategoria": string | null;
    Tipo: string | null;
    "Nome Concessão": string | null;
    "Data aplicação": string | null;
    "Detalhe Reclamação": string | null;
    "Subcategoria Inqueritos Satisfaçao": string | null;
    Model: string | null;
    VIN: string | null;
    "Detalhe myHyundai": string | null;
    "Detalhe Pedido de Informação": string | null;
  };
  isArchived: boolean;
  description: string | null;
  timeEntryCount: string;
  channelRelatedInfo: string | null;
  responseDueDate: string | null;
  isDeleted: boolean;
  modifiedBy: string;
  followerCount: string;
  email: string;
  layoutDetails: {
    id: string;
    layoutName: string;
  };
  channelCode: string | null;
  isFollowing: boolean;
  cf: {
    cf_concess: string | null;
    cf_vin: string | null;
    cf_data_aplicacao: string | null;
    cf_nome_do_colaborador_badge: string | null;
    cf_status_do_pedido: string | null;
    cf_e_proprietario_de_um_byd: string | null;
    cf_detalhe_solicitacoes: string | null;
    cf_inscricao_programa_de_certificacao: string | null;
    cf_detalhe: string | null;
    cf_detalhe_reclamacao: string | null;
    cf_picklist_1: string | null;
    cf_tipo: string | null;
    cf_categoria_profissional: string | null;
    cf_morada: string | null;
    cf_subcategoria_inqueritos_satisfacao: string | null;
    cf_topico: string | null;
    cf_subcategoria_my_honda: string | null;
    cf_detalhe_subcategoria: string | null;
    cf_subcategoria_click_to_buy: string | null;
    cf_transm: string | null;
    cf_modelo: string | null;
    cf_nome_concessionario: string | null;
    cf_pwa_frente: string | null;
    cf_codigo_concessao: string | null;
    cf_axle: string | null;
    cf_nome_do_colaborador: string | null;
    cf_gvw: string | null;
    cf_concessionario: string | null;
    cf_subcategoria_connected_services: string | null;
    cf_e_proprietario_de_um_hyundai: string | null;
    cf_contencioso: string | null;
    cf_detalhe_my_hyundai: string | null;
    cf_paint: string | null;
    cf_subcategoria_recall_ev: string | null;
    cf_categoria_2: string | null;
    cf_categoria_1: string | null;
    cf_combination_weight: string | null;
    cf_subcategoria_my_hyundai: string | null;
    cf_critico: string | null;
    cf_instalacao: string | null;
    cf_pwa_atras: string | null;
    cf_subcategoria_pedido_de_informacao: string | null;
    cf_detalhe_pedido_de_informacao: string | null;
    cf_date_de_resolucao: string | null;
    cf_pedito: string | null;
    cf_model: string | null;
    cf_subcategoria_solicitacoes: string | null;
    cf_telemovel: string | null;
    cf_subcategoria_blue_e: string | null;
    cf_valor: string | null;
    cf_status_pedido: string | null;
    cf_localidade: string | null;
    cf_trim: string | null;
    cf_reincidencia: string | null;
    cf_matricula: string | null;
    cf_digitalizacao_do_dua_anexo: string | null;
    cf_data_fim_viatura_de_subsituicao: string | null;
    cf_data_inicio_viatura_substituicao: string | null;
    cf_subcategoria_reclamacao: string | null;
    cf_e_proprietario_nissan: string | null;
    cf_approval_no: string | null;
  };
  slaId: string | null;
  layoutId: string | null;
  assigneeId: string;
  createdBy: string;
  teamId: string | null;
  tagCount: string;
  attachmentCount: string;
  isEscalated: boolean;
  category: string | null;
};
