(() => {
  document.documentElement.classList.add('js');

  /* ---------- 1. 4-STAGE IMPLANT CROSS-SECTION ---------- */
  const STAGES = [
    {
      badge: 'ЭТАП 01 / 04',
      duration: 'Визит 1 · 30–40 минут',
      title: 'Компьютерная томография (КТ) и расчёт костной ткани',
      desc: 'Хирург-имплантолог делает 3D-снимок челюсти, измеряет высоту и плотность кости до миллиметра, проверяет расположение пазух и нижнечелюстного нерва. До начала операции вы получаете поэтапный план и смету.',
      doc: 'Хирург-имплантолог + стоматолог-ортопед',
      note: 'Если объёма кости не хватает, врач сразу скажет, нужен ли синус-лифтинг или костная пластика'
    },
    {
      badge: 'ЭТАП 02 / 04',
      duration: 'Хирургический этап · 40–60 минут',
      title: 'Установка титанового имплантата под местной анестезией',
      desc: 'Через аккуратный доступ хирург формирует ложе в кости и устанавливает титановый корень. При подходящих условиях имплантат можно установить одномоментно сразу после удаления разрушенного зуба.',
      doc: 'Стоматолог-хирург-имплантолог',
      note: 'Внутрикостная дентальная имплантация в справочниках указана от ~38 000 ₽ (точная стоимость зависит от системы имплантата)'
    },
    {
      badge: 'ЭТАП 03 / 04',
      duration: 'Остеоинтеграция · 3–6 месяцев',
      title: 'Приживление имплантата и формирование контура десны',
      desc: 'Костная ткань плотно срастается с микрорезьбой титанового имплантата. Перед протезированием устанавливается формирователь десны, а затем соединительный элемент — абатмент.',
      doc: 'Контрольный снимок у хирурга и переход к ортопеду',
      note: 'На нижней челюсти приживление обычно идёт быстрее (3–4 мес.), на верхней — 4–6 мес.'
    },
    {
      badge: 'ЭТАП 04 / 04',
      duration: 'Ортопедический этап · 2 визита',
      title: 'Фиксация постоянной коронки на абатменте',
      desc: 'Стоматолог-ортопед снимает слепки, подбирает цвет в тон соседним зубам и фиксирует коронку. Новый зуб полностью берёт на себя жевательную нагрузку без обточки соседних зубов.',
      doc: 'Стоматолог-ортопед',
      note: 'Винтовая или цементная фиксация по показаниям; регулярный профосмотр раз в полгода'
    }
  ];

  const stageTabs = document.getElementById('stage-tabs');
  const implantSvg = document.getElementById('implant-svg');

  function setStage(idx) {
    const s = STAGES[idx];
    if (!s) return;
    if (implantSvg) implantSvg.setAttribute('data-stage', String(idx));
    if (stageTabs) {
      stageTabs.querySelectorAll('.stage-tab').forEach((btn, i) => {
        btn.setAttribute('aria-selected', String(i === idx));
      });
    }
    const badge = document.getElementById('stage-badge');
    const dur = document.getElementById('stage-duration');
    const title = document.getElementById('stage-title');
    const desc = document.getElementById('stage-desc');
    const doc = document.getElementById('stage-doc');
    const note = document.getElementById('stage-note');

    if (badge) badge.textContent = s.badge;
    if (dur) dur.textContent = s.duration;
    if (title) title.textContent = s.title;
    if (desc) desc.textContent = s.desc;
    if (doc) doc.textContent = s.doc;
    if (note) note.textContent = s.note;
  }

  if (stageTabs) {
    stageTabs.querySelectorAll('.stage-tab').forEach((btn, idx) => {
      btn.addEventListener('click', () => setStage(idx));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (idx + 1) % STAGES.length;
          setStage(next);
          stageTabs.children[next]?.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (idx - 1 + STAGES.length) % STAGES.length;
          setStage(prev);
          stageTabs.children[prev]?.focus();
        }
      });
    });
  }

  /* ---------- 2. CLINICAL ROUTE CONFIGURATOR ---------- */
  const ROUTES = {
    single: {
      tag: 'ПРОТОКОЛ · ОДИНОЧНАЯ РЕСТАВРАЦИЯ',
      price: 'Ориентир: внутрикостная имплантация от ~38 000 ₽ (справочники)',
      title: 'Восстановление одного зуба без обточки соседних',
      desc: 'В отличие от мостовидного протеза, соседние здоровые зубы не депульпируют и не обтачивают. В кость устанавливается титановый корень, а после приживления фиксируется коронка.',
      steps: [
        'Осмотр хирурга-имплантолога и компьютерная томография (КТ) челюсти в клинике.',
        'Установка внутрикостного дентального имплантата под местной анестезией (или одномоментно с удалением корня, если позволяет кость).',
        'Фиксация формирователя десны, снятие слепков у ортопеда и установка постоянной коронки.'
      ],
      doc: 'Хирург-имплантолог + стоматолог-ортопед',
      formLine: 'Маршрут: восстановление 1 зуба на имплантате (нужна КТ-консультация).'
    },
    bridge: {
      tag: 'ПРОТОКОЛ · СЕГМЕНТ ИЛИ ПОЛНАЯ ДУГА',
      price: 'Прайс: рассчитывается индивидуально по КТ (заглушка)',
      title: 'Восстановление нескольких отсутствующих зубов подряд',
      desc: 'Когда нет 2–4 зубов подряд или всего зубного ряда, вместо отдельных имплантатов под каждый зуб часто устанавливают опорные имплантаты под несъёмный мост или съёмный/несъёмный протез.',
      steps: [
        '3D КТ обеих челюстей и совместная консультация хирурга-имплантолога и стоматолога-ортопеда.',
        'Оценка объёма кости, при необходимости — синус-лифтинг или костная пластика.',
        'Установка опорных имплантатов и изготовление ортопедической конструкции.'
      ],
      doc: 'Консилиум: стоматолог-ортопед + хирург-имплантолог',
      formLine: 'Маршрут: протезирование нескольких отсутствующих зубов на имплантатах.'
    },
    wisdom: {
      tag: 'ПРОТОКОЛ · АТРАВМАТИЧНАЯ ХИРУРГИЯ',
      price: 'Прайс на удаление: заглушка (зависит от сложности)',
      title: 'Удаление сложного или ретинированного зуба мудрости',
      desc: 'Восьмые зубы часто растут под наклоном, упираются в соседнюю «семёрку» или лежат близко к нижнечелюстному нерву. Перед удалением хирург смотрит положение корней на снимке.',
      steps: [
        'Прицельный рентген-снимок или 3D КТ для точного определения формы корней и близости нерва.',
        'Местная анестезия и бережное разделение зуба без лишней травмы окружающей кости.',
        'Наложение швов, подробная памятка по уходу и контрольный осмотр.'
      ],
      doc: 'Стоматолог-хирург',
      formLine: 'Маршрут: консультация хирурга и удаление зуба мудрости по снимку.'
    },
    ortho: {
      tag: 'ПРОТОКОЛ · ИСПРАВЛЕНИЕ ПРИКУСА',
      price: 'Прайс на ортодонтию: заглушка до сверки с клиникой',
      title: 'Выравнивание зубов брекетами или элайнерами',
      desc: 'Ортодонтическое лечение нужно не только для ровной улыбки, но и чтобы раздвинуть наклонившиеся зубы перед установкой имплантата или коронки.',
      steps: [
        'Диагностика прикуса, снимки челюстей и составление плана перемещения зубов.',
        'Санация полости рта (лечение кариеса и профессиональная гигиена) перед фиксацией.',
        'Установка брекет-системы или выдача набора прозрачных капп-элайнеров с плановыми активациями.'
      ],
      doc: 'Стоматолог-ортодонт',
      formLine: 'Маршрут: консультация ортодонта (брекет-системы / элайнеры).'
    }
  };

  let currentCase = 'single';
  const routeList = document.getElementById('route-list');

  function setRoute(key) {
    const r = ROUTES[key];
    if (!r) return;
    currentCase = key;
    if (routeList) {
      routeList.querySelectorAll('.route-item').forEach((btn) => {
        btn.setAttribute('aria-checked', String(btn.dataset.case === key));
      });
    }
    document.getElementById('rc-tag').textContent = r.tag;
    document.getElementById('rc-price').textContent = r.price;
    document.getElementById('rc-title').textContent = r.title;
    document.getElementById('rc-desc').textContent = r.desc;
    document.getElementById('rc-doc').textContent = r.doc;
    const stepsEl = document.getElementById('rc-steps');
    if (stepsEl) {
      stepsEl.innerHTML = r.steps
        .map((st, i) => `<li><b>Шаг ${i + 1}.</b> ${st}</li>`)
        .join('');
    }
  }

  if (routeList) {
    routeList.querySelectorAll('.route-item').forEach((btn) => {
      btn.addEventListener('click', () => setRoute(btn.dataset.case));
    });
  }

  const rcApply = document.getElementById('rc-apply');
  if (rcApply) {
    rcApply.addEventListener('click', () => {
      const r = ROUTES[currentCase];
      const note = document.getElementById('f-note');
      if (note && r) {
        note.value = r.formLine;
      }
      setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), 350);
    });
  }

  /* ---------- 3. FORM & PHONE ---------- */
  const form = document.getElementById('form');
  const phone = document.getElementById('f-phone');
  const nameInput = document.getElementById('f-name');

  if (phone) {
    phone.addEventListener('input', () => {
      let d = phone.value.replace(/\D/g, '');
      if (d.startsWith('8')) d = '7' + d.slice(1);
      if (!d.startsWith('7')) d = '7' + d;
      d = d.slice(0, 11);
      const p = d.slice(1);
      let out = '+7';
      if (p.length) out += ' ' + p.slice(0, 3);
      if (p.length > 3) out += ' ' + p.slice(3, 6);
      if (p.length > 6) out += '-' + p.slice(6, 8);
      if (p.length > 8) out += '-' + p.slice(8, 10);
      phone.value = out;
      if (phone.getAttribute('aria-invalid') === 'true' && p.length === 10) setErr(phone, false);
    });
  }

  function setErr(input, bad) {
    if (!input) return;
    input.setAttribute('aria-invalid', String(bad));
    const err = document.getElementById(input.id + '-err');
    if (err) err.hidden = !bad;
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) setErr(nameInput, false);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameBad = !nameInput || nameInput.value.trim().length < 2;
      const digits = phone ? phone.value.replace(/\D/g, '') : '';
      const phoneBad = digits.length !== 11;
      setErr(nameInput, nameBad);
      setErr(phone, phoneBad);
      if (nameBad) { nameInput?.focus(); return; }
      if (phoneBad) { phone?.focus(); return; }
      form.hidden = true;
      const ok = document.getElementById('form-ok');
      if (ok) {
        ok.hidden = false;
        ok.focus();
      }
    });
  }

  /* ---------- 4. REVEAL ON SCROLL ---------- */
  const items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }
})();
