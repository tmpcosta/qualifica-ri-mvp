const STORAGE_KEY = 'interactive-checklist-state-v1';

const stageData = [
  {
    id: 'preparacao',
    title: 'Preparação estratégica',
    description:
      'Mapeie expectativas, recursos e stakeholders antes de publicar o checklist.',
    tasks: [
      {
        id: 'mapear-objetivos',
        title: 'Mapear objetivos do checklist',
        description:
          'Liste quais resultados o checklist precisa garantir e quais problemas ele evita.',
        meta: 'Visão geral • 15 min'
      },
      {
        id: 'identificar-publico',
        title: 'Identificar público e responsáveis',
        description:
          'Determine quem utilizará o checklist, responsáveis por cada etapa e aprovadores.',
        meta: 'Stakeholders • 10 min'
      },
      {
        id: 'levantar-requisitos',
        title: 'Levantar requisitos essenciais',
        description:
          'Documente normas, políticas internas e restrições que o checklist deve seguir.',
        meta: 'Regras do negócio • 20 min'
      },
      {
        id: 'definir-ferramentas',
        title: 'Definir ferramentas de registro',
        description:
          'Escolha onde o checklist será hospedado, como os dados serão exportados e quais integrações existirão.',
        meta: 'Infraestrutura • 20 min'
      },
      {
        id: 'planejar-cronograma',
        title: 'Planejar cronograma e marcos',
        description:
          'Estabeleça datas de revisão, testes com usuários e checkpoints de aprovação.',
        meta: 'Linha do tempo • 15 min'
      }
    ]
  },
  {
    id: 'estrutura',
    title: 'Estruturação do conteúdo',
    description:
      'Transforme requisitos em etapas claras, com critérios objetivos e referências complementares.',
    tasks: [
      {
        id: 'organizar-etapas',
        title: 'Organizar fluxo principal',
        description:
          'Defina a sequência lógica das etapas e valide se há dependências explícitas.',
        meta: 'Fluxo • 20 min'
      },
      {
        id: 'escrever-instrucoes',
        title: 'Escrever instruções detalhadas',
        description:
          'Inclua verbos de ação, condições de aprovação e o resultado esperado em cada item.',
        meta: 'Qualidade • 25 min'
      },
      {
        id: 'definir-evidencias',
        title: 'Definir evidências necessárias',
        description:
          'Liste arquivos, prints ou confirmações que comprovem a conclusão da tarefa.',
        meta: 'Compliance • 15 min'
      },
      {
        id: 'inserir-referencias',
        title: 'Inserir referências úteis',
        description:
          'Adicione links para padrões, templates ou manuais que auxiliem o responsável.',
        meta: 'Suporte • 10 min'
      },
      {
        id: 'validar-linguagem',
        title: 'Validar linguagem inclusiva e clara',
        description:
          'Revise termos técnicos, ambiguidades e assegure que o texto seja acessível para novos membros.',
        meta: 'Revisão editorial • 15 min'
      }
    ]
  },
  {
    id: 'implantacao',
    title: 'Implantação e testes',
    description:
      'Implemente o checklist na ferramenta escolhida e valide com um grupo piloto.',
    tasks: [
      {
        id: 'configurar-ferramenta',
        title: 'Configurar checklist na ferramenta',
        description:
          'Crie listas, campos obrigatórios e automações necessárias para registrar respostas.',
        meta: 'Setup • 30 min'
      },
      {
        id: 'criar-versao-piloto',
        title: 'Criar versão piloto controlada',
        description:
          'Disponibilize o checklist para um grupo restrito e documente premissas do teste.',
        meta: 'Piloto • 25 min'
      },
      {
        id: 'executar-teste',
        title: 'Executar teste com usuários-chave',
        description:
          'Acompanhe o uso do checklist em um caso real e observe gargalos ou dúvidas recorrentes.',
        meta: 'Validação • 30 min'
      },
      {
        id: 'coletar-feedback',
        title: 'Coletar feedback estruturado',
        description:
          'Registre sugestões, dificuldades e notas de melhoria, classificando por impacto.',
        meta: 'Insights • 15 min'
      },
      {
        id: 'ajustar-processo',
        title: 'Ajustar processo e atualizar versão',
        description:
          'Implemente melhorias priorizadas, atualize documentação e comunique stakeholders.',
        meta: 'Iteração • 20 min'
      }
    ]
  },
  {
    id: 'acompanhamento',
    title: 'Acompanhamento contínuo',
    description:
      'Garanta que o checklist permaneça relevante, mensurável e atualizado ao longo do tempo.',
    tasks: [
      {
        id: 'monitorar-metricas',
        title: 'Monitorar métricas de uso',
        description:
          'Acompanhe taxa de conclusão, tempo médio e apontamentos de não conformidade.',
        meta: 'Indicadores • 20 min'
      },
      {
        id: 'definir-revisoes',
        title: 'Definir rotina de revisões',
        description:
          'Estabeleça periodicidade, responsáveis e critérios para atualizar o checklist.',
        meta: 'Governança • 15 min'
      },
      {
        id: 'treinar-equipe',
        title: 'Treinar e onboard novos membros',
        description:
          'Crie materiais de apoio, sessões de demonstração e acompanhe as primeiras execuções.',
        meta: 'Capacitação • 25 min'
      },
      {
        id: 'arquivar-versoes',
        title: 'Arquivar versões anteriores',
        description:
          'Registre histórico de alterações e mantenha acesso às versões para auditoria.',
        meta: 'Documentação • 10 min'
      },
      {
        id: 'comunicar-melhoria',
        title: 'Comunicar melhorias aos usuários',
        description:
          'Divulgue atualizações, destaque mudanças críticas e ofereça canais de suporte.',
        meta: 'Comunicação • 15 min'
      }
    ]
  }
];

