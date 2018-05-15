profilePhoneCtrl.$inject = ['$scope', '$state', 'profile'];

function profilePhoneCtrl($scope, $state, profile) {
  $scope.form = {};
  $scope.save = function() {
    profile.sendSms($scope.form.phone, function() {

    }, function() {

    });
  };
};