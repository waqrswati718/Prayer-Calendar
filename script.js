// let solorMonthValue = "";

const calendar = document.getElementById("calendar");
const solarMonthInput = document.getElementById("solar-month");
const calendarMonth = document.getElementById("calendar-month");
const hijriMonthInput = document.getElementById("hijri-month");
const hijriMonthDiv = document.getElementById("hijri-month-div");

function gregorianToHijri(dateObject) {
  // Check if the input is a Date object
  if (!(dateObject instanceof Date)) {
    throw new Error("Input should be a Date object.");
  }

  // Convert the Date object to a string in the format "YYYY-MM-DD"
  const gregorianDate = dateObject.toISOString().split("T")[0];

  const gregorianParts = gregorianDate.split("-");
  const gregorianYear = parseInt(gregorianParts[0], 10);
  const gregorianMonth = parseInt(gregorianParts[1], 10) - 1; // Months are 0-based
  const gregorianDay = parseInt(gregorianParts[2], 10);

  const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hijriDateString = hijriFormatter.format(
    new Date(gregorianYear, gregorianMonth, gregorianDay)
  );

  // Extract the Hijri month name and numeric representation from the formatted string
  const [hijriMonth, hijriDay, hijriYear] = hijriDateString.split(" ");

  return {
    hijriDate: `${hijriMonth} ${hijriDay}, ${hijriYear}`,
    hijriMonthName: hijriMonth,
    hijriMonthNumber: parseInt(hijriDay, 10),
  };
}

//initial array to store 1 year data
let currentYearData = [];

// Api Endpiont
let endpoint =
  "http://masjid.connextar.com/?rest_route=/dpt/v1/prayertime&filter=year";

// Request to the Api
fetch(endpoint)
  .then((response) => {
    // Check if the response is successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON response
    return response.json();
  })
  .then((data) => {
    currentYearData = data[0];

    const firstMonthData = currentYearData.filter((date) =>
      date.d_date.startsWith("2024-01-")
    );
    console.log("MonthData: ", firstMonthData);
    const calendarData = firstMonthData.map((date) => {
      const dateObject = new Date(date.d_date);
      const dayName = dateObject.toLocaleDateString("en-US", {
        weekday: "short",
      });

      const hijriDate = gregorianToHijri(dateObject);

      const dayMatch = hijriDate.hijriDate.match(/\b\d+\b/);

      const hijriDay = dayMatch ? dayMatch[0] : null;

      return `<div class="line ${dayName === "Mon" ? "monday" : ""} ${
        dayName === "Fri" ? "friday" : ""
      }">
        <div class="row-field row-date"><input type="text" value="${date.d_date.slice(
          -2
        )}" /></div>
        <div class="row-field row-day"><input type="text" value="${dayName}" /></div>
        <div class="row-field row-field row-hijri"><input type="text" value="${hijriDay}" /></div>
        <div class="row-field row-start1"><input type="text" value="${date.fajr_begins.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-jama1"><input type="text" value="${date.fajr_jamah.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-sunrise"><input type="text" value="${date.sunrise.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-start2"><input type="text" value="${date.zuhr_begins.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-jumuah"><input type="text" value="${date.zuhr_jamah.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-start3"><input type="text" value="${date.asr_mithl_1.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-jama2"><input type="text" value="${date.asr_jamah.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-maghrib"><input type="text" value="${date.maghrib_jamah.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-start4"><input type="text" value="${date.isha_begins.substring(
          0,
          5
        )}" /></div>
        <div class="row-field row-jama3"><input type="text" value="${date.isha_jamah.substring(
          0,
          5
        )}" /></div>
      </div>`;
    });

    const firstDate = new Date(firstMonthData[0].d_date);
    const lastDate = new Date(firstMonthData[firstMonthData.length - 1].d_date);
    const firstHijriDate = gregorianToHijri(firstDate);
    const lastHijriDate = gregorianToHijri(lastDate);
    const hijriFirstMonth = firstHijriDate.hijriDate.replace(/[\d,]/g, "");
    const hijriLastMonth = lastHijriDate.hijriDate.replace(/[\d,]/g, "");
    console.log("Hijri first month: ", hijriFirstMonth);
    console.log("Last Hijri month: ", hijriLastMonth);

    const defaultMonth = "January";
    solarMonthInput.value = defaultMonth;
    calendarMonth.innerHTML = defaultMonth;
    hijriMonthInput.value = `${hijriFirstMonth}- ${hijriLastMonth}`;
    hijriMonthDiv.innerHTML = `${hijriFirstMonth}- ${hijriLastMonth}`;
    const calendarString = calendarData.join("");
    calendar.innerHTML = calendarString;
  });

