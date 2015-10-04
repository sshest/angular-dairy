'use strict';

/* Controllers */

var dairyControllers = angular.module('dairyControllers', []);

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
dairyControllers.controller('NewIssueCtrl', ['$scope', 'LocalStorage',
    function($scope, store) {
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
      
      var lat, lon;
      //если есть возможность получить координаты текущего положения пользователя
      //то используем их как центр карты
      //если нет - центр зададим статично (Харьков)
      navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude || 49.9945914;
        lon = pos.coords.longitude || 36.2858248;
      });
      var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(lat, lon),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      map.markers = [];
      // добавляем слушателя клика по карте, который создаст
      //в месте клика маркер
      google.maps.event.addListenerOnce(map, 'click', this.setMarker);
      //добавляем слушеталя клика в поисковой строке для поиска
      //с помощью Goecoder
      google.maps.event.addDomListener(document.getElementById("adress-input"), 'keyup', this.coordsByAddress(map, this));
      
      //в редактирование -> area.contentDocument.body.innerHTML = $scope.issue.description;
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
      //метод позволяющий установить маркер на карте
      //может вызываться как при клике на карте (тогда ему передается событие клика),
      //при вводе в поисковой строке текста,
      //при отображении представления редактирования 
      setMarker: function(event) {
          var map = event.map || this.map || this;
          var marker, markers = map.markers;
          //если карта уже содержит массив маркеров, то помещается первый в место события
          //таким образом не создается второго и т.д. маркера, мы лишь перемещаем единственный
          if (markers.length > 0) {
            marker = markers[0];
            marker.setPosition(event.latLng);
            //иначе - создается новый маркер
          } else {
              marker = new google.maps.Marker({
              position: event.latLng,
              map: map,                            
              draggable: true
            });
            
            markers.push(marker);
          };
          //после этого карта центрируется по маркеру
          map.panTo(marker.position);
          function getMarkerCoords(ev) {
            var markerCoords = JSON.stringify(ev.latLng);
              $('#markerCoords').val(markerCoords);
          };         
          //записываем преобразованные в JSON координаты маркера в скрытое поле ввода
          getMarkerCoords(event);
          //добавляем как обработчик события перетаскивания маркера функцию getMarkerCoords
          //для сохранения новый координат маркера 
          google.maps.event.addListener(marker, 'dragend', getMarkerCoords);
      }
      $scope.saveNewIssue = function() {
        store.insert(issue);
      };
    }
  ]);