var cameraButtonClicked = false;
$(document).ready(function() {
    // we are putting a loading state on the app, and will take it away when the page is ready for 
    // data input. we need to clear these later;
    preparePageForLoad();  

    $('#upload').hide();
  
    // Trigger the Camera button to initiate a photo select direct from camera
    // by binding to the file input
    $(".photo-button").on("click", function() {
      cameraButtonClicked = true;
        $('.alert').hide();
        $('#upload').hide();
        $("#food-capture").trigger("click");
    });
  
    // Trigger Gallery selection
    $(".gallery-button").on("click", function() {
      cameraButtonClicked = true;
        $('.alert').hide();
        $('#upload').hide();
        $("#food-gallery-capture").trigger("click");
    });

    // Link the File Picker to the display image.
    eta.forms.bindImgToFilePicker(
      $('#food-capture'),
      $('#imgView') ,
       800,450,0.85);

    // link gallery picker to display image
    eta.forms.bindImgToFilePicker(
        $('#food-gallery-capture'),
        $('#imgView') ,
         800,450,0.85);
             
    // when the display image changes, prompt the user to upload the image if its good.
    document.getElementById("imgView").onload =function(){
      // cameraButtonClicked is false the first time so that we dont show the upload button
      // when loading the default image.
      if(cameraButtonClicked) $('#upload').show();
      
    };

    // perform the upload if everything is correct.
    $("#btnGo").click(postFoodReading);
  
    // verify we are logged in and do a preload of data
    eta.user.CheckLoginStatus("../etalogin.html", function() {
      diabeticHealthTracker.Food.data.GetRecentData().then(result=>{
        onInitData(result);
        pageLoadCompleted();
      
      }).catch(sendingError);
    });
  
  });
  
  function resetDataAndGUI() {
    $("#historyRows").html("");
  }
  
  
  function postFoodReading(item) {
    if (!eta.user.valid()) return;

    var msgArea = $('.msg-area');
    // no double clicks for now
    $('#upload').hide();

    sendingNow();
    // create a filename unique enough for this user.
    var dateNumStr= new Date().valueOf().toString();
    var foodFileName = 'food_'+dateNumStr;
    // file path generated based on developer account and project.
    var filePath= 'storage/a-10000/p-4/private/u-'+eta.user.Account.AccountNumber.toString()+'/food/'+foodFileName+'.jpg';
    
    eta.comms.putUserImg(filePath, $('#imgView')[0].src, true)
      .then(function(){
        return diabeticHealthTracker.Food.data.addFood(filePath);
      }).then((queryResult)=>{ 
          sendingComplete("Great, we have added your food entry");
          resetImg();
          onInitData(queryResult);
        })
      .catch(function(status, message)
      {
        // allow retry just incase real comms error
        $('#upload').show();
        sendingError(status, message);
      });
    


  }

  function resetImg(){
    cameraButtonClicked = false;
    document.getElementById("imgView").src = "./images/food.jpg";
  }
  function updateGUI(rowSets) {

    var history = eta.utils.rowsByName("RecentReadings", rowSets);
    var historyHtml = "";
    var id=0;
    if (history) {
      
      history.Rows.forEach(function(item) {
        id++;
        var d = new Date(item.TimeTaken);
        historyHtml +=
          '<div class="time-header"><label class="date-label">' +
          d.toLocaleDateString() +
          '</label><label class="time-label">' +
            d.toLocaleTimeString() +
        '</label></div><div class="img-preview"><img id="img_' + id.toString() + '" class="img-320240" src="' + diabeticHealthTracker.util.pictureToUrl(item.Picture) + '" alt="" /></div>';
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
      updateGUI(queryResult.Data.Results);
    } else eta.forms.displayError(queryResult.Message);
  }

  function onFoodReadingPosted(queryResult) {
    if (!eta.user.valid()) {
      resetDataAndGUI();
      return;
    }
    if (queryResult.Success) {
      onInitData(queryResult);
      eta.forms.alertSuccess("msg","You're reading has been logged ");
    } else eta.forms.alertError(queryResult.Message);
  }
  

  // for local debugging
 //  eta.comms.settings.apidomain = "http://localhost:60775/";    




 


