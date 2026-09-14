/**
 * Wedding site content
 * --------------------
 * Edit this file to populate the site. Then replace the images in /img/photos.
 * The Google Sheets URL is the last piece — see the README for how to connect it.
 */
window.WEDDING = {
  partnerOne: "Rachel",
  partnerTwo: "Tadhg",

  headline: ["we're", "getting", "married!"],
  inviteLead: "You're invited to",

  date: {
    display: "09.04.2027",
    weekday: "Friday",
    timeLabel: "Time to be confirmed",
    // Used for "Add to calendar" (.ics + Google Calendar)
    start: "2027-04-09T13:00:00",
    end: "2027-04-10T00:00:00",
  },

  venue: {
    name: "The Ravenswood",
    area: "Sussex, UK",
    address: "Cinder Hill, Sharpthorne, West Sussex, RH19 4HY",
    mapsUrl: "https://maps.google.com/?q=The+Ravenswood+Cinder+Hill+Sharpthorne+RH19+4HY",
    notes: "Please RSVP if you can come.",
  },

  story: {
    heading: "The day",
    body: "You are invited to celebrate with us at The Ravenswood, a 15th-century manor on the edge of the Ashdown Forest. Details are on this page — please RSVP so we can plan for you.",
  },

  schedule: [
    { time: "TBC", title: "Ceremony", detail: "Add the ceremony time and any notes for guests." },
    { time: "TBC", title: "Drinks", detail: "Add where drinks will be served." },
    { time: "TBC", title: "Wedding breakfast", detail: "Add sitting time and anything guests should know." },
    { time: "TBC", title: "Evening", detail: "Add evening start time and dress notes if they differ." },
  ],

  stay: {
    heading: "Where to stay",
    body: "The Ravenswood has rooms on site, and there are inns and hotels nearby in Sharpthorne, East Grinstead, and around Ashdown Forest. Recommendations will be added here.",
  },

  photos: [
    { src: "img/photos/01.jpg", alt: "Rachel and Tadhg looking out over a waterfall" },
    { src: "img/photos/02.jpg", alt: "Rachel and Tadhg on a bridge in the forest" },
    { src: "img/photos/03.jpg", alt: "Rachel and Tadhg among the trees" },
    { src: "img/photos/04.jpg", alt: "A waterfall in the forest" },
    // Add more when you have them, e.g. { src: "img/photos/05.jpg", alt: "..." }
  ],

  rsvp: {
    deadline: "1 February 2027",
    // Paste the Web App URL from Apps Script after you deploy (README, step 3)
    googleScriptUrl: "",
    // Optional. Leave blank to skip the invite-code check.
    inviteCode: "",
  },

  contactEmail: "rachel.and.tadhg@example.com",
};
