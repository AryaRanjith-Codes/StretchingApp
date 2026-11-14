import { useId, useState } from 'react';

/**
 * Floating-label input with a glowing focus ring.
 * The label sits inside the field, then lifts up when the field is focused
 * or has a value — pure CSS via the `:placeholder-shown` sibling trick
 * combined with React state for the glow effect.
 */
export default function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  autoComplete,
  accentFrom = 'from-indigo-500',
  accentTo = 'to-teal-400',
  icon = null,
  error = null,
  onBlur,
}) {
  const id = useId();
  const errorId = `${id}-err`;
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative group">
      {/* Glow halo — scales up and brightens on focus. Behind the field. */}
      <div
        aria-hidden="true"
        className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r ${accentFrom} ${accentTo} opacity-0 blur transition-all duration-500 ${
          focused ? 'opacity-70' : 'group-hover:opacity-30'
        }`}
      />

      <div className="relative">
        {/* The actual input. `placeholder=" "` (space) is required so the
            :placeholder-shown trick works without displaying anything. */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          required={required}
          autoComplete={autoComplete}
          placeholder=" "
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`peer w-full rounded-xl border bg-slate-900/70 backdrop-blur px-4 pt-5 pb-2 text-sm text-white placeholder-transparent outline-none transition-colors duration-200 ${
            icon ? 'pl-11' : ''
          } ${error ? 'border-rose-500/70' : 'border-white/10'} focus:border-transparent focus:bg-slate-900/90`}
        />

        {/* Icon slot (optional) */}
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-white transition-colors">
            {icon}
          </span>
        )}

        {/* Floating label. Animated via peer state. */}
        <label
          htmlFor={id}
          className={`absolute ${
            icon ? 'left-11' : 'left-4'
          } top-3.5 origin-left text-sm text-slate-400 transition-all duration-200 pointer-events-none
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400
            peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-white peer-focus:font-medium
            peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-slate-200`}
        >
          {label}
          {required && <span className="ml-0.5 text-rose-400">*</span>}
        </label>
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-[11px] text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
