orderReviewPaymentCtrl.$inject = [
  '$scope',
  '$state',
  '$ionicHistory',
  '$translate',
  'order',
  'api'
];

function orderReviewPaymentCtrl(
  $scope,
  $state,
  $ionicHistory,
  $translate,
  order,
  api
) {
  var type = 'payment';
  $scope.type = type;
  $scope.options = order.getOrder().options;

  $translate(['payment']).then(function(t) {
    $scope.title = t.payment;
  });

  $scope.setOption = function(option, index) {
    option.icon = 'icon-' + type + '-' + 0;
    console.log(option, index);
    if (index === 1) {
      $state.go('menu.payment');
    } else {
      order.setOption(type, option);
      order.reflashTotal();
      $ionicHistory.goBack();
    }
  };
}
