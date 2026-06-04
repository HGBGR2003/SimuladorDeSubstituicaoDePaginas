function clock(pages, nFrames) {
  const frames = new Array(nFrames).fill(null)
  const ref = new Array(nFrames).fill(0)
  let hand = 0
  const steps = []

  let hits = 0
  let faults = 0

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const idx = frames.indexOf(page);

    if (idx !== -1) {
      hits++;
      ref[idx] = 1;
      steps.push({
        page,
        frames: [...frames],
        hit: true,
        replaced: null,
        ref: [...ref],
        hand,
        explain: `Página ${page} presente em Q${idx + 1}. Bit de referência → 1. → HIT`,
      })

    } else {

      faults++
      const scanLog = []

      while (true) {
        if (ref[hand] === 0) {
          const replaced = frames[hand]
          const suffix =
            replaced !== null ? ` (era ${replaced})` : " (quadro vazio)";
          const explain = scanLog.length
            ? `Ponteiro em Q${hand + 1}${suffix}: bit=0 → substituída. Varreu: ${scanLog.join(", ")}.`
            : `Ponteiro em Q${hand + 1}${suffix}: bit=0 → substituída diretamente.`;
          frames[hand] = page;
          ref[hand] = 1;
          const savedHand = hand;
          hand = (hand + 1) % nFrames;
          steps.push({
            page,
            frames: [...frames],
            hit: false,
            replaced,
            ref: [...ref],
            hand: savedHand,
            explain,
          })

          break

        } else {
          scanLog.push(`Q${hand + 1}: bit 1→0`);
          ref[hand] = 0;
          hand = (hand + 1) % nFrames;
        }
      }
    }
  }
  return { steps, hits, faults, name: "Clock" };
}
