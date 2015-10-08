var app = angular.module("OnApp",['ui.bootstrap']);
app.controller("dispCtrl",function($scope,$http,$modal,$log){

	$http.get("questions.json").success(function(data){
		$scope.samples = data;
		$scope.totalItems = $scope.samples.length;

		$scope.itemsPerPage = 4;
		$scope.currentPage = 1;

		// $scope.pageCount = function() {
		//     return Math.ceil($scope.totalItems / $scope.itemsPerPage);
		// };

		$scope.$watch('currentPage + itemsPerPage', function() {
			var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
				end = begin + $scope.itemsPerPage;

			$scope.filteredquestions = $scope.samples.slice(begin, end);
		});

	});


	//$scope.items = ['item1', 'item2', 'item3'];

	$scope.open = function (size) {

		var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			size: size,
			resolve: {
				items: function () {
					return $scope.samples;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});


	};

});


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

	$scope.items = items;
	$scope.selected = {
		// item: $scope.items[0]
	};

	$scope.count = 0;
	angular.forEach($scope.items, function(sample){
		var canswer = sample.canswer;
		angular.forEach(sample.answers, function(answer){
			if(answer.done){
				if(answer.option == canswer){
					$scope.count++;
				}
			}
		});
	});

	$scope.change = function(i){
		$scope.it = i;
		angular.forEach($scope.it.answers, function(q){
			if(q.done){
				if($scope.it.canswer == q.option){
					$scope.mystyle = {color:'green'};
				}
				else{
					$scope.mystyle = {color:'red'};
				}
			}
		});

	};

	$scope.ok = function () {
		$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});