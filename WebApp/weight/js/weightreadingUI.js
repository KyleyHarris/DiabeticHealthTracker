$(document).ready(function() {
  preparePageForLoad();
  $("#btnGo").click(postWeightReading);
  $("#reading-value").val(0);
  // will trigger an event back to the main form

  eta.user.CheckLoginStatus("../etalogin.html", function() {
    diabeticHealthTracker.WeightReadings.data.GetRecentData()
    .then(result=>
      {
        updateGUI(result.Data.Results);
        pageLoadCompleted();
      }).catch(sendingError);
  });
});


function postWeightReading(item) {
  if (!eta.user.valid()) return;
  var currentValue = diabeticHealthTracker.convert.stringToFloat($("#reading-value").val());
  if (currentValue !== 0) {
      diabeticHealthTracker.WeightReadings.data.addReading(currentValue)
          .then(result =>
          {
              updateGUI(result.Data.Results);
              sendingComplete("your weight " + currentValue.toString() + "kgs has been recorded");
          }).catch(sendingError);
  }
}

var WeightReadingsAppData = {};

function clearWeightValue() {
  $("#reading-value").val(null);
}

function updateGUI(rowSets) {
  WeightReadingsAppData.SettingsCreated = false;
  clearWeightValue();
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


//eta.comms.settings.apidomain = "http://localhost:60775/";



