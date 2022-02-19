'use strict';

window.GoogleMapVersion = "Nov 7, 2021 12:50 PM";
export let currentPosMarkerNew = null;
export let mapNew = null;
export let positionWatchIdNew = -1;
export let currentPosIconURL = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
export let userPrevLong = "";
export let userPrevLat = "";
export let variableLocations = [];
export let markersArrray = new Array();
export let InfocusMarker = "";
export let blazorPageReference;
export let mapErrorDisplayElementID;
export let currentLatLong;
export let oneTimeForceLoad;
export let bounds;
export let circles = [];
export let CodeRunning = false;




export let  Status = {
    _mapInitialized: false,
    edition: 1
};

export let UpdateBound = false;
Object.defineProperty(Status, "mapInitialized", {
    get: function () {
        return this._mapInitialized;
    },
    set: function (newValue) {
        this._mapInitialized = newValue;

        //if (!releaseMode)
        //console.log("InitilizedMap Value Changed to " + newValue);
        //this.edition = newValue - 2004;
        //alert(this._year);
        //alert(this.edition);
    }
});

export function loadScript(url) {
    'use strict';

    return new Promise((resolve, reject) => {
        try {
       

            var scriptFound = "WAITING";

            var scripts = document.getElementsByTagName('script');
            if (scripts.length) {
                for (var scriptIndex in scripts) {
                    //console.warn(scripts[scriptIndex].src);
                    if (url === scripts[scriptIndex].src) {
                        console.warn("getElementsByTagName: Google Map Script found to be already loaded " + scripts[scriptIndex].src);
                        scriptFound = "FOUND";
                        resolve();
                        return;
                    }
                }
                scriptFound = "NOT_FOUND";
            }

            if (scriptFound == "NOT_FOUND")
            {
                var script = document.createElement('script')
                script.src = url
                script.async = false;
                script.id = 'GoogleMapJs';
                script.language = "javascript";
                script.type = "text/javascript";
                script.onload = () => {
                    console.warn("GoogleMap External Script was loaded");
                    resolve();
                    return;
                }
                script.onerror = () => {
                    reject('cannot load script ' + url);
                }

                document.body.appendChild(script)
            }
            else if(scriptFound == "WAITING")
            {
                console.error("Script completed before Check completed...");
                reject('cannot load script ' + url);
            }
            else if(scriptFound == "FOUND")
            {
                console.error("SKIPED Loading becuase it was already found to be loaded");
                resolve();
            }

        } catch (e) {
            console.error("Error While Loading Script" + url);
            console.error(e);
        }

    })
}

export async function initGoogleMap(mapdivElement, blazorPageRef, errorDisplayElementID,googleAPIKey) {
    'use strict';

    console.log("JsvaScript:initGoogleMap executed");
    blazorPageReference = blazorPageRef;
    mapErrorDisplayElementID = errorDisplayElementID;

    try {

           //loadscript has logic to prevent duplicate loads
        await loadScript('https://maps.googleapis.com/maps/api/js?key=' + googleAPIKey + '&libraries=geometry').then(() => {
                console.log('Loadded Google Map Script File');

                var latlng = new google.maps.LatLng(40.716948, -74.003563);
                var options = {
                    //zoom: 12,
                    //minZoom: zoom + 12,
                    maxZoom: 18,
                    center: latlng,
                    disableDefaultUI: true, // a way to quickly hide all controls
                    scaleControl: true,
                    zoomControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    maptypecontrol: false,
                    // gestureHandling: "cooperative"
                    gestureHandling: "auto",
                    streetViewControl: false,
                    styles: [
                        {
                            featureType: "poi.business",
                            stylers: [{ visibility: "off" }],
                        },
                        {
                            featureType: "transit",
                            elementType: "labels.icon",
                            stylers: [{ visibility: "off" }],
                        },
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }]

                };

                //https://console.cloud.google.com/google/maps-apis/client-styles?project=wide-axiom-315015&folder=&organizationId=
                mapNew = new google.maps.Map(document.getElementById(mapdivElement), options);

                Status.mapInitialized = true;
                mapNew.setZoom(16);

                if (positionWatchIdNew != -1) {
                    navigator.geolocation.clearWatch(positionWatchIdNew);
                    positionWatchIdNew = -1;
                }

                const centerControlDiv = document.createElement("div");
                TopCenterControl(centerControlDiv, mapNew, "Show My Location")
                mapNew.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

             
                var geoOptions = {
                    enableHighAccuracy: true
                };

               

            navigator.geolocation.getCurrentPosition(showPosition, showError, geoOptions);

              
                if (positionWatchIdNew == -1)
                    positionWatchIdNew = navigator.geolocation.watchPosition(showPosition, showError, geoOptions);

                blazorPageReference.invokeMethodAsync('GoogleMapJSCallBack', 'Loaded GoogleMap');

              
            });
       
    } catch (e) {
        console.error("Javascript:initGoogleMap :- " + e.errorMessage);
        console.error(e);
        blazorPageReference.invokeMethodAsync('GoogleMapJSCallBack', e.errorMessage);
    }

}


