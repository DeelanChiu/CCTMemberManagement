var lastRow;
var lastColumn;

/*
Shows the Attendance System button and the features in the system
*/
function onOpen() {
  var menu = SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('Attendance System');
  
  menu.addItem('Sign In sidebar', 'showSignInSidebar')
      .addToUi();
  /*
  menu.addItem('Admin panel', 'showAdminPanel')
      .addToUi();
  */
}

/*
Shows the sign in sidebar by calling Sidebar.html
*/
function showSignInSidebar() { //get the form data
  var html = HtmlService.createHtmlOutputFromFile('SignInSidebar')
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
    while (netIdRow < data.length && data[netIdRow][0] !== ""+netId){
        netIdRow = netIdRow + 1;
    }
    //ui.alert(netIdRow+" out of "+data.length+" with last column "+lastColumn);
    
    if (netIdRow < data.length){
      var cell = sheet.getRange(netIdRow+1, lastColumn);
      cell.setValue("1");
      
      ui.alert("Thanks for signing in! Have fun :)");
      //ui.alert(netIdRow+" out of "+data.length+" with last column "+lastColumn);
      
    } else {
         
      var newMember = ui.alert("Hmm... we can't seem to be able to find you...",
        "Are you a new member / Is this your first time to a CCT event?",
                               ui.ButtonSet.YES_NO);
      
      if (newMember == ui.Button.YES) {
        // User clicked "Yes".
        //ui.alert('Welcome! Please enter your name :)');
        
        var personInfo = HtmlService.createHtmlOutputFromFile('NewPersonInfo')
        .setWidth(450)
        .setHeight(200);
        
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
        .showModalDialog(personInfo, 'New Atendee Info');
        
      } else {
        // User clicked "No" or X in the title bar.
        ui.alert('Perhaps you have made a typo? Please re-enter your netID');
      }  
      
      
      
    }
    
}

/*
If the attendee isn't in the database, this function is called to put the person in the list

*/
function insertNewPerson(form){
  var ui = SpreadsheetApp.getUi();
  var netId = form.netId;
  var firstName = form.firstName;
  var lasttName = form.lastName;
  //ui.alert("name: "+firstName+" "+lasttName);
  //var sheet = SpreadsheetApp.getActiveSheet();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  
  // This logs the value in the very last cell of this sheet
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  //ui.alert("col row: "+lastColumn+" "+lastRow);
  var data = sheet.getDataRange().getValues();
  //ui.alert("last: "+data[lastRow-1][0]+" "+data[lastRow-1][1]+" "+data[lastRow-1][2]);
  //sheet.insertRowAfter(lastRow);
  
  //sheet.appendRow([netId, firstName, lastName]);
  
  //sheet.getRange(lastRow, 0).setValue(netId);
  //sheet.getRange(lastRow, 1).setValue(firstName);
  //sheet.getRange(lastRow, 2).setValue(lastName);
  
  var values = [
   [netId, firstName, lastName, "=SUM(E"+(lastRow+1)+":AAD"+(lastRow+1)+")" ]
  ];

  var range = sheet.getRange("A"+(lastRow+1)+":D"+(lastRow+1));
  range.setValues(values);
  
  var cell = sheet.getRange(lastRow+1, lastColumn);
  cell.setValue("1");
  
  ui.alert("Thanks for signing in! Have fun :)");
}

/*
function processAdminPanel(form) {
  
}
*/