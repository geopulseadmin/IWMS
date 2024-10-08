L.control.scale().addTo(map);

var northArrowControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    container.innerHTML =
      // '<div class="north-arrow" ><i class="fas fa-long-arrow-alt-up p-1"  style="width: 20px; background-color:white;  height: 20px;"></i></div>';
      '<img  src="png/002-cardinal-point.png" alt="" style="width: 30px;  height:50px; border:2px solid darkblue; background:white; border-radius:5px;">';

    return container;
  },
});
map.addControl(new northArrowControl());