export function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export function showError(error) {
    'use strict';

    console.log("Geolocation API isn't supported.");
    var element = document.getElementById('LocationErrorText');
    var erMsg = "";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            erMsg = "User denied the request for Geolocation.";
            //  element.innerHTML = erMsg;
            console.error(erMsg);
            break;
        case error.POSITION_UNAVAILABLE:
            erMsg = "Location information is unavailable.";
            // element.innerHTML = erMsg;
            console.error(erMsg);
            break;
        case error.TIMEOUT:
            erMsg = "The request to get user location timed out.";
            // element.innerHTML = erMsg;
            console.error(erMsg);
            break;
        case error.UNKNOWN_ERR:
            erMsg = "An unknown error occurred.";
            // element.innerHTML = erMsg;
            console.error(erMsg);
            break;
    }

    blazorPageReference.invokeMethodAsync('MapLocationError', erMsg);
}




export async function showPosition(position) {
    'use strict';

    try {

        console.log(" showPosition :- Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        currentLatLong = new google.maps.LatLng(lat, lon);
        var prevlatlong = new google.maps.LatLng(userPrevLat, userPrevLong);

       
        if (userPrevLat == lat && userPrevLong == lon && currentPosMarkerNew != null) {
            console.log("Same location, skipping");

            return;
        }
        else {

            var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
                currentLatLong,
                prevlatlong
            );

            if (distanceInMeters <= 10) {
                //difference in distance is too short to update Map
                return;
            }
            console.log("New value GPS Location");
            console.log("Previous Lat Long " + prevlatlong);
            console.log("difference of distance in meteres " + distanceInMeters);
            userPrevLat = lat;
            userPrevLong = lon;
        }

        console.log("Triggering Update to Blazor");
      
        blazorPageReference.invokeMethodAsync('LocationUpdated', lat, lon);

        if (currentPosMarkerNew != null) {
            currentPosMarkerNew.setPosition(currentLatLong);
           
            if (!bounds.contains(currentLatLong)) {
                console.log("New Point outside of bounds");
                displayMarkersOnGoogleMap(variableLocations);
            }
       
             return;
            }

                currentPosMarkerNew = new google.maps.Marker({
                    map: mapNew, pos: currentLatLong, clickable: true,
                    icon: {
                        url: currentPosIconURL,
                        labelOrigin: { x: 12, y: -10 }
                        //scaledSize: new google.maps.Size(38, 38)
                    },
                    label: {
                        text: "You Location",
                        color: "red",
                        fontWeight: "bold",
                        fontsize: "16px"
                    },
                    zIndex: -9999999
                    //, optimized: false
                    //,zIndex: google.maps.Marker.MAX_ZINDEX + 1
                });

                currentPosMarkerNew.setPosition(currentLatLong);

                currentPosMarkerNew.info = new google.maps.InfoWindow({
                    content: 'Your Location',
                });


                google.maps.event.addListener(currentPosMarkerNew, 'click', function () {
                    currentPosMarkerNew.info.open(mapNew, currentPosMarkerNew);
                });

                //This works
                //var latlng = currentPosMarkerNew.get('position');
                //var latlng = currentPosMarkerNew.getPosition();

       // mapNew.setCenter(currentPosMarkerNew.getPosition());
        displayMarkersOnGoogleMap(variableLocations);
                //mapNew.setZoom(16);
               // mapNew.setCenter(currentLatLong);

             
       
                //window.setTimeout(() => {
                //    if (UpdateBound == false)
                //        return;
                //    else
                //        UpdateBound = false;
                //             mapNew.fitBounds(bounds); //auto-zoom
                //             mapNew.panToBounds(bounds); //auto-cente
                //             mapNew.setZoom(16);
                //            }, 3000);

              
                console.log("First time user Location Marked(showPosition)");

 
           
    } catch (e) {
        console.error("Javascript:showPosition :- " + e.errorMessage);
        console.error(e);
    }
    finally {
        oneTimeForceLoad = false;
    }
}


