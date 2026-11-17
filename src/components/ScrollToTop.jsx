
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // If navigating to a specific hash element (e.g. /#domains),
    // let that section handle the scroll.
    if (hash) return;

    // Set scroll position immediately before the browser paints the page.
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, hash]);

  return null;
}
