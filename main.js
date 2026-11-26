// Reads DEMO_URL and CONTACT_URL from config.js.
(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function httpOrMailto(value) {
    if (!value) return "";
    if (/^mailto:/i.test(value)) {
      return /^mailto:\s*$/i.test(value) ? "" : value;
    }
    try {
      var parsed = new URL(value);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") return value;
    } catch (err) {
      return "";
    }
    return "";
  }

  ready(function () {
    var demoRaw = typeof DEMO_URL === "string" ? DEMO_URL.trim() : "";
    var contactRaw = typeof CONTACT_URL === "string" ? CONTACT_URL.trim() : "";
    var demoUrl = httpOrMailto(demoRaw);
    var contactUrl = httpOrMailto(contactRaw);

    document.querySelectorAll("[data-demo]").forEach(function (node) {
      if (!demoUrl) {
        node.textContent = "Demo opening soon";
        node.setAttribute("aria-disabled", "true");
        if (node.tagName === "BUTTON") node.disabled = true;
        if (node.tagName === "A") {
          node.removeAttribute("href");
          node.setAttribute("tabindex", "-1");
        }
        return;
      }

      var link = document.createElement("a");
      link.className = node.className;
      link.setAttribute("data-demo", "");
      link.href = demoUrl;
      link.textContent = "Try the demo";
      node.replaceWith(link);
    });

    document.querySelectorAll("[data-contact]").forEach(function (node) {
      if (!contactUrl) {
        node.hidden = true;
        node.removeAttribute("href");
        return;
      }
      node.hidden = false;
      node.href = contactUrl;
      if (/^mailto:/i.test(contactUrl)) {
        node.removeAttribute("target");
        node.removeAttribute("rel");
        node.removeAttribute("aria-label");
      } else {
        node.target = "_blank";
        node.rel = "noopener noreferrer";
        node.setAttribute("aria-label", "Contact (opens in a new tab)");
      }
    });
  });
})();