function monthNameToNumber(monthName) {
  const months = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  const lowerMonthName = monthName.toLowerCase(); // Convert input to lowercase
  return months[lowerMonthName];
}

function monthNumberToName(monthNumber) {
  const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  return months[monthNumber];
}

function dynamicMonth(inputId) {
  const monthInput = document.getElementById(inputId);

  const date = new Date(); // Get the current date
  const year = date.getFullYear().toString(); // Get the year as a string
  console.log(year); // Output: "2024"
  const monthNumber = monthNameToNumber(monthInput.value);

  console.log(`${year}-${monthNumber}-`);

  console.log("Current year: ", currentYearData);

  const dynamicMonthData = currentYearData.filter((date) =>
    date.d_date.startsWith(`${year}-${monthNumber}-`)
  );

  console.log("dynamic month data: ", dynamicMonthData);

  const calendarData = dynamicMonthData.map((date) => {
    const dateObject = new Date(date.d_date);
    const dayName = dateObject.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const hijriDate = gregorianToHijri(dateObject);

    const dayMatch = hijriDate.hijriDate.match(/\b\d+\b/);

    const hijriDay = dayMatch ? dayMatch[0] : null;

    return `<div class="line ${dayName === "Mon" ? "monday" : ""} ${
      dayName === "Fri" ? "friday" : ""
    }">
      <div class="row-field row-date"><input type="text" value="${date.d_date.slice(
        -2
      )}" /></div>
      <div class="row-field row-day"><input type="text" value="${dayName}" /></div>
      <div class="row-field row-field row-hijri"><input type="text" value="${hijriDay}" /></div>
      <div class="row-field row-start1"><input type="text" value="${date.fajr_begins.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-jama1"><input type="text" value="${date.fajr_jamah.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-sunrise"><input type="text" value="${date.sunrise.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-start2"><input type="text" value="${date.zuhr_begins.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-jumuah"><input type="text" value="${date.zuhr_jamah.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-start3"><input type="text" value="${date.asr_mithl_1.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-jama2"><input type="text" value="${date.asr_jamah.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-maghrib"><input type="text" value="${date.maghrib_jamah.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-start4"><input type="text" value="${date.isha_begins.substring(
        0,
        5
      )}" /></div>
      <div class="row-field row-jama3"><input type="text" value="${date.isha_jamah.substring(
        0,
        5
      )}" /></div>
    </div>`;
  });

  const firstDate = new Date(dynamicMonthData[0].d_date);
  const lastDate = new Date(
    dynamicMonthData[dynamicMonthData.length - 1].d_date
  );
  const firstHijriDate = gregorianToHijri(firstDate);
  const lastHijriDate = gregorianToHijri(lastDate);
  const hijriFirstMonth = firstHijriDate.hijriDate.replace(/[\d,]/g, "");
  const hijriLastMonth = lastHijriDate.hijriDate.replace(/[\d,]/g, "");
  console.log("Hijri first month: ", hijriFirstMonth);
  console.log("Last Hijri month: ", hijriLastMonth);

  const dynamicMonth = monthInput.value.toUpperCase();
  solarMonthInput.value = dynamicMonth;
  calendarMonth.innerHTML = dynamicMonth;
  hijriMonthInput.value = `${hijriFirstMonth}- ${hijriLastMonth}`;
  hijriMonthDiv.innerHTML = `${hijriFirstMonth}- ${hijriLastMonth}`;
  const calendarString = calendarData.join("");
  calendar.innerHTML = calendarString;
}
