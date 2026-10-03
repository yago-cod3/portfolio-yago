(function () {
  "use strict";
  var root = document.documentElement;
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================================================================================================================================================================== */
  function initTheme() {
    var THEMES = [
      { id: "neon", name: "Neon", c: ["#38e1ff", "#8a7bff"] },
      { id: "aurora", name: "Aurora", c: ["#34e3a4", "#4aa3ff"] },
      { id: "ember", name: "Ember", c: ["#ff9f5a", "#ff5d8f"] },
      { id: "frost", name: "Frost", c: ["#0a7ea4", "#6552e8"] },
    ];
    var KEY = "yc4-theme";
    var btn = document.getElementById("theme-btn");
    var menu = document.getElementById("theme-menu");
    var label = btn.querySelector(".name");
    var dot = btn.querySelector(".sw");
    var items = [],
      cur = 0;

    function paint(el, t) {
      el.style.setProperty("--s1", t.c[0]);
      el.style.setProperty("--s2", t.c[1]);
    }
    function toggle(open) {
      menu.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
    }

    function apply(i, save) {
      cur = i;
      var t = THEMES[i];
      root.dataset.theme = t.id;
      label.textContent = t.name;
      paint(dot, t);
      if (save) {
        btn.classList.remove("pop");
        void btn.offsetWidth; // reinicia a animação
        btn.classList.add("pop");
      }
      items.forEach(function (b, k) {
        b.setAttribute("aria-checked", k === i);
      });
      if (save) {
        try {
          localStorage.setItem(KEY, t.id);
        } catch (e) {}
      }
      window.dispatchEvent(new Event("themechange"));
    }

    THEMES.forEach(function (t, i) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "menuitemradio");
      b.innerHTML = '<span class="sw"></span>' + t.name;
      paint(b.firstChild, t);
      b.onclick = function () {
        apply(i, true);
        toggle(false);
        btn.focus();
      };
      li.appendChild(b);
      menu.appendChild(li);
      items.push(b);
    });
    menu.insertAdjacentHTML(
      "beforeend",
      '<li style="padding:.4rem .6rem .2rem;font-size:.72rem;color:var(--muted)">Alternar: <kbd>T</kbd></li>',
    );

    var saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch (e) {}
    var start = -1;
    THEMES.forEach(function (t, i) {
      if (t.id === saved) start = i;
    });
    if (start < 0)
      start = matchMedia("(prefers-color-scheme: light)").matches ? 3 : 0;
    apply(start, false);

    btn.onclick = function (e) {
      e.stopPropagation();
      toggle(!menu.classList.contains("open"));
    };
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) toggle(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        toggle(false);
        return;
      }
      if (e.key.toLowerCase() !== "t" || e.ctrlKey || e.metaKey || e.altKey)
        return;
      var el = document.activeElement;
      if (el && /INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
      apply((cur + 1) % THEMES.length, true);
    });
  }

  /* ================================================================================================================================================================== */
  function initSky() {
    var cv = document.getElementById("sky"),
      ctx = cv.getContext("2d");
    var techs = [
      "React",
      "Node.js",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "Git",
      "GitHub",
      "React Native",
      "Redux",
      "Java",
      "Linux",
      "UX/UI",
    ];
    var col = { fg: "#e8eefc", a1: "#38e1ff", a2: "#8a7bff" };
    var W,
      H,
      stars = [],
      mx = -9999,
      my = -9999,
      tick = 0;

    function colors() {
      var s = getComputedStyle(root);
      ["fg", "a1", "a2"].forEach(function (k) {
        col[k] = s.getPropertyValue("--" + k).trim() || col[k];
      });
    }
    function build() {
      var d = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth;
      H = innerHeight;
      cv.width = W * d;
      cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      var n = Math.max(45, Math.min(120, Math.round((W * H) / 11000)));
      stars = [];
      for (var i = 0; i < n; i++)
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.6 + Math.random() * 1.3,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          ph: Math.random() * 6.28,
          sp: 0.01 + Math.random() * 0.03,
          t: techs[i] || null,
        });
    }
    function draw() {
      if (++tick % 20 === 1) colors();
      ctx.clearRect(0, 0, W, H);
      ctx.font =
        "500 12px " + getComputedStyle(root).getPropertyValue("--mono");
      ctx.textBaseline = "middle";
      for (var i = 0; i < stars.length; i++) {
        var a = stars[i];
        if (!calm) {
          a.x += a.vx;
          a.y += a.vy;
          a.ph += a.sp;
          if (a.x < -80) a.x = W + 80;
          else if (a.x > W + 80) a.x = -80;
          if (a.y < -20) a.y = H + 20;
          else if (a.y > H + 20) a.y = -20;
        }
        for (var j = i + 1; j < stars.length; j++) {
          var b = stars[j],
            dx = a.x - b.x,
            dy = a.y - b.y,
            dd = dx * dx + dy * dy;
          if (dd < 12100) {
            ctx.globalAlpha = (1 - dd / 12100) * 0.15;
            ctx.strokeStyle = col.a1;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        var d = Math.hypot(a.x - mx, a.y - my),
          near = d < 170 ? 1 - d / 170 : 0;
        if (near > 0) {
          ctx.globalAlpha = near * 0.5;
          ctx.strokeStyle = col.a2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
        var tw = 0.5 + 0.5 * Math.sin(a.ph);
        ctx.fillStyle = a.t ? col.a1 : col.fg;
        ctx.globalAlpha = Math.min(1, (a.t ? 0.9 : 0.22 + tw * 0.45) + near);
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.t ? 2.2 + near * 1.5 : a.r + near, 0, 6.28);
        ctx.fill();
        if (a.t) {
          ctx.fillStyle = near > 0.05 ? col.a2 : col.fg;
          ctx.globalAlpha = Math.min(1, 0.3 + tw * 0.12 + near * 0.7);
          ctx.fillText(a.t, a.x + 9, a.y);
        }
      }
      ctx.globalAlpha = 1;
      if (!calm) requestAnimationFrame(draw);
    }

    addEventListener(
      "pointermove",
      function (e) {
        mx = e.clientX;
        my = e.clientY;
      },
      { passive: true },
    );
    addEventListener("pointerleave", function () {
      mx = my = -9999;
    });
    var rt;
    addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        build();
        if (calm) draw();
      }, 150);
    });
    if (calm)
      addEventListener("themechange", function () {
        setTimeout(function () {
          colors();
          draw();
        }, 60);
      });
    build();
    colors();
    draw();
  }

  /* ================================================================================================================================================================== */
  function initStack() {
    var TECHS = [
      ["Linux", "linux"],
      ["Debian", "debian"],
      ["Windows", "windows8"],
      ["HTML", "html5"],
      ["CSS", "css3"],
      ["JavaScript", "javascript"],
      ["Git", "git"],
      ["GitHub", "github"],
      ["TypeScript", "typescript"],
      ["React", "react"],
      ["Next.js", "nextjs"],
      ["Tailwind", "tailwindcss"],
      ["Node.js", "nodejs"],
      ["Express", "express"],
      ["Python", "python"],
      ["Rust", "rust"],
      ["Java", "java"],
      ["MySQL", "mysql"],
      ["Docker", "docker"],
    ];
    function tiles(dup) {
      return TECHS.map(function (t) {
        var src =
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/" +
          t[1] +
          "/" +
          t[1] +
          "-original.svg";
        return (
          '<div class="tile' +
          (dup ? " dup" : "") +
          '"' +
          (dup ? ' aria-hidden="true"' : "") +
          ">" +
          '<img src="' +
          src +
          '" alt="' +
          (dup ? "" : t[0]) +
          '" loading="lazy" /><span>' +
          t[0] +
          "</span></div>"
        );
      }).join("");
    }
    document.getElementById("carousel").innerHTML =
      '<div class="track">' + tiles(false) + tiles(true) + "</div>";
  }

  /* ================================================================================================================================================================== */
  function initMotion() {
    var REVEAL =
      ".glass:not(.term), .job, section h2, .lead, .cert-item, .project-card";
    var meters = [].slice.call(document.querySelectorAll(".meter"));
    var items = [].slice.call(document.querySelectorAll(REVEAL));

    // brilho que segue o cursor
    var bg = document.querySelector(".bg"),
      raf = 0,
      x = 0,
      y = 0;
    addEventListener(
      "pointermove",
      function (e) {
        x = e.clientX;
        y = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          bg.style.setProperty("--mx", x + "px");
          bg.style.setProperty("--my", y + "px");
        });
      },
      { passive: true },
    );

    if (!("IntersectionObserver" in window)) {
      meters.forEach(function (m) {
        m.classList.add("in");
      });
      return;
    }

    // reveal (a classe sai depois para não brigar com o :hover dos cards)
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          el.classList.add("in");
          if (el.classList.contains("reveal")) {
            var delay = parseInt(el.style.getPropertyValue("--d")) || 0;
            setTimeout(function () {
              el.classList.remove("reveal", "in");
            }, 1000 + delay);
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    meters.forEach(function (m) {
      io.observe(m);
    });
    items.forEach(function (el) {
      var sibs = [].filter.call(el.parentElement.children, function (c) {
        return c.matches(REVEAL);
      });
      el.style.setProperty("--d", Math.min(sibs.indexOf(el), 5) * 80 + "ms");
      el.classList.add("reveal");
      io.observe(el);
    });

    // scroll-spy do menu (pausa durante o scroll por clique)
    var links = [].slice.call(document.querySelectorAll(".nav ul a"));
    var lock = false,
      lockTimer;
    var spy = new IntersectionObserver(
      function (es) {
        if (lock) return;
        es.forEach(function (e) {
          if (e.isIntersecting)
            links.forEach(function (a) {
              a.classList.toggle("on", a.hash === "#" + e.target.id);
            });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach(function (s) {
      spy.observe(s);
    });

    links.forEach(function (a) {
      a.addEventListener("click", function () {
        lock = true;
        clearTimeout(lockTimer);
        lockTimer = setTimeout(function () {
          lock = false;
        }, 900);
        links.forEach(function (l) {
          l.classList.toggle("on", l === a);
        });
      });
    });
  }

  /* ================================================================================================================================================================== */
  function initTerminal() {
    var LINES = [
      ["whoami", "Yago Cayo, desenvolvedor de software"],
      ["cat stack.txt", "React · React Native · Node.js · TypeScript"],
      ["git log --oneline -1", "De suporte e infraestrutura para o código"],
      ["status", "cursando ADS e pós em Engenharia de Software"],
    ];
    var out = document.getElementById("out");
    function esc(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    }
    function row(cmd, res) {
      return (
        '<div><span class="p">$</span> ' +
        esc(cmd) +
        '</div><span class="o">' +
        esc(res) +
        "</span>"
      );
    }

    if (calm) {
      out.innerHTML = LINES.map(function (l) {
        return row(l[0], l[1]);
      }).join("");
      return;
    }

    // título letra a letra
    var n = 0;
    document.querySelectorAll(".hero h1 > span").forEach(function (s) {
      var t = s.dataset.t;
      s.textContent = "";
      t.split("").forEach(function (c) {
        var x = document.createElement("span");
        x.className = "ch";
        x.style.setProperty("--i", n++);
        x.textContent = c;
        s.appendChild(x);
      });
    });

    // digitação dos comandos
    var html = "",
      li = 0,
      cursor = '<span class="cur"></span>';
    (function next() {
      if (li >= LINES.length) {
        out.innerHTML =
          html + '<div><span class="p">$</span> ' + cursor + "</div>";
        return;
      }
      var cmd = LINES[li][0],
        res = LINES[li][1],
        c = 0;
      (function type() {
        out.innerHTML =
          html +
          '<div><span class="p">$</span> ' +
          esc(cmd.slice(0, ++c)) +
          cursor +
          "</div>";
        if (c < cmd.length) return setTimeout(type, 38);
        setTimeout(function () {
          html += row(cmd, res);
          li++;
          next();
        }, 260);
      })();
    })();
  }

  /* ================================================================================================================================================================== */
  initTheme();
  initSky();
  initStack();
  initMotion();
  initTerminal();
  document.getElementById("yr").textContent = new Date().getFullYear();
})();