const stageListEl = document.getElementById('stage-list');
const stageTitleEl = document.getElementById('stage-title');
const stageDescriptionEl = document.getElementById('stage-description');
const stageProgressSummaryEl = document.getElementById('stage-progress-summary');
const taskListEl = document.getElementById('task-list');
const taskTemplate = document.getElementById('task-template');
const filterInput = document.getElementById('task-filter');
const pendingToggle = document.getElementById('show-only-pending');
const markCompleteBtn = document.getElementById('mark-stage-complete');
const markPendingBtn = document.getElementById('mark-stage-pending');
const resetProgressBtn = document.getElementById('reset-progress');
const toggleThemeBtn = document.getElementById('toggle-theme');
const customTaskForm = document.getElementById('custom-task-form');
const customTaskTitleInput = document.getElementById('custom-task-title');
const customTaskNotesInput = document.getElementById('custom-task-notes');
const customTaskSubmitButton = customTaskForm.querySelector('button[type="submit"]');
const overallCompletedEl = document.getElementById('overall-completed');
const overallTotalEl = document.getElementById('overall-total');
const overallProgressFill = document.getElementById('overall-progress');
const overallProgressBar = overallProgressFill?.parentElement;

let state = loadState();
let currentStageId = null;
let filterTerm = '';
let showOnlyPending = false;

initialize();

function initialize() {
  applyTheme(state.theme ?? 'light');
  renderStageList();
  updateOverallProgress();
  bindEvents();
  if (stageData.length) {
    setActiveStage(stageData[0].id);
  }
}

