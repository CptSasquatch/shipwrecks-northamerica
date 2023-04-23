// create the icon variable
var wreckIcon
var wreckType
// declare number of wrecks variable
var numWrecks
// create a function that returns the correct icon for the wreck type
function getIcon(wreckType) {
    // create a switch statement that will return the correct icon for the wreck type
    switch (wreckType) {
        case "Not Charted":
            wreckIcon = L.icon({
                iconUrl: "static/images/marker_uncharted.svg",
                iconSize: [70, 70],
                iconAnchor: [35, 70],
                popupAnchor: [0, -70]
            });
            return wreckIcon;
        case "Wreck - Submerged, dangerous to surface navigation":
            wreckIcon = L.icon({
                iconUrl: "static/images/marker_danger.svg",
                iconSize: [70, 70],
                iconAnchor: [35, 70],
                popupAnchor: [0, -70]
            });
            return wreckIcon;
        case "Wreck - Submerged, nondangerous":
            wreckIcon = L.icon({
                iconUrl: "static/images/marker_safe.svg",
                iconSize: [70, 70],
                iconAnchor: [35, 70],
                popupAnchor: [0, -70]
            });
            return wreckIcon;
        case "Wreck - Visible":
            wreckIcon = L.icon({
                iconUrl: "static/images/marker_vis.svg",
                iconSize: [70, 70],
                iconAnchor: [35, 70],
                popupAnchor: [0, -70]
            });
            return wreckIcon;
    }
}
// create the tile layers that will be the background of the map
let satellite = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
let black = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
// create the map object with a center and zoom level
let map = L.map('map', {
    center: [39.5, -98.5],
    zoom: 4,
    layers: [street]
});
// create a base layer that holds the maps
let baseMaps = {
    "Satellite": satellite,
    "Street": street,
    "Black": black
};
// create heatmap variables
let allwrecks = new L.LayerGroup();
let uncharted = new L.LayerGroup();
let danger = new L.LayerGroup();
let safe = new L.LayerGroup();
let visible = new L.LayerGroup();
// declare the overlay object to hold the heatmap layers
let overlayMaps = {
    "All Wrecks": allwrecks,
    "Not Charted": uncharted,
    "Submerged, dangerous": danger,
    "Submerged, nondangerous": safe,
    "Visible": visible
};
// add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
// only one heatmap can be selected at a time
let inputs = document.getElementsByClassName('leaflet-control-layers-selector');
inputs[3].onclick = function() {
    inputs[4].checked = false;
    inputs[5].checked = false;
    inputs[6].checked = false;
    inputs[7].checked = false;
    uncharted.clearLayers();
    danger.clearLayers();
    safe.clearLayers();
    visible.clearLayers();
    // get the data for each heatmap and it to the layer groups
    d3.json("static/data/shipwreck.json").then(function(data) {
        // create a variable the holds the lat and long of each wreck
        let wreckLoc = data.map(wreck => [wreck.lat, wreck.lng]);
        allwrecks.addLayer(L.heatLayer(wreckLoc, {
            radius: 20,
            blur: 25,
            useLocalExtrema: true,
            minOpacity: 0.5
            }));
    });
};
inputs[4].onclick = function() {
    inputs[3].checked = false;
    inputs[5].checked = false;
    inputs[6].checked = false;
    inputs[7].checked = false;
    allwrecks.clearLayers();
    danger.clearLayers();
    safe.clearLayers();
    visible.clearLayers();
    // filter the data for uncharted wrecks
    d3.json("static/data/shipwreck.json").then(function(data) {
        // create a variable the holds the lat and long of each wreck
        let unchartedWrecks = data.filter(wreck => wreck.type === "Not Charted");
        let unchartedLoc = unchartedWrecks.map(wreck => [wreck.lat, wreck.lng]);
        uncharted.addLayer(L.heatLayer(unchartedLoc, {
            radius: 20,
            blur: 25,
            useLocalExtrema: true,
            minOpacity: 0.5
            }));
    });
};
inputs[5].onclick = function() {
    inputs[3].checked = false;
    inputs[4].checked = false;
    inputs[6].checked = false;
    inputs[7].checked = false;
    allwrecks.clearLayers();
    uncharted.clearLayers();
    safe.clearLayers();
    visible.clearLayers();
    // filter the data for dangerous wrecks
    d3.json("static/data/shipwreck.json").then(function(data) {
        // create a variable the holds the lat and long of each wreck
        let dangerWrecks = data.filter(wreck => wreck.type === "Wreck - Submerged, dangerous to surface navigation");
        let dangerLoc = dangerWrecks.map(wreck => [wreck.lat, wreck.lng]);
        danger.addLayer(L.heatLayer(dangerLoc, {
            radius: 20,
            blur: 25,
            useLocalExtrema: true,
            minOpacity: 0.5
            }));
    });
};
inputs[6].onclick = function() {
    inputs[3].checked = false;
    inputs[4].checked = false;
    inputs[5].checked = false;
    inputs[7].checked = false;
    allwrecks.clearLayers();
    uncharted.clearLayers();
    danger.clearLayers();
    visible.clearLayers();
    // filter the data for safe wrecks
    d3.json("static/data/shipwreck.json").then(function(data) {
        // create a variable the holds the lat and long of each wreck
        let safeWrecks = data.filter(wreck => wreck.type === "Wreck - Submerged, nondangerous");
        let safeLoc = safeWrecks.map(wreck => [wreck.lat, wreck.lng]);
        safe.addLayer(L.heatLayer(safeLoc, {
            radius: 20,
            blur: 25,
            useLocalExtrema: true,
            minOpacity: 0.5
            }));
    });
};
inputs[7].onclick = function() {
    inputs[3].checked = false;
    inputs[4].checked = false;
    inputs[5].checked = false;
    inputs[6].checked = false;
    allwrecks.clearLayers();
    uncharted.clearLayers();
    danger.clearLayers();
    safe.clearLayers();
    // filter the data for visible wrecks
    d3.json("static/data/shipwreck.json").then(function(data) {
        // create a variable the holds the lat and long of each wreck
        let visibleWrecks = data.filter(wreck => wreck.type === "Wreck - Visible");
        let visibleLoc = visibleWrecks.map(wreck => [wreck.lat, wreck.lng]);
        visible.addLayer(L.heatLayer(visibleLoc, {
            radius: 20,
            blur: 25,
            useLocalExtrema: true,
            minOpacity: 0.5
            }));
    });
};


