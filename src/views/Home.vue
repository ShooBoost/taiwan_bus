<template>
  <div class="flex-md w100 pos-relative border-box">
    <section
      id="infoPanel"
      class="w100 w40-md w30-lg h90 h100-md pos-absolute pos-relative-md b0 z-index9999 bg-color-white flex flex-direction-column border-rounded-top-24 border-rounded-none-md pt68-md border-box"
    >
      <div
        @touchstart.prevent.self="setOriginalClientY"
        @touchmove.prevent.self="changeTargetHeight"
        @touchend.prevent.self="touchInfoPanel = false"
        @mousedown.prevent.self="setOriginalClientY"
        @mousemove.prevent.self="changeTargetHeight"
        @mouseup.prevent="touchInfoPanel = false"
        class="py12 text-center material-icons-round fw-bold cursor-pointer display-none-md"
      >
        horizontal_rule
      </div>
      <div
        v-if="Object.keys(stopsOfTheRoute).length === 0"
        class="flex flex-direction-column overflow-scroll flex-grow-1"
        :class="{ 'jc-center': showAlertOfNoFavoriteRoute }"
      >
        <div class="px32">
          <input
            id="inputOfSearchRoute"
            class="w100 border-box mb20 bg-color-grey300 border-none p12 border-rounded-10-md"
            v-model="routeName"
            placeholder="🔍"
          />
        </div>
        <p class="text-center pt12" v-if="showAlertOfNoFavoriteRoute">
          {{ showAlertOfNoFavoriteRoute }}
        </p>
        <RouteSearchPanel
          :routesByKeywords="routesByKeywords"
          @setRouteCityAndNameForGetStops="setRouteCityAndNameForGetStops"
          class="overflow-scroll flex-grow-1"
        ></RouteSearchPanel>
        <div class="w100 py12 px22 border-box fz20">
          <div class="w100 gap10 flex jc-space-around mb10">
            <div
              class="py12 border-rounded w100 text-center bg-color-kb-red color-white fw-bold cursor-pointer"
              @click="routeName = routeName.toString() + '紅'"
            >
              紅
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-kb-blue color-white fw-bold cursor-pointer"
              @click="routeName = routeName.toString() + '藍'"
            >
              藍
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '1'"
            >
              1
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '2'"
            >
              2
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '3'"
            >
              3
            </div>
          </div>
          <div class="w100 gap10 flex jc-space-around mb10">
            <div
              class="py12 border-rounded w100 text-center bg-color-kb-green color-white fw-bold cursor-pointer"
              @click="routeName = routeName.toString() + '綠'"
            >
              綠
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-kb-brown color-white fw-bold cursor-pointer"
              @click="routeName = routeName.toString() + '棕'"
            >
              棕
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '4'"
            >
              4
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '5'"
            >
              5
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '6'"
            >
              6
            </div>
          </div>
          <div class="w100 gap10 flex jc-space-around mb10">
            <div
              class="py12 border-rounded w100 text-center bg-color-kb-orange color-white fw-bold cursor-pointer"
              @click="routeName = routeName.toString() + '橘'"
            >
              橘
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-kb-yellow color-white fw-bold cursor-pointer"
              @click="routeName = routeName.toString() + '黃'"
            >
              黃
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '7'"
            >
              7
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '8'"
            >
              8
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '9'"
            >
              9
            </div>
          </div>
          <div class="w100 gap10 flex jc-space-around">
            <div
              class="py12 border-rounded w100 text-center bg-color-grey600 color-white fw-bold cursor-pointer"
              @click="routeName = routeName.toString() + 'F'"
            >
              F
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey600 color-white fw-bold cursor-pointer"
              @click="routeName = routeName.toString() + '小'"
            >
              小
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-kb-black color-white cursor-pointer"
              @click="focusInput('inputOfSearchRoute')"
            >
              其他
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString() + '0'"
            >
              0
            </div>
            <div
              class="py12 border-rounded w100 text-center bg-color-grey500 cursor-pointer"
              @click="routeName = routeName.toString().slice(0, -1)"
            >
              清除
            </div>
          </div>
        </div>
      </div>
      <!-- 搜尋 路徑 結束 -->
      <!-- 顯示 指定路徑的 即時站牌資訊 開始 -->
      <div v-else class="overflow-scroll flex-grow-1">
        <StopsListPanel
          class="h100"
          :allDirectionStopsOfTheRoute="allDirectionStopsOfTheRoute"
          :prePage="nowPage"
          @setRouteCityAndNameForGetStops="setRouteCityAndNameForGetStops"
          @changeDirection="changeDirectionForMap"
          @changeRoutesToAll="changeRoutesToFavoritesOrAll"
          @renewFavoriteList="renewFavoriteList"
          @renewPopMarker="renewPopMarker"
          @resetNowDirection="nowDirection = 0"
        ></StopsListPanel>
      </div>
      <!-- 顯示 指定路徑的 即時站牌資訊 結束 -->
    </section>
    <section class="w100 w60-md w70-lg h100">
      <Map
        class="w100 h100"
        mapId="homeMap"
        :mapCenter="mapCenter"
        :stops="stops"
        :routeGEOJSON="routeGEOJSON"
        :popMarker="popMarker"
      ></Map>
    </section>
  </div>
