angular.module('app.controllers', [])
  .controller('greetingCtrl', greetingCtrl)
  .controller('mainCtrl', mainCtrl)
  .controller('menuCtrl', menuCtrl)
  .controller('registrationCtrl', registrationCtrl)
  .controller('loginCtrl', loginCtrl)
  .controller('orderCtrl', orderCtrl)
  .controller('orderSearchCtrl', orderSearchCtrl)
  .controller('orderPointCtrl', orderPointCtrl)
  .controller('orderMapCtrl', orderMapCtrl)
  .controller('orderFavoriteCtrl', orderFavoriteCtrl)
  .controller('orderCreateFavoriteCtrl', orderCreateFavoriteCtrl)
  .controller('orderSearchFavoriteCtrl', orderSearchCtrl)
  .controller('orderReviewCtrl', orderReviewCtrl)
  .controller('orderReviewClassCtrl', orderReviewClassCtrl)
  .controller('orderReviewTariffCtrl', orderReviewTariffCtrl)
  .controller('orderReviewTimeCtrl', orderReviewTimeCtrl)
  .controller('orderReviewSetTimeCtrl', orderReviewSetTimeCtrl)
  .controller('orderReviewOtherCtrl', orderReviewOtherCtrl)
  .controller('orderReviewPaymentCtrl', orderReviewPaymentCtrl)
  .controller('historyCtrl', historyCtrl)
  .controller('historyItemCtrl', historyItemCtrl)
  .controller('historyRatingCtrl', historyRatingCtrl)
  .controller('historyMapCtrl', historyMapCtrl)
  .controller('historyDriversCtrl', historyDriversCtrl)
  .controller('profileCtrl', profileCtrl)
  .controller('profileNameCtrl', profileNameCtrl)
  .controller('profilePhoneCtrl', profilePhoneCtrl)
  .controller('helpCtrl', helpCtrl)
  .controller('paymentListCtrl', paymentListCtrl)
  .filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
        '<b>$1</b>')

      return $sce.trustAsHtml(text)
    }
  })
  .directive('focusMe', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        var focus = function () {
          element[0].focus();
          if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.show(); //open keyboard manually
          }
        };
        scope.$on('viewLoaded', function () {
          console.log('View is loaded.');
          focus();
        });
      }
    };
  })
  // .directive('focusMe', function ($timeout) {
  //   return {
  //     link: function (scope, element, attrs) {
  //       if (attrs.focusMeDisable === "true") {
  //         return;
  //       }
  //       $timeout(function () {
  //         element[0].focus();
  //         if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
  //           cordova.plugins.Keyboard.show(); //open keyboard manually
  //         }
  //       }, 350);
  //     }
  //   };
  // })
  .directive('stars', function() {
    return {
      restrict: 'E',
      scope: {
        rate: '=',
        status: '='
      },
      link: function(scope, element) {
        var html = '';
        for (var i = 0; i < 5; i++) {
          if (scope.rate > i)
            html += '<i class="icon ion-android-star active"></i>';
          else
            html += '<i class="icon ion-android-star"></i>';
        }
        element.append(angular.element('<div>' + html + '</div>'));
      }
    };
  });

