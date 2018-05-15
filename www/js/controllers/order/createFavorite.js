orderCreateFavoriteCtrl.$inject = [
  '$scope',
  '$state',
  '$rootScope',
  '$ionicHistory',
  'api',
  'favorite'
];

function orderCreateFavoriteCtrl(
  $scope,
  $state,
  $rootScope,
  $ionicHistory,
  api,
  favorite
) {

  $scope.visible = {
    name: true,
    house: true
  };

  favorite.setForm({
    callback: function(form) {
      $scope.form = form;
    }
  });

  $scope.clearLatLng = function() {
    $scope.form.lat = null;
    $scope.form.lng = null;
  };

  $scope.saveData = function() {

    if ($scope.form.lat === null && $scope.form.lng === null) {
      var address = $scope.form.street + ' ' + $scope.form.house;
      api.getAddressesByName({ 
        query: address,
        city: $rootScope.city.name
      }, function(response) {

        if (response.items.length > 0) {
          var meta = response.items[0].meta;

          api.getAddressesByName({
            city: $rootScope.city.name,
            query: address,
            meta: meta
          }, function(success){
            var data = success.items[0];

            api.createFavorite({
              name:       $scope.form.favorite_name,
              id_address: $scope.form.id_address,
              comment:    $scope.form.comment,
              entrance:   $scope.form.entrance,
              address:    data.address,
              street:     data.street,
              house:      data.house,
              lat:        data.lat,
              lng:        data.lng
            }, function(_success) {
              favorite.setList({
                item: _success.data.data
              });
              $ionicHistory.goBack();
            });

          });
        } else {
          $cordovaDialogs.alert('Данный адрес не поддерживается в системе', 'Внимание!', 'ОК');
        }
      });
    } else {
      api.createFavorite({
        name:       $scope.form.favorite_name,
        address:    $scope.form.address,
        id_address: $scope.form.id_address,
        comment:    $scope.form.comment,
        entrance:   $scope.form.entrance,
        street:     $scope.form.street,
        house:      $scope.form.house,
        lat:        $scope.form.lat,
        lng:        $scope.form.lng
      }, function(success) {
        favorite.setList({
          item: success.data.data
        });
        $ionicHistory.goBack();
      });
    }

  };

  $scope.goSearch = function() {
    $state.go('menu.order-favorite-search');
  };

};