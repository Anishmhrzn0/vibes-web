'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Shield, GitBranch, BadgeCheck, Eye, EyeOff } from 'lucide-react';

import { registerSchema, type RegisterSchema } from '@/app/lib/schemas/auth.schema';
import { registerAction } from '@/app/lib/actions/auth.actions';
import { FieldError } from './FieldError';
import s from './auth.module.css';

const NAV_LINKS    = ['Inventory', 'Sell', 'Financing', 'Concierge'] as const;
const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Verified Seller Program', 'Support'] as const;
const TRUST_BADGES = [
  { icon: <Shield size={12} />,     label: 'Secure'    },
  { icon: <GitBranch size={12} />,  label: 'Traceable' },
  { icon: <BadgeCheck size={12} />, label: 'Verified'  },
] as const;

const COUNTRY = { dial: '+977', flag: '🇳🇵' };

type Step = 'form' | 'pin';

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function RegistrationStep({ onNext }: { onNext: (phone: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError]   = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterSchema) {
    setServerError(null);
    try {
      await registerAction(data);
      onNext(data.phone);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <>
      <div className={s.iconWrap}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8922A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h1 className={s.title}>Create your account</h1>
      <p className={s.subtitle}>Fill in your details to get started.</p>

      {serverError && <p className={s.serverError}>{serverError}</p>}

      <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className={s.field}>
          <label className={s.label} htmlFor="fullName">Full name</label>
          <input id="fullName" type="text" placeholder="Aarav Sharma" autoComplete="name"
            className={`${s.input} ${errors.fullName ? s.inputError : ''}`}
            {...register('fullName')} />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="aarav@example.com" autoComplete="email"
            className={`${s.input} ${errors.email ? s.inputError : ''}`}
            {...register('email')} />
          <FieldError message={errors.email?.message} />
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="phone">Phone number</label>
          <div className={`${s.phoneRow} ${errors.phone ? s.phoneRowError : ''}`}>
            <div className={s.dialBtn}>
              <span>{COUNTRY.flag}</span>
              <span>{COUNTRY.dial}</span>
            </div>
            <input id="phone" type="tel" placeholder="98XXXXXXXX" autoComplete="tel-national"
              className={s.phoneInput} {...register('phone')} />
          </div>
          <FieldError message={errors.phone?.message} />
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="password">Password</label>
          <div className={s.passwordWrap}>
            <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" autoComplete="new-password"
              className={`${s.input} ${errors.password ? s.inputError : ''}`}
              {...register('password')} />
            <button type="button" className={s.passwordToggle} onClick={() => setShowPassword(p => !p)} tabIndex={-1} aria-label="Toggle password">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <button type="submit" className={s.submitButton} disabled={isSubmitting}>
          {isSubmitting ? <div className={s.spinner} /> : <><span>Continue</span><ArrowRight size={14} /></>}
        </button>
      </form>

      <p className={s.authPrompt}>Already have an account? <Link href="/login">Sign in</Link></p>
    </>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function PinStep({ phone, onBack }: { phone: string; onBack: () => void }) {
  const [pin, setPin]           = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length < 6) { setPinError('Enter the 6-digit code'); return; }
    setPinError(null);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
  }

  const masked = `${'•'.repeat(Math.max(0, phone.length - 3))}${phone.slice(-3)}`;

  return (
    <>
      <div className={s.iconWrap}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8922A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
      <h1 className={s.title}>Verify your number</h1>
      <p className={s.subtitle}>We sent a 6-digit code to {COUNTRY.dial} {masked}</p>

      <form className={s.form} onSubmit={handleConfirm} noValidate>
        <div className={s.field}>
          <label className={s.label} htmlFor="pin">Verification code</label>
          <input id="pin" type="text" inputMode="numeric" placeholder="••••••" maxLength={6} autoFocus
            className={s.pinInput} value={pin}
            onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setPinError(null); }} />
          {pinError && <FieldError message={pinError} />}
        </div>

        <button type="submit" className={s.submitButton} disabled={loading || pin.length < 6}>
          {loading ? <div className={s.spinner} /> : <><span>Verify &amp; create account</span><ArrowRight size={14} /></>}
        </button>
        <button type="button" className={s.backButton} onClick={onBack}>← Go back and edit details</button>
      </form>

      <p className={s.authPrompt}>Already have an account? <Link href="/login">Sign in</Link></p>
    </>
  );
}

// ─── RegisterForm ─────────────────────────────────────────────────────────────

export function RegisterForm() {
  const [step, setStep]   = useState<Step>('form');
  const [phone, setPhone] = useState('');

  return (
    <div className={s.page}>

      <nav className={s.nav}>
        <Link href="/" className={s.navLogo}>VIBES</Link>
        <ul className={s.navLinks}>
          {NAV_LINKS.map(l => <li key={l}><Link href="#">{l}</Link></li>)}
        </ul>
      </nav>

      <main className={s.main}>
        <div className={s.card} key={step}>
          {step === 'form' && <RegistrationStep onNext={p => { setPhone(p); setStep('pin'); }} />}
          {step === 'pin'  && <PinStep phone={phone} onBack={() => setStep('form')} />}
        </div>

        <div className={s.badges}>
          {TRUST_BADGES.map(({ icon, label }) => (
            <div key={label} className={s.badge}>
              <div className={s.badgeRing}>{icon}</div>
              {label}
            </div>
          ))}
        </div>
      </main>

      <footer className={s.footer}>
        <span className={s.footerLogo}>VIBES</span>
        <ul className={s.footerLinks}>
          {FOOTER_LINKS.map(l => <li key={l}><Link href="#">{l}</Link></li>)}
        </ul>
        <span className={s.footerCopy}>© 2024 VIBES. Precision. Transparency. Authority.</span>
      </footer>

    </div>
  );
}