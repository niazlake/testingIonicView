angular.module('app.routes', [])
  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('main', {
        url: '/',
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl'
      })
      // .state('greeting', {
      //   url: '/greeting',
      //   templateUrl: 'templates/greeting.html',
      //   controller: 'greetingCtrl'
      // })
      .state('registration', {
        url: '/registration',
        templateUrl: 'templates/auth/registration.html',
        controller: 'registrationCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/auth/login.html',
        controller: 'loginCtrl'
      })
      .state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
      })
      .state('menu.order', {
        url: '/order',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/order.html',
            controller: 'orderCtrl'
          }
        }
      })
      .state('menu.order-search', {
        url: '/order/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/search.html',
            controller: 'orderSearchCtrl'
          }
        }
      })
      .state('menu.order-point', {
        url: '/order/point',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/point.html',
            controller: 'orderPointCtrl'
          }
        }
      })
      .state('menu.order-map', {
        url: '/order/map',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/map.html',
            controller: 'orderMapCtrl'
          }
        }
      })
      .state('menu.order-favorite', {
        url: '/order/favorite',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/favorite.html',
            controller: 'orderFavoriteCtrl'
          }
        }
      })
      .state('menu.order-favorite-map', {
        url: '/order/favorite/map',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/map.html',
            controller: 'orderMapCtrl'
          }
        }
      })
      .state('menu.order-favorite-create', {
        url: '/order/favorite/create',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/point.html',
            controller: 'orderCreateFavoriteCtrl'
          }
        }
      })
      .state('menu.order-favorite-search', {
        url: '/order/favorite/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/search.html',
            controller: 'orderSearchCtrl'
          }
        }
      })
      .state('menu.favorite', {
        url: '/favorite',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/favorite.html',
            controller: 'orderFavoriteCtrl'
          }
        }
      })
      .state('menu.favorite-create', {
        url: '/favorite/create',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/point.html',
            controller: 'orderCreateFavoriteCtrl'
          }
        }
      })
      .state('menu.favorite-search', {
        url: '/favorite/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/search.html',
            controller: 'orderSearchFavoriteCtrl'
          }
        }
      })
      .state('menu.order-review', {
        url: '/order/review',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/review.html',
            controller: 'orderReviewCtrl'
          }
        }
      })
      .state('menu.order-review-class', {
        url: '/order/review/class',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/options.html',
            controller: 'orderReviewClassCtrl'
          }
        }
      })
      .state('menu.order-review-tariff', {
        url: '/order/review/tariff',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/options.html',
            controller: 'orderReviewTariffCtrl'
          }
        }
      })
      .state('menu.order-review-payment', {
        url: '/order/review/payment',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/options.html',
            controller: 'orderReviewPaymentCtrl'
          }
        }
      })
      .state('menu.order-review-time', {
        url: '/order/review/time',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/options.html',
            controller: 'orderReviewTimeCtrl'
          }
        }
      })
      .state('menu.order-review-time-set', {
        url: '/order/review/time/set',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/time.html',
            controller: 'orderReviewSetTimeCtrl'
          }
        }
      })
      .state('menu.order-review-other', {
        url: '/order/review/other',
        views: {
          'menuContent': {
            templateUrl: 'templates/order/other.html',
            controller: 'orderReviewOtherCtrl'
          }
        }
      })
      .state('menu.payment', {
        url: '/payment',
        views: {
          'menuContent': {
            templateUrl: 'templates/payment/list.html',
            controller: 'paymentListCtrl'
          }
        }
      })
      .state('menu.history', {
        url: '/history',
        views: {
          'menuContent': {
            templateUrl: 'templates/history/history.html',
            controller: 'historyCtrl'
          }
        }
      })
      .state('menu.history-item', {
        url: '/history/item',
        views: {
          'menuContent': {
            templateUrl: 'templates/history/item.html',
            controller: 'historyItemCtrl'
          }
        }
      })
      .state('menu.history-rating', {
        url: '/history/rating',
        views: {
          'menuContent': {
            templateUrl: 'templates/history/rating.html',
            controller: 'historyRatingCtrl'
          }
        }
      })
      .state('menu.history-map', {
        url: '/history/map',
        views: {
          'menuContent': {
            templateUrl: 'templates/history/map.html',
            controller: 'historyMapCtrl'
          }
        }
      })
      .state('menu.history-drivers', {
        url: '/history/drivers',
        views: {
          'menuContent': {
            templateUrl: 'templates/history/drivers.html',
            controller: 'historyDriversCtrl'
          }
        }
      })
      .state('menu.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile/profile.html',
            controller: 'profileCtrl'
          }
        }
      })
      .state('menu.profile-name', {
        url: '/profile/name',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile/name.html',
            controller: 'profileNameCtrl'
          }
        }
      })
      .state('menu.profile-phone', {
        url: '/profile/phone',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile/phone.html',
            controller: 'profilePhoneCtrl'
          }
        }
      })
      .state('menu.help', {
        url: '/help',
        views: {
          'menuContent': {
            templateUrl: 'templates/help.html',
            controller: 'helpCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/');

  });
