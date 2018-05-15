initFact.$inject = [
  '$translate',
  '$filter',
  '$rootScope',
  '$state',
  '$ionicHistory',
  '$cordovaGeolocation',
  '$ionicLoading',
  '$cordovaProgress',
  '$cordovaDialogs',
  '$ionicPopup',
  '$timeout',
  '$interval',
  'api',
  'order',
  'map',
  'history'
];

function initFact(
  $translate,
  $filter,
  $rootScope,
  $state,
  $ionicHistory,
  $cordovaGeolocation,
  $ionicLoading,
  $cordovaProgress,
  $cordovaDialogs,
  $ionicPopup,
  $timeout,
  $interval,
  api,
  order,
  map,
  history
) {
  var config;
  var currentTimestamp = null;
  var currentState = {};
  var titleLoader = $filter('translate')('loading');

  /**
   * Function open active history order
   */
  var goToRoot = function() {
    $state.go('menu.order');
    return false;
    /**
     * Function transform date to timestamp
     * @param {String} date date format "mm.dd.yyyy"
     * @return {Number} timestamp
    */

    function dateToTimestamp(date) {
      var myDate = date.split(".");
      var newDate = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
      return +(new Date(newDate).getTime());
    };
    api.getHistoryList(function(response) {
      var list = response.data.data.items;
      var chosen = list.filter(function(item) {
        var currentStatus = item.state.id;
        var avalibleStatus = [8, 9, 10, 14];
        return avalibleStatus.every(function(status) {
          return status !== currentStatus;
        });
      }).sort(function(a, b) {
        var prev = dateToTimestamp(a.date);
        var next = dateToTimestamp(b.date);
        return next - prev;
      })[0];
      history.setModel(list);
      if (typeof chosen === 'undefined') {
        $state.go('menu.order');
      } else {
        api.getHistoryItem(chosen.id, function(res) {
          history.setModel(res.data.data);
          history.setState({'id': chosen.id});
          //history.render();
          $state.go('menu.order').then(function() {
            $ionicHistory.nextViewOptions({ disableAnimate: true });
            setTimeout(function() {
              $state.go('menu.history').then(function() {
                $ionicHistory.nextViewOptions({ disableAnimate: true });
                $state.go('menu.history-item').then(function() {
                  $ionicHistory.nextViewOptions({ disableAnimate: true });
                  $state.go('menu.history-map');
                });
              });
            }, 500);
          });
        }, function(error) { $state.go('menu.order') });
      }
    }, function(error) { $state.go('menu.order') });

  };

  var processLognPull = function(last) {
    api.longPool(last, function(success) {
      $translate([
        'car_drove_up',
        'order_executed',
        'to_pay',
        'rate_order',
        'order',
        'estimate',
        'enter_code_paymen',
        'confirmation',
        'sms_code'
      ]).then(function(T) {
        var order = success.data.data.commands.order;//.order;
        var message = success.data.data.commands.message;
        if ( !angular.isUndefined(order) ) {
          var currentId = history.getState().id;
          var _model = [];

          for (id in order) {
            order[id].id = +id;
            var item = order[id];
            _model.push(item);

            if (currentState[id] != item.state.id)
              switch (item.state.id) {
                case 3:
                  cordova.plugins.notification.local.schedule({
                    id: id,
                    title: T.car_drove_up,
                    text: item.driver.model,
                    at: new Date(new Date().getTime() + 5*1000)
                  });
                  break;
                case 14:
                  $cordovaDialogs
                    .confirm(T.order_executed + '\n' + T.to_pay + item.summary + T.rate_order, T.order + ' #' + item.id, [T.estimate])
                    .then(function(index) {
                      if (index === 1)
                        $state.go('menu.history-rating');
                      else
                        $state.go('menu.order');
                    });
                  break;
              }
            if ( (currentId == id) && !angular.isUndefined(item.driver) ) {
              var car = {
                lat: item.driver.lat,
                lng: item.driver.lng
              };
              map.setCar(car);
            }
            currentState[id] = item.state.id;
          };
          history.setModel(_model);
        }
        if ( !angular.isUndefined(message) ) {
          message.forEach(function(item) {
            if (item.type === 'bisys') {
              if (item.meta.type === 'sms')
                $cordovaDialogs.prompt(T.enter_code_paymen, T.confirmation, ['ОК'], T.sms_code)
                  .then(function(result) {
                    var code = result.input1;
                    var btnIndex = result.buttonIndex;
                    if (btnIndex === 1)
                      api.confirmPayment(item.meta.id, code);
                  });
            }
          });
        }
        currentTimestamp = success.data.data.last;
        processLognPull(currentTimestamp);
      });
    }, function(error) {
      if (error.status === 500 || error.status === 504)
        processLognPull(currentTimestamp);
      else
        $timeout(function() { processLognPull(currentTimestamp)} , 5000 );
    });
  };

  var load = function() {
    // api.getOther(function(response) {

    //   response.data.data.items.forEach(function(item) {
    //     item.checked = false;
    //   });
    //   order.setOption('other', response.data.data.items);

      api.getClass(function(response) {
        order.setOptionsList('class', response.data.data.items);
        if (response.data.data.count != 0) {
          //response.data.data.items[0].icon = 'icon-class-0';
          response.data.data.items[0].icon = (typeof response.data.data.items[0].icon == 'undefined' || response.data.data.items[0].icon == 'null' || response.data.data.items[0].icon == null) ? './img/icons/class-0.png' : response.data.data.items[0].icon;

          order.setOption('class', response.data.data.items[0]);
        }
        api.getPayment(function(response) {
          var params;

          order.setOptionsList('payment', response.data.data.items);
          response.data.data.items[0].icon = 'icon-payment-0';
          order.setOption('payment', response.data.data.items[0]);

          $translate(['near_future']).then(function(t) {
            order.setOption('time', {
              'value': null,
              'name': t.near_future,
              'icon': 'icon-time-0'
            });
          });

          processLognPull(null);
          var tariffs = [
            {
              value: 1,
              name: 'Фиксированный',
              icon: 'icon-tariff-0'
            },
            {
              value: 2,
              name: 'Таксометр',
              icon: 'icon-tariff-1'
            }
          ];
          order.setOptionsList('tariff', tariffs);
          order.setOption('tariff', tariffs[0]);

          $cordovaGeolocation
            .getCurrentPosition({
              timeout: 5000,
              enableHighAccuracy: true
            })
            .then(function (position) {
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
              api.getAddressByGeo({
                lat: lat,
                lng: lng
              }, function(response) {
                console.log('response');
                console.log(response);

                var item = response.items;
                order.setPoint(0, {
                  id:      item.id,
                  address: item.address,
                  house:   item.house,
                  street:  item.street,
                  city:    item.city,
                  name:    item.name,
                  meta:    item.meta,
                  lat:     item.lat,
                  lng:     item.lng
                });
                $rootScope.city = {
                  name: item.city
                };
                $cordovaProgress.hide();
                $ionicHistory.nextViewOptions({
                  disableAnimate: false,
                  disableBack: true
                });
                goToRoot();
                //$state.go('menu.order');
              }, function(response) {
                $cordovaProgress.hide();
                $ionicHistory.nextViewOptions({
                  disableAnimate: false,
                  disableBack: true
                });
                goToRoot();
                //$state.go('menu.order');
              });
            }, function(error) {

              api.getGeoByIp(function(response) {
                $rootScope.city = {
                  name: response.data.data.name,
                  center: response.data.data.center
                };
                if (response.data.data.items === null)
                  $rootScope.city = {
                    name: 'Москва',
                    center: {
                      lat: 55.755826,
                      lng: 37.6173
                    }
                  };

                map.dataInit('menu.order', {
                  center: $rootScope.city.center,
                  objects: [
                    {
                      type: 'point',
                      coord: $rootScope.city.center
                    }
                  ]
                });
                //$state.go('menu.order');
              }, function() {
                $rootScope.city = {
                  name: 'Москва',
                  center: {
                    lat: 55.755826,
                    lng: 37.6173
                  }
                };
                map.dataInit('menu.order', {
                  center: $rootScope.city.center,
                  objects: [
                    {
                      type: 'point',
                      coord: $rootScope.city.center
                    }
                  ]
                });
                //$state.go('menu.order');
              });

              $cordovaProgress.hide();
              $translate([
                'turn_gps_set',
                'no_gps'
              ]).then(function(T) {
                $cordovaDialogs
                  .alert(T.turn_gps_set, T.no_gps, 'OK')
                  .then(function() {
                    $ionicHistory.nextViewOptions({
                      disableAnimate: false,
                      disableBack: true
                    });
                    goToRoot();
                    //$state.go('menu.order');
                  });
              });
            });
        }, function(error) { $timeout(function() { load() }, 5000); });
      }, function(error) { $timeout(function() { load() }, 5000); });
    //}, function(error) { $timeout(function() { load() }, 5000); });
  }

  var run = function() {
    var token = window.localStorage.getItem('token');
    var config = window.localStorage.getItem('config');
    console.log('CONFIG: ', config);
    $rootScope.configApp = angular.fromJson(config);

    if ( !(token === null || token == 'null' || token == '') ) {
      if (typeof $rootScope.configApp.extend.currency === 'undefined') {
        $rootScope.configApp.currency = 'руб';
      } else if (typeof $rootScope.configApp.extend.currency[$rootScope.lang] === 'undefined') {
        $rootScope.configApp.currency = $rootScope.configApp.extend.currency['ru'];
      } else {
        $rootScope.configApp.currency = $rootScope.configApp.extend.currency[$rootScope.lang];
      }
      titleLoader;
      var lang = localStorage.getItem('lang');

      if(lang === 'en'){
        titleLoader = 'Loading...'
      } else if(lang === 'ru'){
        titleLoader = 'Загрузка...'
      } else {
        titleLoader = 'Φορτωνει...'
      }

      $cordovaProgress.showSimpleWithLabel(true, titleLoader);
      load();
    } else {
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });
      $state.go(REGISTRATION);
    }
  };

  return {
    run: run
  };
}
