$(document).ready(function() {
    HealthJournal.WaterIntake.Data.onFluidHistoryReceived = onWaterValuePosted;
    HealthJournal.WaterIntake.Data.onMessageFailed = onMessageFailed
    $(".water-button").click(clickWaterButton);
    $("#btnGo").click(postWaterValue);
    $("#water-value").val(0);
   $("#btnUpdateSettings").click(postSettings);
  // will trigger an event back to the main form
  $("#btnAdd").click(postWaterType);

  
  ETA.User.CheckLoginStatus("/etalogin.html",function(){
    HealthJournal.WaterIntake.Data.GetTodayData(onInitData);
  });

})
function resetDataAndGUI(){
    WaterIntakeAppData = {};  
    $("#todayTotal_mls").html("");
    $("#historyRows").html("");
}

function stringToInt(v){
    var value = parseInt(v);
    if(isNaN(value)) {return 0}
    return value;
}
function clickWaterButton(item){
    if(!ETA.User.valid()) return;

    var currentValue = stringToInt($("#water-value").val());
  var amount = stringToInt( item.currentTarget.getAttribute("value")) + currentValue;
  $("#water-value").val(amount);

  
}
function postWaterValue(item){
  if(!ETA.User.valid()) return;
  var waterTypeId = $(item.currentTarget).attr('WaterTypeId');
  if(!waterTypeId || waterTypeId=="")
   waterTypeId = null;
  var currentValue = stringToInt($("#water-value").val());
  if(currentValue!=0){
    $("#btnGO").disable();
    HealthJournal.WaterIntake.Data.AddFluid(currentValue, new Date(), waterTypeId);      
  }

}
function postWaterType()
{
    if(!ETA.User.valid()) return;
    var currentValue = $("#new-fluid-type").val();
    $("#new-fluid-type").val("");
    if(currentValue!=""){
      HealthJournal.WaterIntake.Data.AddWaterType(currentValue);      
    }
  
}

function postSettings(item){
    if(!ETA.User.valid()) return;
    var currentValue = stringToInt($("#water-value-perday").val());
    if(currentValue!=0){
        if( WaterIntakeAppData.SettingsCreated)
        {
            HealthJournal.WaterIntake.Settings.UpdateDailyLimit(currentValue);      
        }
        else
        {
            HealthJournal.WaterIntake.Settings.AddDailyLimit(currentValue);      
        }
    }
  
  }
  
var WaterIntakeAppData = {};

function clearWaterValue(){$("#water-value").val(null)};

function updateGUI(rowSets){
    WaterIntakeAppData.SettingsCreated = false;
    var settings = ETA.Utils.RowsByName("settings", rowSets);
    if(settings)
    {
      if (settings.data.length==1) {
        WaterIntakeAppData.SettingsCreated = true;
        WaterIntakeAppData.VolumePerDayTarget_mls = settings.data[0].VolumePerDayTarget_mls;

      } else
      {
        WaterIntakeAppData.VolumePerDayTarget_mls = 8*300;
      }
      $("#water-value-perday").val(WaterIntakeAppData.VolumePerDayTarget_mls);
    } 
    var history = ETA.Utils.RowsByName("TodaysWater", rowSets);
    var todayTotal_mls = 0;
    var historyHtml = "";
    if(history)
    {

        history.data.forEach(function(item){ 
            todayTotal_mls+=item.Volume_mls;
            var d = new Date(item.FinishedConsumingAt);
            historyHtml+='<div><label class="history-time">'+d.toLocaleTimeString()+'</label><label class="history-value">'+ETA.Utils.Sanitize(item.WaterType)+'</label><span class="history-value">'+item.Volume_mls+'mls</span></div>';
        });

    }
    var waterTypes =  ETA.Utils.RowsByName("WaterType", rowSets);
    var waterTypeHtml = "";
    if(waterTypes)
    {
        waterTypes.data.forEach(function(item){ 
            waterTypeHtml+=
            //'<div class="add-water">'+
            '<button id="btnAddWater-'+item._Id+'" WaterTypeId="'+item._Id+'" class="add-water-button dynamic-water-button button-width-small button button-primary button-pill button-icon-txt-large">'+ETA.Utils.Sanitize(item.Name)+'</button>';
            //'</div>';
        });

    }


    WaterIntakeAppData.todayTotal_mls = todayTotal_mls;
    WaterIntakeAppData.todayRemaining_mls = WaterIntakeAppData.VolumePerDayTarget_mls - todayTotal_mls;
    $("#todayTotal_mls").html(todayTotal_mls);
    $("#todayRemaining_mls").html(WaterIntakeAppData.todayRemaining_mls);
    $("#historyRows").html(historyHtml);
    $('#extra-buttons').html(waterTypeHtml);
    $('.dynamic-water-button').click(postWaterValue);
}


function onMessageFailed(queryResult){
    $("#btnGO").enable();
     displayalert("ERROR: "+queryResult.Message);
    if(!ETA.User.valid()) {
        resetDataAndGUI();
        return;
    }
    

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

function onWaterValuePosted(queryResult){
    $("#btnGO").enable();
    if(!ETA.User.valid()) {
        resetDataAndGUI();
        return;
    }
    if(queryResult.Success){
        onInitData(queryResult);
        clearWaterValue();
        var waterLeft = WaterIntakeAppData.VolumePerDayTarget_mls - WaterIntakeAppData.todayTotal_mls;
        if (waterLeft < 0){
         displayalert("Great, you've exceeded your daily requirement by "+Math.abs(waterLeft)+ "\n and drunk "+ WaterIntakeAppData.todayTotal_mls+"mls today! \n time to slow it down");
        }
        else
        displayalert("Cool, you've drunk "+ WaterIntakeAppData.todayTotal_mls+"mls today! \n only " + waterLeft + "mls to target.");
        
    } else
    displayalert("ERROR: "+queryResult.Message);
}



// for local debugging
//ETACommsSettings.apidomain = "http://localhost:60775/";
    
