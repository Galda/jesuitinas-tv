(function(){
  'use strict';
  var myApp = angular.module('app', ['onsen','ngSanitize']);
  var Mydialog = '';
  
  myApp.controller('AppController', function($scope, $data) {
    $scope.doSomething = function() {
		window.plugins.socialsharing.share('Message only');
      //ons.notification.alert({message: 'Poner función aquí'});
    };

	$scope.showSearch = function(dlg) {
		if (!Mydialog) {	//<- Mediante esta variable podríamos conseguir que no se borre el contenido, simplemente haciendo SHOW en el else
		  ons.createDialog(dlg).then(function(dialog) {
			Mydialog = dialog;
			dialog.show();
		  });
		}else{
			ons.createDialog(dlg).then(function(dialog) {	//Lo vuelve a crear, asi que se regenera y borra el contenido anterior!
				Mydialog = dialog;
				dialog.show();
			});
		}
	};
  });
  
  //Controladores  
	myApp.controller('DetailController', function($scope, $data) {
		$scope.item = $data.selectedItem;
		//$scope.test = JSON.stringify($data.selectedItem); //TEST
	  });

	  myApp.controller('MasterController', function($scope, $data) {
		$scope.items = $data.items;
		
		$scope.showDetail = function(index) {
		  var selectedItem = $data.items[index];
		  $data.selectedItem = selectedItem;
		  $scope.navi.pushPage('detail.html', {title : selectedItem.title});
		};
	});

	var searchResult = [];
	var searchResultTotal = 0;
	var searchString ='';
	myApp.controller('SearchController', function($scope,$http,$sce,$data) {
		$scope.searchRes = searchResult;
		$scope.searchResultTotal = searchResultTotal;
		$scope.searchString = searchString;

		
		$scope.searchVideo = function(toFind) {
			if(toFind){
				searchString = toFind;
				getSearch(toFind);		
			}else{
				alert('Pon algo para buscar majo');
			}
		};
		
		$scope.showDetail = function(index) {
		  var selectedItem = $scope.searchRes[index];
		  $data.selectedItem = selectedItem;
		  $scope.navi.pushPage('detail.html', {title : selectedItem.title});
		};
	

		function getSearch(aBuscar){

			$http.post("http://www.jesuitinasdonosti.tv/scripts/appData/index.php", {filtroPor:aBuscar})
			.success(function(response){
				searchResult = [];
				searchResultTotal= 0;
				searchResult = formatearPostArticulos(response,$sce);
				searchResultTotal = searchResult.length;
				if(Mydialog){Mydialog.hide();}		
				$scope.navi.pushPage('searchData.html');
			}).error(function(response) {
				alert('Error al buscar');
				alert( JSON.stringify(response));
			});		 
		};
	});
	
  //Factorias
  myApp.factory('$data', function($http,$sce) {
	var data = {};
	data.items = [];
	//El AJAX de angular
	$http.post("http://www.jesuitinasdonosti.tv/scripts/appData/index.php",'test')
		.success(function(response) {
			
			angular.forEach(response,function(v,k){
				var video = {};
				
				var keepGoing = true; //<- para control de bucles
				//Saco la imagen
				var img = '';var imgBig = '';
				
				if(v.archivos.img){
					angular.forEach(v.archivos.img,function(i,ik){
						if(keepGoing){
							if(i.nombre){
								img = {fichero: i.copias.social.fichero, alto:i.copias.social.y};
								imgBig = {fichero: i.copias.social.fichero, alto:i.copias.social.y};
								keepGoing = false;
							}
						}
					});
				}
				
				//Saco el vídeo
				keepGoing = true;
				var mp4 = '';
				if(v.archivos.video){
					angular.forEach(v.archivos.video,function(v,vk){
						if(keepGoing){
							if(v.url_video){
								mp4 = v.url_video;
								keepGoing = false;
							}
						}
					});
				}
				//Guardo datos
					//cropeo el texto
					var clean_desc = String(v.descripcion).replace(/<[^>]+>/gm, '');
					var short_desc = ((clean_desc.length > 150 ) ? clean_desc.substr(0,150) + ' ... ' : clean_desc);
					var fecha = v.fecha_pub.split(' '); //separo fecha y hora
				video = {
					titulo: v.titulo,
					label: fecha[0],
					desc: short_desc,
					long_desc: v.descripcion,
					img: img,
					imgBig: imgBig,
					mp4: mp4,
					video: 	 $sce.trustAsHtml(videoTube(mp4)) //VERIFICA QUE LA URL SE PUEDA EJECUTAR
				};
				
				data.items.push(video);
				
			});
		}).error(function(response) {console.log(response)});
     
      return data;
  }); 


	//Para formatear lo que nos devuelve el servidor
	function formatearPostArticulos(array,$sce){
		var resultado = [];
		angular.forEach(array,function(v,k){
				var video = {};
				
				var keepGoing = true; //<- para control de bucles
				//Saco la imagen
				var img = '';var imgBig = '';
				
				if(v.archivos.img){
					angular.forEach(v.archivos.img,function(i,ik){
						if(keepGoing){
							if(i.nombre){
								img = {fichero: i.copias.social.fichero, alto:i.copias.social.y};
								imgBig = {fichero: i.copias.social.fichero, alto:i.copias.social.y};
								keepGoing = false;
							}
						}
					});
				}
				
				//Saco el vídeo
				keepGoing = true;
				var mp4 = '';
				if(v.archivos.video){
					angular.forEach(v.archivos.video,function(v,vk){
						if(keepGoing){
							if(v.url_video){
								mp4 = v.url_video;
								keepGoing = false;
							}
						}
					});
				}
				//Guardo datos
					//cropeo el texto
					var clean_desc = String(v.descripcion).replace(/<[^>]+>/gm, '');
					var short_desc = ((clean_desc.length > 150) ? clean_desc.substr(0,150) + ' ... ' : clean_desc);

					var fecha = v.fecha_pub.split(' '); //separo fecha y hora
				video = {
					titulo: v.titulo,
					label: fecha[0],
					desc: short_desc,
					long_desc: v.descripcion,
					img: img,
					imgBig: imgBig,
					mp4: mp4,
					video: 	 $sce.trustAsHtml(videoTube(mp4)) //VERIFICA QUE LA URL SE PUEDA EJECUTAR
				};
				
				resultado.push(video);
			});
			
			return resultado;
		}
				
})();

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
	// var ref = window.open('http://apache.org', '_blank', 'location=yes');
	//ons.bootstrap();
}

var vibrate = function() {
    navigator.notification.vibrate([50,50,50]);
};

function dump_pic(data) {
    var viewport = document.getElementById('viewport');
    viewport.style.display = "";
    viewport.style.position = "absolute";
    viewport.style.top = "10px";
    viewport.style.left = "10px";
    document.getElementById("test_img").src = "data:image/jpeg;base64," + data;
}

function fail(msg) {
    alert(msg);
}

function show_pic() {
    navigator.camera.getPicture(dump_pic, fail, {
        quality : 50,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 100,
        targetHeight: 100
    });
}
/*
function shareMe(msg,asunto,img,link){
	msg, asunto,img,link);
}*/