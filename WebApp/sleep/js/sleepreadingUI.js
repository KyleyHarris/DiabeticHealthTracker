$(document).ready(function() {
  diabeticHealthTracker.SleepReadings.data.onPageDataCallback = onSleepReadingPosted;
  diabeticHealthTracker.SleepReadings.data.onMesssageFailed = onSleepReadingPosted;

  $("#btnGo").click(postSleepReading);
  $("#reading-value").val(0);
  // will trigger an event back to the main form

  
  eta.user.CheckLoginStatus("/etalogin.html", function() {
    diabeticHealthTracker.SleepReadings.data.GetRecentData(onInitData);
  });
});
function resetDataAndGUI() {
  SleepReadingsAppData = {};
  $("#historyRows").html("");
}

function stringToFloat(v) {
  var value = parseFloat(v);
  if (isNaN(value)) {
    return 0;
  }
  return value;
}
function postSleepReading(item) {
  if (!eta.user.valid()) return;
  var currentValue = stringToFloat($("#reading-value").val());
  if (currentValue != 0) {
    diabeticHealthTracker.SleepReadings.data.addReading(currentValue);
  }
}

var SleepReadingsAppData = {};

function clearSleepValue() {
  $("#reading-value").val(null);
}

function updateGUI(rowSets) {
  SleepReadingsAppData.SettingsCreated = false;

  var history = eta.utils.RowsByName("RecentReadings", rowSets);
  var historyHtml = "";
  if (history) {
    history.data.forEach(function(item) {
      var d = new Date(item.TimeTaken);
      historyHtml +=
        '<div><label class="date-label">' +
        d.toLocaleDateString() +
        '</label><label class="time-label">' +
        d.toLocaleTimeString() +
        '</label><span class="history-value">' +
        item.Hours +
        "</span></div>";
    });
  }

  $("#historyRows").html(historyHtml);
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

function onSleepReadingPosted(queryResult) {
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

//ETACommsSettings.apidomain = "http://localhost:60775/";
