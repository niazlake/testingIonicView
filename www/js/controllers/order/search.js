orderSearchCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$ionicHistory',
  '$state',
  '$translate',
  'order',
  'api',
  'favorite',
  '$timeout',
  '$filter'
];

function orderSearchCtrl(
  $rootScope,
  $scope,
  $ionicHistory,
  $state,
  $translate,
  order,
  api,
  favorite,
  $timeout,
  $filter
) {
  console.log('=== init orderSearchCtrl ===');
  $scope.showButton = false;
  if ( $state.is('menu.order-search') ) {
    $scope.visible = {
      geo: true,
      favorite: true,
      history: true
    };
    var history = JSON.parse(window.localStorage.getItem('history'));
    $scope.histories = (history === null) ? [] : history;
  } else {
    $scope.visible = {
      geo: true,
      favorite: false,
      history: false
    };
  }
  $scope.address = {
    title: ''
  };
  $scope.items = [];
//  var elem = angular.element(document.getElementById('inputSearch'));
  
  // получение списка адрессов
  $scope.getAddress = function(address) {
    $scope.showButton = false;
    if (address.length > 2) {
      api.getAddressesByName({ 
        query: address,
        city: $rootScope.city.name
      }, function(response) {
        $scope.items = response.items;
      });
    } else {
      $scope.items = [];
    }
  };

  $scope.clearSearch = function() {
    $scope.getAddress('');
    $scope.address.title = '';
  };
  // очистка поиска
  // order.addCallback('orderSearchCtrl', function(data) {
  //   console.log('run need callback ', data);

  //   var history = JSON.parse(window.localStorage.getItem('history'));

  //   $scope.histories = (history === null) ? [] : history;
  //   $scope.address.title = '';
  //   $scope.items = [];
  // });

  order.setSearchCallback(function(query) {
    var history = JSON.parse( window.localStorage.getItem('history') );
    $scope.histories = (history === null) ? [] : history;
    $timeout(function() {
      if ( $state.is('menu.order-search') ) {
        $scope.address.title = query;
        $scope.getAddress(query);
      } else {
        $scope.address.title = '';
        $scope.items = [];
      }
    }, 150);
  });
  $scope.$on('$ionicView.afterEnter', function () {
    $scope.$broadcast('viewLoaded');
  });

  $scope.setAddress = function() {
    $scope.showButton = false;
    $state.go('menu.order-point');
  };
  $scope.goMap = function() {
    if ( $state.is('menu.order-search') )
      $state.go('menu.order-map');
    else
      $state.go('menu.order-favorite-map');

  };
  $scope.goFavorite = function() {
    $state.go('menu.order-favorite');
  };
  $scope.selectAddress = function(item, isHistory) {
    if (!isHistory) {
      api.getAddressesByName({
        city: $rootScope.city.name,
        query: item.name,
        meta: item.meta
      }, function(success){
        var data = success.items[0];
        var point = {
          id:          data.id,
          name:        data.name,
          address:     data.address,
          house:       data.house,
          need:        data.need,
          lat:         data.lat,
          lng:         data.lng,
          type:        data.type,
          description: data.description,
          city:        data.city,
          meta:        data.meta,
          entrance:    null,
          comment:     null
        };

        $rootScope.tempCity = data.city;
        
        point.street = (data.street === null) ? data.address : data.street;
        point.view_address = (data.street === null) ? true : false;
        if ( $state.is('menu.order-search') ) {
          order.setOrderForm(point);
          $state.go('menu.order-point');
        } else {
          point.id_address = data.id;
          favorite.setForm(point);
          $ionicHistory.goBack();
        }
      });
    } else {
      order.setOrderForm(item);
      $state.go('menu.order-point');
    }
  };
};