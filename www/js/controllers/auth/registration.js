registrationCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$state',
  '$ionicPopup',
  '$cordovaDevice',
  '$cordovaDialogs',
  'api',
  '$translate',
  'ngFB'
];

function registrationCtrl(
  $scope,
  $rootScope,
  $state,
  $ionicPopup,
  $cordovaDevice,
  $cordovaDialogs,
  api,
  $translate,
  ngFB

) {

  var
    phone = window.localStorage.getItem('phone'),
    name = window.localStorage.getItem('name');
    console.log(name);
    // $scope.isFB = false;
    // $scope.showFB = true;
    // $scope.showName = true;

  if (name) {
    $scope.name = name;
    $scope.showName = false;
    // $scope.showFB = false;

  } else {
    $scope.showName = true;
    // $scope.showFB = true;
  }
  //$scope.showName = true;
  if (phone) {
    $scope.phone = phone;
  }

  $scope.selectInitLang = function(lang){
    $translate.use(lang).then(function(data) {
      console.log("SUCCESS -> " + data);
      $rootScope.lang = data;
    }, function(error) {
      console.log("ERROR -> " + error);
    });
  }

  $scope.registration = function(login, name) {
    var
      platform = 'Android'//$cordovaDevice.getPlatform(),
      uuid = "aadsdsd2323"//$cordovaDevice.getUUID(),
      os = 0;

    switch(platform) {
      case 'Android':
        os = 2;
        break;
      case 'iOS':
        os = 1;
        break;
    }

    // if($scope.isFB){
    //   name = localStorage.getItem('name');
    // }else {
    //
    //   localStorage.setItem('name', name);
    //   console.log(name);
    //
    // }

    if (angular.isUndefined(name)) {
      $cordovaDialogs.alert('Вы не указали свое имя', 'Error!', 'OK');
      return false;
    }

    api.registration({
      login: login,
      device: uuid,
      os: os,
      name: name
    }, function(response) {
      $scope.showName = false;
      $translate(['access_code_sent', 'sent']).then(function(translate) {
        $cordovaDialogs
          .alert(translate.access_code_sent, translate.sent, 'OK')
          .then(function() {
            $state.go('login');
          });
      });
    }, function(response) {
      $cordovaDialogs.alert(response.data.message, 'Error!', 'OK');//.then( $state.go('login') );
    });
  };

  // $scope.loginFromFacebook = function(){
  //
  //   console.log('ngFB', ngFB);
  //
  //   $scope.showName = false;
  //   $scope.isFB = true;
  //   $scope.showFB = false;
  //   ngFB.login(["public_profile", "email", "user_friends"]).then(
  //     function (response) {
  //       console.log('RESPONSE: ', response);
  //       if (response.status === 'connected') {
  //         console.log('Facebook login succeeded');
  //         console.log('AccessToken : ', response.authResponse.accessToken);
  //         localStorage.setItem('access_Token', response.authResponse.accessToken);
  //         ngFB.api({
  //           path: '/me',
  //           params: {fields: 'id,name'}
  //         }).then(
  //           function (user) {
  //             console.log(user);
  //             localStorage.setItem('name', user.name);
  //           },
  //           function (error) {
  //             console.log('Facebook error: ' + error);
  //           });
  //         // $state.go('menu.order');
  //       } else {
  //         console.log('Facebook login failed');
  //       }
  //     });
  // };

};
