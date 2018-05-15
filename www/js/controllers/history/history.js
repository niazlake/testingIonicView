historyCtrl.$inject = ['$scope', '$rootScope', '$state', '$cordovaDialogs', '$translate', 'api', 'history'];

function historyCtrl($scope, $rootScope, $state, $cordovaDialogs, $translate, api, history) {
  console.log('====== init historyCtrl ======');

  $scope.currentHistory = [];
  $scope.pastHistory = [];

  $scope.current = $rootScope.configApp.currency;

  api.getHistoryList(function(response) {
    var view = 'list';
    // check model is loading
    history.setModel(response.data.data.items);
    history.setViewsCallback(view, function(data) {
      var
        currentHistory = [],
        pastHistory = [];
      console.log('RESPONSE', data);
      // filter data
      data.forEach(function(item, index) {
        if (item.state.id ==  8 || item.state.id == 10 || item.state.id == 13 || item.state.id == 14)
          pastHistory.push(item);
        else
          currentHistory.push(item);
      });
      // set view data
      $scope.currentHistory = currentHistory;
      $scope.pastHistory = pastHistory;
    });
    history.render(view);
  });

  $scope.goItem = function(id) {
    api.getHistoryItem(id, function(response) {
      history.setModel(response.data.data);
      history.setState({'id': id});
      history.render();
      $state.go('menu.history-item');
    });
  };

  $scope.clear = function() {
    $translate(['want_delete_story', 'attention', 'yes', 'no']).then(
      function(translate) {
        $cordovaDialogs
          .confirm(translate.want_delete_story, translate.attention, [translate.yes, translate.no])
          .then(function(buttonIndex) {
            if (buttonIndex === 1) {
              var arr = [];
              console.log('CURRENT HISTORY', $scope.currentHistory);
              $scope.currentHistory.forEach(function (item, index) {
                if (item.state.id ==  8 || item.state.id == 10 || item.state.id == 13 || item.state.id == 14){
                  arr.push(item)
                }
              });

              if(arr.length > 0){
                api.clearHistory(function(success) {
                  history.clearModel();
                  history.render();
                  $scope.currentHistory = [];
                  $scope.pastHistory = [];
                });
              }else {
                $translate(['attention', 'remove_addresses']).then(function(t) {
                  $cordovaDialogs.alert(t.remove_addresses, t.attention, 'ОК');
                });
              }
            }
          });
      });
  };

  $scope.goRating = function(id) {
    api.getHistoryItem(id, function(response) {
      history.setModel(response.data.data);
      history.setState({'id': id});
      $state.go('menu.history-rating');
    });
  };

};
