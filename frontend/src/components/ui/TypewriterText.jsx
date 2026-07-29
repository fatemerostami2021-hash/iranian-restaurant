import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * متن رو حرف‌به‌حرف (یا کلمه‌به‌کلمه) با افکت تایپ نمایش می‌ده،
 * فقط وقتی وارد Viewport شد شروع می‌کنه (یک‌بار).
 */
export default function TypewriterText({
  text,
  as: Tag = 'span',
  className = '',
  speed = 35,       // میلی‌ثانیه بین هر کاراکتر
  startDelay = 150,
  showCursor = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, text]);

  return (
    <Tag ref={ref} className={className}>
      {displayed}
      {showCursor && !done && (
        <span className="inline-block w-[2px] md:w-[3px] h-[0.9em] ml-1 align-middle bg-current animate-pulse" />
      )}
    </Tag>
  );
}