import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingInput from './FloatingInput.jsx';
import RoleSelector from './RoleSelector.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateTeamCode,
  validateOptionalText,
} from '../../lib/validation.js';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
  </svg>
);

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

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path d="M4 12l8-8h8v8l-8 8-8-8z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="15" cy="9" r="1.2" fill="currentColor" />
  </svg>
);

// UI selector uses 'student' / 'coach'; DB enum uses 'student_player' / 'coach'.
const dbRole = (uiRole) => (uiRole === 'coach' ? 'coach' : 'student_player');

export default function SignUpForm({ role, setRole }) {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [organization, setOrganization] = useState('');

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);

  const isCoach = role === 'coach';
  const accentFrom = isCoach ? 'from-fuchsia-500' : 'from-indigo-500';
  const accentTo = isCoach ? 'to-orange-400' : 'to-teal-400';

  const runValidation = () => {
    const errs = {
      name: validateFullName(name),
      email: validateEmail(email),
      password: validatePassword(password, { context: 'signup' }),
      confirm: !confirm
        ? 'Please confirm your password.'
        : confirm !== password
        ? 'Passwords do not match.'
        : null,
    };
    if (isCoach) {
      errs.organization = validateOptionalText(organization, { max: 120 });
    } else {
      errs.teamCode = validateTeamCode(teamCode);
      errs.gradeLevel = validateOptionalText(gradeLevel, { max: 40 });
    }
    return errs;
  };

  const markTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));

  const handleBlur = (name) => () => {
    markTouched(name);
    setFieldErrors(runValidation());
  };

  const anyError = (errs) => Object.values(errs).some((v) => v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setInfoMsg(null);

    const errs = runValidation();
    setFieldErrors(errs);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirm: true,
      teamCode: true,
      gradeLevel: true,
      organization: true,
    });
    if (anyError(errs)) return;

    const extras = isCoach
      ? { organization: organization.trim() || undefined }
      : {
          team_code: teamCode.trim() || undefined,
          grade_level: gradeLevel.trim() || undefined,
        };

    setSubmitting(true);
    const { data, error } = await signUp({
      email: email.trim(),
      password,
      fullName: name.trim(),
      role: dbRole(role),
      extras,
    });
    setSubmitting(false);

    if (error) {
      setFormError(error.message || 'Could not create account.');
      return;
    }

    // If email confirmation is ON (default), there's no active session yet —
    // tell the user to check their inbox. Otherwise we land them inside.
    if (!data.session) {
      setInfoMsg('Account created — check your email to confirm, then sign in.');
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
          Create account
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {isCoach
            ? 'Set up your team in under a minute.'
            : 'Join your team to track your progress.'}
        </p>
      </div>

      <RoleSelector role={role} setRole={setRole} accent={role} />

      <div className="flex flex-col gap-4">
        <FloatingInput
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur('name')}
          required
          autoComplete="name"
          accentFrom={accentFrom}
          accentTo={accentTo}
          icon={<UserIcon />}
          error={shownError('name')}
        />
        <FloatingInput
          label={isCoach ? 'Work email' : 'Email'}
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
          autoComplete="new-password"
          accentFrom={accentFrom}
          accentTo={accentTo}
          icon={<LockIcon />}
          error={shownError('password')}
        />
        <FloatingInput
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={handleBlur('confirm')}
          required
          autoComplete="new-password"
          accentFrom={accentFrom}
          accentTo={accentTo}
          icon={<LockIcon />}
          error={shownError('confirm')}
        />

        {isCoach ? (
          <FloatingInput
            label="Organization (school / club)"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            onBlur={handleBlur('organization')}
            autoComplete="organization"
            accentFrom={accentFrom}
            accentTo={accentTo}
            icon={<TagIcon />}
            error={shownError('organization')}
          />
        ) : (
          <>
            <FloatingInput
              label="Team code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              onBlur={handleBlur('teamCode')}
              autoComplete="off"
              accentFrom={accentFrom}
              accentTo={accentTo}
              icon={<TagIcon />}
              error={shownError('teamCode')}
            />
            <FloatingInput
              label="Grade / age group"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              onBlur={handleBlur('gradeLevel')}
              autoComplete="off"
              accentFrom={accentFrom}
              accentTo={accentTo}
              icon={<TagIcon />}
              error={shownError('gradeLevel')}
            />
          </>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
          {formError}
        </p>
      )}
      {infoMsg && (
        <p role="status" className="text-xs text-emerald-200 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
          {infoMsg}
        </p>
      )}

      <p className="text-[11px] text-slate-500 leading-relaxed">
        By creating an account you agree to our{' '}
        <a href="#terms" className="text-slate-300 underline-offset-2 hover:underline">Terms</a>{' '}
        and{' '}
        <a href="#privacy" className="text-slate-300 underline-offset-2 hover:underline">Privacy Policy</a>.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-r ${accentFrom} ${accentTo} px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-fuchsia-500/30 active:scale-[0.98] disabled:opacity-60`}
      >
        {submitting ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
