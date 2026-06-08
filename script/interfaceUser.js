const ALGOS = ['fifo', 'lru', 'opt', 'clock']
const NAMES = { fifo: 'FIFO', lru: 'LRU', opt: 'OPT', clock: 'Clock' }

let results     = {}
let currentAlgo = 'fifo'
let currentStep = 0
let totalSteps  = 0
let pages       = []
let nFrames     = 4
let playInterval = null

function 
init() {
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
  document.getElementById('refStr').value  = '7 0 1 2 0 3 0 4 2 3'
  document.getElementById('nFrames').value = '4'
  
init()
}

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

  stopPlay()
  document.getElementById('stepNav').removeAttribute('hidden')
  render()
}

function goStep(n) {
  stopPlay()
  currentStep = Math.max(0, Math.min(totalSteps - 1, n))
  render()
}

init()

function togglePlay() {
  if (playInterval) {
    stopPlay()
  } else {
    const btn = document.getElementById('btnPlay')
    btn.textContent = '⏸'
    btn.setAttribute('aria-label', 'Pausar reprodução')
    playInterval = setInterval(() => {
      if (currentStep >= totalSteps - 1) {
        stopPlay()
        return
      }
      goStep(currentStep + 1)
    }, 800)
  }
}

function stopPlay() {
  clearInterval(playInterval)
  playInterval = null
  const btn = document.getElementById('btnPlay')
  if (btn) {
    btn.textContent = '▶'
    btn.setAttribute('aria-label', 'Reproduzir automaticamente')
  }
}