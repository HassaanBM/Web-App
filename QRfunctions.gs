function saveQRCodes() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var links = sheet.getRange('K2:K' + sheet.getLastRow()).getValues();
  var names = sheet.getRange('E2:E' + sheet.getLastRow()).getValues(); // Fetch names from column E
  var folder = DriveApp.createFolder('QR_Codes'); // Creates a folder in Google Drive
  Logger.log('Folder created: ' + folder.getName());
  
  links.forEach(function(link, index) {
    if (link[0]) {
      var qrCode = createQRCode(link[0]);
      var fileName = names[index][0] || 'QR_Code_' + (index + 1); // Use name from column E or fallback
      folder.createFile(qrCode).setName(fileName);
      Logger.log('File created: ' + fileName);
    } else {
      Logger.log('No URL at row ' + (index + 2));
    }
  });
  Logger.flush(); // Ensure logs are shown
}





function createQRCode(url) {
  var apiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(url);
  var response = UrlFetchApp.fetch(apiUrl);
  Logger.log('QR Code created for URL: ' + url);
  return response.getBlob();
}





function downloadQRCode() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var activeRow = sheet.getActiveCell().getRow();
  var qrCodeUrl = sheet.getRange(activeRow, 11).getValue(); // Column K (11th column) for QR code URL
  var fileName = sheet.getRange(activeRow, 5).getValue();  // Column E (5th column) for name

  if (!qrCodeUrl) {
    SpreadsheetApp.getUi().alert("No QR Code URL found in column K for the active row.");
    return;
  }

  if (!fileName) {
    fileName = `QRCode_Row_${activeRow}`; // Fallback filename if column E is empty
  }

  try {
    var qrCodeBlob = createQRCode(qrCodeUrl); // Reuse createQRCode function to get the blob
    var base64Data = Utilities.base64Encode(qrCodeBlob.getBytes());
    var contentType = qrCodeBlob.getContentType();

    // Generate HTML for the modal dialog
    var html = `<html><body>
                  <h3>Your QR Code is ready to download:</h3>
                  <a href="data:${contentType};base64,${base64Data}" download="${fileName}.png">
                    <img src="data:${contentType};base64,${base64Data}" alt="QR Code" style="max-width: 300px; max-height: 300px;" />
                    <br>Click here to download
                  </a>
                </body></html>`;
    var ui = HtmlService.createHtmlOutput(html)
                          .setWidth(400)
                          .setHeight(400);
    SpreadsheetApp.getUi().showModalDialog(ui, "Download QR Code");

  } catch (error) {
    Logger.log('Error downloading QR Code: ' + error.message);
    SpreadsheetApp.getUi().alert("An error occurred while downloading the QR Code. Please check the URL or try again.");
  }
}