</template>
<script>
import getTdxData from "@/mixins/getTdxData";
import RouteSearchPanel from "@/components/RouteSearchPanel.vue";
import StopsListPanel from "@/components/StopsListPanel.vue";
import Map from "@/components/Map.vue";
export default {
  data() {
    return {
      routes: [],
      allRoutes: [],
      favoriteRoutes: [],
      routesByKeywords: [],
      allDirectionStopsOfTheRoute: [],
      stopsOfTheRoute: [],
      stops: [],
      mapCenter: { Lat: "22.997572", Lon: "120.196029" },
      cityOfRoute: "",
      routeName: "",
      vehicleOfTaiwan: [],
      cityList: [],
      vechile: "",
      routeGEOJSON: {},
      originalClientY: 0,
      nowClientY: 0,
      windowHeight: 0,
      originalBoardHeight: 0,
      newBoardHeight: 0,
      touchInfoPanel: "",
      showAlertOfNoFavoriteRoute: "",
      intervalRenewStops: "",
      RouteUID: "",
      DepartureStopNameZh: "",
      DestinationStopNameZh: "",
      CityName: "",
      savedInFavorite: "",
      nowDirection: 0,
      nowPage: "home",
      popMarker: undefined,
    };
  },
  components: { RouteSearchPanel, Map, StopsListPanel },
  mixins: [getTdxData],
  watch: {
    "$route.query": {
      handler: function (query) {
        if (query.routes === "favorite" || Object.keys(query).length === 0) {
          this.changeRoutesToFavoritesOrAll(query.routes === "favorite");
        }
        this.nowPage =
          query.routes === "favorite"
            ? "favorite"
            : Object.keys(query).length === 0
            ? "home"
            : this.nowPage;
      },
      deep: true,
    },
    routeName() {
      if (this.routeName === "" && this.$route.query.routes !== "favorite") {
        this.routesByKeywords = [];
      } else {
        this.filterRouteByKeywords(this.routeName);
      }
    },
  },
  methods: {
    renewPopMarker(sequence) {
      if (sequence !== undefined) {
        this.mapCenter.Lat = this.stops[sequence].StopPosition.PositionLat;
        this.mapCenter.Lon = this.stops[sequence].StopPosition.PositionLon;
      }
      this.popMarker = sequence;
    },
    renewFavoriteList(saveOrNot, routeUID) {
      var renewRoute = this.routes.find((item) => {
        return item.RouteUID === routeUID;
      });
      renewRoute.savedInFavorite = saveOrNot;
    },
    focusInput(id) {
      document.getElementById(id).focus();
    },
    setOriginalClientY(e) {
      console.log(e);
      this.originalClientY = e.touches ? e.touches[0].clientY : e.clientY;
      // this.originalClientY = document.getElementById("infoPanel").offsetTop;
      this.touchInfoPanel = true;
    },
    changeTargetHeight(e) {
      // this.originalClientY
      if (this.touchInfoPanel) {
        this.nowClientY = e.changedTouches
          ? e.changedTouches[0].clientY
          : e.clientY;
        this.originalBoardHeight =
          document.getElementById("infoPanel").offsetHeight;
        this.newBoardHeight =
          this.originalBoardHeight + (this.originalClientY - this.nowClientY);
        document.getElementById("infoPanel").style.height =
          this.newBoardHeight >= this.windowHeight
            ? this.windowHeight + "px"
            : this.newBoardHeight <= 200
            ? "200px"
            : this.newBoardHeight + "px";
        this.originalClientY = this.nowClientY;
        // console.log(e.target.offsetHeight);
      }
    },
    changeDirectionForMap(dir) {
      this.nowDirection = dir;
      this.stopsOfTheRoute = this.allDirectionStopsOfTheRoute[dir];
      this.stops = this.stopsOfTheRoute.Stops;
    },
    filterRouteByKeywords(routeName) {
      this.routesByKeywords = [];
      let _this = this;
      let reg = new RegExp(routeName);
      this.routes.forEach(function (route) {
        if (
          reg.test(route.RouteName.Zh_tw + "*") ||
          reg.test(route.DepartureStopNameZh + "*") ||
          reg.test(route.DestinationStopNameZh + "*")
        ) {
          _this.routesByKeywords.push(route);
        }
      });
    },
    async changeRoutesToFavoritesOrAll(changeToFavorites) {
      this.routeName = "";
      this.stopsOfTheRoute = [];
      this.stops = [];
      this.routeGEOJSON = "";

      // 讀取最愛的站牌
      var localRouteList = localStorage.getItem("favoriteRouteList");
      this.favoriteRouteList = localRouteList ? JSON.parse(localRouteList) : [];

      // this.$route.query.routes === "favorite"
      if (changeToFavorites) {
        this.routes = this.favoriteRouteList;
        this.routesByKeywords = this.favoriteRouteList;
        this.showAlertOfNoFavoriteRoute =
          this.favoriteRouteList.length === 0 ? "還沒有收藏的站牌YO" : "";
      } else {
        this.routes = this.allRoutes;
        this.showAlertOfNoFavoriteRoute = "";
        this.routesByKeywords = [];
      }
    },
    async setRouteCityAndNameForGetStops(
      cityOfRoute,
      routeName,
      RouteUID,
      DepartureStopNameZh,
      DestinationStopNameZh,
      CityName,
      savedInFavorite
    ) {
      this.$router.replace({
        query: {
          cityOfRoute: cityOfRoute,
          routeName: routeName,
          RouteUID: RouteUID,
          DepartureStopNameZh: DepartureStopNameZh,
          DestinationStopNameZh: DestinationStopNameZh,
          CityName: CityName,
        },
      });

      this.cityOfRoute = cityOfRoute;
      this.routeName = routeName;
      this.RouteUID = RouteUID;
      this.DepartureStopNameZh = DepartureStopNameZh;
      this.DestinationStopNameZh = DestinationStopNameZh;
      this.CityName = CityName;
      this.savedInFavorite = savedInFavorite;
      let _this = this;

      // 取得去程與返程分別所經站牌
      this.allDirectionStopsOfTheRoute =
        await _this.sortRealTimeNearStopAndEstimatedTimeByStopsOfTheRoute(
          this.vehicleOfTaiwan,
          cityOfRoute,
          routeName,
          RouteUID
        );
      // 將該路線的起迄點名稱，分別記到去程（direction 0）與回程（direction 1）資料中
      await _this.allDirectionStopsOfTheRoute.forEach((direction) => {
        direction.DepartureStopNameZh = DepartureStopNameZh;
        direction.DestinationStopNameZh = DestinationStopNameZh;
        direction.CityName = CityName;
        direction.savedInFavorite = savedInFavorite;
      });
      // 以 nowDirection (可能是去程 direction 0，或返程 direction 1）作為所經過站牌為初始站牌資料
      _this.stopsOfTheRoute = await _this.allDirectionStopsOfTheRoute[
        _this.nowDirection
      ];

      // 取得路徑圖資
      this.routeGEOJSON = await this.getRouteGEOJSON(cityOfRoute, RouteUID);

      _this.stops = _this.stopsOfTheRoute.Stops;
      let mapCenterSequence =
        this.popMarker === undefined
          ? parseInt(_this.stops.length / 2)
          : this.popMarker;
      _this.mapCenter.Lat =
        _this.stops[mapCenterSequence].StopPosition.PositionLat;
      _this.mapCenter.Lon =
        _this.stops[mapCenterSequence].StopPosition.PositionLon;
      // console.log("_this.mapCenter", _this.mapCenter);
    },
  },
  async mounted() {
    // this.windowHeight = window.innerHeight;
    this.windowHeight = document.getElementById("infoPanel").offsetHeight / 0.9;
  },
  async created() {
    var _this = this;
    (async function () {
      _this.cityList = await _this.getCityList();
      _this.allRoutes = await _this.getRoutesOfTaiwan(await _this.cityList);
      // route list
      _this.changeRoutesToFavoritesOrAll(
        _this.$route.query.routes === "favorite"
      );
      _this.vehicleOfTaiwan = await _this.getVehicleOfTaiwan(
        await _this.cityList
      );
      if (
        _this.$route.query.cityOfRoute &&
        _this.$route.query.routeName &&
        _this.$route.query.RouteUID &&
        _this.$route.query.DepartureStopNameZh &&
        _this.$route.query.DestinationStopNameZh &&
        _this.$route.query.CityName
      ) {
        _this.setRouteCityAndNameForGetStops(
          _this.$route.query.cityOfRoute,
          _this.$route.query.routeName,
          _this.$route.query.RouteUID,
          _this.$route.query.DepartureStopNameZh,
          _this.$route.query.DestinationStopNameZh,
          _this.$route.query.CityName
        );
      }
    })();
    // console.log(this.$route.query);
  },
};
</script>
<style lang="scss">
// @import "@/assets/style/scss/_main.scss";
</style>
