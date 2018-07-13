$(document).ready(function() {
  ETA.Forms.onError = function(errorMsg){
      ETA.Forms.alertError('error', errorMsg);
  
  }
  Debug.logSpace = $("#log");
  localStorage.setItem(
    "eta_headerimgurl",
    "/web/healthjournal/images/HealthJournal.png"
  );
  localStorage.setItem("eta_headercolor", "antiquewhite");

  $(".app-header").css(
    "background-image",
    "url(" + localStorage.getItem("eta_headerimgurl") + ")"
  );
  $(".app-header").css(
    "background-color",
    localStorage.getItem("eta_headercolor")
  );
});

