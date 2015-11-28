'use strict';

/* Controllers */

var dairyControllers = angular.module('dairyControllers', ['ngMap', 'youtube']);

dairyControllers.controller('IssueListCtrl', ['$scope', '$location', 'LocalStorage',
  function($scope, $location, store) {
    $scope.sorting = {};
    $scope.sorting.sortType = 'date';
    $scope.sorting.sortReverse = false;

    store.get().then(function(data){
      $scope.issues = data;
    });
    
    //$scope.orderProp = 'id';
    
    $scope.issueDelete = function(issue){
      $('#myModal').modal({
        show: false,
        backdrop: true,
        keyboard: true
      });
      $('#myModal').modal('show');
      //при нажатии на кнопку с классом btn-primary в модальном окне
      //модель удаляется из хранилища
      $('#myModal').on('click', '.btn-primary', function(){
        store.delete(issue).then(function(data){
          $scope.issues = data;
        });
        //после этого модальное окно прячется
        $('#myModal').modal('hide');
      });

    };
    
    $scope.issueEdit = function(issue) {
      var index = $scope.issues.indexOf(issue);
      //сгенерировать роут с индексом события
      $location.path('/issue/' + index + '/edit');

    };
    
    $scope.showIssueDetails = function(issue){
      var index = $scope.issues.indexOf(issue);
      //сгенерировать роут с индексом события
      $location.path('/issue/' + index);
    };
  }]);

dairyControllers.controller('NewIssueCtrl', ['$scope', 'LocalStorage', '$location', 'SetMarker', 'CoordsByAdress', 
    function($scope, store, $location, setMarker, coordsByAdress) {
      $scope.issue = {
        title: '',
        description: '',
        attitude: '',
        date: '',
        videoUrl: '',
        coords:'' 
      };
      
      var lat, lon;
      //если есть возможность получить координаты текущего положения пользователя
      //то используем их как центр карты
      navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      });

      $scope.$on('mapInitialized', function(evt, map) {
        lat && lon && map.setCenter(new google.maps.LatLng(lat, lon));
        $scope.map = map;
        // добавляем разового слушателя клика по карте, который создаст
        //в месте клика маркер
        google.maps.event.addListenerOnce(map, 'click', function(event){
          var latLng = event.latLng;
          setMarker($scope, latLng);
        });
        //добавляем слушеталя поднятия клавиш в поисковой строке для поиска
        //с помощью Goecoder
        google.maps.event.addDomListener(document.getElementById("adress-input"), 'keyup', 
          function(event) {
            coordsByAdress($scope, event);
          }
        );
      });
      
      $scope.showThumb = function() {
        var urlId = $scope.issue.videoUrl.split('=')[1];
        $scope.thmbUrl = 'https://img.youtube.com/vi/'+urlId+'/mqdefault.jpg';
      };
            
      $scope.saveIssue = function(issue) {
        store.insert(issue);
        $location.path('/list');
      };
    }
  ]);

/*phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    };
  }]);
*/
dairyControllers.controller('EditIssueCtrl', ['$scope', '$routeParams', '$location', 'LocalStorage', 'SetMarker', 'CoordsByAdress', 
    function($scope, $routeParams, $location, store, setMarker, coordsByAdress) {
      
      var lat, lon, map, latLng;
      //если есть возможность получить координаты текущего положения пользователя
      //то используем их как центр карты
      navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      });

      $scope.$on('mapInitialized', function(evt, map) {
        lat && lon && map.setCenter(new google.maps.LatLng(lat, lon));
        
        $scope.map = map;
        store.get().then(function(data){
          $scope.issue = data[$routeParams.id];
          $scope.issue.date = new Date($scope.issue.date);

          $scope.showThumb();
          //если модель хранит в себе координаты
          //то добавляется маркер с этими координатами
          //с помощью сервиса setMarker
          if ($scope.issue.coords.A && $scope.issue.coords.B) {
            latLng = new google.maps.LatLng($scope.issue.coords.A, $scope.issue.coords.B);
            setMarker($scope, latLng);
          } else {
            // добавляем одиночный слушатель клика по карте, который создаст
            //в месте клика маркер
            google.maps.event.addListenerOnce(map, 'click', function(event){
              var latLng = event.latLng;
              setMarker($scope, latLng);
            });
          }
        });
        //добавляем слушеталя поднятия клавиш в поисковой строке для поиска
        //с помощью Goecoder
        google.maps.event.addDomListener(document.getElementById("adress-input"), 'keyup', 
          function(event) {
            coordsByAdress($scope, event);
          }
        );
      });
      
      $scope.showThumb = function() {
        var urlId = $scope.issue.videoUrl.split('=')[1];
        $scope.thmbUrl = 'https://img.youtube.com/vi/'+urlId+'/mqdefault.jpg';
      };
            
      $scope.saveIssue = function(issue) {
        var index = $routeParams.id;
        store.put(issue, index);
        store.get().then(function(data){
          $scope.issues = data;
          $location.path('/list');
        });
        
      };
    }
  ]);

