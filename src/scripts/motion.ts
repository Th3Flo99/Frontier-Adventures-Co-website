// Scroll-linked motion (GSAP + ScrollTrigger).
// Everything here is an enhancement: the page reads and works without it, and nothing
// runs for visitors who prefer reduced motion. Simple entrances are plain CSS (global.css).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const media = gsap.matchMedia();

media.add('(prefers-reduced-motion: no-preference)', () => {
  // Parallax photography: <img data-parallax="8"> drifts by 8% of its own height while its
  // container crosses the viewport. The image must be taller than its (overflow-hidden) box.
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || '8');
    const trigger = el.closest<HTMLElement>('[data-parallax-root]') ?? el.parentElement ?? el;
    gsap.fromTo(
      el,
      { yPercent: -amount },
      { yPercent: amount, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true } }
    );
  });

  // Text that inks in word by word, once, when it comes into view: <p data-ink-words>…</p>
  // It is a timed run rather than tied to the scroll position, so text that is on screen
  // always ends up fully inked and readable, wherever the visitor stops scrolling.
  gsap.utils.toArray<HTMLElement>('[data-ink-words]').forEach((el) => {
    const words = (el.textContent ?? '').trim().split(/\s+/);
    el.textContent = '';
    const spans = words.map((word, i) => {
      const span = document.createElement('span');
      span.textContent = word;
      el.append(span, i < words.length - 1 ? ' ' : '');
      return span;
    });
    gsap.fromTo(
      spans,
      { opacity: 0.22 },
      { opacity: 1, duration: 0.5, ease: 'power1.out', stagger: 0.045, scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
    );
  });
});

// Layout shifts after fonts and images load would leave triggers in the wrong place
window.addEventListener('load', () => ScrollTrigger.refresh());

export { gsap, ScrollTrigger };
