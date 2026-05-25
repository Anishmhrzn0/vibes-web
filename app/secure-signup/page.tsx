'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, GitBranch, BadgeCheck, Eye, EyeOff } from 'lucide-react';

const COUNTRY = { dial: '+977', flag: '🇳🇵' };

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
  .phone-row{display:flex;height:42px;border:1.5px solid #E0DDD8;border-radius:8px;overflow:hidden;background:#fff;transition:border-color 0.15s,box-shadow 0.15s}
  .phone-row:focus-within{border-color:#C8922A;box-shadow:0 0 0 3px rgba(200,146,42,0.1)}
  .phone-row.err-border{border-color:#E05252}
  .dial-btn{display:flex;align-items:center;gap:5px;padding:0 11px;background:#FAFAF9;border:none;border-right:1.5px solid #E0DDD8;font-size:0.8125rem;font-weight:500;color:#333;font-family:inherit;cursor:default;white-space:nowrap;flex-shrink:0}
  .phone-inp{flex:1;border:none;outline:none;padding:0 12px;font-size:0.875rem;color:#1a1a1a;font-family:inherit;background:transparent;min-width:0}
  .phone-inp::placeholder{color:#BBBBBB}
  .pw-wrap{position:relative}
  .pw-wrap .inp{padding-right:40px}
  .pw-toggle{position:absolute;right:11px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#aaa;display:flex;align-items:center;padding:0;transition:color 0.15s}
  .pw-toggle:hover{color:#666}
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
  .back-btn{background:none;border:none;color:#aaa;font-size:0.75rem;cursor:pointer;margin-top:10px;font-family:inherit;display:block;width:100%;text-align:center;transition:color 0.15s}
  .back-btn:hover{color:#666}
  .pin-inp{width:100%;height:42px;border:1.5px solid #E0DDD8;border-radius:8px;outline:none;padding:0 12px;font-size:1rem;color:#1a1a1a;font-family:inherit;background:#fff;transition:border-color 0.15s,box-shadow 0.15s;letter-spacing:0.2em}
  .pin-inp:focus{border-color:#C8922A;box-shadow:0 0 0 3px rgba(200,146,42,0.1)}
  .pin-inp::placeholder{color:#BBBBBB;letter-spacing:0.05em}
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

interface Fields { fullName: string; email: string; phone: string; password: string; }
interface Errors { fullName?: string; email?: string; phone?: string; password?: string; pin?: string; }

export default function SecureSignUpPage() {
  const [step, setStep] = useState<'form' | 'pin'>('form');
  const [fields, setFields] = useState<Fields>({ fullName: '', email: '', phone: '', password: '' });
  const [pin, setPin] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const validateForm = () => {
    const e: Errors = {};
    if (!fields.fullName.trim()) e.fullName = 'Full name is required';
    if (!fields.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email';
    if (!fields.phone.trim()) e.phone = 'Phone number is required';
    else if (fields.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number';
    if (!fields.password) e.password = 'Password is required';
    else if (fields.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep('pin');
  };

  const handleConfirmPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 6) { setErrors(er => ({ ...er, pin: 'Enter the 6-digit code' })); return; }
    setErrors({});
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
          <div className="card" key={step}>
            {success ? (
              <div className="success-wrap">
                <div className="success-icon"><BadgeCheck size={22} color="#3A9E55" /></div>
                <p style={{fontSize:'1.1rem',fontWeight:600,color:'#1a1a1a'}}>Account created!</p>
                <p style={{fontSize:'0.8rem',color:'#888',lineHeight:1.6}}>Your AutoPremium account is ready to use.</p>
              </div>
            ) : step === 'form' ? (
              <>
                <div className="icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8922A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h1 className="title">Create your account</h1>
                <p className="sub">Fill in your details to get started.</p>

                <form className="form" onSubmit={handleSubmitForm} noValidate>
                  {/* Full Name */}
                  <div className="field">
                    <label className="lbl" htmlFor="fullName">Full name</label>
                    <input id="fullName" className={`inp${errors.fullName ? ' err-border' : ''}`} type="text" placeholder="Aarav Sharma" value={fields.fullName} onChange={set('fullName')} autoComplete="name" />
                    {errors.fullName && <span className="err">{errors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div className="field">
                    <label className="lbl" htmlFor="email">Email address</label>
                    <input id="email" className={`inp${errors.email ? ' err-border' : ''}`} type="email" placeholder="aarav@example.com" value={fields.email} onChange={set('email')} autoComplete="email" />
                    {errors.email && <span className="err">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="field">
                    <label className="lbl" htmlFor="phone">Phone number</label>
                    <div className={`phone-row${errors.phone ? ' err-border' : ''}`}>
                      <div className="dial-btn">
                        <span>{COUNTRY.flag}</span>
                        <span>{COUNTRY.dial}</span>
                      </div>
                      <input id="phone" className="phone-inp" type="tel" placeholder="98XXXXXXXX" value={fields.phone} onChange={set('phone')} autoComplete="tel-national" />
                    </div>
                    {errors.phone && <span className="err">{errors.phone}</span>}
                  </div>

                  {/* Password */}
                  <div className="field">
                    <label className="lbl" htmlFor="password">Password</label>
                    <div className="pw-wrap">
                      <input id="password" className={`inp${errors.password ? ' err-border' : ''}`} type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={fields.password} onChange={set('password')} autoComplete="new-password" />
                      <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)} tabIndex={-1}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && <span className="err">{errors.password}</span>}
                  </div>

                  <button type="submit" className="cta" disabled={loading}>
                    {loading ? <div className="spinner" /> : <>Continue <ArrowRight size={14} /></>}
                  </button>
                </form>

                <p className="link-row">Already have an account? <Link href="/secure-signin">Sign in</Link></p>
              </>
            ) : (
              <>
                <div className="icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8922A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <h1 className="title">Verify your number</h1>
                <p className="sub">
                  We sent a 6-digit code to {COUNTRY.dial} {'•'.repeat(Math.max(0, fields.phone.length - 3))}{fields.phone.slice(-3)}
                </p>

                <form className="form" onSubmit={handleConfirmPin} noValidate>
                  <div className="field">
                    <label className="lbl" htmlFor="pin">Verification code</label>
                    <input
                      id="pin"
                      className="pin-inp"
                      type="text"
                      inputMode="numeric"
                      placeholder="••••••"
                      value={pin}
                      onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors(er => ({...er, pin: undefined})); }}
                      maxLength={6}
                      autoFocus
                    />
                    {errors.pin && <span className="err">{errors.pin}</span>}
                  </div>

                  <button type="submit" className="cta" disabled={loading || pin.length < 6}>
                    {loading ? <div className="spinner" /> : <>Verify &amp; create account <ArrowRight size={14} /></>}
                  </button>
                  <button type="button" className="back-btn" onClick={() => { setStep('form'); setPin(''); }}>
                    ← Go back and edit details
                  </button>
                </form>

                <p className="link-row">Already have an account? <Link href="/secure-signin">Sign in</Link></p>
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
