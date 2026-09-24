import { useEffect, useState } from 'react'
import { site } from './data'

const WORDS = ['Portfolio', site.name]
// Titik progres (waktu 0-1 -> persen), tersendat supaya terasa seperti loading asli
const PTS = [[0, 0], [0.12, 14], [0.3, 38], [0.42, 44], [0.62, 79], [0.8, 91], [0.92, 96], [1, 100]]
const DUR = 3200 // GANTI: durasi minimal loader (milidetik)

const at = (t) => {
  for (let i = 1; i < PTS.length; i++) {
    const [a, x] = PTS[i - 1], [b, y] = PTS[i]
    if (t <= b) return x + ((y - x) * (t - a)) / (b - a)
  }
  return 100
}

export default function Loader() {
  const [p, setP] = useState(0)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // Tahan di 96% sampai font dan foto benar-benar selesai dimuat
    let ready = false
    const img = new Image()
    img.src = site.photo
    Promise.all([document.fonts.ready, img.decode().catch(() => {})]).then(() => { ready = true })

    const timers = []
    const t0 = performance.now()
    let id
    const tick = (now) => {
      let v = at(Math.min(1, (now - t0) / DUR))
      if (!ready) v = Math.min(v, 96)
      setP(v)
      if (v < 100) id = requestAnimationFrame(tick)
      else {
        timers.push(setTimeout(() => { setOut(true); document.body.classList.remove('loading') }, 450))
        timers.push(setTimeout(() => setGone(true), 1400))
      }
    }
    id = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(id); timers.forEach(clearTimeout) }
  }, [])

  if (gone) return null
  const chars = WORDS.flatMap((w, l) => [...w].map((c) => ({ c, l })))
  const k = Math.round((p / 100) * chars.length)

  return (
    <div className={`loader${out ? ' out' : ''}`}>
      <div>
        <div className="ltag">Loading</div>
        <div className="ltitle">
          {WORDS.map((_, l) => (
            <div key={l}>
              {chars.map((x, i) => x.l === l && <span key={i} className={i < k ? 'on' : ''}>{x.c}</span>)}
            </div>
          ))}
        </div>
      </div>
      <div className="lfoot">
        <div className="ltag">{site.tagline}</div>
        <div className="lnum">{Math.floor(p)}<small>%</small></div>
      </div>
      <div className="lbar"><i style={{ width: `${p}%` }} /></div>
    </div>
  )
}