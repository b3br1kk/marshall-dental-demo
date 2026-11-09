/* ============================================================
   MARSHALL® Dental Studio — Studio Choreography & Interactions
   Archetypes: Clearmed (B) + OFFLINE (D)
   ============================================================ */

(function () {
  "use strict";

  // 1. SUITE FULL-BLEED DATA (Section 2)
  const SUITE_STATES = [
    {
      tag: "01 / 03 · КОМПЬЮТЕРНАЯ ТОМОГРАФИЯ",
      title: "Точный расчёт костной ткани до начала приёма",
      desc: "3D-снимок показывает плотность кости, расположение гайморовых пазух и нижнечелюстного нерва с точностью до 0.08 мм. Вы получаете прозрачный поэтапный план без скрытых процедур.",
      chips: ["3D-снимок в день обращения", "Контроль канала нерва", "Хирургический шаблон"]
    },
    {
      tag: "02 / 03 · ХИРУРГИЧЕСКИЙ ПРОТОКОЛ",
      title: "Атравматичная имплантация и костная пластика",
      desc: "Установка внутрикостных имплантатов и синус-лифтинг проводятся под прицельным контролем КТ. Соседние здоровые зубы не обтачиваются и сохраняют живой нерв.",
      chips: ["Внутрикостные системы Ti", "Синус-лифтинг", "Бережная анестезия"]
    },
    {
      tag: "03 / 03 · ЭСТЕТИЧЕСКАЯ ОРТОПЕДИЯ",
      title: "Естественная полупрозрачность циркония и E.max",
      desc: "Подбираем тон и микрорельеф коронки по эталонной палитре VITA 3D-Master, чтобы реставрация пропускала свет точно так же, как собственная зубная эмаль.",
      chips: ["Диоксид циркония", "Цельная керамика E.max", "Точность посадки 20 мкм"]
    }
  ];

  // 2. STUDIO PODIUM & CLINICAL RECEIPT DATA (Section 3 — OFFLINE Archetype)
  const PODIUM_CASES = [
    {
      watermark: "01: IMPLANT MONOLITH",
      code: "ПРОТОКОЛ #M-01 · ИМПЛАНТАЦИЯ",
      visits: "3–4 ВИЗИТА",
      title: "Восстановление одного зуба без обточки соседних",
      desc: "Внутрикостный титановый имплантат с индивидуальным абатментом и коронкой из диоксида циркония.",
      callout: "Титановый корень Grade 4 + Коронка из циркония VITA",
      total: "38 000 ₽",
      subnote: "Стоимость хирургического этапа установки имплантата (ортопедический этап оплачивается отдельно при фиксации коронки)",
      formLabel: "01 · Имплантация Ti + Цирконий (от 38 000 ₽)",
      rows: [
        ["01. 3D КТ-диагностика и цифровой план", "ВКЛЮЧЕНО"],
        ["02. Внутрикостный имплантат (хирургия)", "от 38 000 ₽"],
        ["03. Формирователь десны и абатмент", "по смете"],
        ["04. Коронка из диоксида циркония", "от 26 000 ₽"]
      ]
    },
    {
      watermark: "02: E.MAX CERAMIC",
      code: "ПРОТОКОЛ #M-02 · ОРТОПЕДИЯ",
      visits: "2–3 ВИЗИТА",
      title: "Цельнокерамические коронки E.max и диоксид циркония",
      desc: "Восстановление разрушенных зубов и эстетики зоны улыбки без тёмного металлического края у десны.",
      callout: "Многослойная керамика E.max с живой светопроницаемостью",
      total: "26 000 ₽",
      subnote: "Ориентир за единицу безметалловой реставрации (точная смета после очного осмотра)",
      formLabel: "02 · Коронки из циркония и керамика E.max (от 26 000 ₽)",
      rows: [
        ["01. Осмотр ортопеда и фотопротокол VITA", "ВКЛЮЧЕНО"],
        ["02. Временная эстетическая коронка", "от 4 500 ₽"],
        ["03. Цифровое моделирование прикуса", "ВКЛЮЧЕНО"],
        ["04. Коронка Цирконий / Керамика E.max", "от 26 000 ₽"]
      ]
    },
    {
      watermark: "03: 3D CBCT SURGERY",
      code: "ПРОТОКОЛ #M-03 · ЧЛХ & 3D КТ",
      visits: "1 ВИЗИТ (40 МИН)",
      title: "Сложное удаление зуба мудрости под контролем 3D КТ",
      desc: "Атравматичное удаление ретинированных и дистопированных восьмёрок с сохранением костной стенки.",
      callout: "Оптический контроль положения нижнечелюстного нерва",
      total: "8 500 ₽",
      subnote: "Ориентир за сложное хирургическое удаление с учётом прицельной 3D-диагностики",
      formLabel: "03 · 3D КТ и удаление зуба мудрости (от 8 500 ₽)",
      rows: [
        ["01. 3D КТ-снимок области восьмёрки", "ВКЛЮЧЕНО"],
        ["02. Проводниковая анестезия", "ВКЛЮЧЕНО"],
        ["03. Атравматичное разделение корней", "от 8 500 ₽"],
        ["04. Контрольный осмотр и снятие швов", "0 ₽"]
      ]
    },
    {
      watermark: "04: CLEAR ALIGNER",
      code: "ПРОТОКОЛ #M-04 · ОРТОДОНТИЯ",
      visits: "КУРС ОТ 6 МЕС.",
      title: "Исправление прикуса элайнерами и брекет-системами",
      desc: "Пошаговое выравнивание зубного ряда прозрачными съёмными капами или самолигирующими брекетами.",
      callout: "Биополимерные прозрачные капы с 3D-прогнозом улыбки",
      total: "42 000 ₽",
      subnote: "Ориентир за стартовый ортодонтический этап и 3D-расчёт перемещения зубов",
      formLabel: "04 · Элайнеры и коррекция прикуса (от 42 000 ₽)",
      rows: [
        ["01. 3D КТ обеих челюстей и ВНЧС", "ВКЛЮЧЕНО"],
        ["02. Цифровой сетап перемещения зубов", "от 14 000 ₽"],
        ["03. Фиксация системы / комплект кап", "от 42 000 ₽"],
        ["04. Плановые активации у ортодонта", "по графику"]
      ]
    }
  ];

  const JOURNEY_CAPTIONS = [
    "Визит 01 · Осмотр и 3D-снимок",
    "Визит 02 · Бережная хирургия и имплантация",
    "Визит 03 · Подбор оттенка по шкале VITA 3D",
    "Визит 04 · Фиксация керамики и паспорт"
  ];

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
  // SIGNATURE INTERACTION: PODIUM & RECEIPT DRAWER (Section 3)
  // ============================================================
  const studioStage = document.getElementById("studio-stage");
  const podiumItems = document.querySelectorAll(".podium-item");
  const dockPills = document.querySelectorAll(".dock-pill");
  const stageWatermark = document.getElementById("stage-watermark");
  const stageResetBtn = document.getElementById("stage-reset");
  const receiptCloseBtn = document.getElementById("receipt-close");
  const calloutText = document.getElementById("callout-text");

  const rcCode = document.getElementById("rc-code");
  const rcVisits = document.getElementById("rc-visits");
  const rcTitle = document.getElementById("rc-title");
  const rcDesc = document.getElementById("rc-desc");
  const rcRows = document.getElementById("rc-rows");
  const rcTotal = document.getElementById("rc-total");
  const rcSubnote = document.getElementById("rc-subnote");
  const rcApplyBtn = document.getElementById("rc-apply-btn");
  const formProtocolOut = document.getElementById("form-protocol-out");

  let activeCaseIndex = null;

  function renderReceipt(index) {
    const item = PODIUM_CASES[index];
    if (!item) return;
    activeCaseIndex = index;

    studioStage.classList.add("has-active");
    if (stageResetBtn) stageResetBtn.hidden = false;
    if (stageWatermark) stageWatermark.textContent = item.watermark;
    if (calloutText) calloutText.textContent = item.callout;

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

    if (formProtocolOut) {
      formProtocolOut.textContent = item.formLabel;
    }
  }

  function resetStudioStage() {
    activeCaseIndex = null;
    studioStage.classList.remove("has-active");
    if (stageResetBtn) stageResetBtn.hidden = true;
    if (stageWatermark) stageWatermark.textContent = "MARSHALL STUDIO · 01–04";
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
      const bookingEl = document.getElementById("booking");
      if (bookingEl) bookingEl.scrollIntoView({ behavior: "smooth" });
      const nameInput = document.getElementById("inp-name");
      if (nameInput) setTimeout(() => nameInput.focus(), 600);
    });
  }

  // ============================================================
  // STICKY 50/50 CARE JOURNEY ACCORDION (Section 4)
  // ============================================================
  const jSteps = document.querySelectorAll(".j-step");
  const jImages = document.querySelectorAll(".journey-img");
  const jCaption = document.getElementById("journey-caption");

  function activateJourneyStep(index) {
    jSteps.forEach((step, i) => {
      const open = i === index;
      step.classList.toggle("is-open", open);
      const btn = step.querySelector(".j-step__trigger");
      if (btn) btn.setAttribute("aria-expanded", String(open));
    });
    jImages.forEach((img, i) => {
      img.classList.toggle("is-active", i === index);
    });
    if (jCaption && JOURNEY_CAPTIONS[index]) {
      jCaption.textContent = JOURNEY_CAPTIONS[index];
    }
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
      if (dept && formProtocolOut) {
        formProtocolOut.textContent = dept;
      }
      const bookingEl = document.getElementById("booking");
      if (bookingEl) bookingEl.scrollIntoView({ behavior: "smooth" });
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
      const protoVal = formProtocolOut ? formProtocolOut.textContent.trim() : "";

      if (!nameVal || !phoneVal) {
        if (formFeedback) {
          formFeedback.hidden = false;
          formFeedback.textContent = "Пожалуйста, укажите имя и телефон, чтобы администратор связался с вами.";
        }
        return;
      }

      if (formFeedback) {
        formFeedback.hidden = false;
        formFeedback.textContent = `Заявка принята, ${nameVal}. Маршрут «${protoVal}» (${timeVal}) передан в регистратуру клиники Marshall (13 мкр, 34).`;
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
        const lenis = new Lenis({
          duration: 1.12,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true
        });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      // 2. Preloader -> Hero Curtain & Scale Reveal (0.9s)
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".preloader__inner",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35 }
      )
        .to(".preloader", {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.72,
          ease: "power3.inOut",
          delay: 0.12
        })
        .from(
          "#hero-media-wrap",
          {
            scale: 1.07,
            clipPath: "inset(6% 6% 6% 6% round 28px)",
            duration: 0.88
          },
          "-=0.55"
        )
        .from(
          ".line-inner",
          {
            yPercent: 108,
            duration: 0.72,
            stagger: 0.08
          },
          "-=0.68"
        )
        .from(
          ".hero-anim",
          {
            opacity: 0,
            y: 16,
            duration: 0.55,
            stagger: 0.06
          },
          "-=0.5"
        )
        .set(".preloader", { display: "none" });
    });

    // 3. Desktop Spatial Scroll Choreography
    mm.add("(min-width: 1081px) and (prefers-reduced-motion: no-preference)", () => {
      // 3a. Expand Suite Card from 76vw to 96vw Full-Bleed on Scroll (Clearmed 0:04)
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

      // 3b. 3D Curved Arc Card Fanning (Clearmed 0:12)
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
  } else {
    const pre = document.getElementById("preloader");
    if (pre) pre.style.display = "none";
  }
})();
