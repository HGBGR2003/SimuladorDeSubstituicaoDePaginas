// ── ESTADO GLOBAL ─────────────────────────────────────────────────────────────
const ALGOS = ['fifo', 'lru', 'opt', 'clock']
const NAMES = { fifo: 'FIFO', lru: 'LRU', opt: 'OPT', clock: 'Clock' }

let results     = {}
let currentAlgo = 'fifo'
let currentStep = 0
let totalSteps  = 0
let pages       = []
let nFrames     = 3

// ── INICIALIZAÇÃO ─────────────────────────────────────────────────────────────
function init() {
  const str = document.getElementById('refStr').value.trim()
  nFrames   = parseInt(document.getElementById('nFrames').value) || 3
  pages     = str.split(/\s+/).map(Number).filter(n => !isNaN(n))
  if (!pages.length) return

  results = {
    fifo:  fifo(pages, nFrames),
    lru:   leastRecently(pages, nFrames),
    opt:   optimal(pages, nFrames),
    clock: clock(pages, nFrames),
  }

  buildTabs()
  setAlgo('fifo')
}

function loadExample() {
  document.getElementById('refStr').value  = '7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1'
  document.getElementById('nFrames').value = '3'
  init()
}

// ── ABAS ──────────────────────────────────────────────────────────────────────
function buildTabs() {
  const nav = document.getElementById('algoTabs')
  nav.innerHTML = ''

  const list = document.createElement('ul')
  list.setAttribute('role', 'tablist')
  list.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;list-style:none'

  ALGOS.forEach(a => {
    const li = document.createElement('li')
    li.setAttribute('role', 'presentation')

    const btn = document.createElement('button')
    btn.className   = 'tab'
    btn.textContent = NAMES[a]
    btn.id          = 'tab-' + a
    btn.setAttribute('role', 'tab')
    btn.setAttribute('aria-selected', 'false')
    btn.setAttribute('aria-controls', 'content')
    btn.onclick = () => setAlgo(a)

    li.appendChild(btn)
    list.appendChild(li)
  })

  nav.appendChild(list)
}

// ── SELEÇÃO DE ALGORITMO ──────────────────────────────────────────────────────
function setAlgo(a) {
  currentAlgo = a
  currentStep = 0
  totalSteps  = results[a].steps.length

  ALGOS.forEach(x => {
    const b = document.getElementById('tab-' + x)
    if (!b) return
    const isActive = x === a
    b.className = 'tab' + (isActive ? ' active' : '')
    b.setAttribute('aria-selected', String(isActive))
  })

  document.getElementById('stepNav').removeAttribute('hidden')
  render()
}

// ── NAVEGAÇÃO ─────────────────────────────────────────────────────────────────
function goStep(n) {
  currentStep = Math.max(0, Math.min(totalSteps - 1, n))
  render()
}

init()