import { useState, useEffect, useRef } from 'react'

const API_URL = 'http://localhost:8080/api';

// ─── Inject styles immediately at module load (NOT in a component/useEffect) ──
;(function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('lh-styles')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap';
  document.head.appendChild(link);
  const style = document.createElement('style');
  style.id = 'lh-styles';
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --ink: #0a0a0f; --ink2: #18181f; --ink3: #26262e;
      --surf: #f5f4f0; --surf2: #eceae4;
      --acc: #e8643c; --acc2: #f0a87a;
      --txt: #0a0a0f; --mut: #6b6b78;
      --wht: #fafaf8; --brd: rgba(10,10,15,0.1);
      --shsm: 0 1px 3px rgba(10,10,15,.08);
      --shmd: 0 4px 16px rgba(10,10,15,.1),0 2px 8px rgba(10,10,15,.06);
      --shlg: 0 16px 48px rgba(10,10,15,.14),0 8px 24px rgba(10,10,15,.08);
      --r: 12px; --rl: 20px;
      --fd: 'Syne', sans-serif; --fb: 'DM Sans', sans-serif;
    }
    body { font-family: var(--fb); background: var(--surf); color: var(--txt); line-height: 1.6; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: var(--surf2); } ::-webkit-scrollbar-thumb { background: var(--ink3); border-radius: 3px; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fu0{animation:fadeUp .45s ease both;}
    .fu1{animation:fadeUp .45s .08s ease both;}
    .fu2{animation:fadeUp .45s .16s ease both;}
    .fu3{animation:fadeUp .45s .24s ease both;}
    .fu4{animation:fadeUp .45s .32s ease both;}

    /* Buttons */
    .lbtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border-radius:var(--r);font-family:var(--fb);font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all .18s ease;white-space:nowrap;text-decoration:none;}
    .lbtn:disabled{opacity:.45;cursor:not-allowed;pointer-events:none;}
    .lbtn-ink{background:var(--ink);color:var(--wht);}
    .lbtn-ink:hover{background:var(--ink2);transform:translateY(-1px);box-shadow:var(--shmd);}
    .lbtn-acc{background:var(--acc);color:#fff;}
    .lbtn-acc:hover{background:#d4572e;transform:translateY(-1px);box-shadow:0 8px 24px rgba(232,100,60,.32);}
    .lbtn-ghost{background:transparent;color:var(--txt);border:1.5px solid var(--brd);}
    .lbtn-ghost:hover{background:var(--surf2);border-color:var(--ink3);}
    .lbtn-red{background:#ef4444;color:#fff;}
    .lbtn-red:hover{background:#dc2626;}
    .lbtn-sm{padding:7px 14px;font-size:13px;}

    /* Inputs */
    .linput{width:100%;padding:11px 15px;border:1.5px solid var(--brd);border-radius:var(--r);font-family:var(--fb);font-size:14px;background:var(--wht);color:var(--txt);transition:all .18s;outline:none;}
    .linput:focus{border-color:var(--ink);box-shadow:0 0 0 3px rgba(10,10,15,.06);}
    .linput::placeholder{color:var(--mut);}

    /* Cards */
    .lcard{background:var(--wht);border-radius:var(--rl);border:1px solid var(--brd);overflow:hidden;transition:all .22s ease;}
    .lcard:hover{box-shadow:var(--shlg);transform:translateY(-3px);}
    .lcard-thumb{height:186px;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--ink2) 0%,var(--ink3) 100%);}
    .lcard-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease;}
    .lcard:hover .lcard-thumb img{transform:scale(1.05);}
    .lcard-thumb-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:52px;background:linear-gradient(135deg,#1a1a24 0%,#2a2035 50%,#1e2a3a 100%);}

    /* Nav */
    .lnav-link{padding:6px 13px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:none;background:transparent;font-family:var(--fb);color:rgba(250,250,248,.7);transition:all .15s;}
    .lnav-link:hover{background:rgba(255,255,255,.1);color:var(--wht);}
    .lnav-link.on{background:rgba(255,255,255,.14);color:var(--wht);}

    /* Tags */
    .ltag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;}
    .ltag-acc{background:rgba(232,100,60,.12);color:var(--acc);}
    .ltag-grn{background:rgba(34,197,94,.12);color:#16a34a;}
    .ltag-amb{background:rgba(245,158,11,.12);color:#b45309;}
    .ltag-ink{background:var(--ink3);color:var(--wht);}

    /* Category pills */
    .lpill{padding:8px 18px;border-radius:999px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--brd);background:var(--wht);color:var(--mut);transition:all .15s;font-family:var(--fb);}
    .lpill:hover{border-color:var(--ink);color:var(--txt);}
    .lpill.on{background:var(--ink);color:var(--wht);border-color:var(--ink);}

    /* Lesson items */
    .litem{display:flex;align-items:center;gap:11px;padding:11px;border-radius:10px;cursor:pointer;transition:all .15s;border:1.5px solid transparent;}
    .litem:hover{background:var(--surf);}
    .litem.on{background:rgba(232,100,60,.06);border-color:rgba(232,100,60,.22);}
    .lnum{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;background:var(--ink);color:var(--wht);}
    .lnum.lk{background:var(--surf2);color:var(--mut);}

    /* Modal */
    .lmodal-bg{position:fixed;inset:0;background:rgba(10,10,15,.65);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
    .lmodal{background:var(--wht);border-radius:var(--rl);width:100%;max-width:680px;max-height:92vh;overflow-y:auto;box-shadow:var(--shlg);}

    /* Upload */
    .lupload{border:2px dashed var(--brd);border-radius:var(--r);padding:40px 24px;text-align:center;transition:all .2s;}
    .lupload.drag{border-color:var(--acc);background:rgba(232,100,60,.04);}

    /* Hero */
    .lhero{background:var(--ink);position:relative;overflow:hidden;}
    .lhero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 75% 55% at 65% 50%,rgba(232,100,60,.2) 0%,transparent 70%),radial-gradient(ellipse 45% 40% at 15% 85%,rgba(100,80,210,.13) 0%,transparent 60%);pointer-events:none;}
    .lhero::after{content:'';position:absolute;inset:0;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px;pointer-events:none;}

    /* Table */
    .ltbl{width:100%;border-collapse:collapse;}
    .ltbl th{padding:10px 20px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);border-bottom:1px solid var(--brd);}
    .ltbl td{padding:15px 20px;font-size:14px;border-bottom:1px solid var(--brd);vertical-align:middle;}
    .ltbl tr:last-child td{border-bottom:none;}
    .ltbl tbody tr:hover{background:var(--surf);}

    /* Stat card */
    .lstat{padding:24px 26px;border-radius:var(--rl);border:1px solid var(--brd);background:var(--wht);}

    /* Video */
    .lvid{aspect-ratio:16/9;background:#000;border-radius:var(--r);overflow:hidden;}
    .lvid video{width:100%;height:100%;display:block;}

    /* Spinner */
    .lspin{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0;}
    .lspin-ink{border-color:rgba(10,10,15,.15);border-top-color:var(--ink);}

    /* Alert */
    .lalert{padding:11px 15px;border-radius:var(--r);font-size:14px;}
    .lalert-err{background:rgba(239,68,68,.08);color:#b91c1c;border:1px solid rgba(239,68,68,.2);}
    .lalert-ok{background:rgba(34,197,94,.08);color:#15803d;border:1px solid rgba(34,197,94,.2);}

    /* Clamp */
    .clamp2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}

    /* Eyebrow */
    .eyebrow{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--acc);margin-bottom:8px;}

    /* Toggle */
    .ltoggle-track{width:40px;height:22px;border-radius:11px;position:relative;transition:background .2s;cursor:pointer;flex-shrink:0;}
    .ltoggle-thumb{position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}

    /* Sidebar card */
    .lside{background:var(--wht);border-radius:var(--rl);border:1px solid var(--brd);padding:26px;position:sticky;top:80px;box-shadow:var(--shsm);}

    /* Divider */
    .ldiv{height:1px;background:var(--brd);margin:20px 0;}
  `;
  document.head.appendChild(style);
})();

// Types
interface User { id: number; name: string; email: string; role: 'STUDENT' | 'INSTRUCTOR'; }
interface Course { id: number; title: string; description: string; thumbnail: string; price: number; published: boolean; instructor: User; category?: Category; lessons?: Lesson[]; enrollments?: any[]; createdAt: string; }
interface Lesson { id: number; title: string; description: string; videoUrl: string; duration: number; orderIndex: number; course?: Course; }
interface DashboardStats { totalCourses: number; totalLessons: number; totalStudents: number; totalRevenue: number; courses: any[]; }
interface Category { id: number; name: string; description: string; icon: string; }

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('userEmail');
  const h: any = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (email) h['X-User-Email'] = email;
  return h;
};

// ── Shared helpers ─────────────────────────────────────────────────────────────
const S = {
  row: (extra?: any): React.CSSProperties => ({ display: 'flex', alignItems: 'center', ...extra }),
  col: (extra?: any): React.CSSProperties => ({ display: 'flex', flexDirection: 'column', ...extra }),
  grid: (cols: string, gap = 24, extra?: any): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: cols, gap, ...extra }),
};

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--txt)', fontFamily: 'var(--fb)' }}>{children}</label>;
}
function FieldWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 18 }}><Label>{label}</Label>{children}</div>;
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ user, onPageChange, currentPage }: { user: User | null; onPageChange: (p: string) => void; currentPage: string }) {
  return (
    <nav style={{ background: 'var(--ink)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 62, ...S.row({ justifyContent: 'space-between' }) }}>
        {/* Left */}
        <div style={S.row({ gap: 28 })}>
          <div onClick={() => onPageChange('home')} style={S.row({ gap: 9, cursor: 'pointer', userSelect: 'none' })}>
            <div style={{ width: 30, height: 30, background: 'var(--acc)', borderRadius: 8, ...S.row({ justifyContent: 'center', fontSize: 15 }) }}>🎓</div>
            <span style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 18, color: 'var(--wht)', letterSpacing: '-.01em' }}>LearnHub</span>
          </div>
          <div style={S.row({ gap: 2 })}>
            {[['home', 'Home'], ['courses', 'Courses']].map(([p, l]) => (
              <button key={p} onClick={() => onPageChange(p)} className={`lnav-link ${currentPage === p ? 'on' : ''}`}>{l}</button>
            ))}
            {user?.role === 'INSTRUCTOR' && <button onClick={() => onPageChange('instructor')} className={`lnav-link ${currentPage === 'instructor' ? 'on' : ''}`}>Dashboard</button>}
            {user && <button onClick={() => onPageChange('my-learning')} className={`lnav-link ${currentPage === 'my-learning' ? 'on' : ''}`}>My Learning</button>}
          </div>
        </div>
        {/* Right */}
        <div style={S.row({ gap: 10 })}>
          {user ? (
            <>
              <div style={S.row({ gap: 8, padding: '5px 12px', borderRadius: 8, background: 'rgba(255,255,255,.09)' })}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--acc)', ...S.row({ justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 800, flexShrink: 0 })}}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(250,250,248,.8)', fontWeight: 500, fontFamily: 'var(--fb)' }}>{user.name}</span>
              </div>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="lbtn lbtn-ghost lbtn-sm" style={{ color: 'rgba(250,250,248,.55)', borderColor: 'rgba(255,255,255,.12)' }}>Log out</button>
            </>
          ) : (
            <>
              <button onClick={() => onPageChange('login')} className="lnav-link">Log in</button>
              <button onClick={() => onPageChange('register')} className="lbtn lbtn-acc lbtn-sm">Sign up free</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Auth split layout ──────────────────────────────────────────────────────────
function AuthLayout({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 62px)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div className="lhero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 56 }}>
        <div style={{ position: 'relative', color: 'var(--wht)', maxWidth: 380 }} className="fu0">
          <div style={{ fontSize: 48, marginBottom: 22 }}>🎓</div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, marginBottom: 14, letterSpacing: '-.02em' }}>Learn anything.<br /><span style={{ color: 'var(--acc)' }}>Grow every day.</span></h2>
          <p style={{ color: 'rgba(250,250,248,.55)', fontSize: 15, lineHeight: 1.75 }}>Join thousands building real skills with expert-led courses.</p>
          <div style={{ ...S.row({ gap: 32, marginTop: 40 }) }}>
            {[['500+', 'Courses'], ['12k+', 'Learners'], ['98%', 'Satisfaction']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 26, color: 'var(--acc)' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,250,248,.4)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 56, background: 'var(--surf)' }}>
        <div className="fu1" style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 28, fontWeight: 800, marginBottom: 5, letterSpacing: '-.02em' }}>{title}</h1>
          <p style={{ color: 'var(--mut)', fontSize: 15, marginBottom: 30 }}>{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onPageChange, onLogin }: { onPageChange: (p: string) => void; onLogin: (u: User) => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (res.ok) { const d = await res.json(); localStorage.setItem('token', d.token); localStorage.setItem('userEmail', email); onLogin(d.user); onPageChange('home'); }
      else setError('Invalid email or password.');
    } catch { setError('Login failed. Please try again.'); } finally { setLoading(false); }
  };
  return (
    <AuthLayout title="Welcome back" sub="Log in to continue learning">
      {error && <div className="lalert lalert-err" style={{ marginBottom: 18 }}>{error}</div>}
      <form onSubmit={submit}>
        <FieldWrap label="Email address"><input className="linput" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></FieldWrap>
        <FieldWrap label="Password"><input className="linput" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required /></FieldWrap>
        <button type="submit" className="lbtn lbtn-ink" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
          {loading ? <><span className="lspin" style={{ marginRight: 6 }} />Logging in…</> : 'Log in →'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--mut)', fontFamily: 'var(--fb)' }}>
        No account? <button onClick={() => onPageChange('register')} style={{ color: 'var(--acc)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--fb)' }}>Sign up free</button>
      </p>
    </AuthLayout>
  );
}

function RegisterPage({ onPageChange, onLogin }: { onPageChange: (p: string) => void; onLogin: (u: User) => void }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, role }) });
      if (res.ok) { const d = await res.json(); localStorage.setItem('token', d.token); localStorage.setItem('userEmail', email); onLogin(d.user); onPageChange('home'); }
      else setError('Registration failed. Email may already be in use.');
    } catch { setError('Registration failed. Please try again.'); } finally { setLoading(false); }
  };
  return (
    <AuthLayout title="Create account" sub="Start your learning journey today">
      {error && <div className="lalert lalert-err" style={{ marginBottom: 18 }}>{error}</div>}
      <form onSubmit={submit}>
        <FieldWrap label="Full name"><input className="linput" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" required /></FieldWrap>
        <FieldWrap label="Email address"><input className="linput" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></FieldWrap>
        <FieldWrap label="Password"><input className="linput" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} /></FieldWrap>
        <FieldWrap label="I want to…">
          <div style={S.grid('1fr 1fr', 10)}>
            {(['STUDENT', 'INSTRUCTOR'] as const).map(r => (
              <div key={r} onClick={() => setRole(r)} style={{ padding: '13px 15px', borderRadius: 'var(--r)', border: `1.5px solid ${role === r ? 'var(--ink)' : 'var(--brd)'}`, cursor: 'pointer', background: role === r ? 'var(--ink)' : 'var(--wht)', color: role === r ? 'var(--wht)' : 'var(--txt)', transition: 'all .15s', userSelect: 'none', ...S.row({ gap: 10 }) }}>
                <span style={{ fontSize: 20 }}>{r === 'STUDENT' ? '📖' : '🎤'}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--fb)' }}>{r === 'STUDENT' ? 'Learn' : 'Teach'}</div>
                  <div style={{ fontSize: 11, opacity: .65, fontFamily: 'var(--fb)' }}>{r === 'STUDENT' ? 'Enroll in courses' : 'Create & sell courses'}</div>
                </div>
              </div>
            ))}
          </div>
        </FieldWrap>
        <button type="submit" className="lbtn lbtn-ink" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
          {loading ? <><span className="lspin" style={{ marginRight: 6 }} />Creating…</> : 'Create account →'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--mut)', fontFamily: 'var(--fb)' }}>
        Have an account? <button onClick={() => onPageChange('login')} style={{ color: 'var(--acc)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--fb)' }}>Log in</button>
      </p>
    </AuthLayout>
  );
}

// ── Course Card ────────────────────────────────────────────────────────────────
function CourseCard({ course, onPageChange }: { course: Course; onPageChange: (p: string) => void }) {
  return (
    <div className="lcard" style={{ cursor: 'pointer' }} onClick={() => onPageChange(`course-${course.id}`)}>
      <div className="lcard-thumb">
        {course.thumbnail ? <img src={course.thumbnail} alt={course.title} /> : <div className="lcard-thumb-ph">📚</div>}
        {course.category && <div style={{ position: 'absolute', top: 12, left: 12 }}><span className="ltag ltag-ink">{course.category.icon} {course.category.name}</span></div>}
      </div>
      <div style={{ padding: '20px 22px 22px' }}>
        <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 16, marginBottom: 6, lineHeight: 1.35 }}>{course.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--mut)', marginBottom: 14, lineHeight: 1.6 }} className="clamp2">{course.description}</p>
        <div style={S.row({ justifyContent: 'space-between' })}>
          <div>
            <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 22 }}>${course.price}</div>
            <div style={{ fontSize: 12, color: 'var(--mut)', marginTop: 1 }}>by {course.instructor?.name}</div>
          </div>
          <button className="lbtn lbtn-acc lbtn-sm" onClick={e => { e.stopPropagation(); onPageChange(`course-${course.id}`); }}>View →</button>
        </div>
      </div>
    </div>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────────
function HomePage({ onPageChange }: { onPageChange: (p: string) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => { fetch(`${API_URL}/courses`).then(r => r.json()).then(setCourses).catch(() => {}); }, []);

  return (
    <div>
      {/* Hero */}
      <div className="lhero" style={{ padding: '96px 24px 108px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <p className="eyebrow fu0">The modern learning platform</p>
          <h1 className="fu1" style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(38px,6vw,70px)', fontWeight: 800, color: 'var(--wht)', lineHeight: 1.08, letterSpacing: '-.03em', marginBottom: 22 }}>
            Learn Without<br /><span style={{ color: 'var(--acc)' }}>Limits.</span>
          </h1>
          <p className="fu2" style={{ fontSize: 17, color: 'rgba(250,250,248,.62)', maxWidth: 480, margin: '0 auto 38px', lineHeight: 1.75 }}>
            Build real skills with video courses crafted by expert instructors in every field.
          </p>
          <div className="fu3" style={S.row({ gap: 12, justifyContent: 'center', flexWrap: 'wrap' })}>
            <button onClick={() => onPageChange('courses')} className="lbtn lbtn-acc" style={{ fontSize: 15, padding: '13px 30px' }}>Explore Courses</button>
            <button onClick={() => onPageChange('register')} className="lbtn lbtn-ghost" style={{ fontSize: 15, padding: '13px 30px', color: 'rgba(250,250,248,.65)', borderColor: 'rgba(255,255,255,.14)' }}>Create account →</button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ background: 'var(--ink2)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center' }}>
          {[['500+', 'Expert courses'], ['12,000+', 'Active learners'], ['98%', 'Satisfaction rate']].map(([n, l]) => (
            <div key={l} style={{ padding: '26px 24px' }}>
              <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 30, color: 'var(--wht)' }}>{n}</div>
              <div style={{ fontSize: 12, color: 'rgba(250,250,248,.4)', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '76px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="eyebrow">Why LearnHub</p>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, letterSpacing: '-.02em' }}>Everything you need to level up</h2>
        </div>
        <div style={S.grid('repeat(auto-fit,minmax(260px,1fr))', 22)}>
          {[{ icon: '🎥', t: 'HD Video Lessons', d: 'Crystal-clear content from expert instructors, watch on any device.' }, { icon: '📚', t: 'Expert Instructors', d: 'Learn from industry professionals with real-world experience.' }, { icon: '🏆', t: 'Certificates', d: 'Earn verified certificates to showcase your skills to employers.' }].map((f, i) => (
            <div key={f.t} className={`fu${i + 1}`} style={{ padding: 30, borderRadius: 'var(--rl)', background: 'var(--wht)', border: '1px solid var(--brd)' }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--surf2)', ...S.row({ justifyContent: 'center', fontSize: 22, marginBottom: 16 }) }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.t}</h3>
              <p style={{ color: 'var(--mut)', fontSize: 14, lineHeight: 1.7 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Courses */}
      {courses.length > 0 && (
        <div style={{ background: 'var(--surf2)', padding: '76px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ ...S.row({ justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 38 }) }}>
              <div><p className="eyebrow">Popular right now</p><h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 800, letterSpacing: '-.02em' }}>Top Courses</h2></div>
              <button onClick={() => onPageChange('courses')} className="lbtn lbtn-ghost lbtn-sm">Browse all →</button>
            </div>
            <div style={S.grid('repeat(auto-fill,minmax(300px,1fr))', 22)}>
              {courses.slice(0, 6).map(c => <CourseCard key={c.id} course={c} onPageChange={onPageChange} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Courses Catalog ────────────────────────────────────────────────────────────
function CoursesPage({ onPageChange }: { onPageChange: (p: string) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const loadCourses = () => fetch(`${API_URL}/courses`).then(r => r.json()).then(setCourses).catch(() => {});
  useEffect(() => {
    fetch(`${API_URL}/categories`).then(r => r.json()).then(setCategories).catch(() => {});
    loadCourses();
  }, []);

  const doSearch = () => {
    if (search.trim()) fetch(`${API_URL}/courses/search?keyword=${search}`).then(r => r.json()).then(setCourses).catch(() => {});
    else loadCourses();
  };
  const filtered = sel ? courses.filter(c => c.category?.id === sel) : courses;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
      <div className="fu0" style={{ marginBottom: 38 }}>
        <p className="eyebrow">Catalog</p>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-.02em', marginBottom: 5 }}>All Courses</h1>
        <p style={{ color: 'var(--mut)', fontSize: 15 }}>Discover skills that move your career forward</p>
      </div>
      <div className="fu1" style={{ ...S.row({ gap: 10, marginBottom: 26 }) }}>
        <input className="linput" style={{ maxWidth: 460 }} type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="Search courses…" />
        <button onClick={doSearch} className="lbtn lbtn-ink">Search</button>
      </div>
      <div className="fu2" style={{ ...S.row({ flexWrap: 'wrap', gap: 8, marginBottom: 32 }) }}>
        <button onClick={() => setSel(null)} className={`lpill ${sel === null ? 'on' : ''}`}>All</button>
        {categories.map(c => <button key={c.id} onClick={() => setSel(c.id)} className={`lpill ${sel === c.id ? 'on' : ''}`}>{c.icon} {c.name}</button>)}
      </div>
      <p style={{ color: 'var(--mut)', fontSize: 13, marginBottom: 22 }}>{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>
      {filtered.length > 0
        ? <div style={S.grid('repeat(auto-fill,minmax(300px,1fr))', 22)}>{filtered.map(c => <CourseCard key={c.id} course={c} onPageChange={onPageChange} />)}</div>
        : <div style={{ textAlign: 'center', padding: '72px 24px', color: 'var(--mut)' }}><div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div><p style={{ fontSize: 17, fontWeight: 600 }}>No courses found</p><p style={{ fontSize: 14, marginTop: 5 }}>Try a different search or category</p></div>
      }
    </div>
  );
}

// ── Video Player ───────────────────────────────────────────────────────────────
function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const getUrl = (u: string) => u.startsWith('http') ? u : `http://localhost:8080${u}`;
  return <div className="lvid"><video controls preload="metadata" src={getUrl(videoUrl)}>Your browser does not support video.</video></div>;
}

