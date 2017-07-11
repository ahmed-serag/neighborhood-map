var mapMarkers=[];
var infowindows = [];
function init(){

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 31.163827, lng: 29.867720},
        zoom: 18
    });

    var viewmodel = ViewModel(map);
   
    ko.applyBindings(viewmodel);
}
function mapErrorHandler(){
    document.getElementById('map').innerHTML = "<h2>Can't Load GOOGLE MAP!!!";
}

function ViewModel(map){
    this.searchQuery = ko.observable('');

    this.Markers = ko.observableArray([
        {title: "home ", lat: 31.165084, lng: 29.868484, index: 0},
        {title: "school ", lat: 31.163827, lng: 29.867720, index: 1},
        {title: "restaurant ", lat: 31.163831, lng: 29.867816, index: 2},
        {title: "hospital ", lat: 31.163147, lng: 29.867435, index: 3},
        {title: "shop ", lat: 31.163992, lng: 29.867827, index: 4}
    ]);
      ko.utils.arrayForEach(this.Markers(), function(marker) {    
        // Create a latLng literal object.
        var singleLatLng = {lat: marker.lat, lng: marker.lng};	
        
        var singleMarker = new google.maps.Marker({
        position:singleLatLng,
        map: map,
        title: marker.title
        });
        mapMarkers.push(singleMarker);
        
        foursquareUrl = 'https://api.foursquare.com/v2/venues/search' +
        '?client_id=QP1LCTQNC4OCBGLAK31KTGKP5WPYG1I3OJKTS1UU0IY1RNB0' +
        '&client_secret=J1NHLR3FTFKH24CSI2YIPCQYW4FBZ4VJVT4YNJ4LGT0MBBGB' +
        '&v=20130815' +
        '&limit=1' +
        '&ll=' + marker.lat + ',' + marker.lng;
        var infoContent = 'bla bla';
        $.getJSON(foursquareUrl, function(data) {         
            if(data.response.venues){
                result = data.response.venues[0];
                infoContent = "<h2>"+result.name+"</h2>"+
                    "<p> there are "+result.hereNow.count+" here now!";
                initinfoWindow(map, singleMarker, infoContent);
            } 
        }).fail(function(jqXHR, textStatus, errorThrown) {
                infoContent = "Sorry Can't connect to the API right now!!";
                initinfoWindow(map, singleMarker, infoContent);
        });    
    });

       
    this.ActiveMarkers = ko.computed(function() {

        var result = $.grep(this.Markers(), function(arr) {
            var res = arr.title.indexOf(this.searchQuery());
            return (res > -1);
        });        
        ko.utils.arrayForEach(mapMarkers, function(marker){
            marker.setVisible(false);
        });

        ko.utils.arrayForEach(result, function(r){
            mapMarkers[r.index].setVisible(true);
        });
        
        
        this.clickItem = function(item){
            mapMarkers[item.index].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                mapMarkers[item.index].setAnimation(null);
            }, 1200);
            infowindows[item.index].open(map, mapMarkers[item.index]);
        };
        return result;
    });
}

function initinfoWindow(map, marker, content){
    var infowindow = new google.maps.InfoWindow({
        content: content
    });
    infowindows.push(infowindow);
    marker.addListener('click', function() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1200);
        infowindow.open(map, marker);
    });
}

