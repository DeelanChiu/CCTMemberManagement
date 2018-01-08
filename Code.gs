var lastRow;
var lastColumn;

/*
Shows the Attendance System button and the features in the system
*/
function onOpen() {
  var menu = SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('Attendance System');
  
  menu.addItem('Sign In sidebar', 'showSidebar')
      .addToUi();
  /*
  menu.addItem('Admin panel', 'showAdminPanel')
      .addToUi();
  */
}

/*
Shows the sign in sidebar by calling Sidebar.html
*/
function showSidebar() { //get the form data
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Attendance')
      .setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
  
}

/*
function showAdminPanel() {  
  var html = HtmlService.createHtmlOutputFromFile('AdminPanel')
      .setWidth(400)
      .setHeight(300);
  
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'Admin Panel');
  
}
*/
/*
Takes the NetID inputted into the sidebar and searches along all the netIDs in the spreadsheet
If it finds it, it tallies it as 1 on the column furthest to the right (or the "latest" event)
If the tally puts the person at above the needed credits, then it puts the person in the member section of the list

If it doesn't find it, it asks if the user is new to make sure there isn't a typo.
If new, then it takes the name and netID and puts it in the non-member section of the list in alphabetical order of the netID
*/
function processNetId(form) {
    var ui = SpreadsheetApp.getUi();
    var netId = form.netID; 
    //ui.alert("netID: "+netId);
    //var sheet = SpreadsheetApp.getActiveSheet();
  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    // This logs the value in the very last cell of this sheet
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
  
    var data = sheet.getDataRange().getValues();
    var netIdRow = 6; //offset
    var found = false;
    while (netIdRow < data.length && data[netIdRow][0] !== ""+netId){
        netIdRow = netIdRow + 1;
    }
    ui.alert(netIdRow+" out of "+data.length+" with last column "+lastColumn);
    
    if (netIdRow < data.length){
        var cell = sheet.getRange(netIdRow+1, lastColumn);
        cell.setValue("1");
      
        ui.alert("Thanks for signing in! Have fun :)");
        //ui.alert(netIdRow+" out of "+data.length+" with last column "+lastColumn);
      
    } else {
         
        ui.alert("Are you a new member / Is this your first time to a CCT event?");
      
    }
  
    
  /*
    for (var i = 0; i < data.length; i++) { //
      Logger.log('Product name: ' + data[i][0]);
      Logger.log('Product number: ' + data[i][1]);
    } 
    */
    
}
/*
function processAdminPanel(form) {
  
}
*/