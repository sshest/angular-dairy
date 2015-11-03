dairyApp.directive('dairyMap', function(){
	return {
		restrict:'E',
		scope: {
			info: '='
		},
		templateUrl: 'templates/diary-map.html'
	};	
});