// add scale to the map
L.control.scale().addTo(map);
// add mouse position to the map
L.Control.MousePosition = L.Control.extend({
    options: {
      text: '#fff',
      position: 'bottomleft',
      separator: ' : ',
      emptyString: 'Unavailable',
      lngFirst: false,
      numDigits: 5,
      lngFormatter: undefined,
      latFormatter: undefined,
      prefix: ""
    },
  
    onAdd: function (map) {
      this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
      L.DomEvent.disableClickPropagation(this._container);
      map.on('mousemove', this._onMouseMove, this);
      this._container.innerHTML=this.options.emptyString;
      return this._container;
    },
  
    onRemove: function (map) {
      map.off('mousemove', this._onMouseMove)
    },
  
    _onMouseMove: function (e) {
      var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
      var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
      var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
      var prefixAndValue = this.options.prefix + ' ' + value;
      this._container.innerHTML = prefixAndValue;
    }
  
  });
  
  L.Map.mergeOptions({
      positionControl: false
  });
  
  L.Map.addInitHook(function () {
      if (this.options.positionControl) {
          this.positionControl = new L.Control.MousePosition();
          this.addControl(this.positionControl);
      }
  });
  
  L.control.mousePosition = function (options) {
      return new L.Control.MousePosition(options);
  };
