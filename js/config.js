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
    mapsEmbedUrl: "https://maps.google.com/maps?q=The+Ravenswood+Cinder+Hill+Sharpthorne+RH19+4HY&output=embed",
    notes: "Then Saturday at The Boathouse, Putney. Please RSVP — we want you at both.",
  },

  story: {
    heading: "The day",
    body: "We cannot wait to marry at The Ravenswood — a 15th-century manor on the edge of the Ashdown Forest — and then keep the party going on Saturday. Friday is the big day. Saturday is Day 2: drinks on the roof terrace at The Boathouse in Putney, looking out over the river. Please come to both if you can. RSVP so we can plan for you.",
  },

  itinerary: [
    {
      heading: "Friday 9 April — the wedding",
      items: [
        { time: "2pm", title: "Ceremony", detail: "Add the ceremony time and any notes for guests." },
        { time: "3pm", title: "Drinks", detail: "Add where drinks will be served." },
        { time: "5pm", title: "Wedding breakfast", detail: "Add sitting time and anything guests should know." },
        { time: "Till the cows come home", title: "Evening", detail: "Add evening start time and dress notes if they differ." },
      ],
    },
    {
      heading: "Saturday 10 April — Day 2",
      mapsUrl: "https://maps.google.com/?q=The+Boathouse+32+Brewhouse+Lane+Putney+SW15+2JX",
      items: [
        {
          time: "3pm",
          title: "The Boathouse, Putney",
          detail: "Please come. This is the one we do not want you to miss. The Boathouse is our favourite Putney spot — a roof terrace with brilliant views of the Thames. Come from 3pm until close for a loose, sunny, stay-as-long-as-you-like afternoon. 32 Brewhouse Lane, Putney, SW15 2JX.",
        },
      ],
    },
  ],

  gettingThere: {
    heading: "Getting there",
    body: "The wedding is at The Ravenswood, Cinder Hill, Sharpthorne, West Sussex, RH19 4HY. Gatwick is the nearest airport — about 20–25 minutes by taxi.",
  },

  travel: {
    heading: "Getting to Putney",
    paragraphs: [
      "Please do not miss Saturday. Stay local on Friday night if you can, then come into London for Day 2 — roof terrace at The Boathouse, great views of the river, the lot.",
      "The easiest way is a taxi to East Grinstead, then the train to Clapham Junction and a change for Putney. East Grinstead is about 10 minutes from The Ravenswood. Haywards Heath is a little further by taxi and has more frequent trains.",
      "A taxi or Uber all the way takes about an hour to an hour and a half, depending on traffic — worth it if you are sharing.",
    ],
  },

  sunday: {
    heading: "Sunday 11 April",
    body: "If you are still standing after Friday and a big Saturday on the terrace, Putney hosts the Oxford and Cambridge Boat Race on Sunday — a perfect excuse to linger by the river.",
  },

  flights: {
    heading: "Flights from Dublin",
    paragraphs: [
      "If you are flying from Dublin, we suggest an early Friday morning arrival into Gatwick, coming home Sunday afternoon. That gets you here for the wedding, Saturday at The Boathouse, and the Boat Race on Sunday if you want it.",
    ],
    origin: "DUB",
    destination: "LGW",
    outbound: "2027-04-09",
    inbound: "2027-04-11",
    searchUrl: "https://www.skyscanner.ie/transport/flights/dub/lgw/270409/270411/?adultsv2=1&cabinclass=economy&preferdirects=true&rtn=1",
  },

  stay: {
    heading: "Where to stay",
    paragraphs: [
      "The Ravenswood has rooms on site, and it is only about 20–25 minutes from Gatwick — handy if you are flying in.",
      "If the on-site rooms go, East Grinstead, Forest Row, and Sharpthorne are close and have inns, B&Bs, and small hotels. Haywards Heath is a little further and has more options, still an easy taxi to the venue.",
    ],
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
    googleScriptUrl: "https://script.google.com/macros/s/AKfycbzi9ecmFYQKmiZ4QM9Tk26TE47R2giN5tjPNFAiwllAqXzoqX6pS-WbYfbVWV_Ee2MI2w/exec",
  },

  contactEmail: "tadhgok13@gmail.com",
};
