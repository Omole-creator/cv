// Meta (Facebook) Pixel for the /writing page only.
//
// The pixel is set up so it records nothing on page load: no PageView, and
// Meta's "automatic events" (button-click and page-metadata sniffing) are
// switched off. The only event ever sent is Lead, fired by
// trackWritingSubmit() when a visitor sends a valid form. Purchase is left
// to real payments (uploaded to Meta separately), not form submits.
//
// It only loads on the live domain, so local dev and the Playwright suite
// never send anything to Meta.

export const META_PIXEL_ID = "1598534447908730";
const LIVE_HOSTS = ["jobminglecv.vercel.app"];

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function isLive() {
  return typeof window !== "undefined" && LIVE_HOSTS.includes(window.location.hostname);
}

// Meta's standard loader stub, minus the PageView call.
export function loadMetaPixel() {
  if (!isLive() || window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("set", "autoConfig", false, META_PIXEL_ID);
  fbq("init", META_PIXEL_ID);
}

let sent = false;

// Fires once per page load, so a visitor clicking the button twice is
// still one lead.
export function trackWritingSubmit(details: { packageName: string; value: number }) {
  if (!isLive() || !window.fbq || sent) return;
  sent = true;

  const eventID = `w-lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.fbq(
    "track",
    "Lead",
    {
      content_name: details.packageName,
      content_category: "CV writing",
      value: details.value,
      currency: "NGN",
    },
    { eventID }
  );
}