// ── Course Detail ──────────────────────────────────────────────────────────────
function CourseDetailPage({ courseId, user, onPageChange }: { courseId: number; user: User | null; onPageChange: (p: string) => void }) {
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [sel, setSel] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API_URL}/courses/${courseId}/details`, { headers: getAuthHeaders() }).then(r => r.json()).then(d => {
      setCourse(d.course); setLessons(d.lessons || []); setIsEnrolled(d.isEnrolled); setIsOwner(d.isOwner);
      if ((d.isEnrolled || d.isOwner) && d.lessons?.length > 0) setSel(d.lessons[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, [courseId]);

  const enroll = async () => {
    if (!user) { onPageChange('login'); return; }
    const res = await fetch(`${API_URL}/enrollments/${courseId}`, { method: 'POST', headers: getAuthHeaders() });
    if (res.ok) { alert('Successfully enrolled!'); load(); }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12 }}><span className="lspin lspin-ink" style={{ width: 32, height: 32, borderWidth: 3 }} /><span style={{ color: 'var(--mut)', fontFamily: 'var(--fb)' }}>Loading course…</span></div>;
  if (!course) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--mut)', fontFamily: 'var(--fb)' }}>Course not found.</div>;

  const hasAccess = isEnrolled || isOwner;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
        <div className="fu0">
          {hasAccess && sel?.videoUrl ? (
            <>
              <VideoPlayer videoUrl={sel.videoUrl} />
              <div style={{ marginTop: 22 }}>
                <span className="ltag ltag-acc" style={{ marginBottom: 10, display: 'inline-flex' }}>▶ Now playing</span>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-.01em' }}>{sel.title}</h2>
                <p style={{ color: 'var(--mut)', lineHeight: 1.75, fontSize: 15 }}>{sel.description}</p>
              </div>
            </>
          ) : (
            <div className="lhero" style={{ borderRadius: 'var(--rl)', padding: '64px 40px', textAlign: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 52, marginBottom: 18 }}>🎓</div>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: 26, fontWeight: 800, color: 'var(--wht)', marginBottom: 10, letterSpacing: '-.01em' }}>{course.title}</h2>
                <p style={{ color: 'rgba(250,250,248,.5)', maxWidth: 380, margin: '0 auto 20px', fontSize: 14 }}>Enroll to unlock {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.09)', padding: '9px 18px', borderRadius: 99, color: 'rgba(250,250,248,.55)', fontSize: 13, fontFamily: 'var(--fb)' }}>🔒 Enroll below to access all video lessons</div>
              </div>
            </div>
          )}
          <div style={{ marginTop: 36, paddingTop: 32, borderTop: '1px solid var(--brd)' }}>
            <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>About this course</h2>
            <p style={{ color: 'var(--mut)', lineHeight: 1.8, fontSize: 15 }}>{course.description}</p>
            <div style={{ ...S.row({ gap: 28, flexWrap: 'wrap', marginTop: 22 }) }}>
              {[['Instructor', course.instructor?.name], ['Lessons', lessons.length], ...(course.level ? [['Level', course.level]] : [])].map(([k, v]) => (
                <div key={String(k)}><div style={{ fontSize: 11, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700, marginBottom: 2 }}>{k}</div><div style={{ fontWeight: 700, fontSize: 15 }}>{v}</div></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lside fu1">
          <div style={{ textAlign: 'center', paddingBottom: 22, marginBottom: 22, borderBottom: '1px solid var(--brd)' }}>
            <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 40, letterSpacing: '-.02em' }}>${course.price}</div>
          </div>
          {isOwner
            ? <div className="lalert" style={{ background: 'rgba(232,100,60,.08)', color: 'var(--acc)', border: '1px solid rgba(232,100,60,.2)', textAlign: 'center', fontWeight: 700, marginBottom: 18, fontSize: 14 }}>✓ You created this course</div>
            : isEnrolled
            ? <div className="lalert lalert-ok" style={{ textAlign: 'center', fontWeight: 700, marginBottom: 18 }}>✓ Enrolled — select a lesson</div>
            : <button onClick={enroll} className="lbtn lbtn-acc" style={{ width: '100%', fontSize: 15, padding: '13px 22px', marginBottom: 14 }}>Enroll Now — Start Learning</button>
          }
          {!hasAccess && (
            <div style={{ padding: 15, borderRadius: 'var(--r)', background: 'var(--surf)', marginBottom: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mut)', marginBottom: 9 }}>Course includes</p>
              {[`🎬 ${lessons.length} video lesson${lessons.length !== 1 ? 's' : ''}`, '📱 Access on any device', '♾️ Lifetime access'].map(t => (
                <div key={t} style={{ fontSize: 13, color: 'var(--txt)', padding: '4px 0', fontFamily: 'var(--fb)' }}>{t}</div>
              ))}
            </div>
          )}
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mut)', marginBottom: 10 }}>Course content ({lessons.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 360, overflowY: 'auto' }}>
            {lessons.map((l: any, i) => (
              <div key={l.id} className={`litem ${sel?.id === l.id ? 'on' : ''}`} onClick={() => { if (hasAccess && l.videoUrl) setSel(l); else if (!hasAccess) alert('Please enroll to watch lessons.'); }}>
                <div className={`lnum ${!hasAccess ? 'lk' : ''}`}>{hasAccess ? i + 1 : '🔒'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--fb)' }}>{l.title}</p>
                  {l.duration && <p style={{ fontSize: 11, color: 'var(--mut)', marginTop: 1 }}>{Math.floor(l.duration / 60)}:{String(l.duration % 60).padStart(2, '0')}</p>}
                </div>
                {!hasAccess && <span style={{ fontSize: 11, color: 'var(--mut)', flexShrink: 0 }}>Locked</span>}
              </div>
            ))}
            {lessons.length === 0 && <p style={{ fontSize: 13, color: 'var(--mut)', textAlign: 'center', padding: '14px 0', fontFamily: 'var(--fb)' }}>No lessons yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── My Learning ────────────────────────────────────────────────────────────────
function MyLearningPage({ user, onPageChange }: { user: User; onPageChange: (p: string) => void }) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  useEffect(() => { fetch(`${API_URL}/enrollments/my`, { headers: getAuthHeaders() }).then(r => r.json()).then(setEnrollments).catch(() => {}); }, []);
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
      <div className="fu0" style={{ marginBottom: 38 }}>
        <p className="eyebrow">Your library</p>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, letterSpacing: '-.02em' }}>My Learning</h1>
      </div>
      {enrollments.length === 0
        ? <div style={{ textAlign: 'center', padding: '72px 24px' }}><div style={{ fontSize: 48, marginBottom: 16 }}>📚</div><p style={{ fontSize: 18, fontWeight: 700, marginBottom: 7, fontFamily: 'var(--fd)' }}>No courses yet</p><p style={{ color: 'var(--mut)', marginBottom: 22, fontSize: 15 }}>Start exploring and enroll in your first course</p><button onClick={() => onPageChange('courses')} className="lbtn lbtn-ink">Browse Courses →</button></div>
        : <div style={S.grid('repeat(auto-fill,minmax(300px,1fr))', 22)}>
            {enrollments.map(e => (
              <div key={e.id} className="lcard">
                <div className="lcard-thumb">{e.course?.thumbnail ? <img src={e.course.thumbnail} alt="" /> : <div className="lcard-thumb-ph">📚</div>}</div>
                <div style={{ padding: '20px 22px 22px' }}>
                  <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{e.course?.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--mut)', marginBottom: 16 }}>by {e.course?.instructor?.name}</p>
                  <button onClick={() => onPageChange(`course-${e.course?.id}`)} className="lbtn lbtn-ink" style={{ width: '100%' }}>Continue Learning →</button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── Video Upload ───────────────────────────────────────────────────────────────
function VideoUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false); const [drag, setDrag] = useState(false);
  const doUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) { alert('Please upload a video file'); return; }
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const res = await fetch(`${API_URL}/videos/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'X-User-Email': localStorage.getItem('userEmail') || '' }, body: fd });
      const d = await res.json();
      if (res.ok && d.videoUrl) { onUploadComplete(d.videoUrl); alert('Video uploaded!'); }
      else alert('Upload failed: ' + (d.error || 'Unknown error'));
    } catch { alert('Failed to upload video.'); } finally { setUploading(false); }
  };
  return (
    <div className={`lupload ${drag ? 'drag' : ''}`} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) doUpload(f); }}>
      {uploading
        ? <div style={{ ...S.col({ alignItems: 'center', gap: 10 }) }}><span className="lspin lspin-ink" style={{ width: 28, height: 28, borderWidth: 3 }} /><p style={{ color: 'var(--mut)', fontSize: 14, fontFamily: 'var(--fb)' }}>Uploading…</p></div>
        : <><div style={{ fontSize: 32, marginBottom: 10 }}>📤</div><p style={{ color: 'var(--mut)', fontSize: 14, marginBottom: 13, fontFamily: 'var(--fb)' }}>Drag & drop a video here, or</p><label className="lbtn lbtn-ink lbtn-sm" style={{ cursor: 'pointer' }}>Browse Files<input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) doUpload(f); }} /></label><p style={{ fontSize: 11, color: 'var(--mut)', marginTop: 10, fontFamily: 'var(--fb)' }}>MP4, MOV, AVI, WebM · Max 500MB</p></>
      }
    </div>
  );
}

