import Loader from './Loader'
import { Fragment, useEffect, useRef, useState } from 'react'
import { site, socials, nav, hero, manifesto, about, stack, stories } from './data'

const W = 'mx-auto w-full max-w-[1100px] px-6'

/* ---------- Ikon ---------- */
const P = {
  mail: <><rect x="2" y="4" width="20" height="16" /><path d="m2 5 10 8 10-8" /></>,
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  clock: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4M9 2h6" /></>,
  github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  instagram: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  down: <path d="M4 4h10v15m-5-5 5 5 5-5" />,
  arrow: <path d="M3 12h18m-6-6 6 6-6 6" />,
  play: <path d="M7 4.5v15l13-7.5z" />,
}
const Icon = ({ n, className = '' }) => (
  <svg className={`i ${className}`} viewBox="0 0 24 24" aria-hidden="true">{P[n]}</svg>
)


/* ---------- Kursor bulat kecil ---------- */
function Cursor() {
  const ref = useRef()
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return
    document.body.classList.add('cur')
    const c = ref.current
    let x = 0, y = 0, tx = 0, ty = 0, id
    const move = (e) => { tx = e.clientX; ty = e.clientY; c.style.opacity = 1 }
    const over = (e) => c.classList.toggle('big', !!e.target.closest('a,button,.chip,.photo'))
    const loop = () => {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22
      c.style.transform = `translate(${x}px,${y}px)`
      id = requestAnimationFrame(loop)
    }
    addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    loop()
    return () => {
      removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      cancelAnimationFrame(id)
      document.body.classList.remove('cur')
    }
  }, [])
  return <div id="c" ref={ref}><i /></div>
}

