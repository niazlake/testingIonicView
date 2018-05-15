orderReviewCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$state',
  '$rootScope',
  '$ionicHistory',
  '$ionicPopup',
  '$cordovaDialogs',
  'order',
  'api',
  'history',
  'map'
];

function orderReviewCtrl(
  $rootScope,
  $scope,
  $state,
  $rootScope,
  $ionicHistory,
  $ionicPopup,
  $cordovaDialogs,
  order,
  api,
  history,
  map
) {
  console.log('=== run orderReviewCtrl ===');
  $scope.form = {};
  $scope.showOfferPrice = false;
  $scope.isOfferPrice = $rootScope.configApp.isOfferPrice;
  console.log("Config App",$rootScope.configApp);
  $scope.showPayment = $rootScope.configApp.cardPay;
  $scope.showTariff = (typeof $rootScope.configApp.extend.calc_format !== 'undefined') ? $rootScope.configApp.extend.calc_format : false;
  console.log('OPTIONS', order.getOrder().options);
  $scope.options = order.getOrder().options;
  $scope.isOther = true;//(order.getOrder().options.other.length === 0) ? false : true;
  var points = [];
  order.getOrder().points.forEach(function(item) {
    if (item.lat !== null)
      points.push(item);
  });
  $scope.points = points;
  $scope.total = order.getTotal();

  $scope.switchShowPrice = function() { $scope.showOfferPrice = !$scope.showOfferPrice };

  order.setTotalCallback(function(total) {
    $scope.total = total;
  });

  $scope.link = function(route) {
    $state.go(route);
  };

  $scope.current = $rootScope.configApp.currency;

  $scope.createOrder = function() {

    //if ($scope.isOfferPrice && $scope.showOfferPrice)

    var data = order.getApiData();
    data.date = new Date(data.date);
    console.log('CREATE DATA: ', data);
    if ($scope.showOfferPrice) data.offer_price = $scope.form.offerPrice;
    api.createOrder(data, function(response) {
      console.log('CREATE RESPONSE: ', response);
      var id = response.data.data.id;

      // $ionicHistory.nextViewOptions({
      //   disableAnimate: false,
      //   disableBack: true
      // });
      // $cordovaDialogs
      // .confirm("Спасибо ваша заявка принята!", "Принято!", ["Далее"])
      //   .then(function(buttonIndex) {
      order.clearPoints();
      api.getHistoryList(function(res) {
        var list = res.data.data.items;
        history.setModel(list);
        api.getHistoryItem(response.data.data.id, function(_response) {
          var model = _response.data.data;
          var params = map.getParamsByModel(model);

          history.setModel(model);
          history.setState({'id': id});
          history.render();

          map.dataInit('menu.history-map', params);
          //$state.go('menu.history-map');
          $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });
          $state.go('menu.history').then(function() {
            $ionicHistory.nextViewOptions({ disableAnimate: true });
            $state.go('menu.history-item').then(function() {
              $ionicHistory.nextViewOptions({ disableAnimate: true });
              $state.go('menu.history-map');
            });
          });
        });
      });
      //});
    }, function(error) {
      $cordovaDialogs.alert(error.data.message, 'Ошибка!', 'ОК');
    });
  };

  order.addCallback('orderReviewCtrl', function(data) {
    console.log('post review data: ', data);
    console.log('OPTIONS', data);
    $scope.options = data.options;
    var points = [];
    // order.getOrder().points.forEach(function(item) {
    //   if (item.geo !== null)
    //     points.push(item);
    // });
    data.points.forEach(function(item) {
      if (item.address !== null) points.push(item);
    });
    $scope.points = points;
  });

};
