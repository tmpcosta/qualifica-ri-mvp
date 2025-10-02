const state = {
  data: {},
  selected: new Set(),
  answers: new Map(),
};

const elements = {};
const nodeIds = new WeakMap();

function byId(id) {
  return document.getElementById(id);
}

function htmlToElement(markup) {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

function formatDateLabel() {
  const now = new Date();
  return now.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function setupElements() {
  elements.checklistChips = byId('checklist-chips');
  elements.formHost = byId('form-host');
  elements.noteOutput = byId('note-output');
  elements.selectionEmpty = byId('selection-empty');
  elements.counter = byId('selection-count');
  elements.generatedAt = byId('generated-at');
}

function setLoading(isLoading) {
  if (isLoading) {
    elements.formHost.innerHTML = '<p class="question__help">Carregando checklists…</p>';
  }
}

function initializeData(payload) {
  state.data = payload || {};
  const keys = Object.keys(state.data);
  if (keys.length && state.selected.size === 0) {
    state.selected.add(keys[0]);
  }
  renderChecklistChips();
  renderForm();
}

function loadData() {
  setLoading(true);

  if (window.__QUALIFICA_CHECKLISTS__) {
    initializeData(window.__QUALIFICA_CHECKLISTS__);
    return Promise.resolve();
  }

  return fetch('data/checklists.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Não foi possível carregar os checklists.');
      }
      return response.json();
    })
    .then((payload) => {
      initializeData(payload);
    })
    .catch((error) => {
      elements.formHost.innerHTML = `<p class="question__help" style="color: var(--danger);">${error.message}</p>`;
    });
}

function renderChecklistChips() {
  const keys = Object.keys(state.data);
  elements.checklistChips.innerHTML = '';
  if (!keys.length) {
    elements.checklistChips.textContent = 'Nenhum checklist disponível.';
    return;
  }

  keys.forEach((key) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = key;
    chip.setAttribute('data-key', key);
    chip.addEventListener('click', () => toggleChecklist(key));
    if (state.selected.has(key)) {
      chip.classList.add('chip--active');
    }
    elements.checklistChips.appendChild(chip);
  });

  updateSelectionMeta();
}

function toggleChecklist(key) {
  if (state.selected.has(key)) {
    state.selected.delete(key);
  } else {
    state.selected.add(key);
  }
  renderChecklistChips();
  renderForm();
}

function updateSelectionMeta() {
  const count = state.selected.size;
  elements.counter.textContent = count;
  elements.selectionEmpty.hidden = count !== 0;
}

function renderForm() {
  const host = elements.formHost;
  host.innerHTML = '';

  updateSelectionMeta();

  if (state.selected.size === 0) {
    host.appendChild(htmlToElement('<p class="question__help">Escolha um ou mais checklists acima para exibir as perguntas correspondentes.</p>'));
    return;
  }

  Array.from(state.selected).forEach((key) => {
    const definition = state.data[key];
    if (!definition) return;

    const block = document.createElement('section');
    block.className = 'form-block';
    block.setAttribute('data-checklist', key);

    const title = document.createElement('h3');
    title.className = 'form-block__title';
    title.textContent = `Checklist: ${definition.nome || key}`;
    block.appendChild(title);

    (definition.checklist || []).forEach((node) => {
      const rendered = renderNode(node, 0);
      if (rendered) block.appendChild(rendered);
    });

    host.appendChild(block);
  });
}

function nodeIdentifier(node) {
  if (!node) return '';
  if (node.indice) return node.indice;
  if (nodeIds.has(node)) return nodeIds.get(node);
  const fallback = node.pergunta
    ? `auto_${node.pergunta.slice(0, 24).replace(/\W+/g, '_')}`
    : `auto_${Math.random().toString(36).slice(2, 10)}`;
  nodeIds.set(node, fallback);
  return fallback;
}

