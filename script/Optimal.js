function optimal(pages, nFrames) {
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
        explain: `Página ${page} presente. → HIT`,
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
          explain: `Quadro livre. Página ${page} carregada.`,
        })

      } else {

        let farthest = -1,
            victimIdx = 0

        for (let j = 0; j < frames.length; j++) {
          const next = pages.indexOf(frames[j], i + 1);
          if (next === -1) {
            victimIdx = j
            break
          }

          if (next > farthest) {
            farthest = next;
            victimIdx = j
          }
        }

        const replaced = frames[victimIdx];
        const nextUse = pages.indexOf(replaced, i + 1)

        const explain =
          nextUse === -1
            ? `OPT: ${replaced} nunca mais será usada → vítima ideal.`
            : `OPT: ${replaced} será usada na posição ${nextUse + 1} (mais distante) → substituída.`
        
            frames[victimIdx] = page

        steps.push({
          page,
          frames: [...frames],
          hit: false,
          replaced,
          explain,
        })
      }
    }
  }
  return { steps, hits, faults, name: "OPT" }
}
