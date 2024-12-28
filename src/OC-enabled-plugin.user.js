// ==UserScript==
// @id             highlight-overclocked-portals
// @name           Highlight overclocked portals
// @author         hisname
// @category       Highlighter
// @version        1.0.0
// @description    Highlight OC portals on Intel map
// @match          *://intel.ingress.com/*
// @match          *://intel-x.ingress.com/*
// @match          *://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==



var L; // to prevent script errors on load
var $; // to prevent script errors on load
var map; // to prevent script errors on load

function wrapper(plugin_info) {
    const isLocalDev = localStorage.getItem("highlight_overclocked_portals_is_dev");
    var url = ""
    if(isLocalDev){
        url = "http://127.0.0.1:3000"
    } else {
        url = "https://vps-on-intel.vercel.app"
    }

    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'hisname@highlight-overclocked-portals';
    plugin_info.dateTimeVersion = '2024-12-25';
    plugin_info.pluginId = 'highlight-overclocked-portals';

    window.plugin.highlightOCPortals = function() {};

    var portalsInViewport = [];

    window.plugin.highlightPortals = function() {  
        var bounds = map.getBounds();
        
        $.each(window.portals, function (guid, portal) {
            var latLng = portal._latlng;
            if (bounds.contains(latLng)) {
                var obj = new Object();
                obj.lat = latLng.lat;
                obj.lng  = latLng.lng;
                portalsInViewport.push(portal)
            }
        });
    };
    

    window.plugin.syncOCPortal = function() {
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    
        var topLeft = map.containerPointToLatLng([0, 0]);
        var bottomRight = map.containerPointToLatLng([screenWidth, screenHeight]);
    
        var boundingBox = L.latLngBounds(topLeft, bottomRight);
        const centerCoords = boundingBox.getCenter()
        var obj = new Object();
        obj.lat = centerCoords.lat
        obj.lng = centerCoords.lng
        var jsonString = JSON.stringify(obj);
        
        const response = fetch(`${url}/api/v1/getPoiInRadius`, { "method": "POST",     
        headers: {
            "Content-Type": "application/json", 
        },
        "body": jsonString
    }).then(response => response.text())
        response.then(v => {
            const overClockResponse = JSON.parse(v)
            for(var o = 0; o < portalsInViewport.length; o++){
                var port = portalsInViewport[o];
                for (var i = 0; i < overClockResponse.length; i++) {
                    var counter = overClockResponse[i];
                    if(port._latlng.lat == counter.lat && port._latlng.lng == counter.lng){
                        port.setStyle({fillColor: '#040500', fillOpacity: 0.75});
                    }
                }
            }
        })
    }
    
    // window.plugin.showOverClockStatus = function(data){
    //     const portalTitle = data.portalData.title
    //     var info = document.getElementById("historydetails");
    //     const response = fetch("https://lightship.hisname.xyz/api/v1/overclock/" + portalTitle, {"method": "GET"}).then(response => response.text())
    //     response.then(v => {
    //         const overClockResponse = JSON.parse(v)
    //         for (var i = 0; i < overClockResponse.length; i++) {
    //             var counter = overClockResponse[i];
    //             if(counter.title === portalTitle){
    //                 info.innerHTML += " | " + '<span id="overclock" class="completed">Overclocked</span>' ;
    //             }
    //         }
    //     })
    // }

    function setup() {        
        addHook('mapDataRefreshStart', window.plugin.syncOCPortal);
        addHook('mapDataRefreshEnd', window.plugin.highlightPortals);
        window.plugin.highlightOCPortals.highlightOC = new L.LayerGroup();
        window.addLayerGroup('Overclocked Enabled', window.plugin.highlightOCPortals.highlightOC, true);
      //  addHook('portalDetailsUpdated', window.plugin.showOverClockStatus);
    }

    setup.info = plugin_info;

    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};

if(typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}

var textContent = document.createTextNode('('+ wrapper +')('+ JSON.stringify(info) +')');
script.appendChild(textContent);
(document.body || document.head || document.documentElement).appendChild(script);
