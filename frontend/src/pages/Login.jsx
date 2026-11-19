import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle, ShieldCheck, QrCode, Database, Copy } from 'lucide-react'
import { Logo } from '../components/ui'
import { useSession, homeFor } from '../lib/session'
import { DEMO_PASSWORD } from '../data/fixtures'

const DEMO = [
  { role: 'Student', email: 'bhupesh.demo@attendx.test' },
  { role: 'Student', email: 'alisha.demo@attendx.test' },
  { role: 'Student', email: 'rohit.demo@attendx.test' },
  { role: 'Teacher', email: 'meera.teacher@attendx.test' },
  { role: 'Teacher', email: 'arjun.teacher@attendx.test' },
  { role: 'Admin', email: 'admin@attendx.test' },
]

export default function Login() {
  const { user, login } = useSession()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={homeFor(user.role)} replace />

  function validate() {
    const e = {}
    if (!email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email address.'
    if (!password) e.password = 'Password is required.'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.'
    return e
  }

  async function submit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setLoading(true)
    try {
      const u = await login(email, password)
      navigate(homeFor(u.role), { replace: true })
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setLoading(false)
    }
  }

  const fill = (addr) => { setEmail(addr); setPassword(DEMO_PASSWORD); setErrors({}) }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy-900 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative"><Logo light size="lg" /></div>
        <div className="relative mt-auto max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">Every class.<br />Every student.<br /><span className="text-sky-300">Verified in seconds.</span></h1>
          <p className="mt-4 text-navy-200">AttendX replaces paper registers with secure, expiring QR sessions backed by a fully relational PostgreSQL database.</p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: QrCode, t: 'Secure QR', d: 'Hashed, expiring tokens' },
              { icon: ShieldCheck, t: 'Role-based', d: 'Admin · Teacher · Student' },
              { icon: Database, t: '3NF schema', d: '8 relational tables' },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <I className="h-5 w-5 text-sky-300" />
                <div className="mt-3 text-sm font-semibold">{t}</div>
                <div className="text-xs text-navy-300">{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-10 text-xs text-navy-400">B.Tech CSE · RDBMS Course Project</div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo size="lg" /></div>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900">Sign in to AttendX</h2>
          <p className="mt-1 text-sm text-slate-500">Use your university email to access your dashboard.</p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            {errors.form && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
                <AlertCircle className="h-4 w-4" /> {errors.form}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-900" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="email" type="email" autoComplete="username" className={`input pl-9 ${errors.email ? 'border-rose-300' : ''}`} placeholder="name@attendx.test" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {errors.email && <p className="mt-1 text-xs font-medium text-rose-600">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-900" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" className={`input px-9 ${errors.password ? 'border-rose-300' : ''}`} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-700" aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs font-medium text-rose-600">{errors.password}</p>}
            </div>
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : 'Login'}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-navy-900">Demo credentials</div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">password: <span className="rounded bg-navy-50 px-1.5 py-0.5 text-navy-800">{DEMO_PASSWORD}</span></div>
            </div>
            <div className="mt-3 grid gap-1.5">
              {DEMO.map((d) => (
                <button key={d.email} type="button" onClick={() => fill(d.email)} className="group flex items-center gap-3 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-navy-50">
                  <span className="w-14 font-semibold text-navy-700">{d.role}</span>
                  <span className="flex-1 font-mono text-slate-600">{d.email}</span>
                  <Copy className="h-3.5 w-3.5 text-slate-300 group-hover:text-navy-500" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">Click an account to fill the form.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
