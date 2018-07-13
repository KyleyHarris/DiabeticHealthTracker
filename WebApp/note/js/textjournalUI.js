$(document).ready(function() {
  HealthJournal.TextJournal.Data.OnPageDataCallback = onNoteReadingPosted;
  HealthJournal.TextJournal.Data.onMesssageFailed = onNoteReadingPosted;

  $("#btnGo").click(postNoteReading);
  $("#reading-value").val(0);
  // will trigger an event back to the main form

  
  ETA.User.CheckLoginStatus("/etalogin.html", function() {
    HealthJournal.TextJournal.Data.GetRecentData(onInitData);
  });
});
function resetDataAndGUI() {
  TextJournalAppData = {};
  $("#historyRows").html("");
}

function postNoteReading(item) {
  if (!ETA.User.valid()) return;
  var currentValue = $("#reading-value").val();
  if (currentValue != "") {
    HealthJournal.TextJournal.Data.AddNote(currentValue);
  }
}

var TextJournalAppData = {};

function clearNoteValue() {
  $("#reading-value").val(null);
}

function updateGUI(rowSets) {
  TextJournalAppData.SettingsCreated = false;

  var history = ETA.Utils.RowsByName("RecentNotes", rowSets);
  var historyHtml = "";
  if (history) {
    history.data.forEach(function(item) {
      var d = new Date(item.TimeTaken);
      historyHtml +=
        '<div><label class="date-label">' +
        d.toLocaleDateString() +
        '</label><label class="time-label">' +
        d.toLocaleTimeString() +
        '</label><.div><div class="text-journal">' +
        ETA.Utils.Sanitize(item.Details) +
        "</div>";
    });
  }

  $("#historyRows").html(historyHtml);
}

function onInitData(queryResult) {
  if (!ETA.User.valid()) {
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

function onNoteReadingPosted(queryResult) {
  if (!ETA.User.valid()) {
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
