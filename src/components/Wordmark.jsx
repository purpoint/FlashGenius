// The mark is three ticks — the same shape as the progress spine, so the
// signature element is what identifies the product.
export function Mark({ scale = 1 }) {
  const bar = (h, cls) => (
    <span
      className={`rounded-full ${cls}`}
      style={{ height: `${h * scale}px`, width: `${3 * scale}px` }}
    />
  );

  return (
    <span
      className="flex items-end"
      style={{ gap: `${2.5 * scale}px` }}
      aria-hidden="true"
    >
      {bar(9, 'bg-accent/45')}
      {bar(16, 'bg-accent')}
      {bar(9, 'bg-border')}
    </span>
  );
}

export default function Wordmark({ size = 'sm' }) {
  const big = size === 'lg';
  return (
    <span className={`inline-flex items-center ${big ? 'gap-4' : 'gap-2.5'}`}>
      <Mark scale={big ? 2.1 : 1} />
      <span className={`font-display ${big ? 'text-[38px] sm:text-[46px]' : 'text-[17px]'}`}>
        FlashGenius
      </span>
    </span>
  );
}
