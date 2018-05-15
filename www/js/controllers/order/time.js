orderReviewTimeCtrl.$inject = ['$scope', '$state', '$ionicHistory', '$translate', 'order', 'api'];

function orderReviewTimeCtrl($scope, $state, $ionicHistory, $translate, order, api) {
  var type = 'time';
  $scope.type = 'time';
  $scope.title = '';

  $scope.icon = 'icon-time-0';
  $scope.options = order.getOrder().options;

  console.log('TIME : ', $scope.options[$scope.type])
  $scope.setOption = function(option, index) {
    console.log('OPTION TIME', option);
    option.icon = 'icon-' + type + '-' + 0;
    if (option.value === 0) {
      $state.go('menu.order-review-time-set');
    } else {
      order.setOption(type, option);
      order.reflashTotal();
      $ionicHistory.goBack();
    }
  };
  $translate(['select_time', 'near_future', 'select_date_time']).then(function(t) {
    $scope.title = t.select_date_time;
    $scope.options.time = [
      {
        value: null,
        name: t.near_future
      },
      {
        value: 0,
        name: t.select_time
      }
    ];
  });
};
