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
/**  get the element and its total scroll heigh */
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

    // Calculate scrolled percentage relative to the article height
    const scrolledPercentage = Math.min((scrollTop / articleHeight) * 100, 100);
    console.log("scrolledPercentage", scrolledPercentage);
    // Dispatch events at 25%, 50%, and 100% when those thresholds are reached
    thresholds.forEach((threshold) => {
      if (scrolledPercentage >= threshold && !scrollDepthsReached.has(threshold)) {
        scrollDepthsReached.add(threshold);
        dispatchScrollEvent(threshold);
      }
    });
  }

  // Dispatch a custom event with the scroll percentage as detail
  function dispatchScrollEvent(percentage) {
    const event = new CustomEvent("scrollDepthReached", {
      detail: { percentage },
    });
    window.dispatchEvent(event);
    console.log(`Scroll depth reached: ${percentage}%`);
  }

  // Attach the debounced scroll event listener to check scroll depth on user scroll
  window.addEventListener("scroll", debounce(checkScrollDepth, 100));
}

// Initialize the scroll tracking
trackScrollDepth();

// Example: Listen for custom scroll depth events and display the progress
window.addEventListener("scrollDepthReached", (event) => {
  alert(`You've scrolled ${event.detail.percentage}% of the article!`);
});
