orderCtrl.$inject = [
  '$filter',
  '$translate',
  '$timeout',
  '$scope',
  '$state',
  '$timeout',
  '$cordovaGeolocation',
  '$cordovaDialogs',
  '$rootScope',
  '$cordovaProgress',
  '$cordovaActionSheet',
  'order',
  'api',
  'map'
];

function orderCtrl(
  $filter,
  $translate,
  $timeout,
  $scope,
  $state,
  $timeout,
  $cordovaGeolocation,
  $cordovaDialogs,
  $rootScope,
  $cordovaProgress,
  $cordovaActionSheet,
  order,
  api,
  map
) {

  $rootScope.tempCity = null;
  var points = order.getOrder().points;
  $scope.points = points;
  var token = localStorage.getItem('access_Token');

  $translate('enter_code').then(function(text) {
    console.log(text);
  });

  var mapDiv = document.getElementById('map-order');
  setTimeout(function (){
    map.viewInit('menu.order', mapDiv);
  }, 2000);

  order.addCallback('orderCtrl', function(data) {
    $scope.points = data.points;
  });
  $scope.getAddressByGps = function() {
    $translate(['det_loc']).then(function(t) {
      $cordovaProgress.showSimpleWithLabel(true, t.det_loc)
      navigator.geolocation.getCurrentPosition(function(position){
        var
          lat = position.coords.latitude,
          lng = position.coords.longitude;

        $rootScope.location = {
          lat: lat,
          lng: lng
        };
        map.dataInit('menu.order', {
          center: {
            lat: lat,
            lng: lng
          },
          objects: [
            {
              type: 'point',
              coord: {
                lat: lat,
                lng: lng
              }
            }
          ]
        });
        map.render('menu.order');
        api.getAddressByGeo({
          lat: lat,
          lng: lng
        }, function(response) {
          $cordovaProgress.hide();
          var item = response.items;
          order.setPoint(0, {
            id:      item.id,
            address: item.address,
            house:   item.house,
            name:    item.name,
            street:  item.street,
            city:    item.city,
            lat:     item.lat,
            lng:     item.lng
          });
        }, function(response) {
          $cordovaProgress.hide();
        });
      }, function(error) {
        $cordovaProgress.hide();
        $cordovaDialogs.alert('Пожалуйста, включите GPS либо установите адрес вручную', 'Нет GPS - сигнала!', 'ОК');
      }, {
        timeout: 10000,
        maximumAge: Infinity,
        enableHighAccuracy: true
      });
    });
  };

  function calculate() {
    order.reflashTotal(function() {
      var isDetect = false;
      order.getOrder().points.forEach(function(point) {
        if (point.lat !== null)
          isDetect = true;
      });
      if (isDetect) {
        $state.go('menu.order-review');
      } else {
        $translate(['attention', 'first_point']).then(function(t) {
          $cordovaDialogs.alert(t.first_point, t.attention, 'ОК');
        });
      }
    }, function(error) {
      $cordovaDialogs.alert(error.data.message, 'Ошибка!', 'ОК');
    });
  };

  $scope.goReview = function() {
    // order.setOptionsList('tariff', response.data.data.items);
    // response.data.data.items[0].icon = 'icon-payment-0';
    // order.setOption('payment', response.data.data.items[0]);

    if ($rootScope.configApp.useExtendTariff) {
      var data = order.getApiData();
      api.getOther({
        tariff: data.tariff,
        gps: data.points[0].lat + ',' + data.points[0].lng
      }, function(success) {
        success.data.data.items.forEach(function(item) {
          item.checked = false;
        });
        order.setOption('other', success.data.data.items);
        calculate();
      });
    } else {
      var data = order.getApiData();
      api.getOther({
        tariff: data.tariff
      }, function(success) {
        success.data.data.items.forEach(function(item) {
          item.checked = false;
        });
        order.setOption('other', success.data.data.items);
        calculate();
      });
      calculate();
    }
  };
  $scope.goPoint = function(toggle, params) {
    var index = params.index;

    if (toggle) {
      order.setOrderForm({
        index: index,
        id: null,
        address: null,
        house: null,
        lat: null,
        lng: null,
        street: null,
        city: null,
        entrance: null,
        comment: null
      });
      order.runSearchCallback();
      $state.go('menu.order-search');
    } else {
      var point = order.getPoint(index);
      order.setOrderForm({
        index:    index,
        id:       point.id,
        address:  point.address,
        name:     point.name,
        house:    point.house,
        entrance: point.entrance,
        street:   point.street,
        city:     point.city,
        comment:  point.comment,
        lat:      point.lat,
        lng:      point.lng
      });
      order.runSearchCallback();
      $state.go('menu.order-search');
    }
  };
  $scope.addPoint = function() {
    order.addPoint();
  };
  $scope.removePoint = function(index) {
    order.removePoint(index);

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
        var road = success.data.data;
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
        map.render('menu.order');
      });
    } else {
      map.dataInit('menu.order', {
        center: {
          lat: pointArray[0].lat,
          lng: pointArray[0].lng
        },
        objects: [
          {
            type: 'point',
            coord: {
              lat: pointArray[0].lat,
              lng: pointArray[0].lng
            }
          }
        ]
      });
      map.render('menu.order');
    }
  };
};
