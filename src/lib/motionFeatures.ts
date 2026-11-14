// Full framer-motion feature set (animations, gestures, drag, layout), loaded
// asynchronously by <LazyMotion> in app/page.tsx so it stays out of the boot
// bundle. The initial view renders its first frame from the `m` components'
// initial styles; features attach as soon as this chunk arrives.
import { domMax } from 'framer-motion';

export default domMax;
