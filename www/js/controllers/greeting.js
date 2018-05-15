greetingCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$state',
  '$ionicPopup',
  '$cordovaDevice',
  '$cordovaDialogs',
  'api',
  '$translate',
  '$ionicSlideBoxDelegate',
  'init'
];

function greetingCtrl (
  $scope,
  $rootScope,
  $state,
  $ionicPopup,
  $cordovaDevice,
  $cordovaDialogs,
  api,
  $translate,
  $ionicSlideBoxDelegate,
  init) {

  init.run();
  $scope.slideIndex;
  console.log('GreetingCtrl');


  $scope.slideChanged = function(event) {
    alert(event);
    $scope.slideIndex = index;
  };

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
    if($scope.slideIndex === 3){
      alert(true);
    }
  };

  $scope.options = {
    loop: false
  };

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log('Slide change is beginning');
  });

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    // note: the indexes are 0-based
    $scope.activeIndex = data.slider.activeIndex;
    console.log($scope.activeIndex);
    $scope.previousIndex = data.slider.previousIndex;
    if($scope.activeIndex === 3){
      localStorage.setItem('index', JSON.stringify($scope.activeIndex));
      console.log(true);
      $state.go('registration');
    }
  });

}
