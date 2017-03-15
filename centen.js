/*Written by nhoward for OCLS

Below we insert our own custom template into the exisiting template. Create a controller to access the data that will be returned.*/


angular.module('summonApp').run([ '$templateCache', function (templateCache) {
    var docSummary = "/assets/documentSummary.html";
    var chatWidget = "/assets/chatWidget.html";
    var w = templateCache.get(chatWidget);
    var v = templateCache.get(docSummary);
    
    v = v.replace(/(<span.*Z3988.*<\/span>)/,
                          
                          "<div ng-controller='LicenseController'>"+
                          "<a class={{toggle}} ng-click='getTerms()' role='button' aria-pressed='false'></br>{{ license }}</a>"+

                          "<div ng-show = 'state'><img ng-src='{{imageSource}}' height='13' alt='loading'></div>"+
                          "<div ng-show = 'state' aria-hidden='true'>"+
                          "<table role='presentation'>"+
                          "<ul style='list-style: none; padding-left:0;' ng-repeat='x in records'>"+
                          "<ul style='list-style: none; padding-left:0;' ng-repeat='n in x'>"+
                          /*"<h4><a ng-href='{{url}}'>{{n['license-name']}}</a></h4>"+*/
                          /*"<h4>{{lic_name}}</h4>"+*/
                          "<h4>{{n['license-name']}}</h4>"+
                          "<p><a ng-href={{url1}}{{n['license-tag']}} target='_blank'>{{check}}</a></p>"+
                          "<li role='returned_menu_item' aria-required='false' role='list'><span ng-style='calculateStyle(n.e_reserves.usage)'>{{n.e_reserves.usage}}&nbsp</span>&nbsp{{n.e_reserves.case}}</li>"+
                          "<li role='returned_menu_item' aria-required='false' role='list'><span ng-style='calculateStyle(n.cms.usage)'>{{n.cms.usage}}&nbsp</span>&nbsp{{n.cms.case}}</li>"+
                          "<li role='returned_menu_item' aria-required='false' role='list'><span ng-style='calculateStyle(n.course_pack.usage)'>{{n.course_pack.usage}}&nbsp</span>&nbsp{{n.course_pack.case}}</li>"+
                          "<li role='returned_menu_item' aria-required='false' role='list'><span ng-style='calculateStyle(n.durable_url.usage)'>{{n.durable_url.usage}}&nbsp</span>&nbsp{{n.durable_url.case}}</li>"+
                          "<li role='returned_menu_item' aria-required='false' role='list'><span ng-style='calculateStyle(n.print.usage)'>{{n.print.usage}}&nbsp</span>&nbsp{{n.print.case}}</li><br><br>"+
                          "</ul></ul></td>"+
                          "</tr></table>"+
                          "</div>"+
                          "<span ng-show = 'no_show'>"+
                          "<p ng-style='color_ask(no_ask)'>{{no_ask}}</p><a href='mailto:webmaster@example.com'>{{no_res}}</a>"+
                          "</span></div>");
                        
  
                      
    templateCache.put(docSummary, v);

    /*w = w.replace(/(<header><\/header>)/,"<div ng-controller='myCtrl'><div class='libraryh3lp' data-lh3-jid='centennial@chat.ca.libraryh3lp.com'><a href='' ng-click='getWindow()' return false;'><img src='https://s3.amazonaws.com/libraryh3lp.com/ca/askon-reponline.gif'alt='Chat now'></a></div></div>");
    templateCache.put(chatWidget, w);*/
    /*console.log(w);*/
    
}]);



//Here we attach the controller to the $scope and make our call to our PHP file for results. We then style the elements in our controller
angular.module('summonApp.directives')