dairyControllers.controller('IssueDetailCtrl', ['$window', '$scope', '$routeParams', 'LocalStorage', 'youtubePlayerApi',  
    function($window, $scope, $routeParams, store, YTApi) {
      var lat, lon, latLng, player;
      store.get().then(function(data){
        $scope.issue = data[$routeParams.id];
        $scope.video = {};
        $scope.video.id = $scope.issue.videoUrl.split('=')[1];
        if ($scope.video.id) $scope.video.present = true;
        
        $window.onYouTubeIframeAPIReady = function(){
          YTApi.bindVideoPlayer('video');
          YTApi.videoId = $scope.video.id;
          player = YTApi.createPlayer();
        };
      
        $scope.$on('mapInitialized', function(evt, map) {
          
          //если модель хранит в себе координаты
          //то добавляется маркер с этими координатами
          //с помощью сервиса setMarker
          if ($scope.issue.coords.A && $scope.issue.coords.B) {
            latLng = new google.maps.LatLng($scope.issue.coords.A, $scope.issue.coords.B);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,                            
                draggable: false
            }); 
          }  
        });
      });
    }
  ]);  
  
  dairyControllers.controller('IssuesMapCtrl', ['$scope', 'LocalStorage', '$location', 'SetMarker', 
        function($scope, store, $location, setMarker) {

            $scope.$on('mapInitialized', function(evt, map) {
              var latlngbounds = new google.maps.LatLngBounds();
              store.get().then(function(data){
                angular.forEach(data, function(issue, index){
                  if (issue.coords === '') return;
                  var latLng = new google.maps.LatLng(issue.coords.A, issue.coords.B);
                  var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,                            
                    draggable: false,
                    issueId: index
                  });
                  var title = issue.issueTitle;
                  //получаем новый экземпляр информ.окна API google maps
                  var infowindow = new google.maps.InfoWindow({
                      content: title
                  });
                  //обработчик клика на маркере, который триггерит событие "issue:show"
                  //для показа содержавния определенной записи о событии
                  google.maps.event.addListener(marker, 'click', function() {
                      $location.path('/issue/' + index);
                  });
                  //обработчик наведения указателя мыши на маркер
                  google.maps.event.addListener(marker, 'mouseover', function() {
                      //показывает информационное окно - в окне выводится название события   
                      infowindow.open(map, marker);
                  });
                  //обработчик события выхода указателя мыши с маркера
                  google.maps.event.addListener(marker, 'mouseout', function() {
                      //убирает информационное окно
                      infowindow.close();
                  });
                  //при каждом добавлении маркера область latlngbounds расширяется
                  //так, чтобы внутри ее содержался и данный маркер
                  latlngbounds.extend(marker.position); 
                })
                //после отображения всех маркеров карта центруется по центру области latlngbounds
                //ее масштаб меняется так, чтобы полностью отображать область с маркерами 
                map.setCenter( latlngbounds.getCenter(), map.fitBounds(latlngbounds));
                
              });
            });
      }]);
