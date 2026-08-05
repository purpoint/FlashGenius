const VARIANTS = {
  primary:
    'bg-accent text-bg font-medium hover:brightness-110 disabled:bg-border disabled:text-muted',
  ghost:
    'bg-transparent text-text border border-border hover:bg-surface disabled:text-muted disabled:hover:bg-transparent',
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
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3',
        'transition-[filter,background-color,border-color] duration-150',
        'disabled:cursor-not-allowed',
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
