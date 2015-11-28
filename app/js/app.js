'use strict';

/* App Module */

var dairyApp = angular.module('dairyApp', [
  'ngRoute',
  'dairyControllers',
  //'dairyFilters',
  'dairyServices'
]);

dairyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: 'templates/list.html',
        controller: 'IssueListCtrl'
      }).
      when('/issue/:id/edit', {
        templateUrl: 'templates/edit-form-view.html',
        controller: 'EditIssueCtrl'
      }).
      when('/issue/new', {
        templateUrl: 'templates/edit-form-view.html',
        controller: 'NewIssueCtrl'
      }).
      when('/issue/:id', {
        templateUrl: 'templates/show-single-view.html',
        controller: 'IssueDetailCtrl'
      }).
      when('/places', {
        templateUrl: 'templates/map.html',
        controller: 'IssuesMapCtrl'
      }).
      otherwise({
        redirectTo: '/list'
      });
  }]);