function renderNode(node, depth) {
  const tipo = node.tipo || 'INPUT';
  const wrap = document.createElement('div');
  wrap.className = 'question';
  wrap.style.marginLeft = `${depth * 18}px`;
  wrap.dataset.type = tipo;

  if (tipo === 'LABEL') {
    const color = node.cor === 'warning' ? 'alert-card alert-card--warning' : 'alert-card';
    const card = document.createElement('div');
    card.className = color;
    card.innerHTML = node.mensagem || node.pergunta || '';
    wrap.appendChild(card);
    if (node.condicoes && node.condicoes.length) {
      const nested = document.createElement('div');
      nested.className = 'nested';
      wrap.appendChild(nested);
      updateNested(nested, node, depth, nodeIdentifier(node));
    }
    return wrap;
  }

  const indice = nodeIdentifier(node);
  if (!state.answers.has(indice)) {
    state.answers.set(indice, '');
  }

  if (node.pergunta) {
    const label = document.createElement('label');
    label.className = 'question__label';
    label.textContent = node.pergunta;
    label.htmlFor = indice;
    wrap.appendChild(label);
  }

  const field = document.createElement('div');
  field.className = 'question__field';
  wrap.appendChild(field);

  const currentValue = state.answers.get(indice) ?? '';
  const nestedContainer = document.createElement('div');
  nestedContainer.className = 'nested';

  const setAnswer = (value) => {
    state.answers.set(indice, value);
    updateNested(nestedContainer, node, depth, indice);
  };

  if (tipo === 'BOOLEAN') {
    const radios = document.createElement('div');
    radios.className = 'radio-group';
    const yesId = `${indice}_sim`;
    const noId = `${indice}_nao`;
    radios.innerHTML = `
      <label><input type="radio" name="${indice}" value="Sim" id="${yesId}"> Sim</label>
      <label><input type="radio" name="${indice}" value="Não" id="${noId}"> Não</label>
    `;
    field.appendChild(radios);
    radios.querySelectorAll('input').forEach((input) => {
      input.addEventListener('change', (event) => setAnswer(event.target.value));
    });
    if (currentValue === 'Sim') radios.querySelector(`#${yesId}`).checked = true;
    if (currentValue === 'Não') radios.querySelector(`#${noId}`).checked = true;
  } else if (tipo === 'SELECT') {
    const select = document.createElement('select');
    select.className = 'select';
    select.id = indice;
    select.innerHTML = '<option value="">— selecione —</option>';
    const values = new Set();
    (node.condicoes || []).forEach((cond) => {
      if (!values.has(cond.valor)) {
        const option = document.createElement('option');
        option.value = cond.valor;
        option.textContent = cond.valor || '—';
        values.add(cond.valor);
        select.appendChild(option);
      }
    });
    select.value = currentValue || '';
    select.addEventListener('change', (event) => setAnswer(event.target.value));
    field.appendChild(select);
  } else if (tipo === 'EDITOR') {
    const textarea = document.createElement('textarea');
    textarea.className = 'textarea';
    textarea.id = indice;
    textarea.value = currentValue || '';
    textarea.rows = 5;
    textarea.placeholder = 'Descreva os detalhes relevantes…';
    textarea.addEventListener('input', (event) => setAnswer(event.target.value));
    field.appendChild(textarea);
  } else if (tipo === 'GROUP') {
    const note = document.createElement('div');
    note.className = 'question__help';
    note.textContent = node.pergunta || 'Preencha as informações referentes ao grupo abaixo.';
    field.appendChild(note);
  } else {
    const input = document.createElement('input');
    input.className = 'input';
    input.id = indice;
    input.value = currentValue || '';
    if (tipo === 'DATE') input.type = 'date';
    else if (tipo === 'NUMBER') input.type = 'number';
    else if (tipo === 'CURRENCY') input.inputMode = 'decimal';
    else input.type = 'text';
    input.placeholder = tipo === 'VINCULO' ? 'Informe o ato ou referência vinculada…' : 'Digite aqui';
    input.addEventListener('input', (event) => setAnswer(event.target.value));
    field.appendChild(input);
  }

  if (node.ajuda) {
    const help = document.createElement('div');
    help.className = 'question__help';
    help.innerHTML = node.ajuda;
    field.appendChild(help);
  }

  wrap.appendChild(nestedContainer);
  updateNested(nestedContainer, node, depth, indice);

  return wrap;
}

