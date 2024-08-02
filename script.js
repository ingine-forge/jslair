const utcDate = document.getElementById("utcDate");
const utcHour = document.getElementById("utcHour");
const utcMinute = document.getElementById("utcMinute");
const localDate = document.getElementById("localDate");
const localHour = document.getElementById("localHour");
const localMinute = document.getElementById("localMinute");

const previewDateSpan = document.getElementById("preview-date");

const copyButton = document.getElementById("copy-button");

let currentUnixTimestamp = 0;
let utcDateTime;

let discordFormatF = "";
let discordFormatR = "";

// Populate hour options
for (let i = 0; i < 24; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i.toString().padStart(2, "0");
  utcHour.appendChild(option);
  localHour.appendChild(option.cloneNode(true));
}

// Populate minute options
for (let i = 0; i < 60; i += 15) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i.toString().padStart(2, "0");
  utcMinute.appendChild(option);
  localMinute.appendChild(option.cloneNode(true));
}

function formatDay(day) {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
}

function formatMonth(month) {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
  }
}

function formatUTCTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const dateOfTheMonth = date.getUTCDate();
  const day = formatDay(date.getUTCDay());
  const month = formatMonth(date.getUTCMonth());
  const year = date.getUTCFullYear();
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");
  return `${day}, ${month} ${dateOfTheMonth}, ${year} @${hour}:${minute} TCT`;
}

function formatDiscordTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "numeric",
  };
  return date.toLocaleString(undefined, options);
}

function formatRelativeTime(unixTimestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = unixTimestamp - now;
  const absDiff = Math.abs(diff);

  if (absDiff < 60) return "just now";
  if (absDiff < 3600)
    return `${Math.floor(absDiff / 60)} minute${absDiff < 120 ? "" : "s"} ${
      diff > 0 ? "from now" : "ago"
    }`;
  if (absDiff < 86400)
    return `${Math.floor(absDiff / 3600)} hour${absDiff < 7200 ? "" : "s"} ${
      diff > 0 ? "from now" : "ago"
    }`;
  if (absDiff < 2592000)
    return `${Math.floor(absDiff / 86400)} day${absDiff < 172800 ? "" : "s"} ${
      diff > 0 ? "from now" : "ago"
    }`;
  if (absDiff < 31536000)
    return `${Math.floor(absDiff / 2592000)} month${
      absDiff < 5184000 ? "" : "s"
    } ${diff > 0 ? "from now" : "ago"}`;
  return `${Math.floor(absDiff / 31536000)} year${
    absDiff < 63072000 ? "" : "s"
  } ${diff > 0 ? "from now" : "ago"}`;
}

function updateDiscordTimestamp() {
  const timestamp = currentUnixTimestamp;
  discordFormatF = `<t:${timestamp}:F>`;
  discordFormatR = `<t:${timestamp}:R>`;
  const humanReadableF = formatDiscordTimestamp(timestamp);
  const humanReadableR = formatRelativeTime(timestamp);
  document.getElementById("discordTimestamp").innerHTML = `${humanReadableF}`;
  document.getElementById(
    "discordTimeRemaining"
  ).innerHTML = `${humanReadableR}`;
}

function updatePreview() {
  previewDateSpan.textContent = formatUTCTime(currentUnixTimestamp);
}

function updateUnixTimestamp() {
  const utcDateTime = new Date(
    `${utcDate.value}T${utcHour.value.padStart(
      2,
      "0"
    )}:${utcMinute.value.padStart(2, "0")}:00Z`
  );
  currentUnixTimestamp = Math.floor(utcDateTime.getTime() / 1000);
  updateDiscordTimestamp();
  updatePreview();
}

function updateLocalFromUTC() {
  const utcDateTime = new Date(
    `${utcDate.value}T${utcHour.value.padStart(
      2,
      "0"
    )}:${utcMinute.value.padStart(2, "0")}:00Z`
  );
  const localDateTime = new Date(utcDateTime.getTime());

  localDate.value = localDateTime.toISOString().split("T")[0];
  localHour.value = localDateTime.getHours();
  localMinute.value = Math.floor(localDateTime.getMinutes() / 15) * 15;
  updateUnixTimestamp();
}

function updateUTCFromLocal() {
  const localDateTime = new Date(
    `${localDate.value}T${localHour.value.padStart(
      2,
      "0"
    )}:${localMinute.value.padStart(2, "0")}:00`
  );
  utcDateTime = new Date(localDateTime.getTime());

  utcDate.value = utcDateTime.toISOString().split("T")[0];
  utcHour.value = utcDateTime.getUTCHours();
  utcMinute.value = Math.floor(utcDateTime.getUTCMinutes() / 15) * 15;
  updateUnixTimestamp();
}

// Set initial values
const now = new Date();
utcDate.value = now.toISOString().split("T")[0];
utcHour.value = now.getUTCHours();
utcMinute.value = Math.floor(now.getUTCMinutes() / 15) * 15;
previewDateSpan.textContent = formatUTCTime(now.getTime() / 1000);
updateLocalFromUTC();

// Add event listeners
[utcDate, utcHour, utcMinute].forEach((el) =>
  el.addEventListener("change", updateLocalFromUTC)
);
[localDate, localHour, localMinute].forEach((el) =>
  el.addEventListener("change", updateUTCFromLocal)
);

copyButton.addEventListener("click", () => {
  const textToCopy = `@Notification\nThere will be a jump on ${formatUTCTime(
    currentUnixTimestamp
  )}, ${discordFormatR} which is ${discordFormatF} your local time. \nSend a deposit of 2 Edvd's to secure your jump. \n\n0/7 Slots Filled\n0/1 Priority Slots Filled`;

  navigator.clipboard.writeText(textToCopy);
});
