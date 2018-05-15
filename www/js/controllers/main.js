mainCtrl.$inject = ['$ionicPlatform', 'init'];

function mainCtrl($ionicPlatform, init) {
  $ionicPlatform.ready(function() {
    //setTimeout( function() {
      init.run();
    //}, 10000);
  });
};
