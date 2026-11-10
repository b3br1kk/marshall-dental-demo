/* ============================================================
   MARSHALL Dental Studio — Production Choreography & UX
   ============================================================ */

(function () {
  "use strict";

  let lenisInstance = null;

  // 1. CLINIC ADVANTAGES DATA (Section 2)
  const SUITE_STATES = [
    {
      tag: "01 / 03 · ДИАГНОСТИКА НА МЕСТЕ",
      title: "Снимок зубов прямо в клинике за 5 минут",
      desc: "Не нужно никуда ехать за рентгеном. Врач сразу видит полную картину на экране и простыми словами показывает, какое лечение действительно необходимо.",
      chips: ["Консультация — 0 ₽", "Снимок в день приёма", "Без очередей"]
    },
    {
      tag: "02 / 03 · БЕРЕЖНЫЙ ПОДХОД",
      title: "Лечение и удаление без боли и спешки",
      desc: "Подбираем современную мягкую анестезию и работаем аккуратно. Даже сложные зубы мудрости удаляем бережно и комфортно.",
      chips: ["Мягкая анестезия", "Спокойная атмосфера", "Забота о пациенте"]
    },
    {
      tag: "03 / 03 · ПРОЗРАЧНЫЕ УСЛОВИЯ",
      title: "Понятная стоимость до начала лечения",
      desc: "На бесплатном осмотре врач составит понятный план и заранее назовёт точную цену каждого этапа — без скрытых доплат и навязывания лишних услуг.",
      chips: ["Первый осмотр — 0 ₽", "Честная смета", "Поэтапная оплата"]
    }
  ];

  // 2. SERVICES & TRANSPARENT PRICES DATA (Section 3)
  const PODIUM_CASES = [
    {
      watermark: "ИМПЛАНТАЦИЯ",
      code: "ВОССТАНОВЛЕНИЕ ЗУБА",
      visits: "Консультация — 0 ₽",
      title: "Имплантация отсутствующего зуба",
      desc: "Надёжный новый зуб, который выглядит и ощущается как свой собственный. Соседние здоровые зубы обтачивать не нужно.",
      total: "от 38 000 ₽",
      subnote: "Точную стоимость врач назовёт на бесплатной консультации после осмотра",
      serviceValue: "Имплантация (восстановление зуба)",
      rows: [
        ["1. Консультация врача и план лечения", "0 ₽"],
        ["2. 3D-снимок зубов (при необходимости)", "на месте"],
        ["3. Установка имплантата с анестезией", "от 38 000 ₽"],
        ["4. Коронка под цвет ваших зубов", "от 26 000 ₽"]
      ]
    },
    {
      watermark: "КОРОНКИ И ВИНИРЫ",
      code: "КРАСИВАЯ УЛЫБКА",
      visits: "Консультация — 0 ₽",
      title: "Коронки и восстановление зубов",
      desc: "Прочные коронки из циркония и керамики. Точно подбираем цвет под ваши родные зубы, чтобы улыбка выглядела естественно.",
      total: "от 26 000 ₽",
      subnote: "Врач бесплатно осмотрит зуб и подскажет подходящий вариант",
      serviceValue: "Коронки и эстетика улыбки",
      rows: [
        ["1. Первичный осмотр и подбор решения", "0 ₽"],
        ["2. Бережная подготовка и слепки", "включено"],
        ["3. Временная коронка на время изготовления", "от 4 500 ₽"],
        ["4. Готовая коронка (цирконий / керамика)", "от 26 000 ₽"]
      ]
    },
    {
      watermark: "УДАЛЕНИЕ И 3D",
      code: "БЕЗ БОЛИ И СТРАХА",
      visits: "Консультация — 0 ₽",
      title: "Бережное удаление зуба и 3D-снимок",
      desc: "Аккуратно и безболезненно удаляем разрушенные зубы и сложные зубы мудрости под контролем снимка.",
      total: "от 8 500 ₽",
      subnote: "Осмотр и проверка после заживления входят в стоимость",
      serviceValue: "Бережное удаление зуба (в т.ч. зуба мудрости)",
      rows: [
        ["1. Осмотр хирурга и консультация", "0 ₽"],
        ["2. Комфортная современная анестезия", "включено"],
        ["3. Бережное удаление зуба", "от 8 500 ₽"],
        ["4. Контрольный осмотр и снятие швов", "0 ₽"]
      ]
    },
    {
      watermark: "РОВНЫЕ ЗУБЫ",
      code: "ИСПРАВЛЕНИЕ ПРИКУСА",
      visits: "Консультация — 0 ₽",
      title: "Выравнивание зубов капами и брекетами",
      desc: "Плавное выравнивание зубов прозрачными съёмными капами (элайнерами) или современными аккуратными брекетами.",
      total: "от 42 000 ₽",
      subnote: "На бесплатном приёме врач подскажет сроки и удобный вариант",
      serviceValue: "Выравнивание зубов (капы и брекеты)",
      rows: [
        ["1. Первичная консультация ортодонта", "0 ₽"],
        ["2. Снимок и расчёт плана выравнивания", "от 14 000 ₽"],
        ["3. Комплект прозрачных кап / система", "от 42 000 ₽"],
        ["4. Плановые приёмы у врача", "по графику"]
      ]
    }
  ];

  // ============================================================
  // SMOOTH ANCHOR SCROLL HELPER (FOR HEADER & ALL CTA BUTTONS)
  // ============================================================
  function smoothScrollToTarget(selector) {
    if (!selector || selector === "#") return;
    if (selector === "#top") {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, {
          duration: 1.15,
          easing: (t) => 1 - Math.pow(1 - t, 4)
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const targetEl = document.querySelector(selector);
    if (!targetEl) return;

    const headerOffset = -88;
    if (lenisInstance) {
      lenisInstance.scrollTo(targetEl, {
        offset: headerOffset,
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 4)
      });
    } else {
      const rect = targetEl.getBoundingClientRect();
      const targetY = window.pageYOffset + rect.top + headerOffset;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href.length < 2) return;
      e.preventDefault();
      smoothScrollToTarget(href);
    });
  });

  // ============================================================
  // ANIMATED HEADER NAV INDICATOR PILL & SCROLL SPY
  // ============================================================
  const navEl = document.getElementById("main-nav");
  const navIndicator = document.getElementById("nav-indicator");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));

  function moveNavIndicator(linkEl) {
    if (!navEl || !navIndicator || !linkEl) return;
    const navRect = navEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    if (linkRect.width === 0) return;
    const offsetX = linkRect.left - navRect.left;
    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.transform = `translate3d(${offsetX}px, 0, 0)`;
    navIndicator.style.opacity = "1";
  }

  function syncNavIndicatorToActive() {
    const activeLink = document.querySelector(".nav__link.is-active") || navLinks[0];
    if (activeLink) moveNavIndicator(activeLink);
  }

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => moveNavIndicator(link));
    link.addEventListener("focus", () => moveNavIndicator(link));
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
      moveNavIndicator(link);
    });
  });

  if (navEl) {
    navEl.addEventListener("mouseleave", syncNavIndicatorToActive);
  }
  window.addEventListener("resize", syncNavIndicatorToActive);
  window.addEventListener("load", () => setTimeout(syncNavIndicatorToActive, 120));
  setTimeout(syncNavIndicatorToActive, 80);

  // Scroll Spy for Active Section in Header
  const trackedSections = ["#suite", "#podium", "#journey", "#departments", "#contacts"]
    .map((sel) => ({ sel, el: document.querySelector(sel) }))
    .filter((item) => item.el);

  function updateActiveNavOnScroll() {
    const scrollMid = window.scrollY + window.innerHeight * 0.34;
    let currentSel = trackedSections[0]?.sel;
    for (const item of trackedSections) {
      const top = item.el.offsetTop;
      if (scrollMid >= top) {
        currentSel = item.sel;
      }
    }
    if (currentSel) {
      navLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === currentSel;
        link.classList.toggle("is-active", isMatch);
      });
      if (!navEl || !navEl.matches(":hover")) {
        syncNavIndicatorToActive();
      }
    }
  }

  window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });

  // ============================================================
  // HELPER: SELECT SERVICE IN BOOKING FORM
  // ============================================================
  const serviceSelect = document.getElementById("inp-service");
  const serviceHint = document.getElementById("service-picked-hint");

  function selectBookingService(serviceVal) {
    if (!serviceSelect || !serviceVal) return;
    const options = Array.from(serviceSelect.options);
    const match = options.find((opt) => opt.value === serviceVal);
    if (match) {
      serviceSelect.value = serviceVal;
    }
    if (serviceHint) {
      serviceHint.textContent = `Вы выбрали: «${serviceVal}». Первичная консультация и осмотр врача — 0 ₽.`;
    }
  }

  if (serviceSelect && serviceHint) {
    serviceSelect.addEventListener("change", () => {
      if (serviceSelect.value.includes("Бесплатная консультация")) {
        serviceHint.textContent = "Первичный осмотр и составление плана лечения — бесплатно.";
      } else {
        serviceHint.textContent = `Вы выбрали: «${serviceSelect.value}». Первичная консультация и осмотр врача — 0 ₽.`;
      }
    });
  }

  // ============================================================
  // SUITE SWITCHER (Section 2)
  // ============================================================
  const suitePills = document.querySelectorAll(".suite-pill");
  const suiteTag = document.getElementById("suite-tag");
  const suiteTitle = document.getElementById("suite-card-title");
  const suiteDesc = document.getElementById("suite-card-desc");
  const suiteChips = document.getElementById("suite-chips");

  suitePills.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.suite || 0);
      const data = SUITE_STATES[idx] || SUITE_STATES[0];
      suitePills.forEach((p, i) => {
        p.classList.toggle("is-active", i === idx);
        p.setAttribute("aria-selected", String(i === idx));
      });
      if (suiteTag) suiteTag.textContent = data.tag;
      if (suiteTitle) suiteTitle.textContent = data.title;
      if (suiteDesc) suiteDesc.textContent = data.desc;
      if (suiteChips) {
        suiteChips.innerHTML = data.chips.map((c) => `<span>${c}</span>`).join("");
      }
    });
  });

  // ============================================================
  // SERVICES & PRICES SHOWCASE (Section 3)
  // ============================================================
  const studioStage = document.getElementById("studio-stage");
  const podiumItems = document.querySelectorAll(".podium-item");
  const dockPills = document.querySelectorAll(".dock-pill");
  const stageWatermark = document.getElementById("stage-watermark");
  const stageResetBtn = document.getElementById("stage-reset");
  const receiptCloseBtn = document.getElementById("receipt-close");

  const rcCode = document.getElementById("rc-code");
  const rcVisits = document.getElementById("rc-visits");
  const rcTitle = document.getElementById("rc-title");
  const rcDesc = document.getElementById("rc-desc");
  const rcRows = document.getElementById("rc-rows");
  const rcTotal = document.getElementById("rc-total");
  const rcSubnote = document.getElementById("rc-subnote");
  const rcApplyBtn = document.getElementById("rc-apply-btn");

  let activeCaseIndex = null;

  function renderReceipt(index) {
    const item = PODIUM_CASES[index];
    if (!item) return;
    activeCaseIndex = index;

    studioStage.classList.add("has-active");
    if (stageResetBtn) stageResetBtn.hidden = false;
    if (stageWatermark) stageWatermark.textContent = item.watermark;

    podiumItems.forEach((el, i) => {
      el.classList.toggle("is-selected", i === index);
    });
    dockPills.forEach((pill, i) => {
      pill.setAttribute("aria-selected", String(i === index));
    });

    if (rcCode) rcCode.textContent = item.code;
    if (rcVisits) rcVisits.textContent = item.visits;
    if (rcTitle) rcTitle.textContent = item.title;
    if (rcDesc) rcDesc.textContent = item.desc;
    if (rcTotal) rcTotal.textContent = item.total;
    if (rcSubnote) rcSubnote.textContent = item.subnote;

    if (rcRows) {
      rcRows.innerHTML = item.rows
        .map(([name, val]) => `<div class="receipt__row"><span>${name}</span><span>${val}</span></div>`)
        .join("");
    }

    selectBookingService(item.serviceValue);
  }

  function resetStudioStage() {
    activeCaseIndex = null;
    studioStage.classList.remove("has-active");
    if (stageResetBtn) stageResetBtn.hidden = true;
    if (stageWatermark) stageWatermark.textContent = "МАРШАЛЛ · УСЛУГИ";
    podiumItems.forEach((el) => el.classList.remove("is-selected"));
    dockPills.forEach((pill) => pill.setAttribute("aria-selected", "false"));
  }

  podiumItems.forEach((item) => {
    item.addEventListener("click", () => {
      const idx = Number(item.dataset.case || 0);
      if (activeCaseIndex === idx) {
        resetStudioStage();
      } else {
        renderReceipt(idx);
      }
    });
  });

  dockPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const idx = Number(pill.dataset.dock || 0);
      renderReceipt(idx);
    });
  });

  if (stageResetBtn) stageResetBtn.addEventListener("click", resetStudioStage);
  if (receiptCloseBtn) receiptCloseBtn.addEventListener("click", resetStudioStage);

  if (rcApplyBtn) {
    rcApplyBtn.addEventListener("click", () => {
      smoothScrollToTarget("#booking");
      const nameInput = document.getElementById("inp-name");
      if (nameInput) setTimeout(() => nameInput.focus(), 700);
    });
  }

  // ============================================================
  // SCROLL-DRIVEN 50/50 CARE JOURNEY (Section 4)
  // ============================================================
  const jSteps = Array.from(document.querySelectorAll(".j-step"));
  const jImages = Array.from(document.querySelectorAll(".journey-img"));
  let currentJourneyStep = 0;

  function activateJourneyStep(index) {
    const clamped = Math.max(0, Math.min(jSteps.length - 1, index));
    if (clamped === currentJourneyStep && jSteps[clamped]?.classList.contains("is-open")) {
      return;
    }
    currentJourneyStep = clamped;

    jSteps.forEach((step, i) => {
      const open = i === clamped;
      step.classList.toggle("is-open", open);
      const btn = step.querySelector(".j-step__trigger");
      if (btn) btn.setAttribute("aria-expanded", String(open));
    });

    jImages.forEach((img, i) => {
      img.classList.toggle("is-active", i === clamped);
    });
  }

  jSteps.forEach((step, idx) => {
    const btn = step.querySelector(".j-step__trigger");
    if (btn) {
      btn.addEventListener("click", () => activateJourneyStep(idx));
    }
  });

  // ============================================================
  // 3D ARC CARDS -> BOOKING SELECTION (Section 5)
  // ============================================================
  const arcCards = document.querySelectorAll(".arc-card");
  arcCards.forEach((card) => {
    card.addEventListener("click", () => {
      const dept = card.dataset.dept;
      if (dept) {
        selectBookingService(dept);
      }
      smoothScrollToTarget("#booking");
    });
  });

  // ============================================================
  // BOOKING FORM SUBMISSION (Section 6)
  // ============================================================
  const bookingForm = document.getElementById("booking-form");
  const formFeedback = document.getElementById("form-feedback");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameVal = (document.getElementById("inp-name")?.value || "").trim();
      const phoneVal = (document.getElementById("inp-phone")?.value || "").trim();
      const timeVal = document.getElementById("inp-time")?.value || "";
      const srvVal = serviceSelect ? serviceSelect.value : "Бесплатная консультация";

      if (!nameVal || !phoneVal) {
        if (formFeedback) {
          formFeedback.hidden = false;
          formFeedback.textContent = "Пожалуйста, укажите ваше имя и телефон, чтобы мы могли вам перезвонить.";
        }
        return;
      }

      if (formFeedback) {
        formFeedback.hidden = false;
        formFeedback.textContent = `Спасибо, ${nameVal}! Ваша запись (${srvVal}, ${timeVal}) передана администратору клиники «Маршалл» (13 мкр, 34). Мы скоро перезвоним вам.`;
      }
      bookingForm.reset();
    });
  }

  // ============================================================
  // MACRO-CHOREOGRAPHY: LENIS + GSAP SCROLLTRIGGER
  // ============================================================
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Lenis Smooth Inertial Scroll
      if (typeof Lenis !== "undefined") {
        lenisInstance = new Lenis({
          duration: 1.12,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true
        });
        lenisInstance.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      // 2. Preloader -> Hero Curtain & Scale Reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".preloader__inner",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.32 }
      )
        .to(".preloader", {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.68,
          ease: "power3.inOut",
          delay: 0.1
        })
        .from(
          "#hero-media-wrap",
          {
            scale: 1.06,
            clipPath: "inset(5% 5% 5% 5% round 28px)",
            duration: 0.85
          },
          "-=0.52"
        )
        .from(
          ".line-inner",
          {
            yPercent: 108,
            duration: 0.7,
            stagger: 0.08
          },
          "-=0.65"
        )
        .from(
          ".hero-anim",
          {
            opacity: 0,
            y: 16,
            duration: 0.52,
            stagger: 0.06
          },
          "-=0.48"
        )
        .set(".preloader", { display: "none" });
    });

    // 3. Desktop Spatial Scroll Choreography
    mm.add("(min-width: 1081px) and (prefers-reduced-motion: no-preference)", () => {
      // 3a. Expand Suite Card from 74vw to 96vw Full-Bleed on Scroll
      gsap.fromTo(
        "#expand-card",
        { width: "74vw", borderRadius: "32px" },
        {
          width: "96vw",
          borderRadius: "22px",
          ease: "none",
          scrollTrigger: {
            trigger: "#expand-stage",
            start: "top 82%",
            end: "top 18%",
            scrub: 0.55
          }
        }
      );

      // 3b. Scroll-Pinned 50/50 Journey ("Не знаете, с чего начать?"):
      // Scrolling through #journey switches images 0 -> 1 -> 2 -> 3 and highlights steps on the right
      ScrollTrigger.create({
        trigger: "#journey",
        start: "top 13%",
        end: "+=170%",
        pin: true,
        scrub: 0.25,
        onUpdate: (self) => {
          const total = jSteps.length;
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          activateJourneyStep(idx);
        }
      });

      // 3c. 3D Curved Arc Card Fanning
      const cards = gsap.utils.toArray(".arc-card");
      const fanAngles = [-10, -5, 0, 5, 10];
      const fanY = [38, 10, 0, 10, 38];

      gsap.fromTo(
        cards,
        {
          rotateZ: 0,
          y: 72,
          x: (i) => (2 - i) * 70,
          opacity: 0.2,
          scale: 0.92
        },
        {
          rotateZ: (i) => fanAngles[i] || 0,
          y: (i) => fanY[i] || 0,
          x: 0,
          opacity: 1,
          scale: 1,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: "#arc-fan-stage",
            start: "top 85%",
            end: "top 30%",
            scrub: 0.65
          }
        }
      );
    });

    // 4. Tablet/Mobile Scroll-Driven Journey (without full-screen pin)
    mm.add("(max-width: 1080px)", () => {
      ScrollTrigger.create({
        trigger: "#journey",
        start: "top 60%",
        end: "bottom 40%",
        onUpdate: (self) => {
          const total = jSteps.length;
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          activateJourneyStep(idx);
        }
      });
    });
  } else {
    const pre = document.getElementById("preloader");
    if (pre) pre.style.display = "none";
  }
})();
