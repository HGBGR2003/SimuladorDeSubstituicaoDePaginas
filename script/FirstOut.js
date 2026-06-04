function fifo(pages, nFrames) {
  const frames = []
  const steps = []
  let hits = 0
  let faults = 0

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]

    if (frames.includes(page)) {
      hits++;
      steps.push({
        page,
        frames: [...frames],
        hit: true,
        replaced: null,
        explain: `Página ${page} já está nos quadros. → HIT`,
      })

    } else {

      faults++

      if (frames.length < nFrames) {
        frames.push(page);
        steps.push({
          page,
          frames: [...frames],
          hit: false,
          replaced: null,
          explain: `Quadro livre disponível. Página ${page} carregada.`,
        })

      } else {
        const replaced = frames.shift();
        frames.push(page);
        steps.push({
          page,
          frames: [...frames],
          hit: false,
          replaced,
          explain: `FIFO remove a mais antiga (${replaced}), carrega página ${page}.`,
        })
      }
    }
  }
  return { steps, hits, faults, name: "FIFO" };
}