export async function displayMarkersOnGoogleMap(locations) {
    'use strict';

    try {

        console.log("JavaScript: displayMarkersOnGoogleMap Executed")
        variableLocations = locations;
        bounds = new google.maps.LatLngBounds();
        //bounds = new google.maps.LatLngBounds(null);

        var infowindow = new google.maps.InfoWindow();

        //https://developers.google.com/maps/documentation/javascript/examples/marker-remove
        for (var i = 0; i < markersArrray.length; i++) {
            markersArrray[i].setMap(null);
        }
        markersArrray = new Array();

            

        if (locations.length == 0) {
            //Reposition map to display current location
            mapNew.setCenter(currentPosMarkerNew.getPosition());
            return;
        }
         

        for (i = 0; i < locations.length; i++) {
            if (locations[i].latitude == undefined || locations[i].latitude == null) {
                console.error(locations[i].locationName + " : Latitude for this location was not found ");
                continue;
            }
            if (locations[i].longitude == undefined || locations[i].longitude == null) {
                console.error(locations[i].locationName + " longitude for this location was not found ");
                continue;
            }
            var latlong = new google.maps.LatLng(locations[i].latitude, locations[i].longitude);
            var marker = new google.maps.Marker({
                position: latlong,
                title: locations[i].locationName + "," + locations[i].numberOfPeopleInLine + " People in Line. " + " Estimated Wait Time is " + locations[i].estimatedWaitTime + " Minutes ", //titles will display on mouse hover
                icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    labelOrigin: { x: 12, y: -10 }
                },
                map: mapNew,
                label: {
                    text: locations[i].locationName + "(" + locations[i].numberOfpeopleInLine + ")",
                    color: "red",
                    fontWeight: "bold",
                    fontsize: "16px"
                }
            });

            //extend the bounds to include each marker's position
            bounds.extend(marker.position);

            
            marker.LocationName = locations[i].locationName;
            marker.Address = locations[i].street_Address + "<br/> " + locations[i].city + ", " + locations[i].state;
            marker.OpenStatus = locations[i].locationOpenCloseStatus;
            marker.OpenTime = locations[i].locationStartTime;
            marker.CloseTime = locations[i].locationStopTime;
            marker.DistanceFromUserCurrentLocation = locations[i].distanceInMilesFromUsersLocation;
            marker.NumberOfPeopleInLine = locations[i].numberOfpeopleInLine;
            marker.EstimatedWaitTime = locations[i].estimatedWaitTime;
            marker.LocationGuid = locations[i].locationID;
            marker.RangeLimitInMeters = locations[i].rangeLimitInMeters;

            mapNew.addListener('click', () => {
                if (infowindow) {
                    infowindow.close();
                }
            });


            google.maps.event.addListener(marker, 'click', (function (marker) {
                return function () {
                    InfocusMarker = marker;

                    console.warn("Business Marker clicked");

                    //We are recreating bounds , becuase we only want to show two points in focus
                    //one users current location and the business location that he has selected
                    //We are not deleting the existing/already plotted markers on the map, just recreating bounds.
                    //create empty LatLngBounds object
                    bounds = new google.maps.LatLngBounds();
                    bounds.extend(marker.getPosition());
                    bounds.extend(currentPosMarkerNew.getPosition());
                    mapNew.fitBounds(bounds); //auto-zoom
                    mapNew.panToBounds(bounds); //auto-cente



                    var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
                        currentPosMarkerNew.getPosition(),
                        marker.getPosition()
                    );

                    //console.warn("distance in Meters " + distanceInMeters);
                    //console.warn("function Output 1" + await GetMiles(distanceInMeters));
                    //console.warn("function Output 2" + await  GetMiles(distanceInMeters));
                  

                    for (var i = 0; i < circles.length; i++) {
                        circles[i].setMap(null);
                        circles.splice(i, 1);
                        console.log("Item " + i);
                    }


                    var content = "<span style='font-weight: bold;'>" + marker.LocationName + "</span>"
                    content = content + "<br/> " + marker.Address;
                    if (marker.OpenStatus == "CLOSE") {
                        content = content + "<br/><span class='badge bg-danger'>" + marker.OpenStatus + "</span>";
                    }
                    else {
                        content = content + "<br/><span class='badge bg-success'>" + marker.OpenStatus + "</span>";
                      
                    }
                    content = content + "<br/><span style='font-weight: bold;'> Time : </span> " + formatAMPM( new Date(marker.OpenTime)) + " To " + formatAMPM(new Date(marker.CloseTime));
                    //content = content + "</br><span style='font-weight: bold;'> Closing Time : </span> " + locations[i].locationStopTime;
                    //content = content + "</br><span style='font-weight: bold;'> Open time : </span> " + locationStartTime.toTimeString()
                    //content = content + "</br><span style='font-weight: bold;'> Closing Time : </span> " + locationStopTime.toTimeString();
                    content = content + "<br/>" + "<span style='font-weight: bold;'>Distance from your Location : </span>" +  GetMiles(distanceInMeters);
                    content = content + "<br/>" + "<span style='font-weight: bold;'>Number of People in Line : </span> " + marker.NumberOfPeopleInLine;
                  /*  content = content + "<br/>" + "<span style='font-weight: bold;'>Estimated Wait Time : </span> " + marker.EstimatedWaitTime + " Minutes ";*/


                    //if (marker.OpenStatus != "CLOSE") {

                    //    if (distanceInMeters <= marker.RangeLimitInMeters) {
                    //        content = content + "<br/><button class='btn btn-success mt-2' onclick=GetInLine('" + marker.LocationGuid + "')>GetInLine Here</button>"
                    //        if (distanceInMeters < 100)
                    //            currentPosMarkerNew.setVisible(false);
                    //        else
                    //            currentPosMarkerNew.setVisible(true);

                    //        setTimeout(async () => {
                    //            var circle = await drawCircle(mapNew, marker.getPosition(), marker.RangeLimitInMeters, /* light green color*/ '#00ead3', /* boundry/stroke color */ '#00ead3');
                    //            circles.push(circle);
                    //        }, 100);
                    //    }
                    //    else {
                    //        setTimeout(async () => {
                    //            var circle = await drawCircle(mapNew, marker.getPosition(), marker.RangeLimitInMeters, /*Red color */ '#AA0000', /* boundry/stroke color */ "#FF0000");
                    //            circles.push(circle);
                    //        }, 100);
                    //        currentPosMarkerNew.setVisible(true);
                    //        content = content + "<br/>" + "<span style='font-weight: bold;'>Range: </span>You Must be within " + GetMiles(marker.RangeLimitInMeters) + "  to get Token";
                    //        content = content + "<br/> <span style='font-weight: bold;' class='badge badge-danger'>OUT OF RANGE </span>";
                    //    }

                    //}

                    infowindow.marker = marker;
                    infowindow.setContent(content);
                    infowindow.open(mapNew, marker);
                }
            })(marker, i));

            markersArrray.push(marker);
        }

        //Also include the current marker in the map
        bounds.extend(currentLatLong);

        var center = bounds.getCenter();
        mapNew.setCenter(center);
        //now fit the map to the newly inclusive bounds
        mapNew.fitBounds(bounds);

        mapNew.panToBounds(bounds); //auto-center

    } catch (e) {
        console.error(e);
        console.error("Javascript:displayMarkersOnGoogleMap:-" + e.errorMessage);
    }
} 