/* ---------- Navbar ---------- */
function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header>
        <div className="flex h-16 w-full items-center justify-between px-4 md:px-8">
          <a href="#top" className="logo">{site.name}</a>
          <nav className="links">
            {nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
          <button className={`burger${open ? ' open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <i /><i />
          </button>
        </div>
      </header>
      <div className={`menu${open ? ' open' : ''}`}>
        {nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      </div>
    </>
  )
}

/* ---------- Hero ---------- */
function Hero() {
  const ref = useRef()
  useEffect(() => {
    const letters = [...ref.current.querySelectorAll('b')]
    const prox = (x, y) => letters.forEach((b) => {
      const r = b.getBoundingClientRect()
      const f = 1 - Math.min(1, Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) / 150)
      b.style.fontWeight = 600 + Math.round(f * 200)
      b.style.transform = f > 0.02 ? `translateY(${-f * 0.06}em)` : ''
    })
    const mm = (e) => prox(e.clientX, e.clientY)
    const tm = (e) => prox(e.touches[0].clientX, e.touches[0].clientY)
    addEventListener('mousemove', mm)
    addEventListener('touchmove', tm, { passive: true })
    return () => { removeEventListener('mousemove', mm); removeEventListener('touchmove', tm) }
  }, [])
  let k = 0
  return (
    <section className="hero">
      <div className={W}>
        <h1 ref={ref}>
          {hero.title.split(' ').map((word, wi) => (
            <Fragment key={wi}>
              <span className="w">
                {[...word].map((c, ci) => <span key={ci} className="l" style={{ '--i': k++ }}><b>{c}</b></span>)}
              </span>{' '}
            </Fragment>
          ))}
        </h1>
        <p className="sub">{hero.sub}</p>
      </div>
    </section>
  )
}

/* ---------- Manifesto: kata menghitam saat di-scroll ---------- */
function Manifesto() {
  const ref = useRef()
  const words = manifesto.split(' ')
  const [n, setN] = useState(0)
  useEffect(() => {
    const sc = () => {
      const r = ref.current.getBoundingClientRect(), vh = innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3)))
      setN(Math.round(p * words.length))
    }
    sc()
    addEventListener('scroll', sc, { passive: true })
    addEventListener('resize', sc)
    return () => { removeEventListener('scroll', sc); removeEventListener('resize', sc) }
  }, [words.length])
  return (
    <section id="manifesto">
      <div className={W}>
        <p className="man" ref={ref}>
          {words.map((w, i) => <span key={i} className={i < n ? 'on' : ''}>{w + ' '}</span>)}
        </p>
      </div>
    </section>
  )
}

/* ---------- About me ---------- */
function About() {
  return (
    <section id="about">
      <div className={W}>
        <h2>About me</h2>
        <div className="grid items-center gap-9 md:grid-cols-[5fr_6fr] md:gap-16">
          <div className="photo max-w-[340px] md:max-w-none"><img src={site.photo} alt={site.name} /></div>
          <div>
            <p className="about-p">{about.text}</p>
            <div className="mt-9">
              {about.facts.map(([k, v]) => <div className="fact" key={k}><span>{k}</span>{v}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Tech stack ---------- */
function Stack() {
  return (
    <section id="stack">
      <div className={W}>
        <h2>Tech stack</h2>
        {stack.map(([group, items]) => (
          <div className="grp grid gap-4 md:grid-cols-[200px_1fr]" key={group}>
            <h3>{group}</h3>
            <div className="flex flex-wrap gap-2.5">{items.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Stories (project) ---------- */
function Stories() {
  return (
    <section id="stories">
      <div className={W}>
        <h2>Stories</h2>
        <p className="lead">This is section for my project stories.</p>
        {stories.map((s) => (
          <a className="story" href={s.href} key={s.title}>
            <h3>{s.title}</h3><em>{s.tag}</em><p>{s.desc}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ---------- Contact ---------- */
function Contact() {
  const [st, setSt] = useState('idle')
  const label = { idle: 'Send', sending: 'Sending', sent: 'Thank you', error: 'Try again' }[st]

  // Form dikirim lewat Web3Forms (gratis). Access key diisi di data.js
  const submit = async (e) => {
    e.preventDefault()
    const form = e.target
    setSt('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: site.formKey, ...Object.fromEntries(new FormData(form)) }),
      })
      if (!(await res.json()).success) throw new Error('failed')
      setSt('sent')
      form.reset()
    } catch {
      setSt('error')
    }
    setTimeout(() => setSt('idle'), 3000)
  }

  const left = [['mail', site.email, `mailto:${site.email}`], ['phone', site.phone, `tel:${site.phone.replace(/\s/g, '')}`], ['clock', '24 hours']]
  const right = [['github', 'GitHub', socials.github], ['linkedin', 'LinkedIn', socials.linkedin], ['instagram', 'Instagram', socials.instagram]]
  const rows = [0, 1, 2].flatMap((i) => [left[i], right[i]])

  return (
    <section id="contact">
      <div className={W}>
        <h2>Let's build something together.</h2>
        <div className="ch">Get in touch your way <Icon n="down" /></div>
        <div className="mt-11 grid max-w-[720px] gap-x-20 gap-y-4 md:ml-[clamp(0px,12vw,130px)] md:grid-cols-2">
          {rows.map(([icon, text, href]) => href
            ? <a className="it" href={href} key={text}><Icon n={icon} />{text}</a>
            : <div className="it" key={text}><Icon n={icon} />{text}</div>)}
        </div>
        <div className="ch mt-14 md:mt-20 md:justify-end">
          <Icon n="down" className="-scale-x-100" /><s>or the right way</s> or my way
        </div>
        <form className="form mt-14 grid gap-9 md:grid-cols-2 md:gap-x-12" onSubmit={submit}>
          <input name="name" placeholder="NAME" aria-label="Name" required />
          <input name="organization" placeholder="ORGANIZATION" aria-label="Organization" />
          <input name="email" type="email" placeholder="EMAIL" aria-label="Email" required />
          <textarea name="message" rows={1} placeholder="MESSAGE" aria-label="Message" required />
          <button className="send" type="submit" disabled={st === 'sending'}>
            <span>{label}</span><Icon n="arrow" />
          </button>
        </form>
      </div>
    </section>
  )
}

/* ---------- Tombol musik ---------- */
function Music() {
  const audio = useRef()
  const [on, setOn] = useState(false)
  const toggle = () => {
    if (on) { audio.current.pause(); setOn(false) }
    else audio.current.play().then(() => setOn(true)).catch(() => setOn(false))
  }
  return (
    <>
      <audio ref={audio} src={site.music} loop preload="none" />
      <button className={`mus${on ? ' on' : ''}`} onClick={toggle} aria-label="Play or pause music">
        <Icon n="play" className="pl" />
        <span className="eq"><i /><i /><i /></span>
      </button>
    </>
  )
}

export default function App() {
  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <main id="top">
        <Hero />
        <Manifesto />
        <About />
        <Stack />
        <Stories />
        <Contact />
      </main>
      <footer>
        <div className={`${W} flex flex-wrap justify-between gap-4`}>
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>Built with React, Vite and Tailwind</span>
          <a href="#top">Back to top</a>
        </div>
      </footer>
      <Music />
    </>
  )
}
