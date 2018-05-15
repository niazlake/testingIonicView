historyMapCtrl.$inject = [
  '$ionicModal',
  '$rootScope',
  '$translate',
  '$filter',
  '$scope',
  '$cordovaDialogs',
  '$ionicHistory',
  '$state',
  'map',
  'history',
  'api'
];

function historyMapCtrl(
  $ionicModal,
  $rootScope,
  $translate,
  $filter,
  $scope,
  $cordovaDialogs,
  $ionicHistory,
  $state,
  map,
  history,
  api
) {
  var mapDiv = document.getElementById('map-history');
  var model = history.getCurrentModel();
  var params = {};
  $scope.status = false;
  $scope.driverTime = 0;
  $scope.hiddenTime = true;
  $scope.full = false;
  $scope.switch = function() {
    $scope.full = !$scope.full;
  };

  setTimeout(function () {
    $scope.status = true;
  }, 5000);

  $scope.call = function() {
    var phone;
    if ($scope.history.driver.phone === null)
      phone = window.localStorage.getItem('kopeechka.disp');
    else
      phone = $scope.history.driver.phone;
    console.log(phone);
    if (window.cordova)
      window.cordova.InAppBrowser.open('tel:' + phone, '_system');
  };

  $scope.cancelOrder = function() {
    $translate([
      'want_cancel_order',
      'cancellations',
      'cancel_by_driver',
      'yes',
      'no'
    ]).then(function(T) {
      $cordovaDialogs
        .confirm(T.want_cancel_order, T.cancellations, [T.yes, T.no])
        .then(function(buttonIndex) {
          if (buttonIndex === 1)
            api.cancelOrder(history.getState().id, function() {
              $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
              });
              var id = history.getState().id;
              history.setModel({
                id: id,
                state: {
                  id: 8,
                  name: T.cancel_by_driver,
                  terminal: 4
                }
              });
              history.render();
              $state.go('menu.history');
            });
        });
    });
  };

  if (!angular.isUndefined(model.route.bound)) {
    params.bounds = [
      {
        lat: model.route.bound[0][0],
        lng: model.route.bound[0][1]
      },
      {
        lat: model.route.bound[1][0],
        lng: model.route.bound[1][1]
      }
    ];
    params.objects = [
      {
        type: 'route',
        coords: model.route.geometry
      },
      {
        type: 'point',
        coord: {
          lat: model.points[0].lat,
          lng: model.points[0].lng
        }
      },
      {
        type: 'point',
        coord: {
          lat: model.route.to.lat,
          lng: model.route.to.lng
        }
      }
    ];
  } else {
    params.center = {
      lat: model.points[0].lat,
      lng: model.points[0].lng
    };
    params.objects = [
      {
        type: 'point',
        coord: {
          lat: model.points[0].lat,
          lng: model.points[0].lng
        }
      }
    ];
  }

  if (model.driver && model.driver.lat != null && model.driver.lng != null)
    params.objects.push({
      type: 'car',
      visible: true,
      coord: {
        lat: model.driver.lat,
        lng: model.driver.lng
      }
    });
  else
    params.objects.push({
      type: 'car',
      visible: false,
      coord: {
        lat: 0,
        lng: 0
      }
    });

  map.init('menu.history-map', mapDiv, params);

  $scope.states = {
    '0': $filter('translate')('driver_search'),
    '1': $filter('translate')('car_assigned'),
    '2': $filter('translate')('car_left'),
    '3': $filter('translate')('driver_waiting'),
    '4': false,
    '5': false,
    '8': $filter('translate')('cancel_order'),
    '9': false,
    '14': false,
    '15': false,
    '16': 'Ожидание ответа от водителя'
  };

  $scope.center = function() {
    map.setCenter();
  };

  $scope.goDrivers = function() {
    $state.go('menu.history-drivers');
  };

  // $ionicModal.fromTemplateUrl('templates/modals/select-driver.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // $scope.cancelDriver = function(driver) {
  //   console.log('cancelDriver')
  //   var orderId = history.getState().id
  //   api.cancelDriver({
  //     orderId: orderId,
  //     driverId: driver.id
  //   }, function(res) {
  //     history.setModel({
  //       id: orderId,
  //       free_drivers: $scope.history.free_drivers.filter(function(drv) {
  //         return drv.id !== driver.id
  //       }),
  //       state: {
  //         id: res.state,
  //         name: res.message,
  //         terminal: 0
  //       }
  //     });
  //     history.render();
  //     $scope.close();
  //   }, function(err) {

  //   })
  // };

  // $scope.selectDriver = function(driver) {
  //   console.log('selectDriver')
  //   var orderId = history.getState().id
  //   api.chooseDriver({
  //     orderId: orderId,
  //     driverId: driver.id
  //   }, function(res) {
  //     history.setModel({
  //       id: orderId,
  //       driver: driver,
  //       state: {
  //         id: res.state,
  //         name: res.message,
  //         terminal: 0
  //       }
  //     });
  //     history.render();
  //     $scope.close();
  //   }, function(err) {

  //   })
  // };

  $scope.presentModalDrivers = function() {
    $scope.modal.show();
  };

  $scope.close = function() {
    $scope.modal.hide();
  };

  history.setViewsCallback('map', function(data) {
    $scope.history = data;
  });
  history.render();
};