// ── Lesson Modal ───────────────────────────────────────────────────────────────
function LessonModal({ courseId, lesson, onClose, onSave }: { courseId: number; lesson?: Lesson | null; onClose: () => void; onSave: () => void }) {
  const [title, setTitle] = useState(lesson?.title || ''); const [description, setDescription] = useState(lesson?.description || '');
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || ''); const [duration, setDuration] = useState(lesson?.duration || 0);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!title || !videoUrl) { alert('Title and video are required'); return; }
    setSaving(true);
    try {
      const res = await fetch(lesson ? `${API_URL}/lessons/${lesson.id}` : `${API_URL}/lessons`, { method: lesson ? 'PUT' : 'POST', headers: getAuthHeaders(), body: JSON.stringify({ title, description, videoUrl, duration, courseId, orderIndex: lesson?.orderIndex || 0 }) });
      if (res.ok) { onSave(); onClose(); } else alert('Failed to save lesson');
    } catch { alert('Error saving'); } finally { setSaving(false); }
  };
  const del = async () => {
    if (!lesson || !confirm('Delete this lesson?')) return;
    const res = await fetch(`${API_URL}/lessons/${lesson.id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) { onSave(); onClose(); } else alert('Failed to delete');
  };
  return (
    <div className="lmodal-bg">
      <div className="lmodal">
        <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--brd)', ...S.row({ justifyContent: 'space-between' }) }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 19 }}>{lesson ? 'Edit Lesson' : 'Add Lesson'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--mut)', lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FieldWrap label="Lesson Title *"><input className="linput" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter lesson title" /></FieldWrap>
          <FieldWrap label="Description"><textarea className="linput" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What will students learn?" style={{ resize: 'vertical' }} /></FieldWrap>
          <FieldWrap label="Video *">
            {videoUrl
              ? <div style={{ border: '1px solid var(--brd)', borderRadius: 'var(--r)', padding: 14 }}>
                  <div style={{ ...S.row({ justifyContent: 'space-between', marginBottom: 10 }) }}><span style={{ fontSize: 12, color: 'var(--mut)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontFamily: 'var(--fb)' }}>{videoUrl}</span><button onClick={() => setVideoUrl('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: 8, fontSize: 16 }}>✕</button></div>
                  <VideoPlayer videoUrl={videoUrl} />
                </div>
              : <VideoUpload onUploadComplete={setVideoUrl} />
            }
          </FieldWrap>
          <FieldWrap label="Duration (seconds)"><input className="linput" type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value) || 0)} placeholder="e.g. 360" /></FieldWrap>
        </div>
        <div style={{ padding: '18px 26px', borderTop: '1px solid var(--brd)', ...S.row({ justifyContent: 'space-between' }) }}>
          <div>{lesson && <button onClick={del} className="lbtn lbtn-red lbtn-sm">Delete</button>}</div>
          <div style={S.row({ gap: 10 })}>
            <button onClick={onClose} className="lbtn lbtn-ghost lbtn-sm">Cancel</button>
            <button onClick={save} disabled={saving} className="lbtn lbtn-ink lbtn-sm">{saving ? <><span className="lspin" style={{ marginRight: 5 }} />Saving…</> : 'Save lesson'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Course Editor ──────────────────────────────────────────────────────────────
function CourseEditor({ course, onClose, onSave }: { course?: Course | null; onClose: () => void; onSave: () => void }) {
  const [title, setTitle] = useState(course?.title || ''); const [description, setDescription] = useState(course?.description || '');
  const [price, setPrice] = useState(course?.price || 0); const [thumbnail, setThumbnail] = useState(course?.thumbnail || '');
  const [published, setPublished] = useState(course?.published || false); const [categoryId, setCategoryId] = useState<number | null>(course?.category?.id || null);
  const [categories, setCategories] = useState<Category[]>([]); const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showLesson, setShowLesson] = useState(false); const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);

  const loadLessons = () => { if (course?.id) fetch(`${API_URL}/lessons/course/${course.id}`, { headers: getAuthHeaders() }).then(r => r.json()).then(setLessons).catch(() => {}); };
  useEffect(() => { fetch(`${API_URL}/categories`).then(r => r.json()).then(setCategories).catch(() => {}); if (course?.id) loadLessons(); }, [course?.id]);

  const save = async () => {
    if (!title) { alert('Title required'); return; }
    setSaving(true);
    try {
      const res = await fetch(course ? `${API_URL}/courses/${course.id}` : `${API_URL}/courses`, { method: course ? 'PUT' : 'POST', headers: getAuthHeaders(), body: JSON.stringify({ title, description, price, thumbnail, published, categoryId }) });
      if (res.ok) { if (!course) { alert('Course created! Now add lessons.'); onSave(); } else { loadLessons(); alert('Course updated!'); } }
      else { const d = await res.json().catch(() => ({})); alert('Failed: ' + (d.error || d.message || 'Unknown')); }
    } catch { alert('Error saving'); } finally { setSaving(false); }
  };
  const delCourse = async () => {
    if (!course || !confirm('Delete this course? This cannot be undone.')) return;
    const res = await fetch(`${API_URL}/courses/${course.id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) { onSave(); onClose(); } else alert('Failed to delete');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ ...S.row({ justifyContent: 'space-between', marginBottom: 32 }) }}>
        <div><p className="eyebrow">{course ? 'Editing' : 'Creating new'}</p><h1 style={{ fontFamily: 'var(--fd)', fontSize: 26, fontWeight: 800, letterSpacing: '-.01em' }}>{course ? course.title : 'New Course'}</h1></div>
        <button onClick={onClose} className="lbtn lbtn-ghost lbtn-sm">← Back</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 26, alignItems: 'start' }}>
        <div style={{ background: 'var(--wht)', borderRadius: 'var(--rl)', border: '1px solid var(--brd)', padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <FieldWrap label="Course Title *"><input className="linput" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Complete React Developer Course" /></FieldWrap>
          <FieldWrap label="Description"><textarea className="linput" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="What will students achieve?" style={{ resize: 'vertical' }} /></FieldWrap>
          <FieldWrap label="Category"><select className="linput" value={categoryId || ''} onChange={e => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}><option value="">Select category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></FieldWrap>
          <div style={S.grid('1fr 1fr', 16)}>
            <FieldWrap label="Price (USD)"><input className="linput" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} min={0} step={0.01} /></FieldWrap>
            <FieldWrap label="Visibility">
              <div onClick={() => setPublished(!published)} style={{ padding: '11px 15px', borderRadius: 'var(--r)', border: `1.5px solid ${published ? 'rgba(34,197,94,.3)' : 'var(--brd)'}`, background: published ? 'rgba(34,197,94,.05)' : 'var(--wht)', cursor: 'pointer', ...S.row({ gap: 12 }) }}>
                <div className="ltoggle-track" style={{ background: published ? '#22c55e' : 'var(--surf2)' }}><div className="ltoggle-thumb" style={{ left: published ? 21 : 3 }} /></div>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--fb)' }}>{published ? 'Published' : 'Draft'}</span>
              </div>
            </FieldWrap>
          </div>
          <FieldWrap label="Thumbnail URL"><input className="linput" value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://…" /></FieldWrap>
          <div style={S.row({ gap: 12, paddingTop: 6 })}>
            <button onClick={save} disabled={saving} className="lbtn lbtn-ink">{saving ? <><span className="lspin" style={{ marginRight: 6 }} />Saving…</> : course ? 'Update Course' : 'Create Course'}</button>
            {course && <button onClick={delCourse} className="lbtn lbtn-red">Delete Course</button>}
          </div>
        </div>
        {/* Lessons panel */}
        <div style={{ background: 'var(--wht)', borderRadius: 'var(--rl)', border: '1px solid var(--brd)', padding: 22, position: 'sticky', top: 76 }}>
          <div style={{ ...S.row({ justifyContent: 'space-between', marginBottom: 16 }) }}>
            <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 16 }}>Lessons</h2>
            {course && <button onClick={() => { setEditingLesson(null); setShowLesson(true); }} className="lbtn lbtn-acc lbtn-sm">+ Add</button>}
          </div>
          {!course && <p style={{ fontSize: 13, color: 'var(--mut)', marginBottom: 10, fontFamily: 'var(--fb)' }}>Save the course first to add lessons.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 380, overflowY: 'auto' }}>
            {lessons.map((l, i) => (
              <div key={l.id} className="litem" onClick={() => { setEditingLesson(l); setShowLesson(true); }}>
                <div className="lnum">{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--fb)' }}>{l.title}</p>{l.duration && <p style={{ fontSize: 11, color: 'var(--mut)', marginTop: 1 }}>{Math.floor(l.duration / 60)}:{String(l.duration % 60).padStart(2, '0')}</p>}</div>
                <span style={{ fontSize: 11, color: 'var(--mut)' }}>Edit →</span>
              </div>
            ))}
            {lessons.length === 0 && course && <div style={{ textAlign: 'center', padding: '22px 0', color: 'var(--mut)', fontSize: 13, fontFamily: 'var(--fb)' }}>No lessons yet. Click "+ Add".</div>}
          </div>
        </div>
      </div>
      {course && lessons.length > 0 && (
        <div style={{ marginTop: 28, background: 'var(--wht)', borderRadius: 'var(--rl)', border: '1px solid var(--brd)', padding: 26 }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 17, marginBottom: 18 }}>Lesson Preview</h2>
          <div style={S.grid('repeat(auto-fill,minmax(280px,1fr))', 18)}>
            {lessons.slice(0, 3).map((l, i) => (
              <div key={l.id} style={{ borderRadius: 'var(--r)', border: '1px solid var(--brd)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--brd)', ...S.row({ gap: 9 }) }}><div className="lnum" style={{ width: 22, height: 22, fontSize: 10 }}>{i + 1}</div><span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--fb)' }}>{l.title}</span></div>
                <div style={{ padding: 10 }}><VideoPlayer videoUrl={l.videoUrl} /></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showLesson && course && <LessonModal courseId={course.id} lesson={editingLesson} onClose={() => setShowLesson(false)} onSave={loadLessons} />}
    </div>
  );
}