L.control.mousePosition().addTo(map);
// create an array to populate the dropdown menu
var amounts = ['--Select Amount--', 50, 200, 350, 500, 650, 800, 950, 1100, 1350, 1500];
// create a function to set number of wrecks to display
function setNumWrecks() {
    var dropdownMenu = L.DomUtil.create("select", "dropdown");
    dropdownMenu.id = "wreckNum";
    // set the default number of wrecks to display
    numWrecks = 200;
    dropdownMenu.onchange = function () {
        numWrecks = dropdownMenu.value;
        createMap();
        button.state('remove-wrecks');
    };
    amounts.forEach(function (amount) {
        var option = L.DomUtil.create("option", "option");
        option.value = amount;
        option.innerHTML = amount;
        dropdownMenu.appendChild(option);
    });
    L.DomUtil.get("map").appendChild(dropdownMenu);
    // on initial load, create the map with the default number of wrecks
    createMap();

}
setNumWrecks();
// create a function that produces a map that shows a random selection of specified number of shipwrecks
function createMap() {
    // import the data from the json file
    d3.json("static/data/shipwreck.json").then(function (wreckData) {
        // create a variable that is a random number between 0 and the length of the wreck data minus variable value
        let randNum = wreckData.sort(function () { return 0.5 - Math.random() }).slice(0, numWrecks);
        // create a layer group for the wrecks
        let wrecks = L.layerGroup();
        // loop through the wreck locations and add a marker to the layer group
        randNum.forEach(function (location) {
            // call the getIcon function to get the correct icon for the wreck type
            wreckIcon = getIcon(location.type);
            // add a marker to the layer group
            wrecks.addLayer(L.marker(location, {icon:wreckIcon}).bindPopup(`<h3>Name: ${location.name}</h3><hr><p>Type: ${location.type}<br><br>History: ${location.history}</p>`));
        }
        );                
        // add the layer group to the map
        wrecks.addTo(map);
        // add an event listener that will add a marker of the closest wreck to the map where the map is clicked
        map.on('click', function (e) {
            // create a variable that is the lat and long of the click and convert it to a turf point   
            let clickLocation = turf.point([e.latlng.lng, e.latlng.lat]);
            // create a variable that is an array of the lat and long of the shipwrecks in geojson format
            let wreckLocations = wreckData.map(wreck => turf.point([wreck.lng, wreck.lat]));
            // create a variable that is a feature collection of the wreck locations
            let wreckCollection = turf.featureCollection(wreckLocations);
            // create a variable that is the closest wreck to the click location
            let closestWreck = turf.nearestPoint(clickLocation, wreckCollection);
            // find the wreck in the wreck data that matches the closest wreck
            let wreck = wreckData.find(wreck => wreck.lat === closestWreck.geometry.coordinates[1] && wreck.lng === closestWreck.geometry.coordinates[0]);
            // call the getIcon function to get the correct icon for the wreck type
            wreckIcon = getIcon(wreck.type);
            // use the wreck data to create a marker for the closest wreck
            let wreckMarker = L.marker([wreck.lat, wreck.lng], {icon:wreckIcon}).bindPopup(`<h3>Name: ${wreck.name}</h3><hr><p>Type: ${wreck.type}<br><br>History: ${wreck.history}</p>`);
            // add the marker to the map
            wreckMarker.addTo(map);
            deleteButton.addTo(map);
        });
    });
}
// create a function that adds markers for all the shipwrecks of a specified type
function addWrecks(type) {
    // create a variable that uses the endpoint to get the data for the specified wreck type
    let wreckUrl = "static/data/shipwreck.json";
    // import the data from the json file
    d3.json(wreckUrl).then(function (wreckData) {
        // filter the data to only include the specified wreck type
        wreckData = wreckData.filter(wreck => wreck.type === type);
        // create a layer group for the wrecks
        let wrecks = L.layerGroup();
        // loop through the wreck locations and add a marker to the layer group
        wreckData.forEach(function (location) {
            // call the getIcon function to get the correct icon for the wreck type
            wreckIcon = getIcon(location.type);
            // add a marker to the layer group
            wrecks.addLayer(L.marker(location, {icon:wreckIcon}).bindPopup(`<h3>Name: ${location.name}</h3><hr><p>Type: ${location.type}<br><br>History: ${location.history}</p>`));
        }
        );
        // add the layer group to the map
        wrecks.addTo(map);
        // console log the number of wrecks added
        console.log(`Added ${wreckData.length} "${type}" shipwrecks`);
    });
}
// add a button to the map that will call the createMap function
let button = L.easyButton({
    states: [
    {
        stateName: 'remove-wrecks',
        icon: 'fa-trash',
        title: 'Remove Shipwrecks',
        onClick: function (btn, map) {
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            btn.state('add-wrecks');
            wreckButton4.state('add-wrecks');
            wreckButton3.state('add-wrecks');
            wreckButton2.state('add-wrecks');
            wreckButton1.state('add-wrecks');
        }
    },
    {
        stateName: 'add-wrecks',
        icon: 'fa-sailboat',
        title: 'Add Random Shipwrecks',
        onClick: function (btn, map) {
            createMap();
            btn.state('remove-wrecks');
        }
    }]
});
button.addTo(map);
// add a button to add markers for all the visible shipwrecks
let wreckButton1 = L.easyButton({
    states: [{
        stateName: 'add-wrecks',
        icon: 'fa-eye',
        title: 'Add Visible Shipwrecks',
        onClick: function (btn, map) {
            addWrecks("Wreck - Visible");
            btn.state('remove-wrecks');
        }
    },
    {
        stateName: 'remove-wrecks',
        icon: 'fa-trash',
        title: 'Remove Shipwrecks',
        onClick: function (btn, map) {
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            btn.state('add-wrecks');
            wreckButton4.state('add-wrecks');
            wreckButton2.state('add-wrecks');
            wreckButton3.state('add-wrecks');
            button.state('add-wrecks');
        }
    }]
});
wreckButton1.addTo(map);
// add a button to add markers for all the dangerous shipwrecks
let wreckButton2 = L.easyButton({
    states: [{
        stateName: 'add-wrecks',
        icon: 'fa-skull-crossbones',
        title: 'Add Submerged, Dangerous Shipwrecks',
        onClick: function (btn, map) {
            addWrecks("Wreck - Submerged, dangerous to surface navigation");
            btn.state('remove-wrecks');
        }
    },
    {
        stateName: 'remove-wrecks',
        icon: 'fa-trash',
        title: 'Remove Shipwrecks',
        onClick: function (btn, map) {
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            btn.state('add-wrecks');
            wreckButton4.state('add-wrecks');
            wreckButton3.state('add-wrecks');
            wreckButton1.state('add-wrecks');
            button.state('add-wrecks');
        }
    }]
});
wreckButton2.addTo(map);
// add a button to add markers for all the submerged nondangerous shipwrecks
let wreckButton3 = L.easyButton({
    states: [{
        stateName: 'add-wrecks',
        icon: 'fa-anchor',
        title: 'Add Submerged, Nondangerous Shipwrecks',
        onClick: function (btn, map) {
            addWrecks("Wreck - Submerged, nondangerous");
            btn.state('remove-wrecks');
        }
    },
    {
        stateName: 'remove-wrecks',
        icon: 'fa-trash',
        title: 'Remove Shipwrecks',
        onClick: function (btn, map) {
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            btn.state('add-wrecks');
            wreckButton4.state('add-wrecks');
            wreckButton2.state('add-wrecks');
            wreckButton1.state('add-wrecks');
            button.state('add-wrecks');
        }
    }]
});
wreckButton3.addTo(map);
// add a button to add markers for all the uncharted shipwrecks
let wreckButton4 = L.easyButton({
    states: [{
        stateName: 'add-wrecks',
        icon: 'fa-question',
        title: 'Add Uncharted Shipwrecks',
        onClick: function (btn, map) {
            addWrecks("Not Charted");
            btn.state('remove-wrecks');
        }
    },
    {
        stateName: 'remove-wrecks',
        icon: 'fa-trash',
        title: 'Remove Shipwrecks',
        onClick: function (btn, map) {
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            btn.state('add-wrecks');
            wreckButton3.state('add-wrecks');
            wreckButton2.state('add-wrecks');
            wreckButton1.state('add-wrecks');
            button.state('add-wrecks');
        }
    }]
});
wreckButton4.addTo(map);
// add a button to remove all of the shipwreck markers
let deleteButton = L.easyButton({
    states: [{
        stateName: 'remove-wrecks',
        icon: 'fa-trash',
        title: 'Remove Shipwrecks',
        onClick: function (btn, map) {
            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
        deleteButton.removeFrom(map);
        }
    }]
});
// add a splash screen that will appear when the page is loaded
let splash = L.easyButton({
    states: [{
        stateName: 'splash',
        icon: 'fa-info-circle',
        title: 'Click for more information',
        onClick: function (btn, map) {
            splashScreen();
            btn.state('remove-splash');
        }
    },
    {
        stateName: 'remove-splash',
        icon: 'fa-trash',
        title: 'Remove Splash Screen',
        onClick: function (btn, map) {
            removeSplash();
            btn.state('splash');
        }
    }]
});
splash.addTo(map);
// create a function for the splash screen
function splashScreen() {
    let splashyScreen = L.control({
        position: 'topleft'
    });
    splashyScreen.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'splash-screen');
        div.innerHTML = "<div><button class='x-button'>X</button><h1>Shipwreck Map</h1><p>Map showing the location of shipwrecks in North America.</p><ul><li>Add/remove the shipwrecks by clicking on the buttons in the top left corner of the map.</li><li>Zoom in/out by using the buttons in the top left corner of the map.</li><li>Move the map by clicking and dragging the map.</li><li>Click on the markers to see info about the shipwreck.</li><li>Add a heatmap by using the checkboxes in the layer controls at the top right corner.</li><li>Click anywhere on the map and a marker will be added to the map of the shipwreck closest to the location clicked.</li></ul></div>";
        // add an x button to remove the splash screen
        let xButton = div.getElementsByClassName("x-button")[0];
        splash.state('remove-splash');
        xButton.onclick = function () {
            removeSplash();
            splash.state('splash');
        }

        return div;
    }
    splashyScreen.addTo(map);
}
// create a function to remove the splash screen
function removeSplash() {
    // identify the splash screen
    let splashyScreen = document.getElementsByClassName("splash-screen")[0];
    // remove the splash screen
    splashyScreen.remove();
}
// splashScreen();