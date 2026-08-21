/* EcoSustainability Solution — shared interactions */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400, start = null;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.round(target * eased);
          el.textContent = val.toLocaleString("en-IN") + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var ans = item.querySelector(".faq-a");
      var isOpen = item.classList.toggle("open");
      ans.style.maxHeight = isOpen ? ans.scrollHeight + "px" : null;
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* ---- Year in footer ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Form validation (enroll + contact) ---- */
  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    var success = form.parentElement.querySelector(".form-success");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.value.trim() !== "";
        if (input.type === "email") {
          valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        if (input.type === "tel") {
          valid = valid && /^[0-9+\-\s()]{8,}$/.test(input.value.trim());
        }
        field.classList.toggle("error", !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        var firstErr = form.querySelector(".field.error input, .field.error select, .field.error textarea");
        if (firstErr) firstErr.focus();
        return;
      }
      form.style.display = "none";
      if (success) {
        var name = (form.querySelector("[name=name]") || {}).value || "";
        var nameEl = success.querySelector("[data-name]");
        if (nameEl && name) nameEl.textContent = name.split(" ")[0];
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        input.closest(".field").classList.remove("error");
      });
    });
  });
})();
