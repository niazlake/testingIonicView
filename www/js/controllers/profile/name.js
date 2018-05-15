profileNameCtrl.$inject = ['$scope', '$state', 'profile'];

function profileNameCtrl($scope, $state, profile) {
  $scope.form = {};
  
  $scope.save = function() {
    profile.changeName($scope.form.name);
  };
};