import { animate, stagger } from 'animejs';

/**
 * Cac helper animejs (v4) dung chung cho toan bo FE USER, de khong moi noi
 * phai tu viet lai cau hinh ease/duration rieng -> animation nhat quan.
 *
 * Luu y: animejs v4 doi ten easing, bo tien to "ease" (vd: outExpo, inOutSine,
 * outElastic(1, .6)...), va doi prop "easing" -> "ease" so voi v3.
 */

/** Fade + truot len cho 1 phan tu khi vao view (goi trong useEffect voi ref). */
export function fadeInUp(target: Element | Element[] | string, opts?: { delay?: number }) {
  return animate(target, {
    opacity: [0, 1],
    translateY: [16, 0],
    duration: 650,
    delay: opts?.delay ?? 0,
    ease: 'outExpo',
  });
}

/** Fade + truot len theo kieu "cuon chieu" cho danh sach (grid san pham, card...). */
export function staggerFadeInUp(target: Element[] | NodeListOf<Element> | string, staggerMs = 60) {
  return animate(target, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    delay: stagger(staggerMs),
    ease: 'outExpo',
  });
}

/** Scale nhe khi hover - dung cho card san pham, nut CTA. */
export function hoverPulse(target: Element) {
  return animate(target, {
    scale: [1, 1.04, 1],
    duration: 380,
    ease: 'outElastic(1, .6)',
  });
}

/** Hieu ung "them vao gio hang" - icon bay nhanh + bounce. */
export function addToCartBurst(target: Element) {
  return animate(target, {
    scale: [1, 1.35, 1],
    duration: 480,
    ease: 'outElastic(1, .5)',
  });
}

/** Dem so tang dan (dung cho gia tien, so luong, stat). */
export function countUp(
  target: HTMLElement,
  to: number,
  opts?: { duration?: number; formatter?: (n: number) => string }
) {
  const obj = { value: 0 };
  return animate(obj, {
    value: to,
    duration: opts?.duration ?? 900,
    ease: 'outExpo',
    onUpdate: () => {
      target.textContent = opts?.formatter ? opts.formatter(obj.value) : String(Math.round(obj.value));
    },
  });
}

/** Rung nhe (shake) khi co loi validate form. */
export function shake(target: Element) {
  return animate(target, {
    translateX: [0, -8, 8, -6, 6, -3, 3, 0],
    duration: 500,
    ease: 'inOutSine',
  });
}
