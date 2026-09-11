/* Lumen Dermatology — site interactions
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

  /* ---------- Footer year ---------- */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
