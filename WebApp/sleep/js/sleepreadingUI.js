$(document).ready(function() {
  
  preparePageForLoad();

  $("#btnGo").click(postSleepReading);
  $("#reading-value").val(0);
  // will trigger an event back to the main form
  eta.user.CheckLoginStatus("../etalogin.html", function() {
    diabeticHealthTracker.SleepReadings.data.GetRecentData()
    .then(result=>
      {
        updateGUI(result.Data.Results);
        pageLoadCompleted();
      }).catch(sendingError);
  });
});

function postSleepReading(item) {
  if (!eta.user.valid()) return;
  var currentValue = diabeticHealthTracker.convert.stringToFloat($("#reading-value").val());
  if (currentValue != 0) {
    diabeticHealthTracker.SleepReadings.data.addReading(currentValue)
    .then(result=>
      {
        updateGUI(result.Data.Results);
        sendingComplete("Your sleep of "+currentValue.toString()+" hours is recorded");
      }).catch(sendingError);
  }
}

var SleepReadingsAppData = {};

function clearSleepValue() {
  $("#reading-value").val(null);
}

function updateGUI(rowSets) {
  SleepReadingsAppData.SettingsCreated = false;
  clearSleepValue();
  var history = eta.utils.rowsByName("RecentReadings", rowSets);
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
      data:history.Rows,
      fields:[
          {name:"TimeTaken",title:"Date", type:"date"},
          {name:"TimeTaken", title:"Time", type:"time"},
          {name:"Hours",title:"Sleep (Hours)", type:"number",
            itemTemplate:function(value){return diabeticHealthTracker.math.round2dp(value).toFixed(2);}}
      ]   
    });

  }

  $("#historyRows").html(historyHtml);
}


//ETACommsSettings.apidomain = "http://localhost:60775/";
