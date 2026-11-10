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

  let isJumpingToBooking = false;
  let playReceiptPrintIn = () => {};
  let playReceiptRetractOut = () => {};

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

    function populateReceiptDOM(serviceValue) {
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
    }

    // Strictly vertical, slower stepped thermal receipt printer feed-out animation (no side-to-side wobble)
    playReceiptPrintIn = () => {
      if (!receiptCard || typeof window.gsap === "undefined" || prefersReducedMotion) {
        if (receiptCard) receiptCard.style.transform = "none";
        return;
      }
      const gsap = window.gsap;
      gsap.killTweensOf(receiptCard);
      gsap.set(receiptCard, { yPercent: -104, x: 0, rotation: 0, opacity: 1 });

      const tl = gsap.timeline();
      tl.to(receiptCard, {
        yPercent: -80,
        duration: 0.16,
        ease: "power2.out"
      })
        .to(receiptCard, { yPercent: -80, duration: 0.09 })
        .to(receiptCard, {
          yPercent: -55,
          duration: 0.16,
          ease: "power2.out"
        })
        .to(receiptCard, { yPercent: -55, duration: 0.09 })
        .to(receiptCard, {
          yPercent: -30,
          duration: 0.16,
          ease: "power2.out"
        })
        .to(receiptCard, { yPercent: -30, duration: 0.09 })
        .to(receiptCard, {
          yPercent: -11,
          duration: 0.15,
          ease: "power2.out"
        })
        .to(receiptCard, { yPercent: -11, duration: 0.08 })
        .to(receiptCard, {
          yPercent: 0,
          duration: 0.22,
          ease: "power3.out"
        });
    };

    // Reverse strictly vertical stepped retraction when leaving #booking
    playReceiptRetractOut = () => {
      if (!receiptCard || typeof window.gsap === "undefined" || prefersReducedMotion) {
        return;
      }
      const gsap = window.gsap;
      gsap.killTweensOf(receiptCard);
      const tl = gsap.timeline();
      tl.to(receiptCard, {
        yPercent: -34,
        duration: 0.12,
        ease: "power2.in"
      })
        .to(receiptCard, { yPercent: -34, duration: 0.05 })
        .to(receiptCard, {
          yPercent: -70,
          duration: 0.12,
          ease: "power2.in"
        })
        .to(receiptCard, { yPercent: -70, duration: 0.05 })
        .to(receiptCard, {
          yPercent: -104,
          duration: 0.14,
          ease: "power2.in"
        });
    };

    function switchReceiptWithPrintAnimation(serviceValue) {
      if (!receiptCard || typeof window.gsap === "undefined" || prefersReducedMotion) {
        populateReceiptDOM(serviceValue);
        return;
      }
      const gsap = window.gsap;
      gsap.killTweensOf(receiptCard);
      gsap.to(receiptCard, {
        yPercent: -104,
        x: 0,
        rotation: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          populateReceiptDOM(serviceValue);
          playReceiptPrintIn();
        }
      });
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
        // Keep receipt retracted for the ENTIRE 1.15s smooth scroll to #booking so the user watches it print out only after arrival!
        isJumpingToBooking = true;
        populateReceiptDOM(serviceValue);
        if (receiptCard && typeof window.gsap !== "undefined" && !prefersReducedMotion) {
          window.gsap.killTweensOf(receiptCard);
          window.gsap.set(receiptCard, { yPercent: -104, x: 0, rotation: 0 });
        }
        scrollToElement("#booking");
        setTimeout(() => {
          isJumpingToBooking = false;
          playReceiptPrintIn();
          const nameInput = document.getElementById("inp-name");
          if (nameInput) nameInput.focus({ preventScroll: true });
        }, 1220);
      } else {
        switchReceiptWithPrintAnimation(serviceValue);
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

    // 4.2 Velde® Bottom-Up Curtain Reveal + Centered-to-Hero Split-Clipped Wordmark Handoff
    const preloaderMask = document.getElementById("preloader-mask");
    const preloaderWord = document.getElementById("preloader-word");
    const heroTitle = document.getElementById("hero-title");
    const heroBgWrap = document.getElementById("hero-bg-wrap");

    if (preloader && preloaderMask && preloaderWord && heroTitle && window.scrollY < 80) {
      const heroRect = heroTitle.getBoundingClientRect();
      // Start wordmark right near the center of the loading screen so its movement into the Hero is clearly visible
      const startOffsetX = Math.round(
        Math.max(0, (window.innerWidth - heroRect.width) * 0.45 - heroRect.left)
      );
      const startOffsetY = Math.round(
        (window.innerHeight - heroRect.height) * 0.52 - heroRect.top
      );

      // Lock black preloader wordmark and white Hero wordmark to identical screen coordinates
      gsap.set(preloader, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(preloaderMask, {
        left: heroRect.left + startOffsetX,
        top: heroRect.top + startOffsetY,
        x: 0,
        y: 0,
        opacity: 1
      });
      gsap.set(preloaderWord, { y: 0, yPercent: 112, color: "#121110" });
      gsap.set(heroTitle, { x: startOffsetX, y: startOffsetY });
      gsap.set(".hero-reveal", { y: 26, opacity: 0 });
      if (heroBgWrap) {
        gsap.set(heroBgWrap, { yPercent: 14, scale: 1.06 });
      }

      const tlEntry = gsap.timeline({
        onComplete: () => {
          gsap.set(heroTitle, { clearProps: "transform" });
          if (heroBgWrap) gsap.set(heroBgWrap, { clearProps: "transform" });
          preloader.classList.add("is-hidden");
        }
      });

      tlEntry
        // Beat 1: Black wordmark rises out of baseline mask in the center of the white preloader
        .to(
          preloaderWord,
          {
            y: 0,
            yPercent: 0,
            duration: 0.62,
            ease: "power4.out"
          },
          0.05
        )
        // Beat 2: First block rises bottom-to-top while wordmark glides from center into Hero & slices Black -> White at the rising border
        .to(
          preloader,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.94,
            ease: "expo.inOut"
          },
          0.72
        )
        .to(
          preloaderMask,
          {
            x: -startOffsetX,
            y: -startOffsetY,
            duration: 0.94,
            ease: "expo.inOut"
          },
          0.72
        )
        .to(
          heroTitle,
          {
            x: 0,
            y: 0,
            duration: 0.94,
            ease: "expo.inOut"
          },
          0.72
        );

      if (heroBgWrap) {
        tlEntry.to(
          heroBgWrap,
          {
            yPercent: 0,
            scale: 1,
            duration: 0.94,
            ease: "expo.inOut"
          },
          0.72
        );
      }

      // Beat 3: Hero UI elements rise bottom-to-top after curtain settles
      tlEntry.to(
        ".hero-reveal",
        {
          y: 0,
          opacity: 1,
          duration: 0.62,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "transform,opacity"
        },
        1.46
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

    // 4.5 Thermal Receipt Printer ScrollTrigger (Prints in on enter, retracts on leave so it replays every visit)
    const receiptCard = document.getElementById("clinic-receipt");
    const bookingSection = document.getElementById("booking");
    if (receiptCard && bookingSection) {
      gsap.set(receiptCard, { yPercent: -106, rotation: 0 });
      ScrollTrigger.create({
        trigger: bookingSection,
        start: "top 64%",
        end: "bottom 28%",
        onEnter: () => {
          if (!isJumpingToBooking) playReceiptPrintIn();
        },
        onEnterBack: () => {
          if (!isJumpingToBooking) playReceiptPrintIn();
        },
        onLeave: () => {
          if (!isJumpingToBooking) playReceiptRetractOut();
        },
        onLeaveBack: () => {
          if (!isJumpingToBooking) playReceiptRetractOut();
        }
      });
    }
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
