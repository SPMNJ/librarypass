function get_sheet_ids(){
var sheets = []

for (var i = 2; i < spreadsheet.getSheets().length; i++) {
  sheets.push(spreadsheet.getSheets()[i].getName());
}
  console.log(sheets);
  return sheets;
}
function add_block(name,st,et,mp){
  var id = random_id(5);
  spreadsheet.insertSheet(id).activate();
  spreadsheet.moveActiveSheet(spreadsheet.getSheets().length);
  spreadsheet.getSheetByName("Main").activate();
  spreadsheet.appendRow([id,name,st,et,mp,0,mp,0]);
  var sheet = spreadsheet.getSheetByName("Main")
  var search_string = id
  var textFinder = sheet.createTextFinder(search_string)
  var search_row = textFinder.findNext().getRow()
  sheet.getRange(search_row,6).setFormula("=COUNTUNIQUE("+id+"!A1:A)");
  sheet.getRange(search_row,7).setFormula("=E"+search_row+"-F"+search_row);
  sheet.getRange(search_row,8).setFormula("=COUNTUNIQUE("+id+"!D1:D)")
  fix_sheet_order();
}
function delete_block(id){
  var id = ""
  if (debug == true) {
    var myArray = get_sheet_ids();
    var id = myArray[Math.floor(Math.random() * myArray.length)];
  }
  var sheet = spreadsheet.getSheetByName("Main")
  var search_string = id
  var textFinder = sheet.createTextFinder(search_string)
  var search_row = textFinder.findNext().getRow()
  sheet.deleteRow(search_row);
  spreadsheet.deleteSheet(spreadsheet.getSheetByName(id));
  fix_sheet_order();
}
function fix_sheet_order(){
  var sheets = get_sheet_ids();
  var sheet = spreadsheet.getSheetByName("Main")
  for (var i = 0; i < sheets.length; i++) {
    var search_string = sheets[i]
    var textFinder = sheet.createTextFinder(search_string)
    var search_row = textFinder.findNext().getRow()
    var range = sheet.getRange(search_row, 1);
    try{
      sheet.moveRows(range, i+2);
    }
    catch(e){
    }
  }
}
function create_pass(bid,id){
  var pid = random_id(8);
  var sheet = spreadsheet.getSheetByName(bid);
  var time = new Date();
  sheet.appendRow([pid,id,time.toLocaleTimeString()])
}
function find_pass(bid,id) {
  var sheet = spreadsheet.getSheetByName(bid);
  var search_string =  Number(id);
  var textFinder = sheet.createTextFinder(search_string);
  var search_row = textFinder.findNext()
  if (search_row) {
    var test = sheet.getRange(search_row.getRow(), 4);
    if (test == null || test == "")
    {
      var time = new Date();
      sheet.getRange(search_row.getRow(), 4).setValue(time.toLocaleTimeString())
      return true;
    }
    else {
      return false;      
    }
  }
  else {
    return false;
  }
}

function get_passes(bid) {
  return spreadsheet.getSheetByName(bid).getRange("A1:D").getValues();
}
function check_id(id){
  var sheet = spreadsheet.getSheetByName("Users");
  var search_string =  Number(id);
  var textFinder = sheet.createTextFinder(search_string);
  var search_row = textFinder.findNext()
  if (search_row && sheet.getRange(search_row.getRow(), 3).getValue() == false){
    return true;  
  }
  else {
    return false;
  }
}
function respond(code,msg){
  return JSON.stringify({
        status: code,
        message: msg
    });
}
function random_id(length){
length = Number(length);
var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
  return text;
}