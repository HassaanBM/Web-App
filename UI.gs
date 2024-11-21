// Function to create a custom menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('QR Menu')
    .addItem('Download QR Code', 'downloadQRCode')
    .addItem('Save QR Codes', 'saveQRCodes')
    // .addItem('Show Alert', 'downloadQRCode')
    // .addItem('Show Prompt', 'showAlert')
    // .addItem('Show Prompt', 'showPrompt')
    // .addItem('Show Confirmation', 'showConfirmation')
    .addToUi();
}

// Function to show a simple alert message
function showAlert() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('This is a simple alert!');
}


// Function to show a prompt and log the response
function showPrompt() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Please enter your name:', 'John Doe', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() == ui.Button.OK) {
    Logger.log('User entered: ' + response.getResponseText());
  } else {
    Logger.log('User canceled the prompt.');
  }
}


// Function to show a confirmation dialog
function showConfirmation() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Do you want to proceed?', ui.ButtonSet.YES_NO);
  
  if (response == ui.Button.YES) {
    Logger.log('User clicked YES');
  } else {
    Logger.log('User clicked NO');
  }
}
