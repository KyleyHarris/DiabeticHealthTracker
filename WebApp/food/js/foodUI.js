var cameraButtonClicked = false;
$(document).ready(function() {
    $('#upload').hide();
    HealthJournal.Food.Data.OnPageDataCallback = onFoodReadingPosted;
    HealthJournal.Food.Data.onMesssageFailed = onFoodReadingPosted;

    // Trigger the Camera button to initiate a photo select direct from camera
    // by binding to the file input
    $(".photo-button").on("click", function() {
      cameraButtonClicked = true;
        $('.alert').hide();
        $('#upload').hide();
        $("#food-capture").trigger("click");
    });
   
    // Link the File Picker to the display image.
    ETA.Forms.bindImgToFilePicker(
      $('#food-capture'),
      $('#imgView') ,
       800,450,0.85);
    
    // when the display image changes, prompt the user to upload the image if its good.
    document.getElementById("imgView").onload =function(){
      if(cameraButtonClicked)
      {
        ETA.Forms.alertSuccess('msg', 'Great, if this is the right pic, click add to upload');
        $('#upload').show();
      }
    };

    // perform the upload if everything is correct.
    $("#btnGo").click(postFoodReading);
    $("#reading-value").val(0);
    // will trigger an event back to the main form
  
  
    // verify we are logged in and do a preload of data
    ETA.User.CheckLoginStatus("/etalogin.html", function() {
      HealthJournal.Food.Data.GetRecentData(onInitData);
    });
  
  });
  
  function resetDataAndGUI() {
    $("#historyRows").html("");
  }
  
  
  function postFoodReading(item) {
    if (!ETA.User.valid()) return;

    // no double clicks for now
    $('#upload').hide();

    // create a filename unique enough for this user.
    var dateNumStr= new Date().valueOf().toString();
    var foodFileName = 'food_'+dateNumStr;
    // file path generated based on developer account and project.
    var filePath= 'storage/a-10000/p-4/private/u-'+ETA.User.Account.AccountNumber.toString()+'/food/'+foodFileName+'.jpg';
    
    ETA.Comms.putUserImg(filePath, $('#imgView')[0].src, true, function(statusCode){
      if(statusCode==200){
        ETA.Forms.alertSuccess("msg","Image Uploaded, now saving Entry");
        HealthJournal.Food.Data.AddFood(filePath);
      } else
      {
        // allow retry just incase real comms error
        $('#upload').show();
        ETA.Forms.alertError("msg","Could Not Save File. Status Code:" + statusCode.toString())
      }
    });


  }
  
  function updateGUI(rowSets) {

    var history = ETA.Utils.RowsByName("RecentReadings", rowSets);
    var historyHtml = "";
    var id=0;
    if (history) {
      
      history.data.forEach(function(item) {
        id++;
        var d = new Date(item.TimeTaken);
        historyHtml +=
          '<div><label class="date-label">' +
          d.toLocaleDateString() +
          '</label><label class="time-label">' +
          d.toLocaleTimeString() +
          '</label></div><img id="img_'+id.toString()+'" class="img-320240" src="'+ETA.Comms.Settings.apidomain+item.Picture+'?token='+encodeURIComponent(ETA.User.SessionToken)+'" alt="" />';
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
    } else ETA.Forms.displayError(queryResult.Message);
  }

  function onFoodReadingPosted(queryResult) {
    if (!ETA.User.valid()) {
      resetDataAndGUI();
      return;
    }
    if (queryResult.Success) {
      onInitData(queryResult);
      ETA.Forms.alertSuccess("msg","You're reading has been logged ");
    } else ETA.Forms.alertError(queryResult.Message);
  }
  

  // for local debugging
 //  ETA.Comms.Settings.apidomain = "http://localhost:60775/";    




 


