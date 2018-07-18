$(document).ready(function() {
  
  diabeticHealthTracker.sugarReadings.data.onPageDataCallback = onSugarReadingPosted;
  diabeticHealthTracker.sugarReadings.data.onMessageFailed = onMessageFailed
  $("#btnGo").click(postSugarReading);
  $("#reading-value").val(0);
  // will trigger an event back to the main form
  
  
  
  
  eta.user.CheckLoginStatus("../etalogin.html",function(){
    diabeticHealthTracker.sugarReadings.data.getTodayData(onInitData);
  });
});

function updateUnitType(){
    var label = "";
    if (diabeticHealthTracker.sugarReadings.data.unitType ==1){
        label = "mmol/L";
        diabeticHealthTracker.sugarReadings.unitTypeLabelHba1c = "mmol/mol";
    } 
    diabeticHealthTracker.sugarReadings.unitTypeLabel = label;
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
  if(!eta.user.valid()) return;
  var currentValue = stringToFloat($("#reading-value").val());
  if(currentValue!=0){
    diabeticHealthTracker.sugarReadings.data.addReading(currentValue);      
  }

}
function onMessageFailed(queryResult){
    $("#btnGO").enable();
     displayalert("ERROR: "+queryResult.Message);
    if(!eta.user.valid()) {
        resetDataAndGUI();
        return;
    }
}

var SugarReadingsAppData = {};

function clearSugarValue(){$("#reading-value").val(null)};

function updateGUI(rowSets){
    SugarReadingsAppData.SettingsCreated = false;
    
    var history = eta.utils.RowsByName("RecentReadings", rowSets);
    var hba1c = eta.utils.resultByName("hba1c", rowSets).hba1c;
    var todayTotal = 0;
    var todayStr = new Date().toLocaleDateString();
    var historyHtml = "";
    var todayMin = 0;
    var todayCount = 0;
    var todayMax = 0;
    var headerDate ="";
    if(history)
    {
        $('#history-rows').jsGrid({
            width:"100%",
            inserting:false,
            editing:false,
            sorting:true,
            paging:false,
            rowClass:function(item, itemIndex){
                return getTimeBasedAlternateRowClass(item, itemIndex, 'TimeTaken', this.data);

            },
                data:history.data,
            fields:[
                {name:"TimeTaken",title:"Date", type:"date"},
                {name:"TimeTaken", title:"Time", type:"time"},
                
                {name:"Amount",title:"Amount", type:"number"}
            ]   
          });

        history.data.forEach(function(item){ 
            var d = new Date(item.TimeTaken);
            var dateStr = d.toLocaleDateString();
            if(dateStr==todayStr){
              todayCount++;
              todayTotal+=item.Amount;
              if (item.Amount < todayMin || todayMin == 0) todayMin = item.Amount;
              if (item.Amount > todayMax) todayMax = item.Amount;
            }
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
    updateUnitType();

    $('#summary-rows').jsGrid({
        width:"100%",
        inserting:false,
        editing:false,
        sorting:false,
        paging:false  ,
        heading:false,
    data:[
             {information:"Today",Amount:SugarReadingsAppData.todayTotal,label:"readings"}
            ,{information:"Your Low",Amount:SugarReadingsAppData.todayMin,label:diabeticHealthTracker.sugarReadings.unitTypeLabel}
            ,{information:"Your High",Amount:SugarReadingsAppData.todayMax,label:diabeticHealthTracker.sugarReadings.unitTypeLabel}
            ,{information:"Your Avg",Amount:diabeticHealthTracker.math.round2dp(SugarReadingsAppData.todayAvg),label:diabeticHealthTracker.sugarReadings.unitTypeLabel}
            ,{information:"IFCC HbA1c (3mth)",Amount:hba1c,label:diabeticHealthTracker.sugarReadings.unitTypeLabelHba1c}
        ],
        fields:[
            {name:"information",title:"Info", type:"text"},
            {name:"Amount",title:"Amount", type:"number", width:"60px"},
            {name:"label", title:"", type:"text", width:"60px"}
            
        ]   
      });


    


    $('#history-rows').jsGrid({
        width:"100%",
        inserting:false,
        editing:false,
        sorting:true,
        paging:false,
        rowClass:function(item, itemIndex){
            return getTimeBasedAlternateRowClass(item, itemIndex, 'TimeTaken', this.data);

        },
            data:history.data,
        fields:[
            {name:"TimeTaken",title:"Date", type:"date"},
            {name:"TimeTaken", title:"Time", type:"time"},
            
            {name:"Amount",title:"Amount", type:"number"}
        ]   
      });


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
    if(!eta.user.valid()) {
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
    
