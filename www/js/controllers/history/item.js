historyItemCtrl.$inject = [
  '$translate',
  '$scope',
  '$rootScope',
  '$state',
  '$ionicHistory',
  '$cordovaDialogs',
  'history',
  'api'
];

function historyItemCtrl(
  $translate,
  $scope,
  $rootScope,
  $state,
  $ionicHistory,
  $cordovaDialogs,
  history,
  api
) {
  $scope.history = [];
  $scope.current = $rootScope.configApp.currency;

  $scope.goRating = function() {
    $state.go('menu.history-rating');
  };
  $scope.goMap = function() {
    $state.go('menu.history-map');
  };
  $scope.repeat = function() {
    $translate([
      'want_repeat_order',
      'repeat_order',
      'order_accepted',
      'yes',
      'no'
    ]).then(function(T) {
      $cordovaDialogs
        .confirm(T.want_repeat_order, T.repeat_order, [T.yes, T.no])
        .then(function(buttonIndex) {
          if (buttonIndex === 1) {
            var model = history.getCurrentModel();
            var data = {
              points: model.points,
              tariff: model.tariff.id,
              extend: model.extend
            };
            api.createOrder(data, function(response) {
              $cordovaDialogs
                .alert(T.order_accepted + response.data.data.id, T.accepted, 'OK')
                .then(function() {
                  api.getHistoryItem(response.data.data.id, function(_response) {
                    history.setModel(_response.data.data);
                    $ionicHistory.goBack();
                    $state.go('menu.history');
                    history.render('list');
                  });
                });
            });
          }
        });
    });
  };
  history.setViewsCallback('item', function(data) {
    $scope.history = data;
  });
  history.render();
};