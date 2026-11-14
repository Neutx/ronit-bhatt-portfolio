/**
 * Runs `callback` once the window 'load' event has fired AND the first
 * contentful paint has been presented (a fast load can fire 'load' before the
 * first paint, and on this page the first paint is the LCP), then, when `idle`
 * is true, once the main thread is idle. Keeps non-critical work (warm chunks,
 * background video, gesture code) out of the window before LCP. Returns a
 * cancel function. Call only from effects (client-only).
 */
export function afterLoad(
  callback: () => void,
  { idle = true, timeout = 2000 }: { idle?: boolean; timeout?: number } = {}
): () => void {
  let idleId: number | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let observer: PerformanceObserver | undefined;
  let cancelled = false;
  let loaded = document.readyState === 'complete';
  let painted = false;

  const run = () => {
    if (!cancelled) callback();
  };
  const proceed = () => {
    if (cancelled || !loaded || !painted) return;
    observer?.disconnect();
    if (!idle) {
      run();
    } else if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(run, { timeout });
    } else {
      timeoutId = setTimeout(run, 300);
    }
  };
  const onLoad = () => {
    loaded = true;
    proceed();
  };
  const onPaint = () => {
    if (painted) return;
    painted = true;
    proceed();
  };

  const hasPaint = () =>
    performance.getEntriesByName('first-contentful-paint', 'paint').length > 0;
  if (hasPaint()) {
    painted = true;
  } else if (
    typeof PerformanceObserver === 'function' &&
    PerformanceObserver.supportedEntryTypes?.includes('paint')
  ) {
    observer = new PerformanceObserver(() => {
      if (hasPaint()) onPaint();
    });
    observer.observe({ type: 'paint', buffered: true });
  } else {
    // No Paint Timing API: fall back to one frame after load
    requestAnimationFrame(() => setTimeout(onPaint, 0));
  }
  // Never hold work back indefinitely (e.g. a page that is hidden on load)
  const failsafe = setTimeout(onPaint, 5000);

  if (!loaded) window.addEventListener('load', onLoad, { once: true });
  proceed();

  return () => {
    cancelled = true;
    observer?.disconnect();
    clearTimeout(failsafe);
    window.removeEventListener('load', onLoad);
    if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleId);
    }
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
}
