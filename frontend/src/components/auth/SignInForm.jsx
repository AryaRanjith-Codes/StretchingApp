import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingInput from './FloatingInput.jsx';
import RoleSelector from './RoleSelector.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { validateEmail, validatePassword } from '../../lib/validation.js';

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path d="M4 6h16v12H4z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <rect x="5" y="11" width="14" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11V8a4 4 0 118 0v3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function SignInForm({ role, setRole }) {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const isCoach = role === 'coach';
  const accentFrom = isCoach ? 'from-fuchsia-500' : 'from-indigo-500';
  const accentTo = isCoach ? 'to-orange-400' : 'to-teal-400';

  const runValidation = () => ({
    email: validateEmail(email),
    password: validatePassword(password, { context: 'signin' }),
  });

  const markTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));

  const handleBlur = (name) => () => {
    markTouched(name);
    setFieldErrors(runValidation());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const errs = runValidation();
    setFieldErrors(errs);
    setTouched({ email: true, password: true });
    if (errs.email || errs.password) return;

    setSubmitting(true);
    const { error } = await signIn({ email: email.trim(), password });
    setSubmitting(false);

    if (error) {
      setFormError(error.message || 'Could not sign in. Check your credentials.');
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  const shownError = (name) => (touched[name] ? fieldErrors[name] : null);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-auto flex flex-col gap-5"
      noValidate
    >
      <div>
        <h2 className="font-serif text-3xl font-semibold text-white">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to continue tracking your team's compliance.
        </p>
      </div>

      <RoleSelector role={role} setRole={setRole} accent={role} />

      <div className="flex flex-col gap-4">
        <FloatingInput
          label={isCoach ? 'Coach email' : 'Player email'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleBlur('email')}
          required
          autoComplete="email"
          accentFrom={accentFrom}
          accentTo={accentTo}
          icon={<EmailIcon />}
          error={shownError('email')}
        />
        <FloatingInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={handleBlur('password')}
          required
          autoComplete="current-password"
          accentFrom={accentFrom}
          accentTo={accentTo}
          icon={<LockIcon />}
          error={shownError('password')}
        />
      </div>

      {formError && (
        <p role="alert" className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
          {formError}
        </p>
      )}

      <div className="flex items-center justify-between text-xs">
        <label className="inline-flex items-center gap-2 text-slate-400 cursor-pointer">
          <input type="checkbox" className="rounded border-white/20 bg-white/5" />
          Remember me
        </label>
        <a href="#forgot" className="text-slate-300 hover:text-white transition-colors">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`relative mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r ${accentFrom} ${accentTo} px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-60`}
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
