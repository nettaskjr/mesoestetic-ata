
async function fetchData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load data sets');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('dashboard').innerHTML = `<div class="error">Erro ao carregar dados: ${error.message}</div>`;
    return null;
  }
}

function renderHeader(headerData, title) {
  // Update document title
  document.title = title;

  // Render Header Info
  const headerHtml = `
    <div class="card header-card fade-in">
      <h1>${title}</h1>
      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Data</span>
          <span class="meta-value">${headerData.data}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Participantes</span>
          <span class="meta-value">${headerData.participantes.join(', ')}</span>
        </div>
         <div class="meta-item full-width">
          <span class="meta-label">Pauta</span>
          <span class="meta-value">${headerData.pauta}</span>
        </div>
      </div>
    </div>
  `;
  return headerHtml;
}

function renderList(title, items, icon = '•') {
  if (!items || items.length === 0) return '';
  return `
    <section class="card fade-in">
      <h2>${title}</h2>
      <ul class="styled-list">
        ${items.map(item => `<li><span class="list-icon">${icon}</span> ${item}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderDiscussions(discussions) {
  if (!discussions || discussions.length === 0) return '';

  const itemsHtml = discussions.map(disc => {
    let detailsHtml = '';

    // Handle 'pontos_chave' dictionary
    if (disc.pontos_chave) {
      detailsHtml += `<div class="key-points">
        ${Object.entries(disc.pontos_chave).map(([key, val]) => `
          <div class="key-point-item">
            <strong>${key.replace(/_/g, ' ')}:</strong> ${val}
          </div>
        `).join('')}
      </div>`;
    }

    // Handle 'cronograma' array
    if (disc.cronograma) {
      detailsHtml += `<div class="timeline-container">
        ${disc.cronograma.map(c => `
          <div class="timeline-item">
            <div class="timeline-date">${c.mes}</div>
            <div class="timeline-content">
              <strong>${c.foco}</strong>
              <p>${c.produtos}</p>
            </div>
          </div>
        `).join('')}
      </div>`;
    }

    // Handle simple fields
    if (disc.decisao) detailsHtml += `<p class="discussion-meta"><strong>Decisão:</strong> ${disc.decisao}</p>`;
    if (disc.motivo) detailsHtml += `<p class="discussion-meta"><strong>Motivo:</strong> ${disc.motivo}</p>`;
    if (disc.conclusao) detailsHtml += `<p class="discussion-conclusion"><strong>Conclusão:</strong> ${disc.conclusao}</p>`;

    return `
      <div class="discussion-item">
        <h3>${disc.topico}</h3>
        <p class="context">${disc.contexto}</p>
        ${detailsHtml}
      </div>
    `;
  }).join('');

  return `
    <section class="card fade-in">
      <h2>Discussões Principais</h2>
      <div class="discussions-grid">
        ${itemsHtml}
      </div>
    </section>
  `;
}

function renderActionPlan(actions) {
  if (!actions || actions.length === 0) return '';

  return `
    <section class="card full-width fade-in">
      <h2>Plano de Ação</h2>
      <div class="table-responsive">
        <table class="action-table">
          <thead>
            <tr>
              <th>Responsável</th>
              <th>Tarefa</th>
              <th>Entregáveis</th>
              <th>Prazo</th>
            </tr>
          </thead>
          <tbody>
            ${actions.map(action => `
              <tr>
                <td class="td-resp">${action.responsavel}</td>
                <td class="td-task">${action.tarefa}</td>
                <td class="td-deliv">
                  ${action.entregaveis && action.entregaveis.length ?
      `<ul>${action.entregaveis.map(e => `<li>${e}</li>`).join('')}</ul>` :
      '-'}
                </td>
                <td class="td-deadline">${action.prazo}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

async function init() {
  const dataWrapper = await fetchData();
  if (!dataWrapper || !dataWrapper.ata_reuniao) return;

  const ata = dataWrapper.ata_reuniao;
  const container = document.getElementById('dashboard');

  let html = '';

  // 1. Header
  html += renderHeader(ata.cabecalho, ata.titulo);

  // 2. Resumo Executivo
  html += renderList('Resumo Executivo', ata.resumo_executivo);

  // 3. Discussões
  html += renderDiscussions(ata.discussoes_principais);

  // 4. Decisões Tomadas
  html += renderList('Decisões Tomadas', ata.decisoes_tomadas, '✓');

  // 5. Plano de Ação
  html += renderActionPlan(ata.plano_de_acao);

  // 6. Próximos Passos
  html += renderList('Próximos Passos', ata.proximos_passos, '→');

  container.innerHTML = html;
}

init();
