function leastRecently (pages, nFrames) {
    const frames = [] 
    const steps = []
    let hits = 0
    let faults = 0

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i]

        if (frames.includes(page)) {
            hits++
            const idx = frames.indexOf(page);
            frames.splice(idx, 1)
            frames.push(page)
            steps.push({
                page, frames: [...frames], hit: true, replaced: null,
                explain: `Página ${page} encontrada. Movida para posição mais recente. → HIT`
            })
            
        } else {
            faults++
            if (frames.length < nFrames) {
                frames.push(page);
                steps.push({
                    page, frames: [...frames], hit: false, replaced: null,
                    explain: `Quadro livre. Página ${page} inserida como mais recente.`
                })
            } else {
                const replaced = frames.shift()
                frames.push(page)
                steps.push({
                    page, frames: [...frames], hit: false, replaced,
                    explain: `LRU remove a menos usada recentemente (${replaced}), carrega ${page}.`
                })
            }
        }
    }
    return { steps, hits, faults, name: 'LRU' }
}