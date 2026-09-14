(function () {
  var W = window.WEDDING;
  if (!W) return;

  var names = W.partnerOne + " & " + W.partnerTwo;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function setText(sel, value) {
    if (value == null) return;
    document.querySelectorAll(sel).forEach(function (el) {
      el.textContent = value;
    });
  }

  function renderParagraphs(sel, paragraphs) {
    var wrap = $(sel);
    if (!wrap || !paragraphs) return;
    wrap.innerHTML = "";
    paragraphs.forEach(function (text) {
      var p = document.createElement("p");
      p.className = "lede";
      p.textContent = text;
      wrap.appendChild(p);
    });
  }

  function setHref(sel, value) {
    var el = $(sel);
    if (el && value) el.setAttribute("href", value);
  }

  function setAttr(sel, name, value) {
    var el = $(sel);
    if (el && value) el.setAttribute(name, value);
  }

  function filmFigure(photo) {
    var fig = document.createElement("figure");
    var img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || "";
    img.loading = "lazy";
    fig.appendChild(img);
    return fig;
  }

  function render() {
    var page = document.body.getAttribute("data-page");
    var titles = {
      home: names + " — " + W.date.display,
      day: "The day — " + names,
      travel: "Getting there — " + names,
      photos: "Photos — " + names,
      rsvp: "RSVP — " + names,
    };
    if (titles[page]) document.title = titles[page];
    setText("[data-invite-lead]", W.inviteLead);
    setText("[data-names]", names);
    setText("[data-date]", W.date.display);
    setText("[data-weekday]", W.date.weekday);
    setText("[data-time]", W.date.timeLabel);
    setText("[data-venue-name]", W.venue.name);
    setText("[data-venue-area]", W.venue.area);
    setText("[data-venue-address]", W.venue.address);
    setText("[data-venue-notes]", W.venue.notes);
    setText("[data-story-heading]", W.story.heading);
    setText("[data-story-body]", W.story.body);
    setText("[data-stay-heading]", W.stay.heading);
    renderParagraphs("[data-stay-body]", W.stay && W.stay.paragraphs);
    setText("[data-rsvp-deadline]", W.rsvp.deadline);
    setText("[data-contact]", W.contactEmail);
    setHref("[data-contact-link]", "mailto:" + W.contactEmail);
    setHref("[data-maps]", W.venue.mapsUrl);
    setAttr("[data-maps-embed]", "src", W.venue.mapsEmbedUrl);
    setText("[data-getting-heading]", W.gettingThere && W.gettingThere.heading);
    setText("[data-getting-body]", W.gettingThere && W.gettingThere.body);
    setText("[data-travel-heading]", W.travel && W.travel.heading);
    renderParagraphs("[data-travel-body]", W.travel && W.travel.paragraphs);
    setText("[data-flights-heading]", W.flights && W.flights.heading);
    renderParagraphs("[data-flights-body]", W.flights && W.flights.paragraphs);
    setHref("[data-flights-search]", W.flights && W.flights.searchUrl);
    setText("[data-sunday-heading]", W.sunday && W.sunday.heading);
    setText("[data-sunday-body]", W.sunday && W.sunday.body);

    var headline = $("[data-headline]");
    if (headline) {
      headline.innerHTML = "";
      W.headline.forEach(function (line) {
        var span = document.createElement("span");
        span.textContent = line;
        headline.appendChild(span);
      });
    }

    var heroFilm = $("[data-hero-photos]");
    if (heroFilm) {
      heroFilm.innerHTML = "";
      W.photos.slice(0, 4).forEach(function (photo) {
        heroFilm.appendChild(filmFigure(photo));
      });
    }

    var gallery = $("[data-gallery]");
    if (gallery) {
      gallery.innerHTML = "";
      W.photos.forEach(function (photo) {
        var strip = document.createElement("div");
        strip.className = "film-strip";
        strip.appendChild(filmFigure(photo));
        gallery.appendChild(strip);
      });
    }

    var days = $("[data-itinerary]");
    if (days && W.itinerary) {
      days.innerHTML = "";
      W.itinerary.forEach(function (day) {
        var heading = document.createElement("h2");
        heading.className = "subhead";
        heading.textContent = day.heading;
        days.appendChild(heading);

        var list = document.createElement("ol");
        list.className = "schedule";
        (day.items || []).forEach(function (item) {
          var li = document.createElement("li");
          li.innerHTML =
            '<span class="when">' +
            escapeHtml(item.time) +
            '</span><div><strong>' +
            escapeHtml(item.title) +
            "</strong><p>" +
            escapeHtml(item.detail) +
            "</p></div>";
          list.appendChild(li);
        });
        days.appendChild(list);

        if (day.mapsUrl) {
          var mapLine = document.createElement("p");
          mapLine.className = "lede";
          var mapLink = document.createElement("a");
          mapLink.className = "text-link";
          mapLink.href = day.mapsUrl;
          mapLink.target = "_blank";
          mapLink.rel = "noreferrer";
          mapLink.textContent = "Open in maps";
          mapLine.appendChild(mapLink);
          days.appendChild(mapLine);
        }
      });
    }

    renderCalendar();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toCalStamp(iso) {
    var d = new Date(iso);
    return d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  }

  function renderCalendar() {
    var title = names + "'s wedding";
    var loc = W.venue.name + ", " + W.venue.address;
    var start = toCalStamp(W.date.start);
    var end = toCalStamp(W.date.end);
    var details = "We cannot wait to celebrate with you.";

    var google =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(title) +
      "&dates=" + start + "/" + end +
      "&location=" + encodeURIComponent(loc) +
      "&details=" + encodeURIComponent(details);

    var ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//wedding//EN",
      "BEGIN:VEVENT",
      "DTSTAMP:" + toCalStamp(new Date().toISOString()),
      "DTSTART:" + start,
      "DTEND:" + end,
      "SUMMARY:" + title,
      "LOCATION:" + loc,
      "DESCRIPTION:" + details,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    document.querySelectorAll("[data-cal-google]").forEach(function (el) {
      el.setAttribute("href", google);
    });

    document.querySelectorAll("[data-cal-ics]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "wedding.ics";
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  }

  function setupNav() {
    var toggle = $(".nav-toggle");
    var nav = $(".site-nav");
    var page = document.body.getAttribute("data-page");
    var current = {
      day: "the-day.html",
      travel: "getting-there.html",
      photos: "photos.html",
      rsvp: "rsvp.html",
    }[page];

    if (nav && current) {
      var active = nav.querySelector('a[href="' + current + '"]');
      if (active) active.setAttribute("aria-current", "page");
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  function showAlert(type, message) {
    var box = $("[data-alert]");
    if (!box) return;
    box.hidden = false;
    box.className = "alert alert--" + type;
    box.textContent = message;
  }

  function guestToken() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("g") || params.get("token") || "").trim();
  }

  function fetchGuest(token) {
    var base = W.rsvp.googleScriptUrl;
    var url = base + (base.indexOf("?") >= 0 ? "&" : "?") + "g=" + encodeURIComponent(token);

    return fetch(url)
      .then(function (res) {
        return res.json();
      })
      .catch(function () {
        return jsonpGuest(url);
      });
  }

  function jsonpGuest(url) {
    return new Promise(function (resolve, reject) {
      var name = "weddingRsvp" + Date.now();
      var script = document.createElement("script");
      window[name] = function (data) {
        delete window[name];
        script.remove();
        resolve(data);
      };
      script.onerror = function () {
        delete window[name];
        script.remove();
        reject(new Error("Could not load guest"));
      };
      script.src = url + "&callback=" + name;
      document.body.appendChild(script);
    });
  }

  function yesNoLabel(value) {
    if (isYes(value)) return "Yes";
    if (String(value || "").trim()) return "No";
    return "—";
  }

  function isYes(value) {
    var v = String(value || "").trim().toLowerCase();
    return v === "yes" || v === "y" || v === "true" || v === "1";
  }

  function showReceipt(guest) {
    var form = $("#rsvp-form");
    var receipt = $("[data-receipt]");
    var locked = $("[data-rsvp-locked]");
    if (form) form.hidden = true;
    if (locked) locked.hidden = true;
    if (!receipt) return;

    setText("[data-receipt-name]", guest.name || "");
    setText("[data-receipt-attending]", yesNoLabel(guest.attending));

    var plusWrap = $("[data-receipt-plus-wrap]");
    if (plusWrap) {
      plusWrap.hidden = !guest.plusOneAllowed;
      if (guest.plusOneAllowed) {
        var plusName = guest.plusOneNameReply || guest.plusOneName || "Guest";
        setText("[data-receipt-plus-name]", plusName);
        setText("[data-receipt-plus-attending]", yesNoLabel(guest.plusOneAttending));
      }
    }

    function optional(wrapSel, valueSel, value) {
      var wrap = $(wrapSel);
      if (!wrap) return;
      var has = Boolean(value && String(value).trim());
      wrap.hidden = !has;
      if (has) setText(valueSel, value);
    }

    optional("[data-receipt-email-wrap]", "[data-receipt-email]", guest.email);
    optional("[data-receipt-diet-wrap]", "[data-receipt-diet]", guest.diet);
    optional("[data-receipt-message-wrap]", "[data-receipt-message]", guest.message);

    receipt.hidden = false;
  }

  function fillGuestForm(guest, token) {
    var form = $("#rsvp-form");
    if (!form) return;

    var tokenField = $("[data-guest-token]");
    var nameField = $("[data-guest-name-input]");
    var emailField = $("[data-guest-email]");
    if (tokenField) tokenField.value = token;
    if (nameField) nameField.value = guest.name || "";
    setText("[data-guest-name]", guest.name || "");
    if (emailField && guest.email) emailField.value = guest.email;
    if (guest.diet) form.diet.value = guest.diet;
    if (guest.message) form.message.value = guest.message;
    if (guest.attending) form.attending.value = guest.attending;

    var plus = $("[data-plus-one]");
    if (plus) {
      plus.hidden = !guest.plusOneAllowed;
      if (guest.plusOneAllowed) {
        var label = guest.plusOneName || "your guest";
        setText("[data-plus-one-label]", label);
        var nameInput = $("[data-plus-one-name]");
        if (nameInput) nameInput.value = guest.plusOneNameReply || guest.plusOneName || "";
        var plusAttending = $("[data-plus-one-attending]");
        if (plusAttending) {
          plusAttending.required = true;
          if (guest.plusOneAttending) plusAttending.value = guest.plusOneAttending;
        }
      }
    }

    form.hidden = false;
    var locked = $("[data-rsvp-locked]");
    if (locked) locked.hidden = true;
  }

  function setupRsvp() {
    var form = $("#rsvp-form");
    if (!form) return;

    var token = guestToken();
    var locked = $("[data-rsvp-locked]");

    if (!token) {
      form.hidden = true;
      if (locked) locked.hidden = false;
      return;
    }

    if (!W.rsvp.googleScriptUrl) {
      form.hidden = true;
      showAlert(
        "error",
        "RSVPs are not connected yet. Add your Google Apps Script URL in js/config.js — see the README."
      );
      return;
    }

    showAlert("info", "Opening your invitation…");
    fetchGuest(token)
      .then(function (guest) {
        if (!guest || guest.result !== "success") {
          form.hidden = true;
          if (locked) locked.hidden = false;
          showAlert("error", (guest && guest.message) || "We could not find that invitation.");
          return;
        }
        var alertBox = $("[data-alert]");
        if (alertBox) alertBox.hidden = true;
        if (guest.alreadyReplied) {
          showReceipt(guest);
          return;
        }
        fillGuestForm(guest, token);
      })
      .catch(function () {
        form.hidden = true;
        if (locked) locked.hidden = false;
        showAlert("error", "We could not open that invitation. Please try again, or email us.");
      });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.token.value) {
        showAlert("error", "Please use the personal RSVP link we sent you.");
        return;
      }

      var data = new FormData(form);
      var submit = form.querySelector("button[type='submit']");
      submit.disabled = true;
      showAlert("info", "Sending your RSVP…");

      function succeed() {
        var alertBox = $("[data-alert]");
        if (alertBox) alertBox.hidden = true;
        var plusBlock = $("[data-plus-one]");
        showReceipt({
          name: form.name.value,
          attending: form.attending.value,
          plusOneAllowed: plusBlock ? !plusBlock.hidden : false,
          plusOneName: (form.plus_one_name && form.plus_one_name.value) || "",
          plusOneNameReply: (form.plus_one_name && form.plus_one_name.value) || "",
          plusOneAttending: (form.plus_one_attending && form.plus_one_attending.value) || "",
          email: form.email.value,
          diet: form.diet.value,
          message: form.message.value,
        });
      }

      fetch(W.rsvp.googleScriptUrl, { method: "POST", body: data })
        .then(succeed)
        .catch(function () {
          return fetch(W.rsvp.googleScriptUrl, {
            method: "POST",
            body: data,
            mode: "no-cors",
          }).then(succeed);
        })
        .catch(function () {
          submit.disabled = false;
          showAlert("error", "Something went wrong sending your RSVP. Please email us instead.");
        });
    });
  }

  render();
  setupNav();
  setupRsvp();
})();
