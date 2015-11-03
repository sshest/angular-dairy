'use strict';

/* Services */

var dairyServices = angular.module('dairyServices', []);

dairyServices.factory('LocalStorage', 
  function($q){
    var STORAGE_ID = 'issues-angularjs';

	var store = {
		issues: [],

		_getFromLocalStorage: function () {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		},

		_saveToLocalStorage: function (issues) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(issues));
		},

		delete: function (issue) {
			var deferred = $q.defer();

			store.issues.splice(store.issues.indexOf(issue), 1);

			store._saveToLocalStorage(store.issues);
			deferred.resolve(store.issues);

			return deferred.promise;
		},

		get: function () {
			var deferred = $q.defer();

			angular.copy(store._getFromLocalStorage(), store.issues);
			deferred.resolve(store.issues);

			return deferred.promise;
		},

		insert: function (issue) {
			var deferred = $q.defer();

			store.issues.push(issue);

			store._saveToLocalStorage(store.issues);
			deferred.resolve(store.issues);

			return deferred.promise;
		},

		put: function (issue, index) {
			var deferred = $q.defer();

			store.issues[index] = issue;

			store._saveToLocalStorage(store.issues);
			deferred.resolve(store.issues);

			return deferred.promise;
		}
	};
	return store;
  });

dairyServices.factory('SetMarker', 
	function() {
		return function(scope, latLng) {
          var map = scope.map;
          var marker, markers = map.markers //|| [];
          //если карта уже содержит массив маркеров, то помещается первый в место события
          //таким образом не создается второго и т.д. маркера, мы лишь перемещаем единственный
          if (markers.length > 0) {
            marker = markers[0];
            marker.setPosition(latLng);
            //иначе - создается новый маркер
          } else {
              marker = new google.maps.Marker({
              position: latLng,
              map: map,                            
              draggable: true
            });
            
            markers[0] = marker;
          };
          //после этого карта центрируется по маркеру
          map.panTo(marker.position);
          function getMarkerCoords(latLng) {
            scope.issue.coords = latLng;
            debugger;
          };         
          //записываем координаты маркера в скрытое поле ввода
          getMarkerCoords(latLng);
          //добавляем как обработчик события перетаскивания маркера функцию getMarkerCoords
          //для сохранения новых координат маркера 
          google.maps.event.addListener(marker, 'dragend', function(ev) {
          	getMarkerCoords(ev.latLng);
          });
      	}
	}
);
dairyServices.factory('CoordsByAdress', ['SetMarker', 
	function(setmarker){
		return function (scope, event) {
			debugger;
			var request = event.target.value;
			//поиск производится при длине введенной строки не менее 3 символов
			if (request.length < 3) return;
			var geocoder = new google.maps.Geocoder();
			var geoRequest = {
				address: request
			};
			//отправляем запрос - если статус ответа - "ОК",
			//тогда из ответа определяем координаты первого совпадения
			//и запускаем метод установки на карту маркера
			//в иных случаях можно выводить соответствующее информационное сообщение
			geocoder.geocode(geoRequest, function(result, status) {
				switch (status) {
					case "OK": 
						var location = result[0].geometry.location;
						setmarker(scope, location);
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
		}
	}
]);
