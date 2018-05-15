// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', [
  'ionic',
  'ngCordova',
  'ionic-datepicker',
  'ionic-timepicker',
  'ionic-ratings',
  'ui.mask',
  'app.factories',
  'app.controllers',
  'app.routes',
  'pascalprecht.translate',
  'ngOpenFB'
])

.run(function($ionicPlatform, $rootScope, $timeout, $state, $cordovaPushV5, $ionicHistory, $translate, order, map, history, api, $cordovaStatusbar, ngFB) {

  $ionicPlatform.ready(function() {

    ngFB.init({appId: '119137568957002'});

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
      if(typeof navigator.geolocation !== 'undefined')
        navigator.geolocation.getCurrentPosition(function(success){}, function(error){});
    }
    if(window.StatusBar) {
      StatusBar.backgroundColorByHexString('#d4cc0e');
      // $cordovaStatusbar.styleHex('#f3a40b');
    }

    // var appID = 524072784656757;
    // var version = "v2.0";
    // $cordovaFacebookProvider.browserInit(appID, version);

    if(typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(function(language) {
        var lang = ( (language.value).split("-")[0] === 'ru') ? 'ru' : 'en';
        $rootScope.lang = language.value.split("-")[0];
        $translate.use(lang).then(function(data) {
            console.log("SUCCESS -> " + data);
            localStorage.setItem('lang', data);
        }, function(error) {
            console.log("ERROR -> " + error);
        });
      }, null);
    }

  });

  $rootScope.$on('$stateChangeStart', function(event, toState){
    console.log(toState.name);
    switch (toState.name) {
      case 'menu.order-map':
        map.render('menu.order-map');
        break;

      case 'menu.order':
        map.render('menu.order');
        break;

      case 'menu.history-map':
        map.render('menu.history-map');
        break;
    }
  });

  var behaviorBackButton = function() {
    switch ($state.current.name) {
      case 'registration':
        break;
      case 'menu.order':
        break;
      default:
        $ionicHistory.goBack();
    }
  };
    $ionicPlatform.registerBackButtonAction(function() {
      behaviorBackButton();
    }, 500);
    $rootScope.$ionicGoBack = function() {
      behaviorBackButton();
    };
});
