import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { geoDistance, geoOrthographic, geoPath } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
import worldData from 'world-atlas/countries-110m.json'
import { ArrowRight, Award, Blocks, Clock3, Headset, Layers, Mail, MapPin, Phone, UsersRound, Wrench } from 'lucide-react'
import type { CSSProperties } from 'react'
import deepseekLogo from './assets/orbit-image-4.png'
import dokployLogo from './assets/orbit-image-10.png'
import gitlabLogo from './assets/orbit-image-8.png'
import coolifyLogo from './assets/orbit-image-12.png'
import infinityLogo from './assets/orbit-image-7.png'
import n8nLogo from './assets/orbit-n8n-mark.png'
import openClawLogo from './assets/orbit-openclaw-mark.png'
import hostGlobe from './assets/host-globe.png'
import saudiRiyalSymbol from './assets/saudi-riyal-symbol.png'
import brandLogo from './assets/logo-rtl.png'

const topology = worldData as any
const countryFeatures = feature(topology, topology.objects.countries).features
const countryBorders = mesh(topology, topology.objects.countries, (a: any, b: any) => a !== b)

const features = [
  { icon: Blocks, title: 'الخدمــات التقنيـــة', text: 'من البناء إلى التشغيل — نطوّر تطبيقاتك المخصصة ونتولى إدارة خوادمك.', hoverDetails: ['تطوير تطبيقات مخصصة', 'إدارة الخوادم من البناء إلى التشغيل'] },
  { icon: Layers, title: 'البنيــة التحتيــة', text: 'خوادم Linux وWindows بإدارة كاملة، أو تتركها لنا — Shared Hosting وVPS وVDS وDedicated.', hoverDetails: ['Cloud VPS / VDS / Dedicated', 'Shared Hosting Linux وWindows', 'نسخ احتياطي وحماية', 'مراقبة استباقية', 'مساعد ذكي خاص — OpenClaw', 'أتمتة وتكاملات — n8n', 'نموذج لغة محلي — DeepSeek'] },
  { icon: Wrench, title: 'الأنظمة الجـــاهزة', text: 'منظومات جاهزة تُنصَّب داخل خادمك — مساعد ذكي، أتمتة، نموذج لغة خاص، أو سحابة ملفات.', hoverDetails: ['مساعد ذكي خاص — OpenClaw', 'أتمتة وتكاملات — n8n', 'نموذج لغة محلي — DeepSeek', 'سحابة ملفات'] },
]

const orbitItems = [
  { image: deepseekLogo, label: 'DeepSeek', diameter: '96%', phase: '0deg', style: 'deepseek' },
  { image: infinityLogo, label: 'شعار منصة الاستضافة', diameter: '96%', phase: '180deg', style: 'infinity' },
  { image: dokployLogo, label: 'Dokploy', diameter: '80%', phase: '45deg', style: 'dokploy' },
  { image: coolifyLogo, label: 'Coolify', diameter: '80%', phase: '315deg', style: 'coolify' },
  { image: openClawLogo, label: 'OpenClaw', diameter: '80%', phase: '135deg', style: 'openclaw' },
  { image: n8nLogo, label: 'n8n', diameter: '80%', phase: '225deg', style: 'n8n' },
  { image: gitlabLogo, label: 'GitLab', diameter: '44%', phase: '15deg', style: 'gitlab' },
]

const orbitDots = [
  { diameter: '96%', phase: '50deg' },
  { diameter: '96%', phase: '105deg' },
  { diameter: '96%', phase: '230deg' },
  { diameter: '80%', phase: '0deg' },
  { diameter: '80%', phase: '90deg' },
  { diameter: '80%', phase: '180deg' },
  { diameter: '80%', phase: '270deg' },
  { diameter: '60%', phase: '0deg' },
]

