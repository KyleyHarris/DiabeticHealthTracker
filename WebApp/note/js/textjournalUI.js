$(document).ready(function() {
  preparePageForLoad();
  $("#btnGo").click(postNoteReading);
  clearNoteValue();
  // will trigger an event back to the main form

  
  eta.user.CheckLoginStatus("../etalogin.html", function() {
    diabeticHealthTracker.TextJournal.data.GetRecentData()
    .then(result=>
        {
          updateGUI(result.Data.Results);
          pageLoadCompleted();
        }).catch(sendingError);
  });
});

function postNoteReading(item) {
  var currentValue = $("#reading-value").val();
  if (currentValue != "") {
    sendingNow();
    diabeticHealthTracker.TextJournal.data.addNote(currentValue)
    .then(result=>
       {
         updateGUI(result.Data.Results);
         sendingComplete('your note is saved');
       }).catch(sendingError);
  }
}

var TextJournalAppData = {};

function clearNoteValue() {
  $("#reading-value").val(null);
}

function updateGUI(rowSets) {
  TextJournalAppData.SettingsCreated = false;
  clearNoteValue();
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


// for local debugging

//ETACommsSettings.apidomain = "http://localhost:60775/";
