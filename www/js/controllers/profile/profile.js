profileCtrl.$inject = ['$scope', '$state', 'profile', '$translate', '$rootScope'];

function profileCtrl($scope, $state, profile, $translate, $rootScope) {
  profile.init(function(data) {
    $scope.data = data;

  });

  $scope.lang = $rootScope.lang;
  $scope.setLanguage = function(lang){
    $translate.use(lang).then(function(data) {
        console.log("SUCCESS -> " + data);
        $rootScope.lang = data;
    }, function(error) {
        console.log("ERROR -> " + error);
    });
  }
};
