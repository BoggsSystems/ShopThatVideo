'use strict';

angular.module('cmsShoppableApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'cloudinary',
  'ngFileUpload',
  'isteven-multi-select',
  'color.picker',
  'yaru22.angular-timeago'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        if(config.url.indexOf('api.cloudinary.com') >= 0) {
          delete config.headers.Authorization;
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $state, $location, $http, Auth) {
    $rootScope.$state = $state;

    Auth.isLoggedInAsync(function(loggedIn) {
      if (loggedIn) {
        $http.get('/api/users/settings')
        .then(function(response){
          // console.log('response', response);
          if(response.data && response.data.cloud_name && response.data.upload_preset) {
            $.cloudinary.config().cloud_name = response.data.cloud_name;
            $.cloudinary.config().upload_preset = response.data.upload_preset;
          }
        });
      }
    });
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      $rootScope.navbarStatusMessage = '';
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          window.location.href = '/login';
        }
      });

      $(window).on("load", function() {
          "use strict";
          $("#preloader").delay(3000).fadeOut("slow");
      });// END LOAD
      $(window).on("scroll", function () {
          "use strict";

          var siteHeader  = $('#site-header');
          
          if ($(this).scrollTop() > 100) {
              siteHeader.addClass('scroll');
          } else {
              siteHeader.removeClass('scroll');
          }
      });

      // page init
      setTimeout(function() {
        jQuery(function(){
          // initAccordion();
          // initPopups();
          // initMobileNav();
          // initCustomForms();

          // $(document).on("ready", function() {
              "use strict";

              // Menu Toggle
              $('#nav-toggle').on('click', function(){
                  $(this).toggleClass('menu-icon close-icon');
                  $('#site-navigation').toggleClass('open');
              });

              // Main Slider
              if ($("#main-slider").length>0) {
                  jQuery("#main-slider").revolution({
                      sliderType:"hero",
                      sliderLayout:"fullscreen",
                      delay: 10000,
                      gridwidth:1230,
                      gridheight:950,
                      parallax: {
                          type:"mouse",
                          origo:"slidercenter",
                          speed:2000,
                          levels:[2,3,4,5,6,7,12,16,10,50],
                      },
                      navigation: {
                          arrows: {
                              enable: false,
                          },
                      },
                  });
              };

              // Fit Vids
              if ($('div.video').length>0) {
                  $("div.video").fitVids();
              };

              // Easy Scroll
              $('.homeScroll').on('click', function() {
                  $.smoothScroll({
                      scrollElement: $('body'),
                      scrollTarget: '#first-section',
                      speed: 600,
                      offset:0 
                  });
                  return false;
              });

              $('.commentsScroll').on('click', function() {
                  $.smoothScroll({
                      scrollElement: $('body'),
                      scrollTarget: '#comments',
                      speed: 600,
                      offset:0 
                  });
                  return false;
              });


              // Filterable Content
              var $filterableContainer = $('.filterableContent');
              // initialize isotope
              if (($filterableContainer).length> 0) {
                $filterableContainer.isotope({});
                $(window).resize( function(){ 
                    setTimeout(function() { 
                        $filterableContainer.isotope('layout'); 
                    }, 1000);  
                });

                $(window).on("load", function() {
                    $filterableContainer.isotope('layout'); 
                });

              };
          

              // Portfolio Filter
              $("#filter").on("click", "li", function() {
                  $("li.selected").removeClass("selected");
                  $(this).addClass("selected");
                  var selector = $(this).attr("data-filter");
                  $filterableContainer.isotope({
                      filter: selector
                  });
              });
              
              // Forms Validation   
              // Comments
              if ($('#comment-form').length>0) {
                $('#comment-form').validate({
                  rules: {
                    email: {
                      required: true,
                      email: true
                    }
                  }, //end rules
                  messages: {
                    email: {
                      required: "Please type a e-mail address.",
                      email: "This is not a valid email address."
                    }
                  }
                });
              };
          
              // Contact Homepage Form
              if ( $('#contact-form').length>0) {
                  $('#contact-form').validate({
                      rules: {
                          email: {
                              required: true,
                              email: true
                          }
                      }, 
                      messages: {
                          email: {
                              required: "Please type a e-mail address.",
                              email: "This is not a valid email address."
                          }
                      }
                  });
              };


          // });// END READY
        });
      }, 2000);
    });
  });
