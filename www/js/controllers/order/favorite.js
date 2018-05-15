orderFavoriteCtrl.$inject = [
  '$scope',
  '$state',
  '$cordovaDialogs',
  'favorite',
  'api',
  'order'
];

function orderFavoriteCtrl(
  $scope,
  $state,
  $cordovaDialogs,
  favorite,
  api,
  order
) {
  // if (favorite.getList().length === 0)
  api.getFavorite(function(success) {
    favorite.setList({
      items: success.data.data.items,
      callback: function(items) {
        $scope.favorites = items;
      }
    });
  });
  // else
  // favorite.setList({
  //   callback: function(items) {
  //     $scope.favorites = items;
  //   }
  // });

  $scope.selectFavorite = function(favorite) {
    if ($state.current.name == 'menu.favorite')
      return false;
    order.setOrderForm({
      id:       favorite.id_address,
      name:     favorite.address,
      address:  favorite.address,
      house:    favorite.house,
      lat:      favorite.lat,
      lng:      favorite.lng,
      type:     favorite.type,
      street:   favorite.street,
      entrance: favorite.entrance,
      comment:  favorite.comment
    });
    $state.go('menu.order-point');
  };
  $scope.removeFavorite = function(id) {
    $cordovaDialogs
      .confirm('Вы уверены что хотите удалить адрес?', 'Удалить?', ['Да', 'Нет'])
      .then(function(buttonIndex) {
        if (buttonIndex === 1) {
          api.removeFavorite(id, function(success) {
            favorite.removeItem(id);
          });
        }
      });
  };
  $scope.goCreateFavorite = function() {
    favorite.setForm({
      favorite_name: null,
      id: null,
      id_address: null,
      name: null,
      address: null,
      house: null,
      entrance: null,
      comment: null,
      street: null,
      lat: null,
      lng: null
    });
    $state.go('menu.order-favorite-create');
  };
};