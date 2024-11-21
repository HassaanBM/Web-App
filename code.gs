// Global variables for the sheet URL, cache duration, and redirection settings
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1PPbOlaORImoTV4LPmSmlxEuJbrPvn8kmD8f-2-jtmRc/edit#gid=0";
const CACHE_DURATION = 300; // Cache duration in seconds (5 minutes)
const REDIRECTION_URL = "https://forvilcosmetics.com/"; // Redirection URL
const REDIRECTION_TIMER = 10; // Timer for redirection (in seconds)

// Function to serve the main HTML page
function doGet(e) {
  const template = HtmlService.createTemplateFromFile('index');   // HTML template
  const data = getCachedData();                                   // Get data from cache or fetch fresh

  const params = e.parameter;

  if (params['check-user']) {
    const searchNumber = params['check-user'];                    // Retrieve the user parameter
    const userRow = data.find(row => row[2] == searchNumber);     // Search column C (index 2)

    if (userRow) {
      template.nicNumber = userRow[2];                            // Column C
      template.profileImage = userRow[3];                         // Column D
      template.profileName = userRow[4];                          // Column E
      template.profileDesignation = userRow[6];                   // Column G
      template.profileAbout = userRow[7];                         // Column H
      template.profilePhonenumber = userRow[5];                   // Column F
      template.countdownSeconds = REDIRECTION_TIMER;              // Countdown for redirection
      template.linkURL = REDIRECTION_URL;                         // Redirection URL

      return template.evaluate();                                 // Render the personalized template
    } else {
      return HtmlService.createHtmlOutput("User not found.");
    }
  } else {
    // Generate list view for rows where the 3rd column has values
    let listHTML = '';
    for (let i = 1; i < data.length; i++) {
      if (data[i][2]) { // Check if there is a value in the 3rd column (index 2)
        const nic = data[i][2];
        const image = data[i][3];
        const name = data[i][4];
        const phone = data[i][5];
        const area = data[i][7];
        const role = data[i][6];

        listHTML += `
          <div class="card">
            <img src="${image}" alt="Profile Image">
            <h2>${name}</h2>
            <h3>${nic}</h3>
            <h4>${role}</h4>
            <p>${area}</p>
            <a href="tel:${phone}">${phone}</a>
          </div>`;
      }
    }

    return HtmlService.createHtmlOutput(`
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Frovil User Check</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');* {margin: 0;padding: 0;box-sizing: border-box;flex-direction: row;flex-wrap: wrap;align-items: center;}body {display: flex;flex-flow: column;justify-content: center;align-items: center;height: 100vh;background-color: #f4f4f9;font-family: 'Open Sans', sans-serif;align-content: space-around;}.card {background-color: #fff;border-radius: 10px;box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);padding: 20px;text-align: center;width: 300px;}.card img {width: 100%;border-radius: 50%;aspect-ratio: 1/1;object-fit: cover;}.card h2 {margin-top: 14px;margin-bottom: 4px;font-size: 32px;color: #333;font-weight: 400;}.card h4 {font-size: 20px;color: #999;margin-bottom: 10px;font-weight: 600;}.card p {font-size: 16px;color: #555;font-weight: 400;}.timer {margin-top: 16px;font-size: 16px;color: #ff4500;font-weight: 700;}body.grid-container {flex-flow: row wrap;align-items: start;justify-content: space-around;flex-direction: row;flex-wrap: wrap;align-items: center;}body.grid-container .card {!i;!;}body.grid-container .card {margin: 10px auto;align-self: start;}
          </style>
        </head>
        <body class="grid-container">
        ${listHTML}
        </body>
      </html>`);
  }
}




// Function to get cached data or refresh from the sheet if not cached
function getCachedData() {
  const cache = CacheService.getScriptCache();
  const cachedData = cache.get('userData');

  if (cachedData) {
    return JSON.parse(cachedData); // Return cached data if available
  } else {
    const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    // Cache the data for CACHE_DURATION seconds
    cache.put('userData', JSON.stringify(data), CACHE_DURATION);
    return data; // Return fresh data
  }
}


// Function to refresh the app data and force the cache to update
function refreshAppData() {
  const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const cache = CacheService.getScriptCache();
  // Update the cache with the latest data
  cache.put('userData', JSON.stringify(data), CACHE_DURATION);
  Logger.log('App data refreshed and cache updated.');
}




// Function to set up the time-driven trigger for automatic refresh
function createTimeDrivenTriggers() {
  // Trigger to run every hour
  ScriptApp.newTrigger('refreshAppData')
    .timeBased()
    .everyHours(1)  // You can adjust the interval (every minute, hour, day, etc.)
    .create();
}




// Run this function once manually to create the time-driven trigger
function setupTriggers() {
  createTimeDrivenTriggers();
}