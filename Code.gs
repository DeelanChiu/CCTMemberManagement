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
  var creditThresh = 5;
  //ui.alert("netID: "+netId);
  //var sheet = SpreadsheetApp.getActiveSheet();
  
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  
  for (var sheetNum = 0; sheetNum < sheets.length; sheetNum++){
    // This logs the value in the very last cell of this sheet
    var sheet = sheets[sheetNum];
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    
    var data = sheet.getDataRange().getValues();
    var netIdRow = 5; //offset, the first row of netIds
    /*
    while (netIdRow < data.length && data[netIdRow][0] !== ""+netId){
      netIdRow = netIdRow + 1;
    }
    */
    
    var nextSheet = false;
    while (netIdRow < data.length && !nextSheet){
      var currNetId = data[netIdRow][0];
      //compare the netIds
      for (var k=0; k<currNetId.length; k++) {
        if (currNetId[k] > netId[k]){ //found a netId bigger, person is not in this sheet, next sheet
          //ui.alert("breaking at row "+netIdRow+" comparing "+currNetId[k]+" and "+netId[k]);
          nextSheet = true;
          break; 
        }
        if (currNetId[k] < netId[k]){
          break;
        }
        
      }
      
      netIdRow = netIdRow + 1;
      
      if (k == currNetId.length) { //found netid
        //ui.alert("found at "+netIdRow);
        break;
      }
    }
    
    if (nextSheet) continue; //skip to next sheet
    
    if (netIdRow < data.length){
      //ui.alert("At "+netIdRow+" You have "+data[netIdRow-1][3]+" credits");
      
      if (data[netIdRow-1][3] >= creditThresh-1 && sheetNum > 1){//non-member meet credit requirement, raise to member
        //ui.alert(data[netIdRow-1][0]+" becoming a member! row: "+netIdRow+" col: "+lastColumn);
        
        //have to tally the member first
        sheet.getRange(netIdRow, lastColumn).setValue("1");
        
        var row = sheet.getRange(netIdRow, 1, 1, lastColumn);
        
        //ui.alert("getting new row");
        var memberSheet = sheets[1];
        data = memberSheet.getDataRange().getValues();
        //ui.alert("last: "+data[lastRow-1][0]+" "+data[lastRow-1][1]+" "+data[lastRow-1][2]);
        //ui.alert("replacing sheet and data");
        //find the alphetical place this new member goes
        netIdRow = 5;
        //ui.alert(data[7][0]+" on new sheet");
        var foundRow = false;
        while (netIdRow < data.length && !foundRow){
          var currNetId = data[netIdRow][0];
          for (var k=0; k<currNetId.length; k++) {
            if (currNetId[k] > netId[k]){ //found a netId bigger, new person goes before this net id
              //ui.alert("breaking at row "+insertRow+" comparing "+currNetId[k]+" and "+netId[k]);
              foundRow = true;
              break; 
            }
            if (currNetId[k] < netId[k]){
              break;
            }
            
          }
          if (!foundRow) {
            netIdRow = netIdRow + 1;
          }
        }
        
        //add a new row and input the new member's data in there
        //sheet.appendRow([netId, firstName, lastName]);
        memberSheet.insertRowAfter(netIdRow);
        netIdRow = netIdRow + 1;
        row.copyTo(memberSheet.getRange(netIdRow, 1));

        //delete this row in the original sheet
        sheet.deleteRow(netIdRow+1);
        
      } else {
        
        var cell = sheet.getRange(netIdRow, lastColumn);
        cell.setValue("1");
        //ui.alert("found at :"+sheetNum+" "+netIdRow);
        
      }
      /*
      Goal: check if the credits reached 5
      If it did, relocate row to sheet 1
      */     
      //ui.alert("At "+netIdRow+" = "+data[netIdRow][0]);      
      ui.alert("Thanks for signing in! Have fun :)");
      break;
      //ui.alert(netIdRow+" out of "+data.length+" with last column "+lastColumn);
      
    }
    
  }
  
  //ui.alert(netIdRow+" out of "+data.length+" with last column "+lastColumn);
  
  if (sheetNum >= sheets.length){
         
    var newMember = ui.alert("Hmm... we can't seem to be able to find "+netId+"...",
                             "Are you a new member / Is this your first time to a CCT event?",
                             ui.ButtonSet.YES_NO);
    
    if (newMember == ui.Button.YES) {
      // User clicked "Yes".      
      
      //create the page to take in new person's info
      var personInfo = HtmlService.createHtmlOutputFromFile('NewPersonInfo')
      .setWidth(450)
      .setHeight(220);
      
      SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(personInfo, 'New Atendee Info');
      
    } else if (newMember == ui.Button.NO) {
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