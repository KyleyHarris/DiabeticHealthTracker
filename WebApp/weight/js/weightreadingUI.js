$(document).ready(function() {
  diabeticHealthTracker.WeightReadings.data.onPageDataCallback = onWeightReadingPosted;
  diabeticHealthTracker.WeightReadings.data.onMesssageFailed = onWeightReadingPosted;

  $("#btnGo").click(postWeightReading);
  $("#reading-value").val(0);
  // will trigger an event back to the main form

  
  eta.user.CheckLoginStatus("../etalogin.html", function() {
    diabeticHealthTracker.WeightReadings.data.GetRecentData(onInitData);
  });
});
function resetDataAndGUI() {
  WeightReadingsAppData = {};
  $("#historyRows").html("");
}

function stringToFloat(v) {
  var value = parseFloat(v);
  if (isNaN(value)) {
    return 0;
  }
  return value;
}
function postWeightReading(item) {
  if (!eta.user.valid()) return;
  var currentValue = stringToFloat($("#reading-value").val());
  if (currentValue != 0) {
    diabeticHealthTracker.WeightReadings.data.addReading(currentValue);
  }
}

var WeightReadingsAppData = {};

function clearWeightValue() {
  $("#reading-value").val(null);
}

function updateGUI(rowSets) {
  WeightReadingsAppData.SettingsCreated = false;

  var history = eta.utils.RowsByName("RecentReadings", rowSets);
  var historyHtml = "";
  if (history) {
    $('#history-rows').jsGrid({
      width:"100%",
      inserting:false,
      editing:false,
      sorting:true,
      paging:false,
      rowClass:function(item, itemIndex){
          return getTimeBasedAlternateRowClass(item, itemIndex, 'TimeTaken', this.data);

      },
          data:history.data,
      fields:[
          {name:"TimeTaken",title:"Date", type:"date"},
          {name:"TimeTaken", title:"Time", type:"time"},
          
          {name:"Amount",title:"Amount (Kg)", type:"number",
            itemTemplate:function(value){return diabeticHealthTracker.math.round2dp(value).toFixed(2);}}
      ]   
    });

  }

}

function onInitData(queryResult) {
  if (!eta.user.valid()) {
    resetDataAndGUI();
    return;
  }

  if (queryResult.Success) {
    updateGUI(queryResult.RowSets);
  } else displayalert("ERROR: " + queryResult.Message);
}

function displayalert(text) {
  var msgbox = $(".message");
  msgbox.html(text);
  msgbox.removeClass("hidden");
  setTimeout(function() {
    msgbox.addClass("hidden");
    msgbox.html("");
  }, 10000);
}

function onWeightReadingPosted(queryResult) {
  if (!eta.user.valid()) {
    resetDataAndGUI();
    return;
  }
  if (queryResult.Success) {
    onInitData(queryResult);
    displayalert("You're reading has been logged ");
  } else displayalert("ERROR: " + queryResult.Message);
}

// for local debugging

//eta.comms.settings.apidomain = "http://localhost:60775/";



