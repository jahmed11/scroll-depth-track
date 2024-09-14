/**  Utility function to debounce event firing (avoid too many events while scrolling) */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
/**  Get the element and its total scroll height */
const articleBody = document.getElementById("page-container");
const articleHeight = articleBody.scrollHeight;

function trackScrollDepth() {
  if (!articleBody) {
    console.error('Article with id "page-container" not found');
    return;
  }

  const thresholds = [25, 50, 100];
  const scrollDepthsReached = new Set();

  function checkScrollDepth() {
    const scrollTop = window.pageYOffset;


    const scrolledPercentage = Math.min((scrollTop / articleHeight) * 100, 100);
    console.log("scrolledPercentage", scrolledPercentage);

    thresholds.forEach((threshold) => {
      if (scrolledPercentage >= threshold && !scrollDepthsReached.has(threshold)) {
        scrollDepthsReached.add(threshold);
        dispatchScrollEvent(threshold);
      }
    });
  }


  function dispatchScrollEvent(percentage) {
    const event = new CustomEvent("scrollDepthReached", {
      detail: { percentage },
    });
    window.dispatchEvent(event);
    console.log(`Scroll depth reached: ${percentage}%`);
  }


  window.addEventListener("scroll", debounce(checkScrollDepth, 100));
}


trackScrollDepth();


window.addEventListener("scrollDepthReached", (event) => {
  alert(`You've scrolled ${event.detail.percentage}% of the article!`);
});
