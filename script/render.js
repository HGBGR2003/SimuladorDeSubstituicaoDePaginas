function render() {
  const r = results[currentAlgo]
  const s = r.steps[currentStep]
  const pct = Math.round(((currentStep + 1) / totalSteps) * 100)

  const progFill = document.getElementById("progFill")
  progFill.style.width = pct + "%"
  progFill.parentElement.setAttribute("aria-valuenow", pct);

  document.getElementById("stepLbl").textContent =
    `${currentStep + 1} / ${totalSteps}`

  document.getElementById("btnFirst").disabled = currentStep === 0
  document.getElementById("btnPrev").disabled = currentStep === 0
  document.getElementById("btnNext").disabled = currentStep === totalSteps - 1
  document.getElementById("btnLast").disabled = currentStep === totalSteps - 1

  const hitsNow = r.steps.slice(0, currentStep + 1).filter((x) => x.hit).length
  const faultsNow = currentStep + 1 - hitsNow;
  const hitRate = Math.round((hitsNow / (currentStep + 1)) * 100)
  const isClock = currentAlgo === "clock"

  const chips = pages
    .map((pg, i) => {
      let cls = "chip";
      if (i < currentStep) cls += " past";
      else if (i === currentStep)
        cls += s.hit ? " current-hit" : " current-fault";
      return `<div class="${cls}">${pg}</div>`;
    })
    .join("")

  const frameBoxes = Array.from({ length: nFrames }, (_, j) => {
    const v = s.frames[j]
    const isEmpty = v === null || v === undefined
    let boxCls = "frame-box" + (isEmpty ? " empty" : "")

    if (!isEmpty && !s.hit) {
      const prev = currentStep > 0 ? r.steps[currentStep - 1].frames[j] : null;
      if (
        v === s.page &&
        (prev === null || prev === undefined || prev !== s.page)
      )
        boxCls = "frame-box new"
    }

    const ptrHtml =
      isClock && j === s.hand ? `<div class="clock-ptr">▲ ptr</div>` : ""
    const bitHtml =
      isClock && s.ref ? `<div class="ref-bit">ref=${s.ref[j]}</div>` : ""

    return `<div class="frame-slot">
      <div class="frame-name">Q${j + 1}</div>
      <div class="${boxCls}">${isEmpty ? "—" : v}</div>
      ${ptrHtml}${bitHtml}
    </div>`
  }).join("")

  const dots = r.steps
    .slice(0, currentStep + 1)
    .map(
      (x) =>
        `<span class="dot ${x.hit ? "dot-hit" : "dot-fault"}" title="${x.hit ? "HIT" : "FAULT"}: pág. ${x.page}"></span>`,
    )
    .join("")

  const frameHeaders = Array.from(
    { length: nFrames },
    (_, j) => `<th>Q${j + 1}</th>`,
  ).join("")

  const tableRows = r.steps
    .map((step, i) => {
      const isCurrentRow = i === currentStep;
      const rowCls = isCurrentRow
        ? step.hit
          ? "row-current-hit"
          : "row-current-fault"
        : i < currentStep
          ? "row-past"
          : ""

      const frameCells = Array.from({ length: nFrames }, (_, j) => {
        const v = step.frames[j]
        const isEmpty = v === null || v === undefined;
        let cellCls = ""
        if (!isEmpty && !step.hit && i > 0) {
          const prev = r.steps[i - 1].frames[j]
          if (prev !== v) cellCls = "cell-new"
        }
        return `<td class="${cellCls}">${isEmpty ? "—" : v}</td>`;
      }).join("")

      const resultCls = step.hit ? "tbl-hit" : "tbl-fault";
      const resultText = step.hit ? "HIT ✓" : "FAULT ✗";
      return `<tr class="${rowCls}" onclick="goStep(${i})" style="cursor:pointer">
      <td class="col-num">${i + 1}</td>
      <td class="col-page"><strong>${step.page}</strong></td>
      ${frameCells}
      <td class="${resultCls}">${resultText}</td>
    </tr>`
    })
    .join("")

  document.getElementById("content").innerHTML = `
    <article class="main-card">
      <p class="ref-label">String de referência</p>
      <div class="ref-row" role="list" aria-label="Páginas referenciadas">${chips}</div>

      <p class="frames-label">Quadros de memória</p>
      <div class="frames-row" role="list" aria-label="Estado dos quadros">${frameBoxes}</div>

      <p class="result-badge ${s.hit ? "badge-hit" : "badge-fault"}" aria-live="polite">
        ${s.hit ? "✓ HIT" : "✗ FAULT"} — página ${s.page}
      </p>
      <p class="explain">${s.explain}</p>
    </article>

    <section class="stats-row" aria-label="Estatísticas">
      <div class="stat-card">
        <p class="stat-lbl">Page Faults</p>
        <p class="stat-val">${faultsNow} <small>/ ${currentStep + 1}</small></p>
      </div>
      <div class="stat-card">
        <p class="stat-lbl">Page Hits</p>
        <p class="stat-val">${hitsNow} <small>/ ${currentStep + 1}</small></p>
      </div>
      <div class="stat-card">
        <p class="stat-lbl">Hit Rate</p>
        <p class="stat-val">${hitRate}<small>%</small></p>
      </div>
      <div class="stat-card stat-card--wide">
        <p class="stat-lbl">Histórico <span class="stat-legend">(verde = hit · vermelho = fault)</span></p>
        <div class="history-row" role="list" aria-label="Histórico de hits e faults">${dots}</div>
      </div>
    </section>

    <section class="full-table-wrap" aria-label="Todos os passos">
      <p class="full-table-title">
        Todos os passos <span class="tbl-hint">(clique numa linha para navegar)</span>
      </p>
      <table class="full-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Página</th>
            ${frameHeaders}
            <th scope="col">Resultado</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </section>
  `
}
