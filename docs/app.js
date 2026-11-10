/* ==========================================================================
   MARSHALL® — Velde® Architectural Edition
   Lenis Smooth Scroll + GSAP ScrollTrigger Choreography + Interactive Receipt
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
    const sectionIds = ["#about", "#services", "#journey", "#praise", "#booking", "#contacts"];
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
     2. INTERACTIVE CLINIC RECEIPT & OPTIONAL SERVICE PICKER
     -------------------------------------------------------------------------- */
  const RECEIPT_CATALOG = {
    "Бесплатная консультация (врач подскажет на осмотре)": {
      code: "СМЕТА #00 · ОСМОТР",
      title: "Бесплатная консультация — врач сам подскажет на осмотре",
      total: "после осмотра врача",
      lines: [
        ["01. Первичный осмотр профильного врача (20–30 мин)", "0 ₽"],
        ["02. Составление пошагового плана и точной сметы", "0 ₽"],
        ["03. 3D-снимок на месте (при необходимости)", "по показаниям"],
        ["04. Обязательства до вашего согласия с планом", "нет"]
      ]
    },
    "Имплантация (восстановление зуба)": {
      code: "СМЕТА #01 · ИМПЛАНТАЦИЯ",
      title: "Имплантация и восстановление зуба под ключ",
      total: "от 38 000 ₽",
      lines: [
        ["01. Консультация хирурга-имплантолога и план лечения", "0 ₽"],
        ["02. 3D-снимок челюсти прямо в клинике на месте", "в клинике"],
        ["03. Установка имплантата под мягкой анестезией", "от 38 000 ₽"],
        ["04. Контрольные осмотры после процедуры", "0 ₽"]
      ]
    },
    "Коронки и эстетика улыбки": {
      code: "СМЕТА #02 · КОРОНКИ",
      title: "Циркониевые и керамические коронки естественного оттенка",
      total: "от 26 000 ₽",
      lines: [
        ["01. Первичный осмотр врача-ортопеда и план", "0 ₽"],
        ["02. Точный подбор цвета и формы под родные зубы", "включено"],
        ["03. Коронка из диоксида циркония / керамики", "от 26 000 ₽"],
        ["04. Примерка и комфортная посадка по прикусу", "включено"]
      ]
    },
    "Бережное удаление зуба (в т.ч. зуба мудрости)": {
      code: "СМЕТА #03 · ХИРУРГИЯ",
      title: "Бережное удаление зуба и 3D-диагностика",
      total: "от 8 500 ₽",
      lines: [
        ["01. Осмотр хирурга перед процедурой", "0 ₽"],
        ["02. Трёхмерный снимок корней прямо в клинике", "5 минут"],
        ["03. Аккуратное удаление под мягкой анестезией", "от 8 500 ₽"],
        ["04. Контрольный осмотр после заживления", "0 ₽"]
      ]
    },
    "3D-снимок зубов и диагностика": {
      code: "СМЕТА #03 · 3D-СНИМОК",
      title: "Компьютерный 3D-снимок зубов на месте в клинике",
      total: "за 5 минут",
      lines: [
        ["01. Консультация врача и разбор снимка на экране", "0 ₽"],
        ["02. 3D-томография прямо в 13-м микрорайоне", "на месте"],
        ["03. Понятный план лечения и смета на руки", "0 ₽"],
        ["04. Запись исследования", "включено"]
      ]
    },
    "Выравнивание зубов (капы и брекеты)": {
      code: "СМЕТА #04 · ПРИКУС",
      title: "Выравнивание зубов прозрачными капами и брекетами",
      total: "от 42 000 ₽",
      lines: [
        ["01. Первичная консультация врача-ортодонта", "0 ₽"],
        ["02. Диагностика прикуса и расчёт сроков до старта", "в клинике"],
        ["03. Курс выравнивания (элайнеры / брекет-система)", "от 42 000 ₽"],
        ["04. Удобный график плановых посещений", "по договору"]
      ]
    }
  };

  function initServicePicker() {
    const pickButtons = document.querySelectorAll(".js-pick-service");
    const receiptTabs = Array.from(document.querySelectorAll(".receipt-tab"));
    const serviceSelect = document.getElementById("inp-service");
    const hintEl = document.getElementById("service-picked-hint");

    const receiptCard = document.getElementById("clinic-receipt");
    const receiptCodeEl = document.getElementById("receipt-code");
    const receiptTitleEl = document.getElementById("receipt-service-title");
    const receiptLinesEl = document.getElementById("receipt-lines");
    const receiptTotalEl = document.getElementById("receipt-total-price");

    if (!serviceSelect) return;

    function updateReceiptUI(serviceValue) {
      const data =
        RECEIPT_CATALOG[serviceValue] ||
        RECEIPT_CATALOG["Бесплатная консультация (врач подскажет на осмотре)"];

      if (receiptCodeEl) receiptCodeEl.textContent = data.code;
      if (receiptTitleEl) receiptTitleEl.textContent = data.title;
      if (receiptTotalEl) receiptTotalEl.textContent = data.total;

      if (receiptLinesEl) {
        receiptLinesEl.innerHTML = data.lines
          .map(
            ([label, price]) =>
              `<li><span>${label}</span><strong>${price}</strong></li>`
          )
          .join("");
      }

      receiptTabs.forEach((tab) => {
        tab.classList.toggle(
          "is-active",
          tab.getAttribute("data-receipt-service") === serviceValue
        );
      });

      if (receiptCard && typeof window.gsap !== "undefined" && !prefersReducedMotion) {
        window.gsap.fromTo(
          receiptCard,
          { y: 6, opacity: 0.82 },
          { y: 0, opacity: 1, duration: 0.26, ease: "power2.out" }
        );
      }
    }

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

      updateReceiptUI(serviceValue);

      if (hintEl) {
        if (
          serviceValue === "Бесплатная консультация (врач подскажет на осмотре)"
        ) {
          hintEl.textContent =
            "Первичный осмотр и составление плана лечения — бесплатно (0 ₽).";
          hintEl.classList.remove("is-highlighted");
        } else {
          hintEl.textContent = `В чек и заявку выбрано: «${serviceValue}». Первичный осмотр врача — бесплатно (0 ₽).`;
          hintEl.classList.add("is-highlighted");
        }
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

    receiptTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const val = tab.getAttribute("data-receipt-service");
        if (val) selectServiceOption(val, false);
      });
    });

    serviceSelect.addEventListener("change", () => {
      selectServiceOption(serviceSelect.value, false);
    });
  }

  /* --------------------------------------------------------------------------
     3. PHONE MASK & BOOKING FORM FEEDBACK
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
     4. LENIS + GSAP SCROLLTRIGGER MACRO-CHOREOGRAPHY (Velde® Archetype)
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

    // 4.1 Lenis Smooth Scroll
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

    // 4.2 Preloader Logo Handoff into Hero + Color Transition (White -> Black)
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
        .to(preloaderBg, {
          opacity: 0,
          duration: 0.78,
          ease: "power3.inOut",
          delay: 0.25
        })
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

    // 4.3 Desktop Scroll Choreography
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

      // B. Vertical Sticky Stacking Cards in #services
      // Cards stay 100% bright while being read, and only subtly recede when the next card covers their top half
      const serviceCards = gsap.utils.toArray("#stack-cards .stack-card");
      serviceCards.forEach((card, index) => {
        if (index === serviceCards.length - 1) return;
        const nextCard = serviceCards[index + 1];
        gsap.fromTo(
          card,
          { scale: 1, filter: "brightness(1)" },
          {
            scale: 0.985,
            filter: "brightness(0.88)",
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: nextCard,
              start: "top 34%",
              end: "top 14%",
              scrub: true
            }
          }
        );
      });

      // C. Reference Video (00:08.4–00:09.6) 50/50 Split + Unrolling Image Reveals in #journey (.offer-row)
      const offerRows = gsap.utils.toArray(".offer-row");
      offerRows.forEach((row) => {
        const textBlock = row.querySelector(".offer-row__text");
        const mask = row.querySelector(".offer-row__mask");
        const img = row.querySelector(".offer-row__mask img");

        if (textBlock) {
          gsap.from(textBlock, {
            y: 36,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 78%"
            }
          });
        }

        if (mask && img) {
          gsap.fromTo(
            mask,
            { clipPath: "inset(0% 0% 88% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top 82%",
                end: "top 28%",
                scrub: 0.35
              }
            }
          );

          gsap.fromTo(
            img,
            { scale: 1.14 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top 82%",
                end: "top 25%",
                scrub: 0.35
              }
            }
          );
        }
      });
    });

    // 4.4 Section Stagger Reveals (Swiss Metrics, Praise Cards)
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
    initBookingForm();
    initScrollChoreography();
  });
})();
