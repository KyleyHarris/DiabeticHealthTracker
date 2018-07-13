$(document).ready(function() {
   HealthJournal.InsulinRecordings.Data.onRecordingsHistoryReceived = onInsulinRecordingPosted;
   HealthJournal.InsulinRecordings.Data.onMessageFailed = onInsulinRecordingPosted;

$("#btnAdd").click(postInsulinType);
$("#reading-value").val(0);
  // will trigger an event back to the main form
  

  ETA.User.CheckLoginStatus("/etalogin.html",function(){
    HealthJournal.InsulinRecordings.Data.GetTodayData(onInitData);
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
    if(!ETA.User.valid()) return;
    var currentValue = $("#new-insulin-type").val();
    $("#new-insulin-type").val("");
    if(currentValue!=""){
      HealthJournal.InsulinRecordings.Data.AddInsulinType(currentValue);      
    }
  
}

function postInsulinRecording(item){
  if(!ETA.User.valid()) return;
  var insulinTypeId = $(item.currentTarget).attr('InsulinTypeId');
  var edit =$('#insulin-dose');
  var currentValue = edit.val();
  
  if(currentValue!=0){
    HealthJournal.InsulinRecordings.Data.AddRecording(currentValue, insulinTypeId);      
  }

}

var InsulinRecordingsAppData = {};

function updateGUI(rowSets){
    InsulinRecordingsAppData.SettingsCreated = false;
    
    var history = ETA.Utils.RowsByName("TodaysRecordings", rowSets);
    var insulinTypes = ETA.Utils.RowsByName("InsulinType", rowSets);
    var historyHtml = "";
    var insulinTypeHtml = "";
    if(history)
    {
        historyHtml = ETA.Utils.ProcessString(
            '<div><label class="time-label">@#TimeTaken</label><label class="history-type">@#InsulinType_Name</label><span class="history-value">@#Amount</span></div>'
             ,history.data,
            function(item,field){
                if(field!="TimeTaken")
                  return null
                else
                {
                    var d = new Date(item.TimeTaken);
                    return d.toLocaleTimeString();

                }
            }
        );
        /*
        history.data.forEach(function(item){ 
            
            var d = new Date(item.TimeTaken);
            historyHtml+='<div><label class="history-label">'+d.toLocaleTimeString()+'</label><label class="history-type">'+item.InsulinType_Name+'</label><span class="history-value">'+item.Amount+'</span></div>';
        });
        */

    }
    if(insulinTypes)
    {
        insulinTypeHtml ='<div class="add-insulin-dose">Dose <input type="number" id="insulin-dose" class="insulin-dose number-edit" size=6 maxlength="6" /></div>';
        insulinTypes.data.forEach(function(item){ 
            
            insulinTypeHtml+=
            '<div class="add-insulin-dose">'+
        //    '<input type="number" id="insulin-type-'+item._Id+'" class="insulin-dose" size=6 maxlength="6" />'+
            '<button id="btnAddInsulin-'+item._Id+'" InsulinTypeId="'+item._Id+'" class="insulin-dose-button button button-primary button-pill">'+ETA.Utils.Sanitize(item.Name)+'</button>'+
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
    if(!ETA.User.valid()) {
        resetDataAndGUI();
        return;
    }

    if(queryResult.Success){
        updateGUI(queryResult.RowSets);
    } else
    displayalert("ERROR: "+queryResult.Message);
}


function onInsulinRecordingPosted(queryResult){
    if(!ETA.User.valid()) {
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
    
