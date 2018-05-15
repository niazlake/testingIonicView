menuCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicSideMenuDelegate'];

function menuCtrl($scope, $rootScope, $state, $ionicSideMenuDelegate) {
  $scope.$watch(function() {
    return $ionicSideMenuDelegate.getOpenRatio();
  }, function(value) {
    var menu = document.getElementById('side-menu');
    menu.style.visibility = (value === -1) ? 'visible' : 'hidden';
  });

  // $scope.showPayment = $rootScope.configApp.cardPay;

  $scope.exitApp = function() {
    var isAndroid = ionic.Platform.isAndroid();
    window.localStorage.setItem('token', null);
    window.localStorage.setItem('name', '');
    window.localStorage.setItem('phone', null);
    if (isAndroid) {
      ionic.Platform.exitApp();
      window.close();
    } else {
      $state.go('registration');
    }
  };

  $scope.goToOrder = function () {
    return $state.go('menu.order', {reload: true});
  }
};