function updateNested(container, node, depth, indiceOverride) {
  container.innerHTML = '';
  const condicoes = node.condicoes || [];
  if (!condicoes.length) return;

  const indice = indiceOverride || nodeIdentifier(node);
  const value = state.answers.get(indice);

  const match = condicoes.find((cond) => cond.valor === value || (cond.valor === '' && (value === '' || value === undefined)));
  if (!match) return;

  (match.requisitos || []).forEach((child) => {
    const rendered = renderNode(child, depth + 1);
    if (rendered) container.appendChild(rendered);
  });
}

function traverseNodeForNote(node, output) {
  const indice = node.indice || '';
  const value = state.answers.get(indice);

  if (node.condicoes) {
    node.condicoes.forEach((cond) => {
      if (value === cond.valor) {
        if (cond.exigencia) {
          output.push(cond.exigencia);
        }
        (cond.requisitos || []).forEach((child) => traverseNodeForNote(child, output));
      }
    });
  }

  (node.requisitos || []).forEach((child) => traverseNodeForNote(child, output));
}

function generateNote() {
  const stripFormatting = byId('option-strip').checked;
  const justifyParagraphs = byId('option-justify').checked;
  const selection = Array.from(state.selected);
  const chunks = [];

  selection.forEach((key) => {
    const definition = state.data[key];
    if (!definition) return;
    (definition.checklist || []).forEach((node) => traverseNodeForNote(node, chunks));
  });

  let html = chunks.join('\n');
  if (!html.trim()) {
    html = '<p>Nenhuma exigência foi gerada para as respostas fornecidas.</p>';
  }

  if (stripFormatting) {
    html = html.replace(/<\/?strong>/gi, '').replace(/<\/?em>/gi, '');
  }

  if (justifyParagraphs) {
    html = html.replace(/<p(?![^>]*text-align)/gi, '<p style="text-align: justify;"');
  }

  elements.noteOutput.innerHTML = html;
  elements.generatedAt.textContent = formatDateLabel();
}

function copyNote() {
  const selection = window.getSelection();
  selection.removeAllRanges();
  const range = document.createRange();
  range.selectNodeContents(elements.noteOutput);
  selection.addRange(range);
  try {
    document.execCommand('copy');
    selection.removeAllRanges();
    alert('Conteúdo copiado para a área de transferência.');
  } catch (error) {
    alert('Não foi possível copiar automaticamente. Selecione e copie manualmente.');
  }
}

function downloadAsHTML() {
  const content = elements.noteOutput.innerHTML;
  const blob = new Blob([
    `<!DOCTYPE html><html lang="pt-br"><head><meta charset="utf-8"><title>Nota Devolutiva</title></head><body>${content}</body></html>`,
  ], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'nota-devolutiva.html';
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadAnswers() {
  const obj = Object.fromEntries(state.answers.entries());
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'respostas.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

function resetPreview() {
  elements.noteOutput.innerHTML = '<p>Selecione ao menos um checklist, responda às perguntas necessárias e clique em “Gerar Nota”.</p>';
}

document.addEventListener('DOMContentLoaded', () => {
  setupElements();
  resetPreview();
  loadData();
  byId('action-generate').addEventListener('click', generateNote);
  byId('action-copy').addEventListener('click', copyNote);
  byId('action-export-html').addEventListener('click', downloadAsHTML);
  byId('action-export-json').addEventListener('click', downloadAnswers);
});
