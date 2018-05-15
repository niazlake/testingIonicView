orderPointCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$state',
  '$ionicHistory',
  '$cordovaDialogs',
  '$cordovaProgress',
  '$timeout',
  'order',
  'map',
  'api'
];

function orderPointCtrl(
  $rootScope,
  $scope,
  $state,
  $ionicHistory,
  $cordovaDialogs,
  $cordovaProgress,
  $timeout,
  order,
  map,
  api
) {
  $scope.form = {};
  $scope.visible = {
    name: false,
    house: true
  };
  order.setOrderForm({
    callback: function(form) {
      $scope.form = form;
    }
  });

  $scope.goSearch = function() {
    $state.go('menu.order-search');
  };

  $scope.clearLatLng = function() {
    $scope.form.lat = null;
    $scope.form.lng = null;
  };

  $scope.saveData = function() {
    var saveData = function() {
      // Begin | cached history for fast history list
      var detected = false;
      var histories = angular.fromJson( window.localStorage.getItem('history') );

      histories = histories === null ? [] : histories;

      histories.forEach(function(_item) {
        if ($scope.form.name === _item.name) {
          detected = true;
          return false;
        }
      });
      if (!detected) {
        var item = angular.copy($scope.form);
        item.index = undefined;
        histories.push(item);
      }
      if (!detected && histories.length > 6) histories.shift();
      window.localStorage.setItem('history', JSON.stringify(histories));
      // End
      var point = {
        id:       $scope.form.id,
        name:     $scope.form.name,
        address:  $scope.form.address,
        house:    $scope.form.house,
        entrance: $scope.form.entrance,
        lat:      $scope.form.lat,
        lng:      $scope.form.lng,
        street:   $scope.form.street,
        city:     $scope.form.city,
        comment:  $scope.form.comment
      };

      order.setPoint($scope.form.index, point);

      var pointArray = [];

      order.getOrder().points.forEach(function(point, index){
        if(!(point.lat == null || point.lng == null)){
          pointArray.push({
            lat: point.lat,
            lng: point.lng
          })
        }
      });

      if (pointArray.length > 1) {
        api.getRoute(pointArray, function(success){
          console.log('сторим роут!')
          var road = success.data.data;
          console.log(road);
          map.dataInit('menu.order', {
            bounds: [
              {
                lat: road.bound[0][0],
                lng: road.bound[0][1]
              },
              {
                lat: road.bound[1][0],
                lng: road.bound[1][1]
              }
            ],
            objects: [
              {
                type: 'point',
                coord: road.geometry[0]
              },
              {
                type: 'point',
                coord: road.geometry[road.geometry.length - 1]
              },
              {
                type: 'route',
                coords: road.geometry
              }
            ]
          });
          map.render();
          $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
          });
          $state.go('menu.order');
        });
      } else {
        map.dataInit('menu.order', {
          center: {
            lat: $scope.form.lat,
            lng: $scope.form.lng
          },
          objects: [
            {
              type: 'point',
              coord: {
                lat: $scope.form.lat,
                lng: $scope.form.lng
              }
            }
          ]
        });
        $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: true
        });
        $state.go('menu.order');
      }
    };

    if ($scope.form.lat === null && $scope.form.lng === null) {
      $cordovaProgress.showSimpleWithLabel(true, 'Сохранение...');
      var address = $scope.form.street + ' ' + $scope.form.house;
      var city = $rootScope.tempCity === null ? $rootScope.city.name : $rootScope.tempCity;
      api.getAddressesByName({
        query: address,
        city: city//$rootScope.city.name
      }, function(response) {
        $rootScope.tempCity = null;
        if (response.items.length > 0) {
          var meta = response.items[0].meta;

          api.getAddressesByName({
            city: $rootScope.city.name,
            query: address,
            meta: meta
          }, function(success){
            var data = success.items[0];

            order.setOrderForm({
              lat: data.lat,
              lng: data.lng
            });
            saveData();
            $cordovaProgress.hide();

          }, function(error) {
            $cordovaProgress.hide();
          });
        } else {
          $cordovaDialogs.alert('Данный адрес не поддерживается в системе', 'Внимание!', 'ОК');
        }
      });
    } else {
      saveData();
    }
  };
}