function bindEvents() {
  filterInput.addEventListener('input', (event) => {
    filterTerm = event.target.value.trim().toLowerCase();
    renderTasks();
  });

  pendingToggle.addEventListener('change', (event) => {
    showOnlyPending = event.target.checked;
    renderTasks();
  });

  markCompleteBtn.addEventListener('click', () => {
    if (!currentStageId) return;
    setStageCompletion(currentStageId, true);
  });

  markPendingBtn.addEventListener('click', () => {
    if (!currentStageId) return;
    setStageCompletion(currentStageId, false);
  });

  resetProgressBtn.addEventListener('click', () => {
    const confirmed = window.confirm(
      'Tem certeza de que deseja limpar todo o progresso? Esta ação não pode ser desfeita.'
    );
    if (!confirmed) return;
    const preservedTheme = state.theme;
    state = createInitialState(preservedTheme);
    saveState();
    applyTheme(state.theme);
    renderStageList();
    updateOverallProgress();
    if (currentStageId) {
      setActiveStage(currentStageId);
    } else if (stageData.length) {
      setActiveStage(stageData[0].id);
    }
  });

  toggleThemeBtn.addEventListener('click', () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    state.theme = nextTheme;
    saveState();
    applyTheme(nextTheme);
  });

  customTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!currentStageId) return;
    if (!customTaskForm.reportValidity()) return;

    const title = customTaskTitleInput.value.trim();
    const notes = customTaskNotesInput.value.trim();

    if (!title) {
      customTaskTitleInput.focus();
      return;
    }

    const stageState = ensureStageState(currentStageId);
    stageState.customTasks.push({
      id: `custom-${Date.now()}`,
      title,
      notes,
      completed: false
    });

    saveState();

    customTaskForm.reset();
    filterTerm = '';
    showOnlyPending = false;
    filterInput.value = '';
    pendingToggle.checked = false;

    renderStageList();
    renderTasks();
    updateStageProgress(currentStageId);
    updateOverallProgress();
  });
}

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  toggleThemeBtn.textContent = theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro';
}

function createInitialState(previousTheme = 'light') {
  const theme = typeof previousTheme === 'string' ? previousTheme : 'light';
  const stages = {};
  stageData.forEach((stage) => {
    stages[stage.id] = {
      tasks: stage.tasks.reduce((accumulator, task) => {
        accumulator[task.id] = false;
        return accumulator;
      }, {}),
      customTasks: []
    };
  });
  return {
    stages,
    theme
  };
}

function loadState() {
  const baseState = createInitialState();
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) {
      return baseState;
    }

    Object.entries(stored.stages ?? {}).forEach(([stageId, stageState]) => {
      const targetStage = ensureStageStructure(baseState, stageId);
      if (stageState?.tasks) {
        Object.entries(stageState.tasks).forEach(([taskId, completed]) => {
          if (taskExists(stageId, taskId)) {
            targetStage.tasks[taskId] = Boolean(completed);
          }
        });
      }

      if (Array.isArray(stageState?.customTasks)) {
        targetStage.customTasks = stageState.customTasks
          .filter((task) => task && typeof task.id === 'string')
          .map((task) => ({
            id: task.id,
            title: task.title ?? 'Tarefa personalizada',
            notes: task.notes ?? '',
            completed: Boolean(task.completed)
          }));
      }
    });

    if (stored.theme === 'dark') {
      baseState.theme = 'dark';
    }
  } catch (error) {
    console.error('Erro ao carregar estado do checklist:', error);
  }

  return baseState;
}

function ensureStageStructure(targetState, stageId) {
  if (!targetState.stages[stageId]) {
    targetState.stages[stageId] = {
      tasks: {},
      customTasks: []
    };
  }

  const referenceStage = stageData.find((stage) => stage.id === stageId);
  if (referenceStage) {
    referenceStage.tasks.forEach((task) => {
      if (typeof targetState.stages[stageId].tasks[task.id] !== 'boolean') {
        targetState.stages[stageId].tasks[task.id] = false;
      }
    });
  }

  return targetState.stages[stageId];
}

