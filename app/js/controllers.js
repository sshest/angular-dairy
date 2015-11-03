'use strict';

/* Controllers */

var dairyControllers = angular.module('dairyControllers', ['ngMap']);

dairyControllers.controller('IssueListCtrl', ['$scope', 'LocalStorage',
  function($scope, store) {
    $scope.issues = store.get();
    $scope.orderProp = 'id';
    
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
        store.delete(issue);
        //после этого модальное окно прячется
        $('#myModal').modal('hide');
      });

    };
    
    $scope.issueEdit = function(issue) {

    };
    
    $scope.showIssueDetails = function(issue){

    };
  }]);

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
dairyControllers.controller('NewIssueCtrl', ['$scope', 'LocalStorage', 'SetMarker', 'CoordsByAdress', 
    function($scope, store, setMarker, coordsByAdress) {
      $scope.issue = {
        title: '',
        description: '',
        attitude: '',
        date: '',
        videoUrl: '',
        coords:'' 
      };
      var area = document.getElementById('description');
      area.contentWindow.document.designMode = "On";
      
      var lat, lon, map;
      //если есть возможность получить координаты текущего положения пользователя
      //то используем их как центр карты
      navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      });

      $scope.$on('mapInitialized', function(evt, map) {
        lat && lon && map.setCenter(new google.maps.LatLng(lat, lon));
        $scope.map = map;
        // добавляем слушателя клика по карте, который создаст
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

      
      $scope.toggleColorPalette = function(ev) {
          var colpalette = document.getElementById("colpalette");
            if(colpalette.className.indexOf('hidden') != -1) {
            colpalette.className = colpalette.className.replace(/hidden/, '');
            } else if (colpalette.className.length === 0) {
              colpalette.className = 'hidden';
              } else {
                colpalette.className += ' hidden';
              }
          return false;
      };
      $scope.styleApply = function(ev) {
        
        var area = document.getElementById("description");
        var target = ev.target||ev.srcElement;
        if (target && target.name === 'i' || target.name === 'b' || target.name === 'u') {
          area.contentWindow.document.execCommand(target.value, false, null);
        }
        if (ev.currentTarget && ev.currentTarget.id === 'colpalette'){
          area.contentWindow.document.execCommand('ForeColor', false, target.value);
        }
      };

      $scope.setFontSize = function(size) {
        var area = document.getElementById("description");
        area.contentWindow.document.execCommand('fontSize', false, size);
      };

      $scope.showThumb = function() {
        var urlId = $scope.videoUrl.split('=')[1];
        $scope.thmbUrl = 'https://img.youtube.com/vi/'+urlId+'/mqdefault.jpg';
      };
            
      $scope.coordsByAddress = function(map, self) {
          debugger;
          return function(){
            var ev = arguments[0];
            //поиск производится при длине введенной строки не менее 3 символов
            if (ev.target.value.length < 3) return;
            var geocoder = new google.maps.Geocoder();
            var geoRequest = {
              address: self.ui.adress_input.val()
            };
            //отправляем запрос - если статус ответа - "ОК",
            //тогда из ответа определяем координаты первого совпадения
            //и запускаем метод установки на карту маркера
            //в иных случаях можно выводить соответствующее информационное сообщение
            geocoder.geocode(geoRequest, function(result, status) {
              switch (status) {
                case "OK": 
                  var location = result[0].geometry.location;
                  var data = {latLng:location, map:map};
                  self.setMarker(data);
                  break;
                case 'ZERO_RESULTS':
                  //рядом вывести надпись Адрес не найден
                  break;
                case 'UNKNOWN_ERROR':
                  // рядом вывести надпись Ошибка сервера, попробуйте снова
                  break;
                default:
                  //надпись - Невозможно выполнить запрос
                  break;
              };
            });
          };
      };
      $scope.saveIssue = function() {
        $q("#issueDescription").val(area.contentWindow.document.body.innerHTML);
        debugger;
        store.insert(issue);
      };
    }
  ]);

dairyControllers.controller('EditIssueCtrl', ['$scope', 'LocalStorage', 'SetMarker', 'CoordsByAdress', 
    function($scope, store, setMarker, coordsByAdress) {
      $scope.issue = {
        title: '',
        description: '',
        attitude: '',
        date: '',
        videoUrl: '',
        coords:'' 
      };
      var area = document.getElementById('description');
      area.contentWindow.document.designMode = "On";
      
      var lat, lon, map;
      //если есть возможность получить координаты текущего положения пользователя
      //то используем их как центр карты
      navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      });

      $scope.$on('mapInitialized', function(evt, map) {
        lat && lon && map.setCenter(new google.maps.LatLng(lat, lon));
        
        $scope.map = map;
        // добавляем слушателя клика по карте, который создаст
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
      $scope.addIssue = function(issue) {
        //обеспечить сохранение собітия в локалсторедж
        debugger;
      };
      
      $scope.toggleColorPalette = function(ev) {
          var colpalette = document.getElementById("colpalette");
            if(colpalette.className.indexOf('hidden') != -1) {
            colpalette.className = colpalette.className.replace(/hidden/, '');
            } else if (colpalette.className.length === 0) {
              colpalette.className = 'hidden';
              } else {
                colpalette.className += ' hidden';
              }
          return false;
      };
      $scope.styleApply = function(ev) {
        
        var area = document.getElementById("description");
        var target = ev.target||ev.srcElement;
        if (target && target.name === 'i' || target.name === 'b' || target.name === 'u') {
          area.contentWindow.document.execCommand(target.value, false, null);
        }
        if (ev.currentTarget && ev.currentTarget.id === 'colpalette'){
          area.contentWindow.document.execCommand('ForeColor', false, target.value);
        }
      };

      $scope.setFontSize = function(size) {
        var area = document.getElementById("description");
        area.contentWindow.document.execCommand('fontSize', false, size);
      };

      $scope.showThumb = function() {
        var urlId = $scope.videoUrl.split('=')[1];
        $scope.thmbUrl = 'https://img.youtube.com/vi/'+urlId+'/mqdefault.jpg';
      };
            
      $scope.coordsByAddress = function(map, self) {
          debugger;
          return function(){
            var ev = arguments[0];
            //поиск производится при длине введенной строки не менее 3 символов
            if (ev.target.value.length < 3) return;
            var geocoder = new google.maps.Geocoder();
            var geoRequest = {
              address: self.ui.adress_input.val()
            };
            //отправляем запрос - если статус ответа - "ОК",
            //тогда из ответа определяем координаты первого совпадения
            //и запускаем метод установки на карту маркера
            //в иных случаях можно выводить соответствующее информационное сообщение
            geocoder.geocode(geoRequest, function(result, status) {
              switch (status) {
                case "OK": 
                  var location = result[0].geometry.location;
                  var data = {latLng:location, map:map};
                  self.setMarker(data);
                  break;
                case 'ZERO_RESULTS':
                  //рядом вывести надпись Адрес не найден
                  break;
                case 'UNKNOWN_ERROR':
                  // рядом вывести надпись Ошибка сервера, попробуйте снова
                  break;
                default:
                  //надпись - Невозможно выполнить запрос
                  break;
              };
            });
          };
      };
      $scope.saveIssue = function() {
        store.insert(issue);
      };
    }
  ]);