$(document).ready(function() {
  // setup the page state to show everyting is not ready
  preparePageForLoad();

  $("#btnAdd").click(postInsulinType);
  $("#reading-value").val(0);

  // will trigger an event back to the main form

  eta.user.CheckLoginStatus("../etalogin.html", function() {
    diabeticHealthTracker.InsulinRecordings.data.getTodayData()
    .then(result=>{
      updateGUI(result.Data.Results);
      pageLoadCompleted();
    }).catch(sendingError);
  });
});

function resetDataAndGUI() {
  InsulinRecordingsAppData = {};
  $("#historyRows").html("");
  $("#input-form-content").html("");
}

function postInsulinType() {
  var currentValue = $("#new-insulin-type").val();
  $("#new-insulin-type").val("");
  if (currentValue != "") {
    sendingNow();
    diabeticHealthTracker.InsulinRecordings.data.addInsulinType(currentValue)
    .then(result=>
      {
        sendingComplete("New insulin type added");
        updateGUI(result.Data.Results);
      }).catch(sendingError);
  }
}

resetDataEntry = function(){
  $('#insulin-dose').val("");
}
function postInsulinRecording(item) {

  // get the insulin type for the measurement
  var insulinTypeId = $(item.currentTarget).attr("InsulinTypeId");
  var insulinName = $(item.currentTarget).text();
  var edit = $("#insulin-dose");
  var currentValue = edit.val();

  if (currentValue != 0) {
    sendingNow();
    diabeticHealthTracker.InsulinRecordings.data.addRecording(
      currentValue,
      insulinTypeId
    ).then(result=>
        {
          updateGUI(result.Data.Results);
          sendingComplete("We've recorded your dose "+currentValue.toString()+" units of "+insulinName);
        }).catch(sendingError);
  }
}

var InsulinRecordingsAppData = {};

function updateGUI(rowSets) {
  InsulinRecordingsAppData.SettingsCreated = false;

  var history = eta.utils.RowsByName("TodaysRecordings", rowSets);
  var insulinTypes = eta.utils.RowsByName("InsulinType", rowSets);
  var historyHtml = "";
  var insulinTypeHtml = "";
  var headerDate = "";

  if (history) {
     $('#history-rows').jsGrid({
        width:"100%",
        inserting:false,
        editing:false,
        sorting:true,
        paging:false,
        rowClass:function(item, itemIndex){
          if(itemIndex >0 && new Date(item.TimeTaken).toDateString() != new Date(history.data[itemIndex-1].TimeTaken).toDateString() )
            return "jsgrid-row-break"
            else
            return "";
      },

        data:history.data,
        fields:[
            {name:"TimeTaken",title:"Date", type:"date"},
            {name:"TimeTaken", title:"Time", type:"time"},
            {name:"InsulinType_Name",title:"Type", type:"text"},
            {name:"Amount", type:"number"}
        ]   
      });
  }

  // show the settings page  by default if we have no data
  eta.forms.dht.toggleSettings(insulinTypes.data.length == 0);

  insulinTypeHtml = "";
    
  insulinTypes.data.forEach(function(item) {
    insulinTypeHtml +=
     // '<div class="add-insulin-dose">' +
      //    '<input type="number" id="insulin-type-'+item._Id+'" class="insulin-dose" size=6 maxlength="6" />'+
      '<button id="btnAddInsulin-' +
      item._Id +
      '" InsulinTypeId="' +
      item._Id +
      '" class="insulin-dose-button button button-primary button-pill">' +
      eta.utils.sanitize(item.Name) +
      "</button>" ;
      //"</div>";
  });

 
  $("#input-form-content").html(insulinTypeHtml);
  // bind the click events 
  $(".insulin-dose-button").click(postInsulinRecording);
}


//ETACommsSettings.apidomain = "http://localhost:60775/";
