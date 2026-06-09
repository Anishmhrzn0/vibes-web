import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession, logoutAction } from '@/app/lib/actions/auth.actions';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const { user } = session;
  const initials = user.fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className={styles.page}>

      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>VIBES</Link>
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutBtn}>Sign out</button>
        </form>
      </nav>

      <main className={styles.main}>

        <div className={styles.hero}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <h1 className={styles.welcomeTitle}>Welcome back, {user.fullName.split(' ')[0]}.</h1>
            <p className={styles.welcomeSub}>Here&apos;s your account overview.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {[
            { label: 'Full name',    value: user.fullName },
            { label: 'Email',        value: user.email    },
            { label: 'Phone',        value: user.phone    },
            { label: 'Member since', value: memberSince   },
          ].map(({ label, value }) => (
            <div key={label} className={styles.infoCard}>
              <span className={styles.infoLabel}>{label}</span>
              <span className={styles.infoValue}>{value}</span>
            </div>
          ))}
        </div>

        <div className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>Quick actions</h2>
          <div className={styles.actions}>
            {['Browse Inventory', 'List a Vehicle', 'Apply for Financing', 'Contact Concierge'].map(action => (
              <button key={action} className={styles.actionBtn}>{action}</button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}