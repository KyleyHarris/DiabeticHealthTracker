$(document).ready(function() {

  // ETA Root folder is a special feature we set up that allows the javascript and 
  // html for the site to work either on a specific hosted domain
  // eg www.DiabeticHealthTracker.com
  // or in the fully functioning test site as a sub web link of Enter The Api
  // using the Public Name of the API project
  eta.rootFolder = "" ;
  if (window.location.hostname.toLowerCase() == 'entertheapi.azurewebsites.net')
  {
    eta.rootFolder = '/web/diabetichealthtracker'
  }
  
  // This lets the generic login page know where to come back to
  localStorage.setItem('eta_homepage',eta.rootFolder +'/index.htm');

  // Any page of the app which wants to divide its page into a working section and settings 
  // page can be setup here with page switching
  $('.settings-click').click(function(){
    $(".main-section").hide();
    $(".settings-section").show();
  })

  // setup a default error handler for the app to display erros in a Div section
  // id="error"
  eta.forms.onError = function(errorMsg){
      eta.forms.alertError('error', errorMsg);
  }

  // any debug logging will be output to this element with $().append()
  debug.logSpace = $("#log");
  
  // setup the banner image which will be used by the generic login page 
  // and each page of the web app and micro apps.
  localStorage.setItem(
    "eta_headerimgurl",
    eta.rootFolder+"/images/diabeticHealthTracker.png"
  );
  localStorage.setItem("eta_headercolor", "antiquewhite");

  // bind the image and colors.
  $(".app-header").css(
    "background-image",
    "url(" + localStorage.getItem("eta_headerimgurl") + ")"
  );
  $(".app-header").css(
    "background-color",
    localStorage.getItem("eta_headercolor")
  );
});