const plans = [
  { name: 'سحابة VDS', price: '100', unit: 'شهرياً', specs: ['4 أنوية معالجة', 'ذاكرة 24 جيجابايت', 'تخزين SSD بسعة 300 جيجابايت', 'منفذ بسرعة 600 ميجابت/ث'] },
  { name: 'سحابة VPS', price: '150', unit: 'شهرياً', featured: true, specs: ['4 أنوية معالجة', 'ذاكرة 8 جيجابايت', 'تخزين SSD بسعة 150 جيجابايت', 'منفذ بسرعة 300 ميجابت/ث'] },
  { name: 'خوادم مخصصة', price: '100', unit: 'شهرياً', specs: ['8 أنوية معالجة', 'ذاكرة 32 جيجابايت', 'تخزين SSD بسعة 500 جيجابايت', 'دعم فني على مدار الساعة'] },
]

const faqAnswer = 'سرعة المنفذ، مثل 1 جيجابت/ثانية، تحدد السرعة القصوى التي يمكن استخدامها لنقل البيانات من وإلى الخادم. وهي تشير بشكل أساسي إلى سرعة بطاقة الشبكة الموجودة في الخادم المخصص، أو الجزء الافتراضي منها في خوادم VPS وVDS.'

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let frame = 0
    let run = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        run += 1
        cancelAnimationFrame(frame)
        return
      }
      run += 1
      const thisRun = run
      cancelAnimationFrame(frame)
      setCurrent(0)
      const started = performance.now()
      const tick = (now: number) => {
        if (thisRun !== run) return
        const t = Math.min((now - started) / 1750, 1)
        setCurrent(Math.round(value * (1 - (1 - t) ** 4)))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    observer.observe(node)
    return () => { run += 1; cancelAnimationFrame(frame); observer.disconnect() }
  }, [value])
  return <span ref={ref}>{current}{suffix}</span>
}

function CoverageMap() {
  const [rotation, setRotation] = useState<[number, number]>([0, -26])
  const drag = useRef<{ x: number; y: number; rotation: [number, number] } | null>(null)
  const projection = geoOrthographic().scale(560).translate([640, 530]).rotate(rotation).clipAngle(91)
  const drawPath = geoPath(projection)
  const onDown = (e: PointerEvent<SVGSVGElement>) => { drag.current = { x: e.clientX, y: e.clientY, rotation }; e.currentTarget.setPointerCapture(e.pointerId) }
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return
    const bounds = e.currentTarget.getBoundingClientRect()
    const scale = 1280 / bounds.width
    setRotation([drag.current.rotation[0] + (e.clientX - drag.current.x) * scale * .18, Math.max(-75, Math.min(75, drag.current.rotation[1] - (e.clientY - drag.current.y) * scale * .12))])
  }
  const locations = [
    { point: [103.8, 1.3] as [number, number], label: 'سنغافورة' }, { point: [139.7, 35.7] as [number, number], label: 'اليابان' },
    { point: [13.4, 52.5] as [number, number], label: 'ألمانيا' }, { point: [-.1, 51.5] as [number, number], label: 'بريطانيا' },
    { point: [46.7, 24.7] as [number, number], label: 'السعودية' }, { point: [-74, 40.7] as [number, number], label: 'نيويورك' },
    { point: [-79.4, 43.7] as [number, number], label: 'كندا' }, { point: [-46.6, -23.5] as [number, number], label: 'البرازيل' },
    { point: [77.2, 28.6] as [number, number], label: 'الهند' },
  ]
  const center: [number, number] = [-rotation[0], -rotation[1]]
  return <div className="map-shell">
    <svg viewBox="0 0 1280 560" role="img" aria-label="خريطة تفاعلية لمواقع مراكز البيانات حول العالم" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
      <defs>
        <radialGradient id="ocean" cx="50%" cy="25%"><stop stopColor="#b8edf5"/><stop offset=".52" stopColor="#62c8db"/><stop offset="1" stopColor="#32a8c0"/></radialGradient>
        <clipPath id="globe"><path d="M40 530 A600 520 0 0 1 1240 530 Z" /></clipPath>
        <filter id="glow"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <path d="M40 530 A600 520 0 0 1 1240 530 Z" fill="#5dcbe1" opacity=".4" filter="url(#glow)" />
      <path d="M40 530 A600 520 0 0 1 1240 530 Z" fill="url(#ocean)" />
      <g clipPath="url(#globe)">
        <g fill="#d9f5f8" fillOpacity=".82" stroke="#86dce8" strokeWidth=".8">
          {countryFeatures.map((country: any, index: number) => <path key={index} d={drawPath(country) ?? ''} />)}
        </g>
        <path d={drawPath(countryBorders) ?? ''} fill="none" stroke="#62c9d9" strokeOpacity=".8" strokeWidth=".8" />
        {locations.map(({ point, label }) => {
          const position = geoDistance(point, center) < Math.PI / 2 ? projection(point) : null
          if (!position) return null
          const [x, y] = position
          return <g key={label} transform={`translate(${x} ${y})`}>
            <circle r="14" fill="#059cbb" opacity=".18" /><path d="M0-13c-7 0-12 5-12 12 0 9 12 22 12 22S12 8 12-1C12-8 7-13 0-13z" fill="#05a6c7" stroke="#fff" strokeWidth="2" /><circle cy="-1" r="4" fill="#e6fbff" />
            <g transform="translate(15 10)"><rect width="92" height="28" rx="8" fill="#fff" opacity=".96" /><text x="46" y="19" textAnchor="middle" fontSize="10" fill="#183044" direction="rtl">{label}</text><circle cx="80" cy="14" r="4" fill="#43d69b" /></g>
          </g>
        })}
      </g>
      <path d="M40 530 A600 520 0 0 1 1240 530" fill="none" stroke="#e5fbff" strokeOpacity=".7" strokeWidth="2" />
    </svg>
    <span className="map-hint">اسحب الخريطة لاستكشاف المواقع</span>
  </div>
}

