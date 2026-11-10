/* ==========================================================================
   MARSHALL® — Velde® Architectural Edition
   Lenis Smooth Scroll + GSAP ScrollTrigger Choreography + Micro-UI
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenisInstance = null;

  /* --------------------------------------------------------------------------
     0. SMOOTH SCROLL HELPER (For all header links, index links & CTAs)
     -------------------------------------------------------------------------- */
  function scrollToElement(selectorOrEl) {
    const targetEl =
      typeof selectorOrEl === "string"
        ? document.querySelector(selectorOrEl)
        : selectorOrEl;
    if (!targetEl) return;

    const headerOffset = -88;
    if (lenisInstance) {
      lenisInstance.scrollTo(targetEl, {
        offset: headerOffset,
        duration: 1.15,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        }
      });
    } else {
      const top =
        targetEl.getBoundingClientRect().top + window.pageYOffset + headerOffset;
      window.scrollTo({ top: top, behavior: "smooth" });
    }
  }

  /* --------------------------------------------------------------------------
     1. INTERCEPT ALL ANCHOR LINKS + ANIMATED NAV PILL INDICATOR
     -------------------------------------------------------------------------- */
  function initSmoothAnchorsAndNav() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        scrollToElement(target);
      });
    });

    const nav = document.getElementById("main-nav");
    const indicator = document.getElementById("nav-indicator");
    const navLinks = nav ? Array.from(nav.querySelectorAll(".nav__link")) : [];
    if (!nav || !indicator || !navLinks.length) return;

    let activeLink = navLinks[0];

    function moveIndicatorTo(linkEl) {
      if (!linkEl) return;
      const navRect = nav.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();
      const left = linkRect.left - navRect.left;
      indicator.style.width = `${linkRect.width}px`;
      indicator.style.transform = `translate3d(${left}px, 0, 0)`;
      indicator.style.opacity = "1";
    }

    function setActiveNavLink(linkEl) {
      if (!linkEl) return;
      activeLink = linkEl;
      navLinks.forEach((l) => l.classList.toggle("is-active", l === linkEl));
      moveIndicatorTo(linkEl);
    }

    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => moveIndicatorTo(link));
      link.addEventListener("focus", () => moveIndicatorTo(link));
      link.addEventListener("click", () => setActiveNavLink(link));
    });

    nav.addEventListener("mouseleave", () => {
      moveIndicatorTo(activeLink);
    });

    window.addEventListener("resize", () => moveIndicatorTo(activeLink));
    requestAnimationFrame(() => setActiveNavLink(activeLink));

    // Scroll spy for header navigation sections
    const sectionIds = ["#about", "#services", "#journey", "#praise", "#contacts"];
    const sections = sectionIds
      .map((id) => document.querySelector(id))
      .filter(Boolean);

    window.addEventListener(
      "scroll",
      () => {
        const scrollPos = window.scrollY + 240;
        let currentSection = sections[0];
        sections.forEach((sec) => {
          if (sec.offsetTop <= scrollPos) {
            currentSection = sec;
          }
        });
        if (currentSection) {
          const matchingLink = navLinks.find(
            (l) => l.getAttribute("href") === `#${currentSection.id}`
          );
          if (matchingLink && matchingLink !== activeLink) {
            setActiveNavLink(matchingLink);
          }
        }
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------------------
     2. OPTIONAL SERVICE PICKER (Cards -> Booking Form Pre-select)
     -------------------------------------------------------------------------- */
  function initServicePicker() {
    const pickButtons = document.querySelectorAll(".js-pick-service");
    const serviceSelect = document.getElementById("inp-service");
    const hintEl = document.getElementById("service-picked-hint");

    if (!serviceSelect) return;

    function selectServiceOption(serviceValue, shouldScroll) {
      let matched = false;
      Array.from(serviceSelect.options).forEach((opt) => {
        if (opt.value === serviceValue) {
          opt.selected = true;
          matched = true;
        }
      });

      if (!matched && serviceValue) {
        const customOpt = document.createElement("option");
        customOpt.value = serviceValue;
        customOpt.textContent = serviceValue;
        customOpt.selected = true;
        serviceSelect.appendChild(customOpt);
      }

      if (hintEl) {
        hintEl.textContent = `Выбрано направление: «${serviceValue}». Первичный осмотр врача — бесплатно (0 ₽).`;
        hintEl.classList.add("is-highlighted");
      }

      if (shouldScroll) {
        scrollToElement("#booking");
        setTimeout(() => {
          const nameInput = document.getElementById("inp-name");
          if (nameInput) nameInput.focus({ preventScroll: true });
        }, 900);
      }
    }

    pickButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const val = btn.getAttribute("data-service");
        if (val) selectServiceOption(val, true);
      });
    });

    serviceSelect.addEventListener("change", () => {
      if (!hintEl) return;
      if (serviceSelect.selectedIndex === 0) {
        hintEl.textContent =
          "Первичный осмотр и составление плана лечения — бесплатно.";
        hintEl.classList.remove("is-highlighted");
      } else {
        hintEl.textContent = `Выбрано: «${serviceSelect.value}». Первичный осмотр врача — бесплатно (0 ₽).`;
        hintEl.classList.add("is-highlighted");
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. PATIENT JOURNEY STEP SWITCHER (Manual Click + Scroll Sync)
     -------------------------------------------------------------------------- */
  let setActiveJourneyStep = null;

  function initJourneySteps() {
    const steps = Array.from(document.querySelectorAll(".j-step"));
    const imgs = Array.from(document.querySelectorAll(".journey-img"));
    if (!steps.length) return;

    let currentStepIdx = 0;

    setActiveJourneyStep = function (idx) {
      const clampedIdx = Math.max(0, Math.min(steps.length - 1, idx));
      if (clampedIdx === currentStepIdx) return;
      currentStepIdx = clampedIdx;

      steps.forEach((step, i) => {
        const active = i === clampedIdx;
        step.classList.toggle("is-open", active);
        const btn = step.querySelector(".j-step__trigger");
        if (btn) btn.setAttribute("aria-expanded", active ? "true" : "false");
      });

      imgs.forEach((img, i) => {
        img.classList.toggle("is-active", i === clampedIdx);
      });
    };

    steps.forEach((step, index) => {
      const trigger = step.querySelector(".j-step__trigger");
      if (!trigger) return;
      trigger.addEventListener("click", () => {
        if (setActiveJourneyStep) setActiveJourneyStep(index);
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. PHONE MASK & BOOKING FORM FEEDBACK
     -------------------------------------------------------------------------- */
  function initBookingForm() {
    const phoneInput = document.getElementById("inp-phone");
    const form = document.getElementById("booking-form");
    const feedback = document.getElementById("form-feedback");

    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        let digits = e.target.value.replace(/\D/g, "");
        if (!digits) {
          e.target.value = "";
          return;
        }
        if (digits[0] === "8" || digits[0] === "7") {
          digits = digits.slice(1);
        }
        digits = digits.slice(0, 10);

        let formatted = "+7";
        if (digits.length > 0) formatted += " (" + digits.slice(0, 3);
        if (digits.length >= 3) formatted += ") " + digits.slice(3, 6);
        if (digits.length >= 6) formatted += "-" + digits.slice(6, 8);
        if (digits.length >= 8) formatted += "-" + digits.slice(8, 10);
        e.target.value = formatted;
      });
    }

    if (form && feedback) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameVal = (document.getElementById("inp-name")?.value || "").trim();
        const phoneVal = (phoneInput?.value || "").trim();
        const serviceVal =
          document.getElementById("inp-service")?.value ||
          "Бесплатная консультация";
        const timeVal = document.getElementById("inp-time")?.value || "";

        if (phoneVal.replace(/\D/g, "").length < 11) {
          feedback.hidden = false;
          feedback.textContent =
            "Пожалуйста, укажите полный номер телефона, чтобы администратор клиники смог дозвониться до вас.";
          phoneInput?.focus();
          return;
        }

        const displayName = nameVal || "Уважаемый пациент";
        feedback.hidden = false;
        feedback.textContent = `${displayName}, спасибо! Заявка (${serviceVal}, ${timeVal.toLowerCase()}) принята. Администратор «Маршалл» свяжется с вами по номеру ${phoneVal}.`;
        form.reset();
      });
    }
  }

  /* --------------------------------------------------------------------------
     5. LENIS + GSAP SCROLLTRIGGER MACRO-CHOREOGRAPHY (Velde® Archetype)
     -------------------------------------------------------------------------- */
  function initScrollChoreography() {
    const preloader = document.getElementById("preloader");

    if (
      prefersReducedMotion ||
      typeof window.gsap === "undefined" ||
      typeof window.ScrollTrigger === "undefined"
    ) {
      if (preloader) preloader.classList.add("is-hidden");
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // 5.1 Lenis Smooth Scroll
    if (typeof window.Lenis !== "undefined") {
      lenisInstance = new window.Lenis({
        duration: 1.12,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });
      lenisInstance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // 5.2 Preloader Logo Handoff into Hero + Color Transition (White -> Black)
    const preloaderBg = document.getElementById("preloader-bg");
    const preloaderWord = document.getElementById("preloader-word");
    const heroTitle = document.getElementById("hero-title");

    if (preloader && preloaderBg && preloaderWord && heroTitle && window.scrollY < 80) {
      gsap.set(heroTitle, { opacity: 0 });

      const preRect = preloaderWord.getBoundingClientRect();
      const heroRect = heroTitle.getBoundingClientRect();
      const dx = heroRect.left - preRect.left;
      const dy = heroRect.top - preRect.top;

      const tlEntry = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.set(heroTitle, { opacity: 1 });
          preloader.classList.add("is-hidden");
        }
      });

      tlEntry
        .to(
          preloaderBg,
          {
            opacity: 0,
            duration: 0.78,
            ease: "power3.inOut",
            delay: 0.25
          }
        )
        .to(
          preloaderWord,
          {
            x: dx,
            y: dy,
            color: "#121110",
            duration: 0.88,
            ease: "power4.inOut"
          },
          "<"
        )
        .add(() => {
          gsap.set(heroTitle, { opacity: 1 });
          preloader.classList.add("is-hidden");
        })
        .from(
          ".hero-reveal",
          {
            y: 22,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08
          },
          "-=0.42"
        );
    } else if (preloader) {
      preloader.classList.add("is-hidden");
    }

    // 5.3 Desktop Scroll Choreography
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      // A. Hero Subtle Parallax on Scroll (Zero-jump fromTo without scale conflict)
      gsap.fromTo(
        "#hero-bg-img",
        { yPercent: 0 },
        {
          yPercent: 6,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".v-hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        }
      );

      // B. Vertical Sticky Stacking Cards (Velde "What we offer" 00:08–00:09)
      // Applied independently to both #services (#stack-cards) and #journey (#journey-stack-cards)
      const stackContainers = gsap.utils.toArray(".stack-cards");
      stackContainers.forEach((container) => {
        const cards = Array.from(container.querySelectorAll(".stack-card"));
        cards.forEach((card, index) => {
          if (index === cards.length - 1) return;
          const nextCard = cards[index + 1];
          gsap.to(card, {
            scale: 0.96,
            filter: "brightness(0.62)",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top 85%",
              end: "top 15%",
              scrub: true
            }
          });
        });
      });
    });

    // 5.4 Section Stagger Reveals (Swiss Metrics, Praise Cards)
    gsap.from(".swiss-metric", {
      y: 24,
      opacity: 0,
      duration: 0.65,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".swiss-metrics",
        start: "top 85%"
      }
    });

    gsap.from(".praise-card", {
      y: 24,
      opacity: 0,
      duration: 0.65,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".praise-grid",
        start: "top 85%"
      }
    });
  }

  /* --------------------------------------------------------------------------
     INIT ALL MODULES ON DOM READY
     -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initSmoothAnchorsAndNav();
    initServicePicker();
    initJourneySteps();
    initBookingForm();
    initScrollChoreography();
  });
})();
