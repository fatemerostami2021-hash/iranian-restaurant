/**
 * SplitWords — word-level split (React Bits SplitText / BlurText style).
 * Splits on spaces only, never on letters, so Persian/Arabic letters stay joined.
 * Each word: <span.dz-w (mask)><span.dz-w__i (animated)>word</span></span>
 */
export default function SplitWords({ text = '', as: Tag = 'span', className = '' }) {
  const words = String(text).split(/\s+/).filter(Boolean);
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true">
          <span className="dz-w">
            <span className="dz-w__i">{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
