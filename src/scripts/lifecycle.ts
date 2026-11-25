// Page lifecycle with Astro view transitions (<ViewTransitions /> in Layout.astro).
// A bundled script runs only once, but the router swaps in a new <body> on every navigation.
// onPage(setup) runs setup for each page that is shown: on the first load and after every
// navigation. setup receives an AbortSignal that fires when the page is swapped out, so window
// and document listeners, observers and timers can be cleaned up with it.
export function onPage(setup: (signal: AbortSignal) => void) {
  let shownFor: HTMLElement | null = null;
  const run = () => {
    // The script may be evaluated after a navigation and then also hear astro:page-load for the
    // same page: one setup per <body>.
    if (shownFor === document.body) return;
    shownFor = document.body;
    const controller = new AbortController();
    document.addEventListener('astro:before-swap', () => controller.abort(), { once: true });
    setup(controller.signal);
  };
  // Bundled scripts are deferred modules, so the document is parsed by the time this runs
  run();
  document.addEventListener('astro:page-load', run);
}
