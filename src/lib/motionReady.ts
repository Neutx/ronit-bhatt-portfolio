// Boot-bundle flag for framer-motion's lazily loaded feature bundle (see
// loadMotionFeatures in app/page.tsx). Until the features arrive, `m`
// components cannot apply changes to `animate`, so components that position
// themselves from measured values remount instead (see Carousel).
let ready = false;

export function markMotionFeaturesReady(): void {
  ready = true;
}

export function motionFeaturesReady(): boolean {
  return ready;
}
