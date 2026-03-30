const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = siteNav ? siteNav.querySelectorAll("a") : [];

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const track = document.getElementById("carousel-track");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const dotsWrap = document.getElementById("carousel-dots");

if (track && prevBtn && nextBtn && dotsWrap) {
  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  let current = 0;
  let autoPlayId = null;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);
    dot.addEventListener("click", () => {
      goTo(index);
      resetAutoPlay();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  const update = () => {
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-current", i === current ? "true" : "false");
    });
  };

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    update();
  };

  prevBtn.addEventListener("click", () => {
    goTo(current - 1);
    resetAutoPlay();
  });

  nextBtn.addEventListener("click", () => {
    goTo(current + 1);
    resetAutoPlay();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      goTo(current - 1);
      resetAutoPlay();
    }
    if (event.key === "ArrowRight") {
      goTo(current + 1);
      resetAutoPlay();
    }
  });

  const startAutoPlay = () => {
    autoPlayId = window.setInterval(() => {
      goTo(current + 1);
    }, 5500);
  };

  const resetAutoPlay = () => {
    if (autoPlayId) {
      window.clearInterval(autoPlayId);
    }
    startAutoPlay();
  };

  const carousel = track.closest(".carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      if (autoPlayId) {
        window.clearInterval(autoPlayId);
      }
    });

    carousel.addEventListener("mouseleave", () => {
      startAutoPlay();
    });
  }

  update();
  startAutoPlay();
}

const revealTargets = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealTargets.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in-view"));
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