export async function drawCircle(map, latlong, radiusInMeters, fillcolor, strokecolor) {
    'use strict';

    var consoleGroupName = GetFunctionName();
    console.group(consoleGroupName);
    CodeRunning = true;
    try {
        const cityCircle = new google.maps.Circle({
            strokeColor: strokecolor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: fillcolor,
            fillOpacity: 0.35,
            map: mapNew,
            center: latlong,
            radius: radiusInMeters //meters

        });
        return cityCircle;
    } catch (e) {

        console.error(e);
    }
    finally {
        // CodeRunning = false; the value is changed to false in idle event to cover up sync events
        console.groupEnd(consoleGroupName);
    }
}
export function GetMiles(meters) {
    'use strict';

    try {
        if (meters == undefined || meters == null)
            return '';

        var miles = meters * 0.000621371192;
        if (miles < 1)
            return meters.toFixed() + ' meters ';
        else
            return miles.toFixed(2) + ' miles ';

    } catch (e) {
        console.error("Error Occured in GetMiles function " + e);
        return '';
    }
}

export async function TopCenterControl(controlDiv, mapNew, text) {
    'use strict';

    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#FFC733";
    controlUI.style.border = "2px solid #FFC733";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginTop = "8px";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to recenter the map";

    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = text;
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        try {

            if (currentPosMarkerNew != null) {
                mapNew.setCenter(currentPosMarkerNew.getPosition());
                mapNew.setZoom(16);
            }
            else {
                console.error("Error in Show My Location Click, CurrentposMarker is null");
            }
           

            //var isInsideBound = mapNew.getBounds().contains(currentPosMarkerNew.getPosition())
            //if (isInsideBound == false) {
            //   // setCenter: latlong,
            //    mapNew.setCenter(currentPosMarkerNew.getPosition());
              
            //    //var bounds = mapNew.getBounds();
            //    //var latlng = currentPosMarkerNew.getPosition();
            //    //bounds.extend(latlng);
            //    //mapNew.fitBounds(bounds); //auto-zoom
            //    //mapNew.panToBounds(bounds); //auto-cente
            //    //mapNew.setZoom(16);
            //}
           
            console.log("Show current Location Button clicked");
        } catch (e) {
            console.log("Error in the click event of Show current location");
        }

    });
}

export async function ClearVariables() {
    'use strict';

    try {
        userPrevLong = "";
        userPrevLat = "";
        if (currentPosMarkerNew != null) {
            currentPosMarkerNew.setMap(null);
            currentPosMarkerNew = null;
        }
       
        mapNew = null;
        
        navigator.geolocation.clearWatch(positionWatchIdNew);
        positionWatchIdNew = -1;
        console.log("Variable Cleared");
        variableLocations = [];
        markersArrray = [];
        InfocusMarker = null;
        //google.maps.event.hasListeners(marker,'click')
        //google.maps.event.clearListeners(map, 'click');

    } catch (e) {
        console.error("Error in ClearVariables");
    }
}