historyDriversCtrl.$inject = ['$scope', '$state', '$rootScope', '$cordovaDialogs', '$ionicHistory', '$translate', 'api', 'history'];

function historyDriversCtrl($scope, $state, $rootScope, $cordovaDialogs, $ionicHistory, $translate, api, history) {
  $scope.history = [];
  $scope.shows = {};
  history.setViewsCallback('drivers', function(data) {
    $scope.history = data;
  });
  history.render();

  $scope.current = $rootScope.configApp.currency;

  $scope.isShow = function(id) {
    if (typeof $scope.shows[id] === 'undefined') return false;
    return $scope.shows[id];
  };

  $scope.switchShow = function(id) {
    if (typeof $scope.shows[id] === 'undefined')
      $scope.shows[id] = true;
    else
      $scope.shows[id] = !$scope.shows[id];
  };

  $scope.cancel = function(driver) {

    var orderId = history.getState().id
    api.cancelDriver({
      orderId: orderId,
      driverId: driver.id
    }, function(res) {
      history.setModel({
        id: orderId,
        free_drivers: $scope.history.free_drivers.filter(function(drv) {
          return drv.id !== driver.id
        }),
        state: {
          id: res.state,
          name: res.message,
          terminal: 0
        }
      });
      history.render();
    }, function(err) {

    })
  };

  $scope.select = function(driver) {

    var orderId = history.getState().id
    api.chooseDriver({
      orderId: orderId,
      driverId: driver.id
    }, function(res) {
      history.setModel({
        id: orderId,
        select_driver: driver,
        state: {
          id: res.state,
          name: res.message,
          terminal: 0
        }
      });
      history.render();
      $ionicHistory.goBack();
    }, function(err) {

    })
  };
}