$(document).ready(function() {
   diabeticHealthTracker.InsulinRecordings.data.onRecordingsHistoryReceived = onInsulinRecordingPosted;
   diabeticHealthTracker.InsulinRecordings.data.onMessageFailed = onInsulinRecordingPosted;

$("#btnAdd").click(postInsulinType);
$("#reading-value").val(0);
  // will trigger an event back to the main form
  

  eta.user.CheckLoginStatus("/etalogin.html",function(){
    diabeticHealthTracker.InsulinRecordings.data.getTodayData(onInitData);
  });


})
function resetDataAndGUI(){
    InsulinRecordingsAppData = {};  
    $("#historyRows").html("");
    $("#input-form-content").html("");
}

function stringToFloat(v){
    var value = parseFloat(v);
    if(isNaN(value)) {return 0}
    return value;
}

function postInsulinType()
{
    if(!eta.user.valid()) return;
    var currentValue = $("#new-insulin-type").val();
    $("#new-insulin-type").val("");
    if(currentValue!=""){
      diabeticHealthTracker.InsulinRecordings.data.addInsulinType(currentValue);      
    }
  
}

function postInsulinRecording(item){
  if(!eta.user.valid()) return;
  var insulinTypeId = $(item.currentTarget).attr('InsulinTypeId');
  var edit =$('#insulin-dose');
  var currentValue = edit.val();
  
  if(currentValue!=0){
    diabeticHealthTracker.InsulinRecordings.data.addRecording(currentValue, insulinTypeId);      
  }

}

var InsulinRecordingsAppData = {};

function updateGUI(rowSets){
    InsulinRecordingsAppData.SettingsCreated = false;
    
    var history = eta.utils.RowsByName("TodaysRecordings", rowSets);
    var insulinTypes = eta.utils.RowsByName("InsulinType", rowSets);
    var historyHtml = "";
    var insulinTypeHtml = "";
    var headerDate ="";
    if(history)
    {
        history.data.forEach(function(item){ 


            var d = new Date(item.TimeTaken);
            var dateStr = d.toLocaleDateString();
            if(dateStr !=headerDate){
                historyHtml+='<div class="history-date-header">Readings for: '+dateStr+'</div>'+
                '<div class="history-header"><label class="time-label">Time</label><label class="history-value"><span class="unit-type"></span></label></div>';
                ;
                headerDate = dateStr;
            }
            historyHtml +=
            '<div><label class="time-label">' +
            d.toLocaleTimeString() +
            '</label><label class="history-type">'+item.InsulinType_Name+'</label><span class="history-value">' +
            item.Amount +
            "</span></div>";

        });

    }

    if(insulinTypes)
    {
        insulinTypeHtml ='<div class="add-insulin-dose">Dose <input type="number" id="insulin-dose" class="insulin-dose number-edit" size=6 maxlength="6" /></div>';
        insulinTypes.data.forEach(function(item){ 
            
            insulinTypeHtml+=
            '<div class="add-insulin-dose">'+
        //    '<input type="number" id="insulin-type-'+item._Id+'" class="insulin-dose" size=6 maxlength="6" />'+
            '<button id="btnAddInsulin-'+item._Id+'" InsulinTypeId="'+item._Id+'" class="insulin-dose-button button button-primary button-pill">'+eta.utils.sanitize(item.Name)+'</button>'+
            '</div>';
        });

    }


    $("#historyRows").html(historyHtml);
    $("#input-form-content").html(insulinTypeHtml);
    $('.insulin-dose-button').click(postInsulinRecording);
    

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
function onInitData(queryResult){
    if(!eta.user.valid()) {
        resetDataAndGUI();
        return;
    }

    if(queryResult.Success){
        updateGUI(queryResult.RowSets);
    } else
    displayalert("ERROR: "+queryResult.Message);
}


function onInsulinRecordingPosted(queryResult){
    if(!eta.user.valid()) {
        resetDataAndGUI();
        return;
    }
    if(queryResult.Success){
        onInitData(queryResult);
        displayalert("You're recording has been logged ");
        
    } else
    displayalert("ERROR: "+queryResult.Message);
}



// for local debugging
//ETACommsSettings.apidomain = "http://localhost:60775/";
    
