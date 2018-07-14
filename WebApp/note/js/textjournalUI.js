$(document).ready(function() {
  diabeticHealthTracker.TextJournal.data.onPageDataCallback = onNoteReadingPosted;
  diabeticHealthTracker.TextJournal.data.onMesssageFailed = onNoteReadingPosted;

  $("#btnGo").click(postNoteReading);
  clearNoteValue();
  // will trigger an event back to the main form

  
  eta.user.CheckLoginStatus("/etalogin.html", function() {
    diabeticHealthTracker.TextJournal.data.GetRecentData(onInitData);
  });
});
function resetDataAndGUI() {
  TextJournalAppData = {};
  $("#historyRows").html("");
}

function postNoteReading(item) {
  if (!eta.user.valid()) return;
  var currentValue = $("#reading-value").val();
  if (currentValue != "") {
    diabeticHealthTracker.TextJournal.data.addNote(currentValue);
  }
}

var TextJournalAppData = {};

function clearNoteValue() {
  $("#reading-value").val(null);
}

function updateGUI(rowSets) {
  TextJournalAppData.SettingsCreated = false;

  var history = eta.utils.RowsByName("RecentNotes", rowSets);
  var historyHtml = "";
  if (history) {
    history.data.forEach(function(item) {
      var d = new Date(item.TimeTaken);
      historyHtml +=
        '<div class="text-header"><label class="date-label">' +
        d.toLocaleDateString() +
        '</label><label class="time-label">' +
        d.toLocaleTimeString() +
        '</label></div><div class="text-journal">' +
        eta.utils.sanitize(item.Details) +
        "</div>";
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

function onNoteReadingPosted(queryResult) {
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