// ── Instructor Dashboard ───────────────────────────────────────────────────────
function InstructorDashboard({ onPageChange }: { onPageChange: (p: string) => void }) {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sel, setSel] = useState<Course | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    fetch(`${API_URL}/courses/instructor/dashboard`, { headers: getAuthHeaders() }).then(r => r.json()).then(setDashboard).catch(() => {});
    fetch(`${API_URL}/courses/my-courses`, { headers: getAuthHeaders() }).then(r => r.json()).then(d => { setCourses(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { loadData(); }, []);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12 }}><span className="lspin lspin-ink" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>;
  if (sel !== undefined) return <CourseEditor course={sel} onClose={() => setSel(undefined)} onSave={() => { loadData(); setSel(undefined); }} />;

  const stats = [
    { label: 'Courses', value: dashboard?.totalCourses ?? 0, icon: '📚', color: '#6366f1' },
    { label: 'Lessons', value: dashboard?.totalLessons ?? 0, icon: '🎬', color: '#8b5cf6' },
    { label: 'Students', value: dashboard?.totalStudents ?? 0, icon: '👥', color: '#22c55e' },
    { label: 'Revenue', value: `$${dashboard?.totalRevenue ?? 0}`, icon: '💰', color: '#f59e0b' },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
      <div className="fu0" style={{ marginBottom: 34 }}>
        <p className="eyebrow">Instructor</p>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, letterSpacing: '-.02em' }}>Dashboard</h1>
      </div>
      <div className="fu1" style={S.grid('repeat(auto-fit,minmax(190px,1fr))', 18, { marginBottom: 36 })}>
        {stats.map(s => (
          <div key={s.label} className="lstat">
            <div style={{ ...S.row({ justifyContent: 'space-between', marginBottom: 14 }) }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: 'var(--fb)' }}>{s.label}</span>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}18`, ...S.row({ justifyContent: 'center', fontSize: 16 }) }}>{s.icon}</div>
            </div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 34, fontWeight: 800, color: s.color, letterSpacing: '-.02em' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="fu2" style={{ background: 'var(--wht)', borderRadius: 'var(--rl)', border: '1px solid var(--brd)', overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px', ...S.row({ justifyContent: 'space-between', borderBottom: '1px solid var(--brd)' }) }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 18 }}>My Courses</h2>
          <button onClick={() => setSel(null)} className="lbtn lbtn-acc lbtn-sm">+ New Course</button>
        </div>
        {courses.length === 0
          ? <div style={{ padding: '60px 24px', textAlign: 'center' }}><div style={{ fontSize: 44, marginBottom: 14 }}>📝</div><p style={{ fontWeight: 700, marginBottom: 6, fontFamily: 'var(--fd)', fontSize: 17 }}>No courses yet</p><p style={{ color: 'var(--mut)', fontSize: 14, marginBottom: 22 }}>Create your first course to start teaching</p><button onClick={() => setSel(null)} className="lbtn lbtn-ink">Create Course</button></div>
          : <div style={{ overflowX: 'auto' }}>
              <table className="ltbl">
                <thead><tr><th>Course</th><th>Lessons</th><th>Students</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c.id}>
                      <td><div style={S.row({ gap: 14 })}><div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--ink2)', overflow: 'hidden', flexShrink: 0, ...S.row({ justifyContent: 'center', fontSize: 18 }) }}>{c.thumbnail ? <img src={c.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📚'}</div><div><div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--fb)' }}>{c.title}</div><div style={{ fontSize: 12, color: 'var(--mut)', marginTop: 1, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--fb)' }}>{c.description}</div></div></div></td>
                      <td style={{ fontWeight: 700 }}>{c.lessons?.length || 0}</td>
                      <td style={{ fontWeight: 700 }}>{c.enrollments?.length || 0}</td>
                      <td style={{ fontWeight: 800, color: 'var(--acc)', fontFamily: 'var(--fd)' }}>${c.price}</td>
                      <td><span className={`ltag ${c.published ? 'ltag-grn' : 'ltag-amb'}`}>{c.published ? '● Published' : '○ Draft'}</span></td>
                      <td><div style={S.row({ gap: 8 })}><button onClick={() => onPageChange(`course-${c.id}`)} className="lbtn lbtn-ghost lbtn-sm">Preview</button><button onClick={() => setSel(c)} className="lbtn lbtn-ink lbtn-sm">Edit</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>
      {dashboard?.courses && dashboard.courses.length > 0 && (
        <div className="fu3" style={{ marginTop: 26, background: 'var(--wht)', borderRadius: 'var(--rl)', border: '1px solid var(--brd)', overflow: 'hidden' }}>
          <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--brd)' }}><h2 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 18 }}>Course Performance</h2></div>
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dashboard.courses.map(c => (
              <div key={c.id} style={{ padding: '18px 20px', borderRadius: 'var(--r)', border: '1px solid var(--brd)' }}>
                <div style={{ ...S.row({ justifyContent: 'space-between', marginBottom: 14 }) }}><span style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--fb)' }}>{c.title}</span><span className={`ltag ${c.published ? 'ltag-grn' : 'ltag-amb'}`}>{c.published ? 'Published' : 'Draft'}</span></div>
                <div style={S.row({ gap: 28, flexWrap: 'wrap' })}>
                  {[['Lessons', c.lessonsCount], ['Students', c.enrolledStudents], ['Price', `$${c.price}`], ['Revenue', `$${c.price * c.enrolledStudents}`]].map(([k, v]) => (
                    <div key={String(k)}><div style={{ fontSize: 11, color: 'var(--mut)', textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 700, marginBottom: 2, fontFamily: 'var(--fb)' }}>{k}</div><div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 20 }}>{v}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); const email = localStorage.getItem('userEmail');
    if (token && email) {
      fetch(`${API_URL}/auth/me`, { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': email } })
        .then(r => { if (r.ok) return r.json(); throw new Error(); }).then(setUser).catch(() => localStorage.clear());
    }
    const onHash = () => { const h = window.location.hash.slice(1); if (h) setCurrentPage(h); };
    onHash(); window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goTo = (p: string) => { setCurrentPage(p); window.location.hash = p; };
  const courseId = currentPage.startsWith('course-') ? parseInt(currentPage.split('-')[1]) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surf)' }}>
      <Navbar user={user} onPageChange={goTo} currentPage={currentPage} />
      {currentPage === 'home' && <HomePage onPageChange={goTo} />}
      {currentPage === 'courses' && <CoursesPage onPageChange={goTo} />}
      {currentPage === 'login' && <LoginPage onPageChange={goTo} onLogin={u => setUser(u)} />}
      {currentPage === 'register' && <RegisterPage onPageChange={goTo} onLogin={u => setUser(u)} />}
      {currentPage === 'instructor' && user?.role === 'INSTRUCTOR' && <InstructorDashboard onPageChange={goTo} />}
      {currentPage === 'my-learning' && user && <MyLearningPage user={user} onPageChange={goTo} />}
      {courseId && <CourseDetailPage courseId={courseId} user={user} onPageChange={goTo} />}
      {(currentPage === 'instructor' || currentPage === 'my-learning') && !user && (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🔒</div>
          <p style={{ fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Login required</p>
          <p style={{ color: 'var(--mut)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--fb)' }}>Please log in to access this page</p>
          <button onClick={() => goTo('login')} className="lbtn lbtn-ink">Log in →</button>
        </div>
      )}
    </div>
  );
}