export default function App() {
  const [openFaq, setOpenFaq] = useState(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const [planOffset, setPlanOffset] = useState(0)
  return <div dir="rtl" lang="ar" className="page">
    <header className="site-header">
      <a className="brand" href="#home" aria-label="الرئيسية"><span className="brand-word">logo</span><span className="brand-mark">L</span></a>
      <button className="menu-toggle" aria-label="فتح القائمة" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a className={activeNav === 'home' ? 'active' : undefined} aria-current={activeNav === 'home' ? 'page' : undefined} href="#home" onClick={() => { setActiveNav('home'); setMenuOpen(false) }}>الصفحة الرئيسية</a>
        <a className={activeNav === 'features' ? 'active' : undefined} aria-current={activeNav === 'features' ? 'page' : undefined} href="#features" onClick={() => { setActiveNav('features'); setMenuOpen(false) }}>مميزاتنــا</a>
        <a className={activeNav === 'pricing' ? 'active' : undefined} aria-current={activeNav === 'pricing' ? 'page' : undefined} href="#pricing" onClick={() => { setActiveNav('pricing'); setMenuOpen(false) }}>خدماتنــا</a>
        <a className={activeNav === 'faq' ? 'active' : undefined} aria-current={activeNav === 'faq' ? 'page' : undefined} href="#faq" onClick={() => { setActiveNav('faq'); setMenuOpen(false) }}>الاسئلــة الشائعــة</a>
        <a className={activeNav === 'coverage' ? 'active' : undefined} aria-current={activeNav === 'coverage' ? 'page' : undefined} href="#coverage" onClick={() => { setActiveNav('coverage'); setMenuOpen(false) }}>تغطيتنــا العالميــة</a>
      </nav>
      <div className="account-actions"><a href="#contact" className="login">سجل دخول</a><a href="#contact" className="signup">إنشاء حساب</a></div>
    </header>

    <main>
      <section id="home" className="hero-section">
        <div className="hero-copy">
          <h1>بنية تحتية قويـة..<br/><span>تدّعــم <b>نُمـــو التقنيــة</b></span></h1>
          <p>حلول تقنية متكاملة تجمع بين الاستضافة عالية الأداء، والبنية التحتية الرقمية، وتقنيات الذكاء الاصطناعي لدعم أعمالك بكفاءة واستمرارية.</p>
          <div className="hero-actions"><a className="gradient-button" href="#pricing">احجــــــز عرضــــــاً</a><a className="outline-button" href="#contact">تواصل معنــــــا</a></div>
        </div>
        <div className="orbit-scene" role="img" aria-label="رسم توضيحي لشبكة الاستضافة مع شعارات الأدوات التقنية">
          <div className="orbit-canvas" aria-hidden="true">
            <svg className="orbit-lines" viewBox="0 0 100 100" focusable="false">
              <circle cx="50" cy="50" r="48" fill="#5dcbe1" fillOpacity=".025" stroke="#5dcbe1" strokeOpacity=".2" strokeWidth=".45" />
              <circle cx="50" cy="50" r="40" fill="#5dcbe1" fillOpacity=".055" stroke="#5dcbe1" strokeOpacity=".22" strokeWidth=".35" />
              <circle cx="50" cy="50" r="30" fill="#5dcbe1" fillOpacity=".09" stroke="#5dcbe1" strokeOpacity=".48" strokeWidth=".35" />
              <circle cx="50" cy="50" r="22" fill="#5dcbe1" fillOpacity=".14" stroke="#5dcbe1" strokeOpacity=".8" strokeWidth=".35" />
            </svg>
            <div className="orbit-dot-layer">{orbitDots.map(({ diameter, phase }, index) => <span
              className="orbit-dot-track"
              key={index}
              style={{ '--orbit-diameter': diameter, '--orbit-phase': phase } as CSSProperties}
            ><span className="orbit-dot" /></span>)}</div>
            {orbitItems.map(({ image, label, diameter, phase, style }) => <div
              className="orbiting-element"
              key={label}
              style={{ '--orbit-diameter': diameter, '--orbit-phase': phase } as CSSProperties}
            >
              <span className="orbit-badge-anchor">
                <span className="orbit-badge-counter">
                  <span className={`orbit-badge badge-${style}`}><img src={image} alt={label} /></span>
                </span>
              </span>
            </div>)}
            <div className="host-core"><img src={hostGlobe} alt="HOST" /></div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="feature-grid">
          {features.map((f,i)=>{const Icon=f.icon;return <article className={`feature-card icon-${i}`} key={f.title} tabIndex={0} aria-label={f.title}>
            <span className="feature-icon"><Icon size={50} strokeWidth={1.5} aria-hidden="true" /></span><h3>{f.title}</h3><p>{f.text}</p>
            <div className="feature-card-hover"><ul>{f.hoverDetails.map(detail=><li key={detail}>{detail}</li>)}</ul><ArrowRight className="feature-card-arrow" size={30} aria-hidden="true" /></div>
          </article>})}
          <h2 className="feature-heading">مميزاتنــا <span>تصنـــع<br/>الفرق</span></h2>
        </div>
        <div className="marquee"><div className="marquee-track">{Array.from({length:4},(_,i)=><div className="marquee-group" key={i}><span>حلول تقنية تخلي شغلك أسهل</span><b>✦</b><span>بنيتك الرقمية علينا، ونموك عليك</span><b>✦</b><span>استضافة تواكب طموحك</span><b>✦</b></div>)}</div></div>
      </section>
      
      <section id="pricing" className="pricing-section">
        <h2 className="section-title"><span>استضافة</span> VPS والخــوادم المخصصـــــة</h2>
        <div className="carousel-controls"><button onClick={()=>setPlanOffset((planOffset+2)%3)} aria-label="السابق">‹</button><button onClick={()=>setPlanOffset((planOffset+1)%3)} aria-label="التالي">›</button></div>
        <div className="plan-row">{plans.map((_,i)=>plans[(i+planOffset)%plans.length]).map(plan=><article className={`plan-card ${plan.featured?'featured':''}`} key={plan.name}>
          {plan.featured&&<span className="plan-badge">خطة مميزة</span>}<h3>{plan.name}</h3><small>يبدأ من</small><div className="price"><b>{plan.price}</b><span><img className="currency-symbol" src={saudiRiyalSymbol} alt="ريال سعودي" /> / {plan.unit}</span></div><p className="plan-caption">السعر شامل قيمة الضريبة المضافة</p><ul>{plan.specs.map(s=><li key={s}><span>✓</span>{s}</li>)}</ul><a href="#contact" className="plan-cta">اختر خطة {plan.name.replace('سحابة ','')}</a>
        </article>)}</div>
      </section>

      <section id="coverage" className="coverage-section">
        <div className="plus-pattern"/>
        <h2 className="section-title"><span>9 مناطق و11 موقعاً بتغطية عالمية</span></h2><p className="coverage-subtitle">اختر موقعك لاستضافة خوادمك بالقرب من عملائك، واستمتع بأداء واستجابة فائقة أينما كانوا.</p>
        <CoverageMap />
        <div className="stats-grid"><article><span className="stat-icon"><UsersRound size={20} strokeWidth={1.8} aria-hidden="true" /></span><strong>+ <Counter value={500}/></strong><small>عميل مشترك في المنصة التقنية</small></article><article><span className="stat-icon"><Clock3 size={20} strokeWidth={1.8} aria-hidden="true" /></span><strong><Counter value={100} suffix="%"/></strong><small>وقت تشغيل المنصة</small></article><article><span className="stat-icon"><Headset size={20} strokeWidth={1.8} aria-hidden="true" /></span><strong>24/7</strong><small>الدعم الفني</small></article><article><span className="stat-icon"><Award size={20} strokeWidth={1.8} aria-hidden="true" /></span><strong>+ <Counter value={15}/></strong><small>سنـــــوات الخبـــــرة</small></article></div>
      </section>

      <section  id="faq" className="faq-section">
        <div className="faq-title"><h2>الأسئلــــــة<br/><span>الشائـعـــة؟</span></h2></div>
        <div className="faq-list">{Array.from({length:5},(_,i)=><article className={`faq-item ${openFaq===i?'expanded':''}`} key={i}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)} aria-expanded={openFaq===i}><span className="faq-symbol">{openFaq===i?'−':'+'}</span><span>ماذا تعني سرعة المنفذ (Port Speed) الموجودة في عروضكم؟</span></button>{openFaq===i&&<p>{faqAnswer}</p>}</article>)}</div>
      </section>
    </main>

    <footer id="contact" className="site-footer">
      <div className="footer-top"><a className="footer-brand" href="#home" aria-label="الرئيسية"><img src={brandLogo} alt="" /></a><div className="socials"><a href="#contact" aria-label="Facebook">f</a><a href="#contact" aria-label="Instagram">◎</a><a href="#contact" aria-label="LinkedIn">in</a></div></div>
      <div className="footer-columns"><div className="vision"><b>رؤية 2030</b><span>VISION</span></div><div><h3>المنتجات</h3><a href="#pricing">سحابي VPS</a><a href="#pricing">سحابي VDS</a><a href="#pricing">خوادم مخصصة</a><a href="#pricing">عروض الخوادم</a></div><div><h3>المنتجات</h3><a href="#pricing">سحابي VPS</a><a href="#pricing">سحابي VDS</a><a href="#pricing">خوادم مخصصة</a><a href="#pricing">عروض الخوادم</a></div><div><h3>الحلول</h3><a href="#features">الحماية من هجمات DDoS</a><a href="#features">مسارات CI/CD</a><a href="#features">استضافة عالية الأداء</a><a href="#features">استضافة تواكب طموحك</a></div><div><h3>المنتجات</h3><a href="#pricing">سحابي VPS</a><a href="#pricing">سحابي VDS</a><a href="#pricing">خوادم مخصصة</a><a href="#pricing">عروض الخوادم</a></div></div>
      <div className="footer-bottom"><span><Phone size={14} aria-hidden="true" /> +966 50 000 0000</span><span><Mail size={14} aria-hidden="true" /> example@gmail.com</span><span>جميع الحقوق محفوظة © 2026</span><span><MapPin size={14} aria-hidden="true" /> المملكة العربية السعودية، مكة المكرمة</span></div>
    </footer>
  </div>
}
