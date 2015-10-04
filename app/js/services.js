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
