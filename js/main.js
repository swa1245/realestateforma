(() => {
  const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) document.body.classList.add("is-touch");

  const loader = document.querySelector(".loader");
  const fill = document.querySelector(".loader__fill");
  const pct = document.querySelector(".loader__pct");

  const boot = () => {
    gsap.registerPlugin(ScrollTrigger);
    initCursor();
    initNav();
    initHero();
    initReveals();
    initCounts();
    initHorizontal();
    initFilm();
    initStack3D();
    initJourneyStack();
    initPresenceMap();
    initForm();
  };

  if (loader && fill) {
    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
          onComplete: () => {
            loader.style.display = "none";
            boot();
          },
        });
      },
    });
    tl.to(fill, { width: "100%", duration: 1.2, ease: "power2.inOut" }, 0)
      .to(
        counter,
        {
          val: 100,
          duration: 1.2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (pct) pct.textContent = String(Math.floor(counter.val)).padStart(3, "0");
          },
        },
        0
      )
      .from(".loader__brand", { y: 40, opacity: 0, duration: 0.6 }, 0);
  } else {
    boot();
  }

  function initCursor() {
    if (isTouch) return;
    const dot = document.querySelector(".cursor");
    const label = document.querySelector(".cursor-label");
    if (!dot) return;
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    gsap.ticker.add(() => {
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      gsap.set(dot, { x: pos.x, y: pos.y });
      if (label) gsap.set(label, { x: pos.x, y: pos.y });
    });

    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("is-grow");
        if (label) {
          label.textContent = el.dataset.cursor || "";
          label.classList.add("is-on");
        }
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("is-grow");
        label?.classList.remove("is-on");
      });
    });
  }

  function initNav() {
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector(".nav__toggle");
    const links = document.querySelector(".nav__links");
    toggle?.addEventListener("click", () => links?.classList.toggle("is-open"));
    links?.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("is-open"))
    );
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__links a").forEach((a) => {
      if (a.getAttribute("href") === path) a.classList.add("is-active");
    });
    const onScroll = () => nav?.classList.toggle("is-solid", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.classList.add("is-target");
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    }
  }

  function initHero() {
    if (!document.querySelector(".hero")) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero__video, .hero__media > img.hero-main", { scale: 1.2, duration: 1.8 }, 0)
      .from(".hero__brand", { y: 90, opacity: 0, duration: 1 }, 0.2)
      .from(".hero__tag", { y: 30, opacity: 0, duration: 0.7 }, 0.45)
      .from(".hero__actions .btn", { y: 20, opacity: 0, stagger: 0.1, duration: 0.55 }, 0.6)
      .from(".hero__float", { y: 80, opacity: 0, stagger: 0.12, duration: 1 }, 0.35);

    gsap.to(".hero__media", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    if (!isTouch) {
      const media = document.querySelector(".hero__media");
      window.addEventListener("mousemove", (e) => {
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;
        gsap.to(media, {
          rotateY: x * 4,
          rotateX: -y * 3,
          transformPerspective: 1200,
          duration: 0.6,
          ease: "power2.out",
        });
        gsap.to(".hero__float--a", { x: x * 18, y: y * 12, duration: 0.7 });
        gsap.to(".hero__float--b", { x: -x * 22, y: -y * 14, duration: 0.7 });
      });
    }
  }

  function initReveals() {
    if (document.querySelector(".page-hero")) {
      gsap.from(".page-hero .eyebrow, .page-hero .display, .page-hero .lead", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
      });
    }

    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    gsap.utils.toArray(".reveal-left").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
      });
    });

    gsap.utils.toArray(".reveal-right").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
      });
    });
  }

  function initCounts() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.floor(obj.val).toLocaleString("en-IN") + suffix;
            },
          });
        },
      });
    });
  }

  function initHorizontal() {
    const section = document.querySelector("#hscroll");
    const track = section?.querySelector(".hscroll__track");
    if (!section || !track) return;

    const getScroll = () => Math.max(0, track.scrollWidth - innerWidth + 64);

    gsap.to(track, {
      x: () => -getScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScroll()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.from(".hcard", {
      y: 60,
      opacity: 0.25,
      rotateY: -12,
      stagger: 0.08,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: section, start: "top 70%" },
    });
  }

  function initFilm() {
    const section = document.querySelector("#film");
    if (!section) return;
    const pin = section.querySelector(".film__pin");
    const frames = [...section.querySelectorAll(".film__frame")];
    const phase = section.querySelector("[data-film-phase]");
    const title = section.querySelector("[data-film-title]");
    const text = section.querySelector("[data-film-text]");
    const progress = section.querySelector("[data-film-progress]");
    const room = section.querySelector("[data-film-room]");
    const video = section.querySelector(".film__video");

    const chapters = [
      {
        phase: "01 Arrive",
        title: "Lobby & first light",
        text: "Travertine, brass, and a staircase that sets the tone before the lift doors open.",
        room: "Arrival",
      },
      {
        phase: "02 Live",
        title: "The living volume",
        text: "Floor-to-ceiling glass, quiet materials, and a city that becomes part of the furniture.",
        room: "Living",
      },
      {
        phase: "03 Rest",
        title: "Private suite",
        text: "A bedroom that holds the skyline soft — linen, low light, and absolute hush.",
        room: "Suite",
      },
      {
        phase: "04 Rise",
        title: "Terrace & sky",
        text: "Infinity edge, monsoon breeze, evening gold — the outdoor room that sells the home.",
        room: "Terrace",
      },
    ];

    let active = -1;
    const setChapter = (i) => {
      if (i === active || !chapters[i]) return;
      active = i;
      frames.forEach((f, idx) => f.classList.toggle("is-on", idx === i));
      phase.innerHTML = chapters[i].phase.replace(/(\d+)/, "<span>$1</span>");
      title.textContent = chapters[i].title;
      text.textContent = chapters[i].text;
      if (room) room.textContent = chapters[i].room;
      gsap.fromTo(
        [phase, title, text],
        { y: 24, opacity: 0.25 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, overwrite: "auto" }
      );
    };

    setChapter(0);

    if (video) {
      video.addEventListener("error", () => {
        video.style.display = "none";
        const fb = section.querySelector(".film__fallback");
        if (fb) fb.hidden = false;
      });
      video.load();
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=350%",
      pin: pin,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        progress.style.width = `${p * 100}%`;
        const idx = Math.min(frames.length - 1, Math.floor(p * frames.length));
        setChapter(idx);
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
          try {
            video.currentTime = Math.min(video.duration - 0.05, p * video.duration);
          } catch (_) {}
        }
        frames.forEach((f) => {
          const img = f.querySelector("img");
          if (img) gsap.set(img, { scale: 1.05 + p * 0.08 });
        });
      },
    });
  }

  function initStack3D() {
    const section = document.querySelector("#stack3d");
    if (!section) return;
    const pin = section.querySelector(".stack3d__pin");
    const cards = [...section.querySelectorAll(".stack3d__card")];

    cards.forEach((card, i) => {
      gsap.set(card, {
        zIndex: cards.length - i,
        rotateX: i * -4,
        y: i * 18,
        z: i * -60,
        scale: 1 - i * 0.04,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=280%",
        pin: pin,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      tl.to(
        card,
        {
          y: -innerHeight * 0.55,
          rotateX: -28,
          rotateZ: i % 2 === 0 ? -8 : 8,
          z: 200,
          opacity: 0,
          duration: 1,
          ease: "none",
        },
        i * 0.85
      );
    });
  }

  function initJourneyStack() {
    const section = document.querySelector("#journey");
    if (!section) return;

    const items = [...section.querySelectorAll(".journey__item")];
    const cards = [...section.querySelectorAll(".journey__card")];
    const stage = section.querySelector(".journey__stack-stage");
    if (!items.length || !cards.length || !stage) return;

    let yearMark = stage.querySelector(".journey__year-mark");
    if (!yearMark) {
      yearMark = document.createElement("div");
      yearMark.className = "journey__year-mark";
      stage.appendChild(yearMark);
    }

    let progress = stage.querySelector(".journey__progress");
    if (!progress) {
      progress = document.createElement("div");
      progress.className = "journey__progress";
      progress.innerHTML = "<span></span>";
      stage.appendChild(progress);
    }
    const bar = progress.querySelector("span");

    cards.forEach((card, i) => {
      const img = card.querySelector("img");
      gsap.set(card, {
        zIndex: cards.length - i,
        xPercent: i === 0 ? 0 : 108,
        opacity: i === 0 ? 1 : 0.85,
        filter: i === 0 ? "blur(0px)" : "blur(6px)",
      });
      gsap.set(img, { scale: 1.08, xPercent: i === 0 ? 0 : 8 });
    });

    yearMark.textContent = items[0]?.dataset.year || "";
    gsap.set(bar, { width: `${100 / items.length}%` });

    const setActive = (index) => {
      items.forEach((item, i) => item.classList.toggle("is-active", i === index));
      yearMark.textContent = items[index]?.dataset.year || "";
    };

    const pin = section.querySelector(".journey__pin");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${items.length * 100}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            items.length - 1,
            Math.floor(self.progress * items.length)
          );
          setActive(idx);
          gsap.set(bar, { width: `${((idx + 1) / items.length) * 100}%` });
        },
      },
    });

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      const next = cards[i + 1];
      const img = card.querySelector("img");
      const nextImg = next.querySelector("img");
      const t = i * 1;

      tl.to(
        card,
        {
          xPercent: -18,
          opacity: 0,
          filter: "blur(8px)",
          duration: 1,
          ease: "none",
        },
        t
      )
        .to(img, { scale: 1.16, xPercent: -10, duration: 1, ease: "none" }, t)
        .fromTo(
          next,
          { xPercent: 108, opacity: 0.85, filter: "blur(6px)" },
          {
            xPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "none",
          },
          t
        )
        .fromTo(
          nextImg,
          { scale: 1.14, xPercent: 10 },
          { scale: 1.04, xPercent: 0, duration: 1, ease: "none" },
          t
        );
    });
  }

  function initPresenceMap() {
    const section = document.querySelector("#presence");
    if (!section) return;

    const pins = [...section.querySelectorAll(".map-pin")];
    const cards = [...section.querySelectorAll(".presence-card")];
    const citySelect = document.querySelector("#city");

    const setCity = (city) => {
      pins.forEach((pin) => pin.classList.toggle("is-active", pin.dataset.city === city));
      cards.forEach((card) => {
        const on = card.dataset.city === city;
        card.classList.toggle("is-active", on);
        if (on) {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", overwrite: true }
          );
          const img = card.querySelector("img");
          if (img) {
            gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 0.9, ease: "power2.out", overwrite: true });
          }
        } else {
          gsap.set(card, { clearProps: "opacity,visibility,transform" });
        }
      });
      if (citySelect && [...citySelect.options].some((o) => o.value === city)) {
        citySelect.value = city;
      }
    };

    pins.forEach((pin) => {
      pin.addEventListener("click", () => setCity(pin.dataset.city));
    });

    citySelect?.addEventListener("change", () => {
      if (["mumbai", "pune", "alibaug"].includes(citySelect.value)) {
        setCity(citySelect.value);
      }
    });

    gsap.from(".map-pin", {
      scale: 0,
      opacity: 0,
      stagger: 0.12,
      duration: 0.55,
      ease: "back.out(1.8)",
      scrollTrigger: { trigger: section, start: "top 70%" },
    });

    gsap.from(".presence-map__land", {
      opacity: 0.2,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: { trigger: section, start: "top 75%" },
    });
  }

  function initForm() {
    const form = document.querySelector(".contact-form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = form.querySelector(".form-success");
      success?.classList.add("is-visible");
      form.reset();
      gsap.fromTo(success, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 });
    });
  }
})();
