loginCtrl.$inject = [
  '$scope',
  '$state',
  '$ionicPopup',
  '$translate',
  'api',
  'init'
];

function loginCtrl(
  $scope,
  $state,
  $ionicPopup,
  $translate,
  api,
  init
) {
  $scope.offer = OFFER;

  $scope.openOffer = function() {
    window.cordova.InAppBrowser.open(OFFER.link, '_system');
  };

  $scope.confirmPhone = function(code) {
    var phone = window.localStorage.getItem('phone');
    if (phone) $scope.phone = phone;

    if (angular.isUndefined(phone) || angular.isUndefined(code))
      return false;
    $translate(['incorrect_sms']).then(function(translate) {
      api.confirm({
        login: phone,
        code: code
      }, function(success) {
        var json = angular.toJson(success.data.data);
        window.localStorage.setItem('config', json);
        window.localStorage.setItem('kopeechka.disp', success.data.data.dispatcher);
        console.log("DISPATCHER : ", success.data.data.dispatcher);
        $state.go('menu.order', {reload: true});
        init.run();
      }, function(error) {
        $ionicPopup.alert({
          cssClass: 'custom-popup',
          template: '<i class="icon ion-close-circled"></i>'+
          '<div class="text">'+
            translate.incorrect_sms+
          '</div>',
        });
      });
    });
  }

};
