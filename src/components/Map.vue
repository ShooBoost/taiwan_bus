<template>
  <div :id="mapId"></div>
</template>
<script>
// 在地圖上顯示 TDX 資料
import L from "leaflet";

// 自製的 mixin

export default {
  name: "Map",
  props: ["mapId", "mapCenter", "stops", "routeGEOJSON", "popMarker"],
  data() {
    return {
      map: {},
      markers: {},
      layer: L.layerGroup(this.markers),
      layerPostalcodes: {},
      geolayerGroup: {},
    };
  },

  watch: {
    popMarker(popMarker) {
      if (popMarker !== undefined) {
        this.markers[popMarker].openPopup();
      }
    },
    routeGEOJSON() {
      this.showRouteOnMap(this.routeGEOJSON);
      console.log(this.routeGEOJSON);
    },
    stops() {
      this.layer.remove();
      let markers = [];
      this.stops.forEach((stop) => {
        let bgColorClass =
          stop.EstimateTime === "將進站" || stop.EstimateTime === "進站中"
            ? "bg-color-secondary"
            : typeof(stop.EstimateTime) === 'number' ? "bg-color-primary" : "bg-color-grey550";
        let marker = this.newMarker(
          stop.StopSequence,
          stop.StopPosition.PositionLat,
          stop.StopPosition.PositionLon,
          bgColorClass
        );
        marker.bindPopup(
          `${stop.StopName.Zh_tw}<br><b>${stop.EstimateTime}</b>`,
          {
            closeButton: false,
            // closeOnClick: false,
            className: bgColorClass,
          }
        );
        markers.push(marker);
      });
      this.markers = markers;
      this.layer = L.layerGroup(this.markers);
      this.layer.addTo(this.map);
    },
    mapCenter: {
      handler: function () {
        // console.log(
        //   "[this.mapCenter.Lat, this.mapCenter.Lon]",
        //   [this.mapCenter.Lat, this.mapCenter.Lon],
        //   11,
        //   { animate: true }
        // );
        this.map.panTo([this.mapCenter.Lat, this.mapCenter.Lon]);
        // this.map.setView([this.mapCenter.Lat, this.mapCenter.Lon], 11, { animate: true })
      },
      deep: true,
    },
  },
  methods: {
    initalLeafletMap(mapId, posLat, posLon) {
      // inital map
      this.map = L.map(mapId, {
        center: [posLat, posLon],
        zoom: 15,
      });
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 25,
          // id:"mapbox/satellite-v9" 為實景空拍模式
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoibG9ic3RlcjAxIiwiYSI6ImNrdXdvN3prYTUyYXgyb3BoaThwcmcxN2cifQ.CsAL1uSEtZjpGwuEpYA-6A",
        }
      ).addTo(this.map);
    },
    newMarker(sequence, lat, lon, bgColorClass) {
      // 客製化 icon，可以自己設計 html
      var myIcon = L.divIcon({
        // 客製化 icon
        html: `<div class="locationIcon ${bgColorClass}"><span>${sequence}</span></div>`,
        // 給定 icon 大小
        iconSize: [20, 20], // size of the icon
        iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
        popupAnchor: [10, 0], // point from which the popup should open relative to the iconAnchor
      });

      // 讓 marker 使用我們設計的 客製化 icon
      // 並在指定經緯度放上客製化的 marker
      return L.marker([lat, lon], {
        icon: myIcon,
        clickable: true,
        // draggable: true,
      });
    },
    // showSpotOnMap(mapId, lat, lon) {
    //   // 客製化 icon，可以自己設計 html
    //   var myIcon = L.divIcon({
    //     // 客製化 icon
    //     html: `<div class="locationIcon"></div>`,
    //     // 給定 icon 大小
    //     iconSize: [41, 51], // size of the icon
    //     iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
    //     popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
    //   });

    //   // 讓 marker 使用我們設計的 客製化 icon
    //   // 並在指定經緯度放上客製化的 marker
    //   L.marker([lat, lon], {
    //     icon: myIcon,
    //     clickable: true,
    //     draggable: true,
    //   }).addTo(this.map);

    //   //  this.map.addLayer(L.marker([lat, lon], { icon: myIcon, clickable: true,
    //   //  draggable: true }))
    // },
    showRouteOnMap(geoJSON) {
      // 先移除路徑圖資
      this.map.removeLayer(this.geolayerGroup);

      // 換上新的路徑
      this.layerPostalcodes = new L.GeoJSON(geoJSON, {
        style: { color: "#355F8B", weight: 5 },
      });
      this.geolayerGroup = new L.LayerGroup();

      // Add the layerGroup to the map before you add the layerPostalCodes to it.
      this.geolayerGroup.addTo(this.map);
      this.geolayerGroup.addLayer(this.layerPostalcodes);
    },
  },
  mounted() {
    // 先初始化將 leaflet 撲到畫面上
    this.initalLeafletMap(this.mapId, this.mapCenter.Lat, this.mapCenter.Lon);

    // 應該換成定位使用者所在地
    // this.showSpotOnMap(this.mapId, this.mapCenter.Lat, this.mapCenter.Lon);
  },
};
</script>
<style lang="scss">
@import "@/assets/style/scss/_main.scss";
.locationIcon {
  // background-color: $color-primary;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  border: 3px solid rgb(255, 255, 255);
  font-size: 14px;
  font-weight: bolder;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(255, 255, 255);
}
</style>
