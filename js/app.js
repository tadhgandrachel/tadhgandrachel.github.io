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

  function setHref(sel, value) {
    var el = $(sel);
    if (el && value) el.setAttribute("href", value);
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
    setText("[data-stay-body]", W.stay.body);
    setText("[data-rsvp-deadline]", W.rsvp.deadline);
    setText("[data-contact]", W.contactEmail);
    setHref("[data-contact-link]", "mailto:" + W.contactEmail);
    setHref("[data-maps]", W.venue.mapsUrl);

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

    var schedule = $("[data-schedule]");
    if (schedule) {
      schedule.innerHTML = "";
      W.schedule.forEach(function (item) {
        var li = document.createElement("li");
        li.innerHTML =
          '<span class="when">' +
          escapeHtml(item.time) +
          '</span><div><strong>' +
          escapeHtml(item.title) +
          "</strong><p>" +
          escapeHtml(item.detail) +
          "</p></div>";
        schedule.appendChild(li);
      });
    }

    var inviteWrap = $("[data-invite-field]");
    if (inviteWrap) {
      inviteWrap.hidden = !W.rsvp.inviteCode;
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

  function setupRsvp() {
    var form = $("#rsvp-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (W.rsvp.inviteCode) {
        var code = (form.invite_code.value || "").trim();
        if (code !== W.rsvp.inviteCode) {
          showAlert("error", "That invite code does not match. Please check your invitation.");
          return;
        }
      }

      if (!W.rsvp.googleScriptUrl) {
        showAlert(
          "error",
          "RSVPs are not connected yet. Add your Google Apps Script URL in js/config.js — see the README."
        );
        return;
      }

      var data = new FormData(form);
      var submit = form.querySelector("button[type='submit']");
      submit.disabled = true;
      showAlert("info", "Sending your RSVP…");

      function succeed() {
        form.hidden = true;
        var thanks = $("[data-thanks]");
        if (thanks) thanks.hidden = false;
        var alertBox = $("[data-alert]");
        if (alertBox) alertBox.hidden = true;
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
