$(document).ready(function() {
    diabeticHealthTracker.WaterIntake.data.onFluidHistoryReceived = onWaterValuePosted;
    diabeticHealthTracker.WaterIntake.data.onMessageFailed = onMessageFailed
    $(".water-button").click(clickWaterButton);
    $("#btnGo").click(postWaterValue);
    $("#water-value").val(0);
   $("#btnUpdateSettings").click(postSettings);
  // will trigger an event back to the main form
  $("#btnAdd").click(postWaterType);

  
  eta.user.CheckLoginStatus("../etalogin.html",function(){
    diabeticHealthTracker.WaterIntake.data.getTodayData(onInitData);
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
    if(!eta.user.valid()) return;

    var currentValue = stringToInt($("#water-value").val());
  var amount = stringToInt( item.currentTarget.getAttribute("value")) + currentValue;
  $("#water-value").val(amount);

  
}
function postWaterValue(item){
  if(!eta.user.valid()) return;
  var waterTypeId = $(item.currentTarget).attr('WaterTypeId');
  if(!waterTypeId || waterTypeId=="")
   waterTypeId = null;
  var currentValue = stringToInt($("#water-value").val());
  if(currentValue!=0){
    $("#btnGO").disable();
    diabeticHealthTracker.WaterIntake.data.addFluid(currentValue, new Date(), waterTypeId);      
  }

}
function postWaterType()
{
    if(!eta.user.valid()) return;
    var currentValue = $("#new-fluid-type").val();
    $("#new-fluid-type").val("");
    if(currentValue!=""){
      diabeticHealthTracker.WaterIntake.data.addWaterType(currentValue);      
    }
  
}

function postSettings(item){
    if(!eta.user.valid()) return;
    var currentValue = stringToInt($("#water-value-perday").val());
    if(currentValue!=0){
        if( WaterIntakeAppData.SettingsCreated)
        {
            diabeticHealthTracker.WaterIntake.Settings.updateDailyLimit(currentValue);      
        }
        else
        {
            diabeticHealthTracker.WaterIntake.Settings.addDailyLimit(currentValue);      
        }
    }
  
  }
  
var WaterIntakeAppData = {};

function clearWaterValue(){$("#water-value").val(null)};

function updateGUI(rowSets){
    WaterIntakeAppData.SettingsCreated = false;
    var settings = eta.utils.RowsByName("settings", rowSets);
    if(settings)
    {
      if (settings.data.length==1) {
        WaterIntakeAppData.SettingsCreated = true;
        WaterIntakeAppData.VolumePerDayTarget_mls = settings.data[0].VolumePerDayTarget_mls;
        eta.forms.dht.hideSettings();

      } else
      {
        WaterIntakeAppData.VolumePerDayTarget_mls = 8*300;
        eta.forms.dht.showSettings();
      }
      $("#water-value-perday").val(WaterIntakeAppData.VolumePerDayTarget_mls);
    } 
    var history = eta.utils.RowsByName("TodaysWater", rowSets);
    var todayTotal_mls = 0;
    var todayDateStr = eta.utils.dateFloor().toLocaleDateString();
    if(history)
    {
        history.data.forEach(function(item){
            if(todayDateStr == new Date(item.FinishedConsumingAt).toLocaleDateString())
              todayTotal_mls+=item.Volume_mls;
        });
        $('#history-rows').jsGrid({
            width:"100%",
            inserting:false,
            editing:false,
            sorting:true,
            paging:false,
            rowClass:function(item, itemIndex){
                return getTimeBasedAlternateRowClass(item, itemIndex, 'FinishedConsumingAt', this.data);
            },
            data:history.data,
            fields:[
                {name:"FinishedConsumingAt",title:"Date", type:"date"},
                {name:"FinishedConsumingAt", title:"Time", type:"time"},
                {name:"WaterType",title:"Type", type:"text"},
                {name:"Volume_mls",title:"Volume(mls)", type:"number"}
            ]   
          });        

    }
    var waterTypes =  eta.utils.RowsByName("WaterType", rowSets);
    var waterTypeHtml = "";
    if(waterTypes)
    {
        waterTypes.data.forEach(function(item){ 
            waterTypeHtml+=
            '<button id="btnAddWater-'+item._Id+'" WaterTypeId="'+item._Id+'" class="add-water-button dynamic-water-button button-width-small button button-primary button-pill button-icon-txt-large">'+eta.utils.sanitize(item.Name)+'</button>';
        });

    }


    WaterIntakeAppData.todayTotal_mls = todayTotal_mls;
    WaterIntakeAppData.todayRemaining_mls = WaterIntakeAppData.VolumePerDayTarget_mls - todayTotal_mls;
    $("#todayTotal_mls").html(todayTotal_mls);
    $("#todayRemaining_mls").html(WaterIntakeAppData.todayRemaining_mls);
    //$("#historyRows").html(historyHtml);
    $('#extra-buttons').html(waterTypeHtml);
    $('.dynamic-water-button').click(postWaterValue);
}


function onMessageFailed(queryResult){
    $("#btnGO").enable();
     displayalert("ERROR: "+queryResult.Message);
    if(!eta.user.valid()) {
        resetDataAndGUI();
        return;
    }
    

}
function onInitData(queryResult){
    if(!eta.user.valid()) {
        resetDataAndGUI();
        return;
    }

    if(queryResult.Success){
        updateGUI(queryResult.Data.Results);
       
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
    if(!eta.user.valid()) {
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
    