function ensureStageState(stageId) {
  return ensureStageStructure(state, stageId);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setActiveStage(stageId) {
  currentStageId = stageId;
  const stage = stageData.find((item) => item.id === stageId);
  if (!stage) {
    stageTitleEl.textContent = 'Etapa não encontrada';
    stageDescriptionEl.textContent = 'Selecione uma etapa válida para visualizar as tarefas.';
    stageProgressSummaryEl.textContent = '0 de 0 tarefas concluídas';
    taskListEl.innerHTML = '';
    disableStageControls();
    return;
  }

  filterTerm = '';
  showOnlyPending = false;
  filterInput.value = '';
  pendingToggle.checked = false;

  enableStageControls();

  stageTitleEl.textContent = stage.title;
  stageDescriptionEl.textContent = stage.description;

  renderStageList();
  renderTasks();
  updateStageProgress(stageId);
}

function disableStageControls() {
  filterInput.disabled = true;
  pendingToggle.disabled = true;
  markCompleteBtn.disabled = true;
  markPendingBtn.disabled = true;
  customTaskTitleInput.disabled = true;
  customTaskNotesInput.disabled = true;
  if (customTaskSubmitButton) {
    customTaskSubmitButton.disabled = true;
  }
}

function enableStageControls() {
  filterInput.disabled = false;
  pendingToggle.disabled = false;
  markCompleteBtn.disabled = false;
  markPendingBtn.disabled = false;
  customTaskTitleInput.disabled = false;
  customTaskNotesInput.disabled = false;
  if (customTaskSubmitButton) {
    customTaskSubmitButton.disabled = false;
  }
}

function renderStageList() {
  stageListEl.innerHTML = '';

  stageData.forEach((stage) => {
    const counts = getStageCounts(stage.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'stage-button';
    if (stage.id === currentStageId) {
      button.classList.add('is-active');
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
    button.dataset.stageId = stage.id;
    button.innerHTML = `
      <span class="stage-button__info">
        <span class="stage-button__title">${stage.title}</span>
        <span class="stage-button__description">${stage.description}</span>
      </span>
      <span class="stage-button__meta">${counts.completed}/${counts.total}</span>
    `;
    button.addEventListener('click', () => setActiveStage(stage.id));
    stageListEl.appendChild(button);
  });
}

function renderTasks() {
  if (!currentStageId) {
    taskListEl.innerHTML = '';
    return;
  }

  const stage = stageData.find((item) => item.id === currentStageId);
  const stageState = ensureStageState(currentStageId);
  const allTasks = [
    ...stage.tasks.map((task) => ({ ...task, type: 'default' })),
    ...stageState.customTasks.map((task) => ({ ...task, type: 'custom' }))
  ];

  const filteredTasks = allTasks.filter((task) => {
    const normalizedTitle = task.title.toLowerCase();
    const normalizedDescription = (task.description || task.notes || '').toLowerCase();
    const matchesFilter = !filterTerm
      ? true
      : normalizedTitle.includes(filterTerm) || normalizedDescription.includes(filterTerm);

    const completed = isTaskCompleted(currentStageId, task);
    const matchesStatus = showOnlyPending ? !completed : true;

    return matchesFilter && matchesStatus;
  });

  taskListEl.innerHTML = '';

  if (!filteredTasks.length) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = filterTerm || showOnlyPending
      ? 'Nenhuma tarefa corresponde aos filtros aplicados.'
      : 'Ainda não existem tarefas nesta etapa. Adicione itens personalizados para começar.';
    taskListEl.appendChild(emptyState);
    return;
  }

  filteredTasks.forEach((task) => {
    const element = taskTemplate.content.firstElementChild.cloneNode(true);
    const checkbox = element.querySelector('input[type="checkbox"]');
    const titleEl = element.querySelector('.task-title');
    const metaEl = element.querySelector('.task-meta');
    const descriptionEl = element.querySelector('.task-description');
    const removeButton = element.querySelector('.task-remove');
    const detailsEl = element.querySelector('.task-details');
    const toggleButton = element.querySelector('.icon-button');

    element.dataset.taskId = task.id;
    element.dataset.taskType = task.type;

    const completed = isTaskCompleted(currentStageId, task);
    checkbox.checked = completed;
    element.dataset.completed = String(completed);

    titleEl.textContent = task.title;
    metaEl.textContent = task.type === 'custom' ? 'Tarefa personalizada' : task.meta || '';

    const hasDetails = task.type === 'custom' ? Boolean(task.notes) : Boolean(task.description);
    descriptionEl.textContent = task.type === 'custom' ? task.notes || 'Sem anotações adicionais.' : task.description;

    if (!hasDetails) {
      detailsEl.hidden = true;
      toggleButton.hidden = true;
    }

    checkbox.addEventListener('change', (event) => {
      setTaskCompletion(currentStageId, task, event.target.checked);
      element.dataset.completed = String(event.target.checked);
    });

    toggleButton.addEventListener('click', () => {
      const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
      toggleButton.setAttribute('aria-expanded', String(!expanded));
      detailsEl.hidden = expanded;
    });

    if (task.type === 'custom') {
      removeButton.addEventListener('click', () => removeCustomTask(currentStageId, task.id));
    } else {
      removeButton.hidden = true;
    }

    taskListEl.appendChild(element);
  });
}

function isTaskCompleted(stageId, task) {
  const stageState = ensureStageState(stageId);
  if (task.type === 'custom') {
    const custom = stageState.customTasks.find((item) => item.id === task.id);
    return custom ? Boolean(custom.completed) : false;
  }
  return Boolean(stageState.tasks[task.id]);
}

function setTaskCompletion(stageId, task, completed) {
  const stageState = ensureStageState(stageId);
  if (task.type === 'custom') {
    const customTask = stageState.customTasks.find((item) => item.id === task.id);
    if (customTask) {
      customTask.completed = completed;
    }
  } else {
    stageState.tasks[task.id] = completed;
  }
  saveState();
  renderStageList();
  updateStageProgress(stageId);
  updateOverallProgress();
}

function setStageCompletion(stageId, completed) {
  const stageState = ensureStageState(stageId);

  Object.keys(stageState.tasks).forEach((taskId) => {
    stageState.tasks[taskId] = completed;
  });

  stageState.customTasks.forEach((task) => {
    task.completed = completed;
  });

  saveState();
  renderStageList();
  renderTasks();
  updateStageProgress(stageId);
  updateOverallProgress();
}

function removeCustomTask(stageId, taskId) {
  const stageState = ensureStageState(stageId);
  stageState.customTasks = stageState.customTasks.filter((task) => task.id !== taskId);
  saveState();
  renderStageList();
  renderTasks();
  updateStageProgress(stageId);
  updateOverallProgress();
}

function getStageCounts(stageId) {
  const stage = stageData.find((item) => item.id === stageId);
  if (!stage) {
    return { completed: 0, total: 0 };
  }
  const stageState = ensureStageState(stageId);

  const defaultCompleted = stage.tasks.reduce((count, task) => {
    return count + (stageState.tasks[task.id] ? 1 : 0);
  }, 0);

  const customCompleted = stageState.customTasks.reduce((count, task) => {
    return count + (task.completed ? 1 : 0);
  }, 0);

  const total = stage.tasks.length + stageState.customTasks.length;
  const completed = defaultCompleted + customCompleted;

  return { completed, total };
}

function updateStageProgress(stageId) {
  const counts = getStageCounts(stageId);
  const total = counts.total;
  const completed = counts.completed;

  stageProgressSummaryEl.textContent = `${completed} de ${total} tarefas concluídas`;
  markCompleteBtn.disabled = total === 0 || completed === total;
  markPendingBtn.disabled = completed === 0;
}

function updateOverallProgress() {
  const aggregate = stageData.reduce(
    (accumulator, stage) => {
      const counts = getStageCounts(stage.id);
      accumulator.completed += counts.completed;
      accumulator.total += counts.total;
      return accumulator;
    },
    { completed: 0, total: 0 }
  );

  const percent = aggregate.total ? Math.round((aggregate.completed / aggregate.total) * 100) : 0;

  overallCompletedEl.textContent = String(aggregate.completed);
  overallTotalEl.textContent = String(aggregate.total);
  overallProgressFill.style.width = `${percent}%`;
  if (overallProgressBar) {
    overallProgressBar.setAttribute('aria-valuenow', String(percent));
    overallProgressBar.setAttribute('aria-valuetext', `${percent}% concluído`);
  }
}

function taskExists(stageId, taskId) {
  const stage = stageData.find((item) => item.id === stageId);
  if (!stage) return false;
  return stage.tasks.some((task) => task.id === taskId);
}
***EOF
