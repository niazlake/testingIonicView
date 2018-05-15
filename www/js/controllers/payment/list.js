paymentListCtrl.$inject = [
  '$scope',
  '$ionicHistory',
  'order',
  'payment'
];

function paymentListCtrl(
  $scope,
  $ionicHistory,
  order,
  payment
) {
  console.log('run paymentListCtrl');

  payment.setCallback('list', function(data) {
    $scope.list = data;
  });
  $scope.selectPayment = function(_payment) {
    console.log(_payment);
    var history = $ionicHistory.viewHistory();
    if (history.backView == null)
      return false;
    if (history.backView.stateName === 'menu.order-review-payment') {
      order.setOption('payment', {
        id: 1,
        icon: "icon-payment-1",
        hash: _payment.id,
        name: _payment.mask
      });
      console.log('order', order.getOrder() );
      order.reflashTotal();
      $ionicHistory.goBack(-2);
    }
  };
  $scope.addPayment = function() {
    payment.addPayment();
  };
  $scope.removePayment = function(id) {
    payment.removePayment(id);
  };
};