.controller('LicenseController', ['$scope','$http',function($scope,$http,$compile) {

    $scope.toggle = "togglePreview customColorsToggleButton ng-scope";
    $scope.getTerms = function() {
        if($scope.toggle == "togglePreview customColorsToggleButton ng-scope"){
          $scope.toggle = "togglePreview customColorsToggleButton ng-scope active";
        }
       else{
          $scope.toggle = "togglePreview customColorsToggleButton ng-scope";
        }
        

        $scope.imageSource = "https://www.ocls.ca/spinner.gif";
        $scope.state = !$scope.state;
        $scope.no_show = !$scope.no_show;
        var sources = [];
        var source = "";
        if($scope.document.issns.length >= 1){
            source = "ISSN";
           for(var i = 0; i < $scope.document.issns.length; i++){
            //console.log(scope.document.databases[i].name);
            name = encodeURIComponent($scope.document.issns[i]);
            sources[i] = name;
            
          }
        }
        if($scope.document.eissns && $scope.document.eissns.length >= 1){
          source = "EISSN";
           for(var x = 0; x < $scope.document.eissns.length; x++){
            
            name = encodeURIComponent($scope.document.eissns[x]);
            sources[x] = name;
            
          }
        }
        for(var j = 0; j < sources.length; j++){

            url = "http://159.203.17.69/get_sum.php?callback=JSON_CALLBACK&license=" + sources + "&source=" + source;
            console.log(url);
            $http.jsonp(url)
                .success(function(data){
                  var count = 0;
                  $scope.imageSource = "https://www.ocls.ca/white.PNG";
                  $scope.records = [data];
                  $scope.url1 = "https://clear.scholarsportal.info/centennial/";
                  angular.forEach(data, function(value, key){
                       
                       angular.forEach(value, function(val,k){
                            
                            if(val.usage == 'Ask'){
                              count++;
                            }
                       });
                      
                  });
                  if(count >= 1){
                    $scope.no_ask = "Who do I ask?";
                    $scope.no_res = "Ask the libary";
                    $scope.color_ask = function(ask) {
                        style ={}
                        style.color='#804D00';
                        style.fontWeight='bold';
                        return style;
                    }
                  }
                  if(data === null || data[Object.keys(data)[0]] == null){
                    
                    $scope.no_ask = "Ask";
                    $scope.no_res = "Please consult the library staff for permitted uses.";
                    $scope.no_res.href = "http://www.google.ca";
                    $scope.check = "#FFA724";
                    $scope.color_ask = function(ask) {
                        style ={}
                        style.color='#000000';
                        style.fontWeight='bold';
                        style.background = '#ff9900';
                        style.paddingRight = '3px';
                        style.paddingLeft = '3px';
                        style.marginRight = '10px';
                        return style;
                    }
                    
                  }else{
                    $scope.check = "More Info";
                  }
                 
                  $scope.calculateStyle = function(test) {
                      var style={}
                      if (test == 'Yes') {
                        style.color='#000000';
                        style.fontWeight='bold';
                        style.background = '#33bb55';
                        /*style.paddingLeft = '5px';
                        style.marginRight = '5px';*/
                       
                      }
                      if(test == 'Ask'){
                        
                        style.color='#000000';
                        style.fontWeight='bold';
                        style.background = '#ff9900';
                        /*style.paddingRight = '3px';
                        style.paddingLeft = '3px';
                        style.marginRight = '10px';*/
                        count + 1;
                      }
                      if(test == 'No'){
                        style.color='#000000';
                        style.fontWeight='bold';
                        style.background = '#ff3333';
                        style.paddingRight = '4px';
                        style.paddingLeft = '2px';
                        /*style.marginRight = '10px';*/
                      }  
                      return style;
                  }
                  $scope.e_res = {
                          "color" : "#33bb37",
                          "font-weight": "bold"
                      }
                      
                 
                });

        }
        
       
       

        }
        
        if($scope.document.issns){
          if($scope.document.issns.length >= 1 || $scope.document.eissns.length >= 1){
           
            $scope.license = "Permitted Uses";
            
          }
          for(var i = 0; i < $scope.document.issns.length; i++){
            
            
         
            
          }
        }else{
            $scope.license = " ";
            $scope.toggle = " ";
        }
        
        
       
        
       
      
       
    
}]);
/*//FOR WIDGET
angular.module('summonApp.directives').controller('myCtrl', function($scope) {
  //array of things to load are saved in a JavascriptFile
  $scope.getWindow = function() {

    window.open('https://ca.libraryh3lp.com/chat/centennial@chat.ca.libraryh3lp.com?skin=15387', 'AskUs', 'resizable=1,width=275,height=300');
  }
  //loadScript("http://159.203.17.69/widget.js");
  
});
function loadScript(src,callback){

    var script = document.createElement("script");
    script.type = "text/javascript";
    if(callback)script.onload=callback;
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = src;
}*/