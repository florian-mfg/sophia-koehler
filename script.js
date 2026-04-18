const sliders = document.querySelectorAll(".art-slider");
const cursor = document.getElementById("customCursor");
const closeMenuLink = document.querySelector("[data-close-menu]");

sliders.forEach((slider) => {
  let isDown = false;
  let didDrag = false;
  let startX = 0;
  let scrollLeft = 0;

  slider.addEventListener("mouseenter", () => {
    cursor.style.display = "block";
  });

  slider.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
    isDown = false;
    didDrag = false;
    slider.classList.remove("is-dragging");
  });

  slider.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;

    const sliderBounds = slider.getBoundingClientRect();
    const mouseXInsideSlider = event.clientX - sliderBounds.left;

    if (mouseXInsideSlider < sliderBounds.width / 2) {
      cursor.classList.add("is-left");
      cursor.classList.remove("is-right");
    } else {
      cursor.classList.add("is-right");
      cursor.classList.remove("is-left");
    }

    if (!isDown) return;

    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.2;
    didDrag = didDrag || Math.abs(walk) > 4;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener("mousedown", (event) => {
    isDown = true;
    didDrag = false;
    slider.classList.add("is-dragging");
    startX = event.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("is-dragging");
  });

  slider.addEventListener("click", (event) => {
    if (didDrag) {
      didDrag = false;
      return;
    }

    const rect = slider.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const scrollAmount = rect.width * 0.75;

    if (clickX < rect.width / 2) {
      slider.scrollBy({
        left: -scrollAmount,
        behavior: "smooth"
      });
    } else {
      slider.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  });
});

// Touch-Geräte: Cursor ausblenden
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

if (isTouchDevice()) {
  cursor.style.display = "none";
}

if (closeMenuLink) {
  closeMenuLink.addEventListener("click", (event) => {
    if (window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });
}
