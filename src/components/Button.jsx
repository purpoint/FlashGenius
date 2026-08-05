const VARIANTS = {
  primary: [
    'bg-accent text-bg font-medium',
    'hover:brightness-108 active:brightness-95',
    'disabled:bg-surface disabled:text-muted/70 disabled:border disabled:border-border',
  ].join(' '),
  ghost: [
    'bg-transparent text-text border border-border',
    'hover:border-accent/40 hover:bg-surface',
    'disabled:text-muted/50 disabled:hover:border-border disabled:hover:bg-transparent',
  ].join(' '),
};

export default function Button({
  variant = 'primary',
  full = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5',
        'transition-[filter,background-color,border-color,transform] duration-150',
        'active:translate-y-px disabled:cursor-not-allowed disabled:active:translate-y-0',
        VARIANTS[variant],
        full ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
