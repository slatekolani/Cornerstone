import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import '../css/app.css';

/* ─── Scroll reveal hook ─── */
function useReveal() {
    useEffect(() => {
        const els = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.12 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef();
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let start = 0;
                const step = target / (duration / 16);
                const timer = setInterval(() => {
                    start = Math.min(start + step, target);
                    setCount(Math.floor(start));
                    if (start >= target) clearInterval(timer);
                }, 16);
                obs.disconnect();
            }
        }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target]);
    return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Navbar ─── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        const onResize = () => { setIsMobile(window.innerWidth < 768); };
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize);
        return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
    }, []);

    const links = ['About', 'Programs', 'Admissions', 'Alumni', 'Contact'];
    const hasBg = scrolled || menuOpen;
    const close = () => setMenuOpen(false);

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'background 0.4s, box-shadow 0.4s', background: hasBg ? 'rgba(13,43,110,0.97)' : 'transparent', backdropFilter: hasBg ? 'blur(12px)' : 'none', boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none' }}>
            {/* Top bar */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: scrolled ? '10px 24px' : '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'padding 0.4s' }}>
                <a href="#home" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <img src="/Logo/CLA_Tanzania_logo_color.gif" alt="CLA Tanzania Logo" style={{ height: 48, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' }} />
                    <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff', fontSize: 13, lineHeight: 1.2 }}>Cornerstone Leadership</div>
                        <div style={{ color: '#e8d5a8', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Academy Tanzania</div>
                    </div>
                </a>

                {/* Desktop links */}
                {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                        {links.map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = '#e8d5a8'}
                                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}>{l}</a>
                        ))}
                        <a href="#admissions" className="btn-primary" style={{ background: 'linear-gradient(135deg, #d4b87a, #e8d5a8)', color: '#0d2b6e', fontWeight: 700, padding: '10px 22px', borderRadius: 999, fontSize: 14, textDecoration: 'none', transition: 'all 0.3s' }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 25px rgba(232,213,168,0.4)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>Apply Now</a>
                    </div>
                )}

                {/* Hamburger button */}
                {isMobile && (
                    <button onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
                        <span style={{ display: 'block', width: 24, height: 2, background: '#fff', borderRadius: 2, transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
                        <span style={{ display: 'block', width: 24, height: 2, background: '#fff', borderRadius: 2, transition: 'opacity 0.3s', opacity: menuOpen ? 0 : 1 }} />
                        <span style={{ display: 'block', width: 24, height: 2, background: '#fff', borderRadius: 2, transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
                    </button>
                )}
            </div>

            {/* Mobile dropdown menu */}
            {isMobile && (
                <div style={{ overflow: 'hidden', maxHeight: menuOpen ? 500 : 0, transition: 'max-height 0.4s ease', borderTop: menuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    <div style={{ padding: '12px 24px 28px', display: 'flex', flexDirection: 'column' }}>
                        {links.map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} onClick={close}
                                style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = '#e8d5a8'}
                                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}>{l}</a>
                        ))}
                        <a href="#admissions" onClick={close}
                            style={{ marginTop: 20, display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #d4b87a, #e8d5a8)', color: '#0d2b6e', fontWeight: 700, padding: '14px', borderRadius: 999, fontSize: 15, textDecoration: 'none' }}>
                            Apply Now
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}

/* ─── Hero ─── */
function Hero() {
    return (
        <section id="home" className="hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 80, right: 80, width: 288, height: 288, borderRadius: '50%', background: 'rgba(232,213,168,0.06)', filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: 128, left: 40, width: 384, height: 384, borderRadius: '50%', background: 'rgba(30,92,197,0.15)', filter: 'blur(60px)' }} />
            <div className="animate-float" style={{ position: 'absolute', top: 130, right: 96 }}>
                <div className="glass" style={{ borderRadius: 16, padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ color: '#e8d5a8', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 24 }}>2011</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>Est. in Arusha</div>
                </div>
            </div>
            <div className="animate-float-delay" style={{ position: 'absolute', bottom: 160, right: 140 }}>
                <div className="glass" style={{ borderRadius: 16, padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ color: '#e8d5a8', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 24 }}>100%</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>Scholarship</div>
                </div>
            </div>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '112px 24px 80px', width: '100%' }}>
                <div style={{ maxWidth: 720 }}>
                    <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0d2b6e', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 999, marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.15em', boxShadow: '0 4px 15px rgba(201,168,76,0.35)' }}>
                        ⭐ Arusha, Tanzania · Est. 2011
                    </div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(3rem, 7vw, 5rem)', color: '#fff', lineHeight: 1.05, marginBottom: 24 }}>
                        Shaping<br />
                        <span className="gradient-text">Africa's Next</span><br />
                        Generation of<br />
                        Leaders
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, lineHeight: 1.7, maxWidth: 560, marginBottom: 40 }}>
                        Nestled at the foothills of Mount Meru, CLA Tanzania transforms brilliant young minds from disadvantaged backgrounds into visionary leaders — fully on scholarship.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        <a href="#admissions" className="btn-primary" style={{ background: 'linear-gradient(135deg, #d4b87a, #e8d5a8)', color: '#0d2b6e', fontWeight: 700, padding: '16px 32px', borderRadius: 999, fontSize: 16, textDecoration: 'none', transition: 'all 0.3s', display: 'inline-block' }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 12px 35px rgba(232,213,168,0.5)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                            Apply for Scholarship →
                        </a>
                        <a href="#about" style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#fff', fontWeight: 600, padding: '16px 32px', borderRadius: 999, fontSize: 16, textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'all 0.3s', display: 'inline-block' }}
                            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.transform = 'translateY(-3px)'; }}
                            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.transform = 'translateY(0)'; }}>
                            Discover Our Story
                        </a>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                        {[['50', 'Scholars/Year'], ['14+', 'Years of Impact'], ['6+', 'Countries Network'], ['100%', 'Tuition-Free']].map(([n, l]) => (
                            <div key={l}>
                                <div style={{ color: '#e8d5a8', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 24 }}>{n}</div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mountain" />
            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                <span>Scroll</span>
                <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
            </div>
        </section>
    );
}

/* ─── About ─── */
function About() {
    return (
        <section id="about" style={{ padding: '112px 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 384, height: 384, background: '#eef2ff', borderRadius: '50%', transform: 'translate(50%, -50%)', filter: 'blur(60px)' }} />
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
                    <div className="reveal" style={{ position: 'relative' }}>
                        <div style={{ borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #1a4a9e, #0d2b6e)', aspectRatio: '4/5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 400 500" style={{ width: '100%', height: '100%', opacity: 0.15, position: 'absolute' }} fill="none">
                                <circle cx="200" cy="200" r="160" stroke="#e8d5a8" strokeWidth="1" strokeDasharray="8 4" />
                                <circle cx="200" cy="200" r="120" stroke="#e8d5a8" strokeWidth="1" strokeDasharray="4 8" />
                                <path d="M100 350 L200 200 L300 350" stroke="#e8d5a8" strokeWidth="1.5" />
                                <path d="M80 350 L200 150 L320 350" stroke="#e8d5a8" strokeWidth="0.5" opacity="0.5" />
                                <circle cx="200" cy="200" r="20" fill="#e8d5a8" opacity="0.4" />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="/Logo/CLA_Tanzania_logo_color.gif" alt="CLA Tanzania" style={{ width: '55%', objectFit: 'contain', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32 }}>
                                <div className="glass" style={{ borderRadius: 16, padding: 24, color: '#fff' }}>
                                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, background: 'linear-gradient(135deg, #e8d5a8, #c9a84c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>Mount Meru</div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>Our campus sits in the breathtaking foothills of Mount Meru, 30 minutes from the vibrant city of Arusha — the heart of East Africa.</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'absolute', right: -24, top: 48, background: '#fff', borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.15)', padding: 20, maxWidth: 160 }}>
                            <div style={{ width: 40, height: 40, background: '#eef2ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>🎓</div>
                            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#0d2b6e', fontSize: 18 }}>First Class</div>
                            <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>Graduated 2013</div>
                        </div>
                        <div style={{ position: 'absolute', left: -24, bottom: 80, background: '#0d2b6e', borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', padding: 20, maxWidth: 160 }}>
                            <div style={{ width: 40, height: 40, background: 'rgba(232,213,168,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>🌍</div>
                            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff', fontSize: 18 }}>East Africa</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>Regional Leader</div>
                        </div>
                    </div>
                    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#faf6ee', color: '#8b6914', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>Our Story</div>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0d2b6e', lineHeight: 1.2, marginBottom: 24 }}>
                                Where Potential Meets <span style={{ color: '#1a4a9e' }}>Purpose</span>
                            </h2>
                            <p style={{ color: '#4b5563', fontSize: 18, lineHeight: 1.7 }}>
                                Founded in 2011, Cornerstone Leadership Academy Tanzania was built on a belief: <strong style={{ color: '#0d2b6e' }}>Without Vision, People Perish.</strong><i> "We seek to create a life transforming learning environment that will mold young men and women into future leaders for Tanzania...men and women whose lives fully reflect the character qualities and leadership principles embodied in the life of Jesus."</i>
                            </p>
                        </div>
                        <p style={{ color: '#6b7280', lineHeight: 1.7 }}>
                            Part of the <strong style={{ color: '#374151' }}>Cornerstone Development Africa (CDA)</strong> network spanning 7 East African nations, our academy has become a beacon of transformational education — producing leaders who go on to drive change in government, business, medicine, and civil society.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                            {[['🌱', 'Character', 'Built through service & integrity'], ['💡', 'Excellence', 'Academic & personal mastery'], ['🤝', 'Community', 'Giving back always']].map(([icon, title, desc]) => (
                                <div key={title} style={{ background: '#eef2ff', borderRadius: 16, padding: 16, textAlign: 'center', transition: 'background 0.2s', cursor: 'default' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#eef2ff'}>
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                                    <div style={{ fontWeight: 600, color: '#0d2b6e', fontSize: 14 }}>{title}</div>
                                    <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>{desc}</div>
                                </div>
                            ))}
                        </div>
                        <a href="#programs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1a4a9e', fontWeight: 600, textDecoration: 'none' }}>
                            Explore our programs →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Stats Banner ─── */
function Stats() {
    const stats = [
        { icon: '🎓', value: 50,  suffix: '+', label: 'Scholars Each Year' },
        { icon: '🏫', value: 14,  suffix: '+', label: 'Years of Excellence' },
        { icon: '🌍', value: 7,   suffix: '',  label: 'Countries in Network' },
        { icon: '🎉', value: 600, suffix: '+', label: 'Alumni Worldwide' },
    ];
    return (
        <section style={{ background: 'linear-gradient(135deg, #0d2b6e, #1a4a9e, #0d2b6e)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
                <div style={{ position: 'absolute', top: 16, left: '25%', width: 256, height: 256, background: '#e8d5a8', borderRadius: '50%', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', bottom: 16, right: '25%', width: 256, height: 256, background: '#e8d5a8', borderRadius: '50%', filter: 'blur(60px)' }} />
            </div>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
                    {stats.map(s => (
                        <div key={s.label} className="reveal stat-card" style={{ borderRadius: 16, padding: 24, textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 48, color: '#e8d5a8', marginBottom: 8 }}>
                                <Counter target={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Programs ─── */
function Programs() {
    const subjects = [
        { icon: '🧮', name: 'Mathematics',    desc: 'Advanced calculus, statistics and quantitative reasoning.', border: '#bfdbfe' },
        { icon: '⚗️', name: 'Sciences',       desc: 'Physics, Chemistry & Biology with hands-on laboratory work.', border: '#e9d5ff' },
        { icon: '📖', name: 'Languages',      desc: 'English & Kiswahili — communication for global leadership.', border: '#fde68a' },
        { icon: '🌐', name: 'Social Sciences',desc: 'History, Geography, Economics & General Studies.', border: '#bbf7d0' },
        { icon: '🏛️', name: 'Leadership',    desc: 'Ethics, servant leadership and civic responsibility.', border: '#fecaca' },
        { icon: '💻', name: 'Technology',     desc: 'Digital literacy and 21st century technology skills.', border: '#a5f3fc' },
    ];
    return (
        <section id="programs" style={{ padding: '112px 0', background: '#f8faff' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div className="reveal" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 64px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dbeafe', color: '#1a4a9e', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>Academic Programs</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0d2b6e', marginBottom: 20 }}>
                        A Curriculum Built for <span style={{ color: '#1a4a9e' }}>Future Leaders</span>
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: 18, lineHeight: 1.6 }}>Our Advanced Level curriculum blends rigorous academics with character development to prepare scholars for Africa's biggest challenges.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                    {subjects.map(s => (
                        <div key={s.name} className="reveal prog-card" style={{ background: '#fff', borderRadius: 24, padding: 28, border: `2px solid ${s.border}`, cursor: 'default' }}>
                            <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 20, color: '#0d2b6e', marginBottom: 8 }}>{s.name}</h3>
                            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="reveal" style={{ marginTop: 48, background: 'linear-gradient(135deg, #0d2b6e, #1a4a9e)', borderRadius: 24, padding: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 28, color: '#fff', marginBottom: 16 }}>Beyond the Classroom</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 24 }}>CLA scholars engage in sports, arts, community service, debate, mentorship, and entrepreneurship that develop the whole person.</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {['Sports', 'Debate', 'Community Service', 'Arts', 'Mentorship', 'Entrepreneurship'].map(tag => (
                                <span key={tag} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: 12, padding: '8px 16px', borderRadius: 999 }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {[['🏆', 'Excellence Driven'], ['🫂', 'Peer Mentorship'], ['🌿', 'Environmental Steward'], ['🎨', 'Arts & Culture']].map(([icon, label]) => (
                            <div key={label} className="glass" style={{ borderRadius: 16, padding: 20, textAlign: 'center' }}>
                                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                                <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Testimonials ─── */
function Testimonials() {
    const quotes = [
        { quote: "CLA didn't just give me an education — it gave me a mission. I now serve as a public health officer, giving back to the communities that shaped me.", name: 'Alex Peter Mathias', year: "Class of '25" },
        { quote: "The teachers here don't just teach subjects. They teach you how to think, how to lead, and most importantly — how to serve.", name: 'Maijo William', year: "Class of '14" },
        { quote: "Growing up in a small village, I never imagined attending a school like this. CLA proved that where you come from doesn't define where you're going.", name: 'Dunstan Kulwa', year: "Class of '21" },
    ];
    const [active, setActive] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setActive(a => (a + 1) % quotes.length), 5000);
        return () => clearInterval(t);
    }, []);
    return (
        <section style={{ padding: '112px 0', background: 'linear-gradient(135deg, #0d2b6e, #1a4a9e)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ position: 'absolute', borderRadius: '50%', border: '1px solid #e8d5a8', width: `${(i + 1) * 18}%`, height: `${(i + 1) * 18}%`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                ))}
            </div>
            <div className="reveal" style={{ maxWidth: 768, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#e8d5a8', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 48 }}>
                    Voices of Our Scholars
                </div>
                <div style={{ position: 'relative', minHeight: 240 }}>
                    {quotes.map((q, i) => (
                        <div key={i} style={{ position: 'absolute', inset: 0, transition: 'all 0.5s', opacity: i === active ? 1 : 0, transform: i === active ? 'translateY(0)' : 'translateY(16px)', pointerEvents: i === active ? 'auto' : 'none' }}>
                            <div className="quote-mark">"</div>
                            <p style={{ color: '#fff', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.7, fontWeight: 300, marginBottom: 32, marginTop: -20 }}>{q.quote}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #d4b87a, #e8d5a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🇹🇿</div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ color: '#fff', fontWeight: 600 }}>{q.name}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{q.year}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 64 }}>
                    {quotes.map((_, i) => (
                        <button key={i} onClick={() => setActive(i)} style={{ borderRadius: 999, border: 'none', cursor: 'pointer', transition: 'all 0.3s', width: i === active ? 32 : 8, height: 8, background: i === active ? '#e8d5a8' : 'rgba(255,255,255,0.3)' }} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Admissions ─── */
function Admissions() {
    const steps = [
        { step: '01', title: 'Oral & Written Interview', desc: 'Applicants sit a rigorous oral & written examination testing academic aptitude and potential.' },
        { step: '02', title: 'Practical Interview', desc: 'Selected candidates gather at the school campus for a week for a rigorous practical interview testing their skills and potential.' },
        { step: '03', title: 'Scholarship Award', desc: '25 boys and 25 girls are selected annually after the practical interview and awarded full scholarships covering all expenses.' },
    ];

    const venues = [
        { city: 'Arusha',        location: 'Cornerstone Leadership Academy',          start: '2026-02-27', end: '2026-02-27', display: '27 Feb 2026' },
        { city: 'Mtwara',        location: 'Shule ya Sekondari Rahaleo',              start: '2026-03-06', end: '2026-03-07', display: '6–7 Mar 2026' },
        { city: 'Tabora',        location: 'Shule ya Sekondari Uyui',                 start: '2026-03-06', end: '2026-03-07', display: '6–7 Mar 2026' },
        { city: 'Makambako',     location: 'Ukumbi wa Roman Catholic',                start: '2026-03-06', end: '2026-03-07', display: '6–7 Mar 2026' },
        { city: 'Dodoma',        location: 'Shule ya Sekondari Viwandani',            start: '2026-03-07', end: '2026-03-08', display: '7–8 Mar 2026' },
        { city: 'Tanga',         location: 'Tanga English Medium',                    start: '2026-03-13', end: '2026-03-14', display: '13–14 Mar 2026' },
        { city: 'Mwanza',        location: 'Shule ya Msingi Nyabulogoya',             start: '2026-03-14', end: '2026-03-15', display: '14–15 Mar 2026' },
        { city: 'Dar es Salaam', location: 'Cornerstone Community Centre (opp. Mlimani City)', start: '2026-03-27', end: '2026-03-28', display: '27–28 Mar 2026' },
    ];

    function getStatus(start, end) {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const s = new Date(start), e = new Date(end); e.setHours(23, 59, 59, 999);
        if (today > e) return 'completed';
        if (today >= s) return 'ongoing';
        return 'upcoming';
    }

    const lastInterviewEnd = new Date('2026-03-28'); lastInterviewEnd.setHours(23, 59, 59, 999);
    const allDone = new Date() > lastInterviewEnd;
    // Set to true when first-round results are ready to publish
    const resultsAvailable = false;

    const statusStyle = {
        completed: { bg: '#dcfce7', color: '#166534', label: 'Completed' },
        ongoing:   { bg: '#fef9c3', color: '#854d0e', label: 'Ongoing Today' },
        upcoming:  { bg: '#dbeafe', color: '#1e40af', label: 'Upcoming' },
    };

    const documents = [
        'Leaving Certificate ya Form VI',
        'Matokeo ya Form VI (NECTA)',
        'Matokeo ya kidato cha 4 na 6 ya shule',
        'Cheti cha kuzaliwa (Birth certificate)',
        'Barua ya kiongozi wa mtaa/kijiji',
        'Kitambulisho cha Taifa au kura cha mzazi/mlezi',
        'Barua ya Kiongozi wa Dini',
        'Barua ya daktari (kama una tatizo la kudumu)',
        'Vyeti vya uongozi/tuzo mbalimbali',
        'Picha za size ya passport (3)',
    ];

    return (
        <section id="admissions" style={{ padding: '112px 0', background: '#fff' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

                {/* Section header */}
                <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#faf6ee', color: '#8b6914', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>Admissions 2026/2027</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0d2b6e', lineHeight: 1.2, marginBottom: 16 }}>
                        A Scholarship That <span style={{ color: '#b8963c' }}>Changes Everything</span>
                    </h2>
                    <p style={{ color: '#4b5563', fontSize: 18, lineHeight: 1.7, maxWidth: 680, margin: '0 auto' }}>
                        Each year, we award <strong>50 full scholarships</strong> — 25 boys and 25 girls — to the brightest Form 5–6 students from Tanzania's most disadvantaged communities.
                    </p>
                </div>

                {/* Main 2-col grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start', marginBottom: 56 }}>

                    {/* LEFT: coverage + eligibility + documents */}
                    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                        <div style={{ background: '#eef2ff', borderRadius: 24, padding: 28 }}>
                            <h4 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#0d2b6e', fontSize: 18, marginBottom: 16 }}>Your Scholarship Covers</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {['Full tuition & boarding fees', 'Textbooks', 'Meals and accommodation', 'Medical care on campus', 'School counseling & mentorship'].map(item => (
                                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 20, height: 20, background: '#1a4a9e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                        <span style={{ color: '#374151', fontSize: 14 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: '#faf6ee', borderRadius: 24, padding: 28 }}>
                            <h4 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#0d2b6e', fontSize: 18, marginBottom: 6 }}>Eligibility Requirements</h4>
                            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>Form 5–6 scholarship — Subjects: PCM, PCB, EGM, HGE, HGL, HKL</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{ width: 20, height: 20, background: '#b8963c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <span style={{ color: '#374151', fontSize: 14, lineHeight: 1.5 }}>Division I, II, or III — for all subjects</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{ width: 20, height: 20, background: '#b8963c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <span style={{ color: '#374151', fontSize: 14, lineHeight: 1.5 }}><strong>Division I only</strong> — for EGM, PCM, and PCB streams</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <div style={{ width: 20, height: 20, background: '#b8963c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <span style={{ color: '#374151', fontSize: 14, lineHeight: 1.5 }}>Interviews begin at <strong>7:00 AM</strong> — arrive on time</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#f8faff', borderRadius: 24, padding: 28 }}>
                            <h4 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#0d2b6e', fontSize: 18, marginBottom: 6 }}>Required Documents</h4>
                            <p style={{ color: '#dc2626', fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Bring originals + copies on interview day</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {documents.map(doc => (
                                    <div key={doc} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a4a9e', flexShrink: 0, marginTop: 6 }} />
                                        <span style={{ color: '#374151', fontSize: 13, lineHeight: 1.5 }}>{doc}</span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: 16, fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
                                Candidates without verified Form 4 results or NECTA result slip will not be allowed to sit the interview.
                            </p>
                        </div>

                        <div style={{ background: '#f0fdf4', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 15 19.79 19.79 0 0 1 1.57 6.46 2 2 0 0 1 3.54 4.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 11.8a16 16 0 0 0 4.29 4.29l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 19.8 17.48 2 2 0 0 1 22 16.92z" /></svg>
                            <span style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>Enquiries: 0767 279 550 &nbsp;|&nbsp; 0620 301 954</span>
                        </div>
                    </div>

                    {/* RIGHT: interview schedule + selection process */}
                    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                        <div>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 22, color: '#0d2b6e', marginBottom: 16 }}>Interview Schedule — 2026</h3>

                            {allDone && (
                                resultsAvailable ? (
                                    <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 16, padding: '18px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                            <div>
                                                <p style={{ fontWeight: 700, color: '#166534', fontSize: 14, marginBottom: 2 }}>First-round results are out!</p>
                                                <p style={{ color: '#15803d', fontSize: 13 }}>Check whether you have been called for the second (practical) interview.</p>
                                            </div>
                                        </div>
                                        <a href="#results" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                            See Interview Results
                                        </a>
                                    </div>
                                ) : (
                                    <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 16, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <div>
                                            <p style={{ fontWeight: 700, color: '#92400e', fontSize: 14, marginBottom: 4 }}>All interviews have concluded</p>
                                            <p style={{ color: '#a16207', fontSize: 13, lineHeight: 1.6 }}>
                                                The interview results are still not out. We will <strong>call you</strong> to inform you about your second interview. Please wait for our call.
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {venues.map(v => {
                                    const status = getStatus(v.start, v.end);
                                    const st = statusStyle[status];
                                    return (
                                        <div key={v.city} style={{ display: 'flex', alignItems: 'center', gap: 14, background: status === 'ongoing' ? '#fffbeb' : '#f8faff', borderRadius: 14, padding: '12px 16px', border: status === 'ongoing' ? '1.5px solid #fbbf24' : '1.5px solid transparent', transition: 'background 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = status === 'ongoing' ? '#fffbeb' : '#f8faff'; e.currentTarget.style.borderColor = status === 'ongoing' ? '#fbbf24' : 'transparent'; }}>
                                            <div style={{ flexShrink: 0 }}>
                                                <div style={{ fontWeight: 700, color: '#0d2b6e', fontSize: 14 }}>{v.city}</div>
                                                <div style={{ color: '#6b7280', fontSize: 12 }}>{v.display}</div>
                                            </div>
                                            <div style={{ flex: 1, color: '#4b5563', fontSize: 12, lineHeight: 1.4 }}>{v.location}</div>
                                            <div style={{ flexShrink: 0, background: st.bg, color: st.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>{st.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 22, color: '#0d2b6e', marginBottom: 16 }}>The Selection Process</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {steps.map(s => (
                                    <div key={s.step} className="timeline-item" style={{ display: 'flex', gap: 16 }}>
                                        <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #d4b87a, #e8d5a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d2b6e', fontWeight: 700, fontSize: 12 }}>{s.step}</div>
                                        <div style={{ background: '#f8faff', borderRadius: 14, padding: '14px 18px', flex: 1, transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#f8faff'}>
                                            <h4 style={{ fontWeight: 600, color: '#0d2b6e', marginBottom: 3, fontSize: 14 }}>{s.title}</h4>
                                            <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Alumni ─── */
function Alumni() {
    return (
        <section id="alumni" style={{ padding: '112px 0', background: '#f8faff' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
                    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dbeafe', color: '#1a4a9e', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Alumni Network</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0d2b6e', lineHeight: 1.2 }}>
                            The COSA-TZ <span style={{ color: '#1a4a9e' }}>Community</span>
                        </h2>
                        <p style={{ color: '#4b5563', fontSize: 18, lineHeight: 1.7 }}>
                            The Cornerstone Old Students' Association Tanzania (COSA-TZ) is a vibrant network of CLA graduates who embody the school's values of <strong>leadership, service, and integrity</strong> long after graduation.
                        </p>
                        <p style={{ color: '#6b7280', lineHeight: 1.7 }}>Alumni are active in medicine, law, engineering, education, government, entrepreneurship, and social enterprise across Tanzania and the world.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[['🩺', 'Healthcare & Medicine'], ['⚖️', 'Law & Policy'], ['🏗️', 'Engineering'], ['📊', 'Business & Finance']].map(([icon, field]) => (
                                <div key={field} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 25px rgba(13,43,110,0.12)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}>
                                    <span style={{ fontSize: 24 }}>{icon}</span>
                                    <span style={{ color: '#374151', fontSize: 14, fontWeight: 500 }}>{field}</span>
                                </div>
                            ))}
                        </div>
                        <a href="https://www.cosatz.org/home" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1a4a9e', fontWeight: 600, textDecoration: 'none' }}>
                            Visit COSA-TZ →
                        </a>
                    </div>
                    <div className="reveal">
                        <div style={{ background: 'linear-gradient(135deg, #0d2b6e, #1a4a9e)', borderRadius: 24, padding: 32, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, width: 192, height: 192, background: 'rgba(232,213,168,0.08)', borderRadius: '50%', transform: 'translate(50%,-50%)', filter: 'blur(40px)' }} />
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>CDA Network Countries</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {[
                                    ['🇹🇿', 'Tanzania', 'Founded 2011', true],
                                    ['🇷🇼', 'Rwanda', 'Leadership Academy', false],
                                    ['🇺🇬', 'Uganda', 'Leadership Academy', false],
                                    ['🇰🇪', 'Kenya', 'Leadership Academy', false],
                                    ['🇧🇮', 'Burundi', 'Leadership Academy', false],
                                    ['🇸🇸', 'South Sudan', 'Leadership Academy', false],
                                    ['🇨🇩', 'Congo DRC', 'Leadership Academy', false],
                                ].map(([flag, country, role, highlight]) => (
                                    <div key={country} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, border: highlight ? '1px solid rgba(232,213,168,0.4)' : '1px solid transparent', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                                        <span style={{ fontSize: 20 }}>{flag}</span>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: highlight ? '#e8d5a8' : '#fff' }}>{country}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Contact ─── */
function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('loading');
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token ? { 'X-CSRF-TOKEN': token } : {}),
                },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    }

    return (
        <section id="contact" style={{ padding: '112px 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 384, height: 384, background: '#eef2ff', borderRadius: '50%', transform: 'translate(-50%, 50%)', filter: 'blur(60px)' }} />
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64 }}>
                    <div className="reveal">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#faf6ee', color: '#8b6914', fontSize: 11, fontWeight: 700, padding: '8px 16px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>Contact Us</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0d2b6e', lineHeight: 1.2, marginBottom: 24 }}>
                            Get in Touch with <span style={{ color: '#1a4a9e' }}>CLA Tanzania</span>
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: 18, lineHeight: 1.7, marginBottom: 40 }}>Whether you're a prospective scholar, parent, partner, or donor — we'd love to hear from you.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {[
                                ['📍', 'Location', 'Foothills of Mount Meru, Arusha, Tanzania'],
                                ['✉️', 'Email', 'cstonetz1@gmail.com'],
                                ['🏫', 'Network', 'Cornerstone Development Africa (CDA)'],
                            ].map(([icon, label, value]) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                    <div style={{ width: 48, height: 48, background: '#eef2ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
                                    <div>
                                        <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                                        <div style={{ color: '#374151', fontWeight: 500 }}>{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="reveal">
                        {status === 'success' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px', background: '#f0fdf4', borderRadius: 24, border: '1.5px solid #86efac' }}>
                                <div style={{ width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>✅</div>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 24, color: '#0d2b6e', marginBottom: 10 }}>Message Sent!</h3>
                                <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: 6 }}>Thank you for reaching out, <strong>{form.name}</strong>.</p>
                                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                                    A confirmation has been sent to <strong>{form.email}</strong>.<br />
                                    Our team will get back to you within 2–3 working days.
                                </p>
                                <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }); }}
                                    style={{ color: '#1a4a9e', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontSize: 14 }}>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ background: '#f8faff', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 24, color: '#0d2b6e' }}>Send a Message</h3>

                                {status === 'error' && (
                                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
                                        Something went wrong. Please try again or email us directly at <strong>cstonetz1@gmail.com</strong>.
                                    </div>
                                )}

                                {[['Full Name', 'text', 'name'], ['Email Address', 'email', 'email']].map(([label, type, key]) => (
                                    <div key={key}>
                                        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>{label}</label>
                                        <input type={type} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none', fontSize: 14, color: '#1f2937', background: '#fff', boxSizing: 'border-box' }}
                                            onFocus={e => e.target.style.borderColor = '#1a4a9e'}
                                            onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Message</label>
                                    <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?"
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none', fontSize: 14, color: '#1f2937', background: '#fff', resize: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
                                        onFocus={e => e.target.style.borderColor = '#1a4a9e'}
                                        onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                                </div>
                                <button type="submit" disabled={status === 'loading'} className="btn-primary"
                                    style={{ width: '100%', background: status === 'loading' ? '#6b7280' : 'linear-gradient(135deg, #0d2b6e, #1a4a9e)', color: '#fff', fontWeight: 700, padding: 16, borderRadius: 12, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontSize: 15, transition: 'all 0.3s' }}
                                    onMouseEnter={e => { if (status !== 'loading') { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 30px rgba(13,43,110,0.4)'; } }}
                                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                                    {status === 'loading' ? 'Sending…' : 'Send Message →'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Footer ─── */
function Footer() {
    return (
        <footer className="footer-bg" style={{ color: '#fff', padding: '64px 0 32px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <img src="/Logo/CLA_Tanzania_logo_color.gif" alt="CLA Tanzania Logo" style={{ height: 56, width: 'auto', objectFit: 'contain' }} />
                            <div>
                                <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff' }}>Cornerstone Leadership Academy</div>
                                <div style={{ color: '#e8d5a8', fontSize: 11, letterSpacing: '0.15em' }}>Tanzania</div>
                            </div>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>Transforming brilliant young Tanzanians into Africa's next generation of visionary leaders — one scholarship at a time.</p>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {['About', 'Programs', 'Admissions', 'Alumni Network', 'Contact'].map(l => (
                                <li key={l}><a href={`#${l.split(' ')[0].toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#e8d5a8'}
                                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>{l}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>CDA Network</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {['🇷🇼 Rwanda', '🇺🇬 Uganda', '🇰🇪 Kenya', '🇧🇮 Burundi', '🇸🇸 South Sudan', '🇨🇩 Congo DRC'].map(c => (
                                <li key={c} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{c}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>© {new Date().getFullYear()} Cornerstone Leadership Academy Tanzania. Part of Cornerstone Development Africa.</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Made with ❤️ for Tanzania's future leaders</p>
                </div>
            </div>
        </footer>
    );
}

/* ─── App Root ─── */
function App() {
    useReveal();
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Stats />
            <Programs />
            <Testimonials />
            <Admissions />
            <Alumni />
            <Contact />
            <Footer />
        </>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
