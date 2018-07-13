$(document).ready(function() {
  
  HealthJournal.SugarReadings.Data.OnPageDataCallback = onSugarReadingPosted;
  HealthJournal.SugarReadings.Data.onMessageFailed = onMessageFailed
  $("#btnGo").click(postSugarReading);
  $("#reading-value").val(0);
  // will trigger an event back to the main form
  
  
  
  
  ETA.User.CheckLoginStatus("/etalogin.html",function(){
    HealthJournal.SugarReadings.Data.GetTodayData(onInitData);
  });
});

function updateUnitType(){
    var label = "";
    if (HealthJournal.SugarReadings.Data.unitType ==1){
        label = "(mmol/L)";
    } 

    $('.unit-type').html(label);
}

function resetDataAndGUI(){
    SugarReadingsAppData = {};  
    $("#todayTotal").html("0");
    $("#todayAvg").html("0");
    $("#historyRows").html("");
}

function stringToFloat(v){
    var value = parseFloat(v);
    if(isNaN(value)) {return 0}
    return value;
}
function postSugarReading(item){
  if(!ETA.User.valid()) return;
  var currentValue = stringToFloat($("#reading-value").val());
  if(currentValue!=0){
    HealthJournal.SugarReadings.Data.AddReading(currentValue);      
  }

}
function onMessageFailed(queryResult){
    $("#btnGO").enable();
     displayalert("ERROR: "+queryResult.Message);
    if(!ETA.User.valid()) {
        resetDataAndGUI();
        return;
    }
}

var SugarReadingsAppData = {};

function clearSugarValue(){$("#reading-value").val(null)};

function updateGUI(rowSets){
    SugarReadingsAppData.SettingsCreated = false;
    
    var history = ETA.Utils.RowsByName("RecentReadings", rowSets);
    var hba1c = ETA.Utils.ResultByName("hba1c", rowSets).hba1c;
    var todayTotal = 0;
    var todayStr = new Date().toLocaleDateString();
    var historyHtml = "";
    var todayMin = 0;
    var todayCount = 0;
    var todayMax = 0;
    var headerDate ="";
    if(history)
    {
        history.data.forEach(function(item){ 


            var d = new Date(item.TimeTaken);
            var dateStr = d.toLocaleDateString();
            if(dateStr==todayStr){
              todayCount++;
              todayTotal+=item.Amount;
              if (item.Amount < todayMin || todayMin == 0) todayMin = item.Amount;
              if (item.Amount > todayMax) todayMax = item.Amount;
            }

            if(dateStr !=headerDate){
                historyHtml+='<div class="history-date-header">Readings for: '+dateStr+'</div>'+
                '<div class="history-header"><label class="time-label">Time</label><label class="history-value"><span class="unit-type"></span></label></div>';
                ;
                headerDate = dateStr;
            }
            historyHtml +=
            '<div><label class="time-label">' +
            d.toLocaleTimeString() +
            '</label><span class="history-value">' +
            item.Amount +
            "</span></div>";
            //historyHtml+='<div><label class="time-label">'+d.toLocaleTimeString()+'</label><span class="history-value">'+item.Amount+'</span><span class="unit-type"></span></div>';
        });

    }
    SugarReadingsAppData.todayTotal = todayCount;
    SugarReadingsAppData.todayMin = todayMin;
    SugarReadingsAppData.todayMax = todayMax;    
    if(SugarReadingsAppData.todayTotal >0){
    SugarReadingsAppData.todayAvg = todayTotal/SugarReadingsAppData.todayTotal;
    }else
    {
        SugarReadingsAppData.todayAvg =0;
    }


    $("#todayTotal").html(SugarReadingsAppData.todayTotal);
    $("#todayAvg").html(Math.round(SugarReadingsAppData.todayAvg * 100)/100);
    $("#todayMin").html(SugarReadingsAppData.todayMin);
    $("#todayMax").html(SugarReadingsAppData.todayMax);
    $("#hba1c").html(hba1c);
    $("#historyRows").html(historyHtml);
    updateUnitType();

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

function displayalert(text){
    var msgbox = $('.message');
    msgbox.html(text);
    msgbox.removeClass("hidden");
    setTimeout(function(){
       msgbox.addClass("hidden");
      msgbox.html("");

    },10000);
}

function onSugarReadingPosted(queryResult){
    if(!ETA.User.valid()) {
        resetDataAndGUI();
        return;
    }
    if(queryResult.Success){
        onInitData(queryResult);
        displayalert("You're reading has been logged ");
        
    } else
    displayalert("ERROR: "+queryResult.Message);
}



// for local debugging
//ETACommsSettings.apidomain = "http://localhost:60775/";
    
