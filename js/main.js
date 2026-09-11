/* Lumen Dermatology: site interactions
   Vanilla JS, no dependencies, deferred load. */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  function closeMobileNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "true");
    mobileNav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) { closeMobileNav(); } else { openMobileNav(); }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    document.querySelectorAll(".reveal-stagger").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty("--i", i);
        child.classList.add("reveal");
      });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Decades tabs ---------- */
  var decadesTabs = document.querySelectorAll(".decades__tab");

  if (decadesTabs.length) {
    var selectDecade = function (decade) {
      decadesTabs.forEach(function (tab) {
        var isActive = tab.getAttribute("data-decade") === decade;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.tabIndex = isActive ? 0 : -1;
      });
      document.querySelectorAll(".decades__panel").forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-decade-panel") !== decade;
      });
    };

    decadesTabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        selectDecade(tab.getAttribute("data-decade"));
      });

      tab.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = decadesTabs[(i + dir + decadesTabs.length) % decadesTabs.length];
        next.focus();
        selectDecade(next.getAttribute("data-decade"));
      });
    });
  }

  /* ---------- Front-end appointment / contact forms ---------- */
  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var success = form.querySelector("[data-form-success]");
      var submitBtn = form.querySelector("[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      window.setTimeout(function () {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.getAttribute("data-label") || "Request appointment";
        }
        if (success) {
          success.classList.add("is-visible");
          success.setAttribute("role", "status");
          success.focus({ preventScroll: true });
        }
      }, 500);
    });
  });

  /* ---------- Hero photo reveal ---------- */
  /* Image loads slightly zoomed/cropped in, then settles to its normal
     size and crop right away on page load. Plays once, automatically,
     not tied to scrolling, so it's never missed. A double rAF makes sure
     the zoomed starting state has actually painted before the
     "is-revealed" class is added, so the CSS transition has something
     to animate from instead of snapping straight to the end state. */
  var heroPhoto = document.querySelector(".hero__media-photo");

  if (heroPhoto) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        heroPhoto.classList.add("is-revealed");
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
