'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, GitBranch, BadgeCheck, Eye, EyeOff } from 'lucide-react';

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  .pg{min-height:100vh;display:flex;flex-direction:column;background:#FAF9F7;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
  .nav{background:#fff;border-bottom:1px solid #EBEBEB;height:54px;display:flex;align-items:center;padding:0 36px;justify-content:space-between}
  .nav-logo{font-size:1rem;font-weight:700;color:#1a1a1a;letter-spacing:0.01em;text-decoration:none}
  .nav-links{display:flex;gap:28px;list-style:none}
  .nav-links a{font-size:0.8125rem;color:#555;text-decoration:none;transition:color 0.15s}
  .nav-links a:hover{color:#1a1a1a}
  .main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 16px 60px}
  .card{background:#fff;border:1px solid #E8E6E1;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);padding:32px 36px 28px;width:100%;max-width:380px;display:flex;flex-direction:column;align-items:center;animation:fadeUp 0.2s ease}
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .icon-wrap{width:42px;height:42px;background:#FDF3E3;border:1.5px solid #F0D9A8;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
  .title{font-size:1.2rem;font-weight:600;color:#1a1a1a;text-align:center;margin-bottom:5px;letter-spacing:-0.01em}
  .sub{font-size:0.79rem;color:#888;text-align:center;line-height:1.6;margin-bottom:22px;max-width:260px}
  .form{width:100%;display:flex;flex-direction:column;gap:14px}
  .field{display:flex;flex-direction:column;gap:5px}
  .lbl{font-size:0.78rem;font-weight:500;color:#444}
  .inp{height:42px;border:1.5px solid #E0DDD8;border-radius:8px;outline:none;padding:0 12px;font-size:0.875rem;color:#1a1a1a;font-family:inherit;background:#fff;transition:border-color 0.15s,box-shadow 0.15s;width:100%}
  .inp:focus{border-color:#C8922A;box-shadow:0 0 0 3px rgba(200,146,42,0.1)}
  .inp::placeholder{color:#BBBBBB}
  .inp.err-border{border-color:#E05252}
  .pw-wrap{position:relative}
  .pw-wrap .inp{padding-right:40px}
  .pw-toggle{position:absolute;right:11px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#aaa;display:flex;align-items:center;padding:0;transition:color 0.15s}
  .pw-toggle:hover{color:#666}
  .forgot{font-size:0.73rem;color:#C8922A;text-decoration:none;text-align:right;display:block;margin-top:2px}
  .forgot:hover{text-decoration:underline}
  .err{font-size:0.72rem;color:#C0392B;margin-top:2px}
  .cta{width:100%;margin-top:4px;padding:11px 20px;background:#C8922A;color:#fff;border:none;border-radius:8px;font-size:0.9rem;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background 0.15s,transform 0.1s}
  .cta:hover:not(:disabled){background:#B8831F}
  .cta:active:not(:disabled){transform:translateY(1px)}
  .cta:disabled{opacity:0.55;cursor:not-allowed}
  .spinner{width:15px;height:15px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .link-row{margin-top:14px;font-size:0.78rem;color:#999;text-align:center}
  .link-row a{color:#C8922A;font-weight:500;text-decoration:none}
  .link-row a:hover{text-decoration:underline}
  .badges{display:flex;justify-content:center;gap:32px;margin-top:24px}
  .badge{display:flex;flex-direction:column;align-items:center;gap:5px;font-size:0.58rem;font-weight:600;color:#BBB;letter-spacing:0.07em;text-transform:uppercase}
  .badge-ring{width:28px;height:28px;border:1px solid #E0DDD8;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#CCC}
  .success-wrap{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:10px 0;animation:fadeUp 0.25s ease}
  .success-icon{width:46px;height:46px;background:#EBF7EE;border:1.5px solid #A8D5B0;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:6px}
  .footer{background:#1a1a1a;padding:16px 36px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
  .footer-logo{font-size:0.875rem;font-weight:700;color:#fff;letter-spacing:0.01em}
  .footer-links{display:flex;gap:18px;list-style:none}
  .footer-links a{font-size:0.7rem;color:#888;text-decoration:none;transition:color 0.15s}
  .footer-links a:hover{color:#ccc}
  .footer-copy{font-size:0.7rem;color:#555;white-space:nowrap}
  @media(max-width:600px){.nav{padding:0 16px}.card{padding:24px 18px 20px}.footer{padding:16px;flex-direction:column;align-items:flex-start}}
`;

interface Fields { email: string; password: string; }
interface Errors { email?: string; password?: string; }

export default function SecureSignInPage() {
  const [fields, setFields] = useState<Fields>({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (!fields.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email';
    if (!fields.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pg">
        <nav className="nav">
          <Link href="/" className="nav-logo">VIBES</Link>
          <ul className="nav-links">
            {['Inventory','Sell','Financing','Concierge'].map(l => <li key={l}><Link href="#">{l}</Link></li>)}
          </ul>
        </nav>

        <main className="main">
          <div className="card">
            {success ? (
              <div className="success-wrap">
                <div className="success-icon"><BadgeCheck size={22} color="#3A9E55" /></div>
                <p style={{fontSize:'1.1rem',fontWeight:600,color:'#1a1a1a'}}>You&apos;re signed in</p>
                <p style={{fontSize:'0.8rem',color:'#888',lineHeight:1.6}}>Welcome back to your AutoPremium dashboard.</p>
              </div>
            ) : (
              <>
                <div className="icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8922A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>

                <h1 className="title">Sign in to AutoPremium</h1>
                <p className="sub">Enter your email and password to continue.</p>

                <form className="form" onSubmit={handleSubmit} noValidate>
                  <div className="field">
                    <label className="lbl" htmlFor="email">Email address</label>
                    <input
                      id="email"
                      className={`inp${errors.email ? ' err-border' : ''}`}
                      type="email"
                      placeholder="you@example.com"
                      value={fields.email}
                      onChange={set('email')}
                      autoComplete="email"
                    />
                    {errors.email && <span className="err">{errors.email}</span>}
                  </div>

                  <div className="field">
                    <label className="lbl" htmlFor="password">Password</label>
                    <div className="pw-wrap">
                      <input
                        id="password"
                        className={`inp${errors.password ? ' err-border' : ''}`}
                        type={showPw ? 'text' : 'password'}
                        placeholder="Your password"
                        value={fields.password}
                        onChange={set('password')}
                        autoComplete="current-password"
                      />
                      <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)} tabIndex={-1}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && <span className="err">{errors.password}</span>}
                    <Link href="#" className="forgot">Forgot password?</Link>
                  </div>

                  <button type="submit" className="cta" disabled={loading}>
                    {loading ? <div className="spinner" /> : <>Sign in <ArrowRight size={14} /></>}
                  </button>
                </form>

                <p className="link-row">Don&apos;t have an account? <Link href="/secure-signup">Create one</Link></p>
              </>
            )}
          </div>

          {!success && (
            <div className="badges">
              {[{icon:<Shield size={12}/>,label:'Secure'},{icon:<GitBranch size={12}/>,label:'Traceable'},{icon:<BadgeCheck size={12}/>,label:'Verified'}].map(b => (
                <div key={b.label} className="badge"><div className="badge-ring">{b.icon}</div>{b.label}</div>
              ))}
            </div>
          )}
        </main>

        <footer className="footer">
          <span className="footer-logo">AutoPremium</span>
          <ul className="footer-links">
            {['Privacy Policy','Terms of Service','Verified Seller Program','Support'].map(l => (
              <li key={l}><Link href="#">{l}</Link></li>
            ))}
          </ul>
          <span className="footer-copy">© 2024 AutoPremium. Precision. Transparency. Authority.</span>
        </footer>
      </div>
    </>
  );
}
