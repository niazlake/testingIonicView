orderMapCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$state',
  '$ionicHistory',
  '$cordovaProgress',
  '$cordovaDialogs',
  'order',
  'api',
  'map',
  'favorite'
];

function orderMapCtrl(
  $rootScope,
  $scope,
  $state,
  $ionicHistory,
  $cordovaProgress,
  $cordovaDialogs,
  order,
  api,
  map,
  favorite
) {
  var mapDiv = document.getElementById('map-point');
  if ( angular.isUndefined($rootScope.location) )
    map.init('menu.order-map', mapDiv, {
      center: $rootScope.city.center
    });
  else
    map.init('menu.order-map', mapDiv, {
      center: $rootScope.location
    });

  $scope.setPoint = function() {
    $cordovaProgress.showSimpleWithLabel(true, 'Определение адреса...');
    var currentMap = map.getMap('menu.order-map');
    // console.log(currentMap.getCameraPosition());
    var camera = currentMap.getCameraPosition();
    console.log(camera);

    api.getAddressByGeo({
      lat: camera.target.lat,
      lng: camera.target.lng
    }, function(response) {
      $cordovaProgress.hide();
      var item = response.items;
      if ( $state.is('menu.order-map') )
        order.setOrderForm({
          id:       item.id,
          address:  item.address,
          name:     item.name,
          house:    item.house,
          street:   item.street,
          city:     item.city,
          lat:      camera.target.lat,
          lng:      camera.target.lng,
          meta:     item.meta,
          entrance: null,
          comment:  null
        });
      else
        favorite.setForm({
          id_address: item.id,
          name:       item.name,
          address:    item.address,
          lat:        camera.target.lat,
          lng:        camera.target.lng,
          type:       item.type,
          street:     item.street,
          house:      item.house,
          city:       item.city,
          entrance:   null,
          comment:    null
        });
      if (item.street == null) {
        $cordovaDialogs.alert('Данный адрес не поддерживается в системе', 'Внимание!', 'ОК');
      } else {
        if ( $state.is('menu.order-map') )
          $state.go('menu.order-point')
        else
          $ionicHistory.goBack(-2);
      }
    }, function(response) {
      $cordovaProgress.hide();
    });
  }
};
