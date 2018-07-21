$(document).ready(function() {
  preparePageForLoad();

  //diabeticHealthTracker.WaterIntake.data.onFluidHistoryReceived = onWaterValuePosted;
  //diabeticHealthTracker.WaterIntake.data.onMessageFailed = onMessageFailed
  $(".water-button").click(clickWaterButton);
  $("#btnGo").click(postWaterValue);
  $("#water-value").val(0);
  $("#btnUpdateSettings").click(postSettings);
  // will trigger an event back to the main form
  $("#btnAdd").click(postWaterType);

  eta.user.CheckLoginStatus("../etalogin.html", function() {
    diabeticHealthTracker.WaterIntake.data
      .getTodayData()
      .then(result => {
        updateGUI(result.Data.Results);
        pageLoadCompleted();
      })
      .catch(loadingError);
  });
});
function resetDataAndGUI() {
  WaterIntakeAppData = {};
  $("#todayTotal_mls").html("");
  $("#historyRows").html("");
}

function stringToInt(v) {
  var value = parseInt(v);
  if (isNaN(value)) {
    return 0;
  }
  return value;
}
function clickWaterButton(item) {
  var currentValue = stringToInt($("#water-value").val());
  var amount =
    stringToInt(item.currentTarget.getAttribute("value")) + currentValue;
  $("#water-value").val(amount);
}
function postWaterValue(item) {
  // get the primary key for the type of water we are adding.
  var waterTypeId = $(item.currentTarget).attr("WaterTypeId");

  // our DB API only supports null, not undefined etc.
  if (!waterTypeId || waterTypeId == "") waterTypeId = null;

  var currentValue = stringToInt($("#water-value").val());
  if (currentValue != 0) {
    sendingNow();

    diabeticHealthTracker.WaterIntake.data
      .addFluid(currentValue, waterTypeId)
      .then(result => {
        updateGUI(result.Data.Results);
        clearWaterValue();
        sendingComplete(waterLeftMessage());
      })
      .catch(sendingError);
  }
}

function postWaterType() {
  var currentValue = $("#new-fluid-type").val();
  $("#new-fluid-type").val("");
  if (currentValue != "") {
    sendingNow();
    diabeticHealthTracker.WaterIntake.data
      .addWaterType(currentValue)
      .then(result => {
        updateGUI(result.Data.Results);
        sendingComplete("New type has been added");
      })
      .catch(sendingError);
  }
}

function postSettings(item) {
  if (!eta.user.valid()) return;
  var currentValue = stringToInt($("#water-value-perday").val());
  if (currentValue != 0) {
    sendingNow();
    var promise;
    if (WaterIntakeAppData.SettingsCreated)
      promise = diabeticHealthTracker.WaterIntake.Settings.updateDailyLimit(
        currentValue
      );

    promise = diabeticHealthTracker.WaterIntake.Settings.addDailyLimit(
      currentValue
    );

    promise.then(result=>{
        updateGUI(result.Data.Results);
         sendingComplete("your water limit is now "+currentValue.toString()+"mls")  }).catch(sendingError);
  }
}

var WaterIntakeAppData = {};

function clearWaterValue() {
  $("#water-value").val(null);
}

function updateGUI(rowSets) {
  WaterIntakeAppData.SettingsCreated = false;
  var settings = eta.utils.RowsByName("settings", rowSets);
  if (settings) {
    if (settings.data.length >0 ) {
      WaterIntakeAppData.SettingsCreated = true;
      WaterIntakeAppData.VolumePerDayTarget_mls =
        settings.data[0].VolumePerDayTarget_mls;
      eta.forms.dht.hideSettings();
    } else {
      WaterIntakeAppData.VolumePerDayTarget_mls = 8 * 300;
      eta.forms.dht.showSettings();
    }
    $("#water-value-perday").val(WaterIntakeAppData.VolumePerDayTarget_mls);
  }
  var history = eta.utils.RowsByName("TodaysWater", rowSets);
  var todayTotal_mls = 0;
  var todayDateStr = eta.utils.dateFloor().toLocaleDateString();
  if (history) {
    history.data.forEach(function(item) {
      if (
        todayDateStr == new Date(item.FinishedConsumingAt).toLocaleDateString()
      )
        todayTotal_mls += item.Volume_mls;
    });
    $("#history-rows").jsGrid({
      width: "100%",
      inserting: false,
      editing: false,
      sorting: true,
      paging: false,
      rowClass: function(item, itemIndex) {
        return getTimeBasedAlternateRowClass(
          item,
          itemIndex,
          "FinishedConsumingAt",
          this.data
        );
      },
      data: history.data,
      fields: [
        { name: "FinishedConsumingAt", title: "Date", type: "date" },
        { name: "FinishedConsumingAt", title: "Time", type: "time" },
        { name: "WaterType", title: "Type", type: "text" },
        { name: "Volume_mls", title: "Volume(mls)", type: "number" }
      ]
    });
  }
  var waterTypes = eta.utils.RowsByName("WaterType", rowSets);
  var waterTypeHtml = "";
  if (waterTypes) {
    waterTypes.data.forEach(function(item) {
      waterTypeHtml +=
        '<button id="btnAddWater-' +
        item._Id +
        '" WaterTypeId="' +
        item._Id +
        '" class="add-water-button dynamic-water-button button-width-small button button-primary button-pill button-icon-txt-large">' +
        eta.utils.sanitize(item.Name) +
        "</button>";
    });
  }

  WaterIntakeAppData.todayTotal_mls = todayTotal_mls;
  WaterIntakeAppData.todayRemaining_mls =
    WaterIntakeAppData.VolumePerDayTarget_mls - todayTotal_mls;
  $("#todayTotal_mls").html(todayTotal_mls);
  $("#todayRemaining_mls").html(WaterIntakeAppData.todayRemaining_mls);
  $("#extra-buttons").html(waterTypeHtml);
  $(".dynamic-water-button").click(postWaterValue);
}

function waterLeftMessage() {
  var msg;
  var waterLeft =
    WaterIntakeAppData.VolumePerDayTarget_mls -
    WaterIntakeAppData.todayTotal_mls;
  if (waterLeft < 0)
    msg =
      "Great, you've exceeded your daily requirement by " +
      Math.abs(waterLeft) +
      "\n and drunk " +
      WaterIntakeAppData.todayTotal_mls +
      "mls today! \n time to slow it down";
  else
    msg =
      "Cool, you've drunk " +
      WaterIntakeAppData.todayTotal_mls +
      "mls today! \n only " +
      waterLeft +
      "mls to target.";
  return msg;
}

// for local debugging

//ETACommsSettings.apidomain = "http://localhost:60775/";
