helpCtrl.$inject = ['$scope', '$sce', '$state', 'api'];

function helpCtrl($scope, $sce, $state, api) {
  api.getFaq(function(success) {
  	var items = [];
  	success.data.data.items.forEach(function(item) {
  		items.push({
  			question: item.question,
  			answer: $sce.trustAsHtml(item.answer)
  		})
  	})
    $scope.items = items; //success.data.data.items;
  });
  $scope.toggle = function(index) {
    $scope.items[index].active = !$scope.items[index].active;
  };
};