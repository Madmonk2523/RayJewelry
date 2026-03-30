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

function initCarousel(config) {
  const track = document.getElementById(config.trackId);
  const prevBtn = document.getElementById(config.prevId);
  const nextBtn = document.getElementById(config.nextId);
  const dotsWrap = document.getElementById(config.dotsId);

  if (!track || !prevBtn || !nextBtn || !dotsWrap) {
    return;
  }

  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  if (slides.length === 0) {
    return;
  }

  let current = 0;
  let autoPlayId = null;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `${config.dotLabel} ${index + 1}`);
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

  const startAutoPlay = () => {
    autoPlayId = window.setInterval(() => {
      goTo(current + 1);
    }, config.intervalMs);
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

  return {
    prev: () => {
      goTo(current - 1);
      resetAutoPlay();
    },
    next: () => {
      goTo(current + 1);
      resetAutoPlay();
    }
  };
}

const galleryCarousel = initCarousel({
  trackId: "carousel-track",
  prevId: "prev-btn",
  nextId: "next-btn",
  dotsId: "carousel-dots",
  dotLabel: "Go to image",
  intervalMs: 5200
});

const reviewCarousel = initCarousel({
  trackId: "review-track",
  prevId: "review-prev-btn",
  nextId: "review-next-btn",
  dotsId: "review-dots",
  dotLabel: "Go to review",
  intervalMs: 4800
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    if (galleryCarousel) {
      galleryCarousel.prev();
    }
  }
  if (event.key === "ArrowRight") {
    if (galleryCarousel) {
      galleryCarousel.next();
    }
  }
});

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
