'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Shield, GitBranch, BadgeCheck, Eye, EyeOff } from 'lucide-react';

import { loginSchema, type LoginSchema } from '@/app/lib/schemas/auth.schema';
import { loginAction } from '@/app/lib/actions/auth.actions';
import { FieldError } from './FieldError';
import s from './auth.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/hooks/useauth';

const NAV_LINKS    = ['Inventory', 'Sell', 'Financing', 'Concierge'] as const;
const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Verified Seller Program', 'Support'] as const;
const TRUST_BADGES = [
  { icon: <Shield size={12} />,     label: 'Secure'    },
  { icon: <GitBranch size={12} />,  label: 'Traceable' },
  { icon: <BadgeCheck size={12} />, label: 'Verified'  },
] as const;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError]   = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginSchema) {
    setServerError(null);
    try {
      await loginAction(data);
    const match = document.cookie
        .split('; ')
        .find(r => r.startsWith('ap_user='));
      if (match) {
        const user = JSON.parse(decodeURIComponent(match.split('=')[1]));
        setUser(user);
      }

      router.push('/');       
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className={s.page}>

      <nav className={s.nav}>
        <Link href="/" className={s.navLogo}>VIBES</Link>
        <ul className={s.navLinks}>
          {NAV_LINKS.map(l => <li key={l}><Link href="#">{l}</Link></li>)}
        </ul>
      </nav>

      <main className={s.main}>
        <div className={s.card}>

          <div className={s.iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8922A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className={s.title}>Sign in to VIBES</h1>
          <p className={s.subtitle}>Enter your email and password to continue.</p>

          {serverError && <p className={s.serverError}>{serverError}</p>}

          <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className={s.field}>
              <label className={s.label} htmlFor="email">Email address</label>
              <input
                id="email" type="email" placeholder="you@example.com" autoComplete="email"
                className={`${s.input} ${errors.email ? s.inputError : ''}`}
                {...register('email')}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="password">Password</label>
              <div className={s.passwordWrap}>
                <input
                  id="password" type={showPassword ? 'text' : 'password'} placeholder="Your password" autoComplete="current-password"
                  className={`${s.input} ${errors.password ? s.inputError : ''}`}
                  {...register('password')}
                />
                <button type="button" className={s.passwordToggle} onClick={() => setShowPassword(p => !p)} tabIndex={-1} aria-label="Toggle password">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
              <Link href="#" className={s.forgotLink}>Forgot password?</Link>
            </div>

            <button type="submit" className={s.submitButton} disabled={isSubmitting}>
              {isSubmitting ? <div className={s.spinner} /> : <><span>Sign in</span><ArrowRight size={14} /></>}
            </button>
          </form>

          <p className={s.authPrompt}>
            Don&apos;t have an account? <Link href="/register">Create one</Link>
          </p>
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