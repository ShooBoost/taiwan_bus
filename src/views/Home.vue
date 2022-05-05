<template>
  <div class="flex-md w100 pos-relative border-box">
    <!-- 公車路線搜尋 或 所經站牌 開始 -->
    <section
      id="infoPanel"
      class="
        w100
        w40-md
        w30-lg
        h90
        h100-md
        pos-absolute pos-relative-md
        b0
        z-index9999
        bg-color-white
        flex flex-direction-column
        border-rounded-top-24 border-rounded-none-md
        pt68-md
        border-box
      "
    >
      <!-- mobile 版才有的觸控調整 infoPanel 大小 開始 -->
      <div
        @touchstart.prevent.self="setOriginalClientY"
        @touchmove.prevent.self="changeTargetHeight"
        @touchend.prevent.self="touchingInfoPanelOrNot = false"
        @mousedown.prevent.self="setOriginalClientY"
        @mousemove.prevent.self="changeTargetHeight"
        @mouseup.prevent="touchingInfoPanelOrNot = false"
        class="
          py12
          text-center
          material-icons-round
          fw-bold
          cursor-pointer
          display-none-md
        "
      >
        horizontal_rule
      </div>
      <!-- mobile 版才有的觸控調整 infoPanel 大小 結束 -->
      <!-- 路線搜尋 開始 -->
      <div
        v-if="Object.keys(chosenDirectionOfChosenRoute).length === 0"
        class="flex flex-direction-column overflow-scroll flex-grow-1"
        :class="{ 'jc-center': signOfEmptyFavoriteRoute }"
      >
        <div class="px32">
          <input
            id="inputOfSearchRoute"
            class="
              w100
              border-box
              mb20
              bg-color-grey300
              border-none
              p12
              border-rounded-10-md
            "
            v-model="routeName"
            placeholder="🔍"
          />
        </div>
        <p class="text-center pt12" v-if="signOfEmptyFavoriteRoute">
          {{ signOfEmptyFavoriteRoute }}
        </p>
        <RouteSearchPanel
          :routesByKeywords="currentRoutesFilterByKeywords"
          @getStopsOfRoute="getStopsOfRoute"
          class="overflow-scroll flex-grow-1"
        ></RouteSearchPanel>
        <div class="w100 py12 px22 border-box fz20">
          <div class="w100 gap10 flex jc-space-around mb10">
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-kb-red
                color-white
                fw-bold
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '紅'"
            >
              紅
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-kb-blue
                color-white
                fw-bold
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '藍'"
            >
              藍
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '1'"
            >
              1
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '2'"
            >
              2
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '3'"
            >
              3
            </div>
          </div>
          <div class="w100 gap10 flex jc-space-around mb10">
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-kb-green
                color-white
                fw-bold
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '綠'"
            >
              綠
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-kb-brown
                color-white
                fw-bold
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '棕'"
            >
              棕
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '4'"
            >
              4
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '5'"
            >
              5
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '6'"
            >
              6
            </div>
          </div>
          <div class="w100 gap10 flex jc-space-around mb10">
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-kb-orange
                color-white
                fw-bold
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '橘'"
            >
              橘
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-kb-yellow
                color-white
                fw-bold
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '黃'"
            >
              黃
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '7'"
            >
              7
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '8'"
            >
              8
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '9'"
            >
              9
            </div>
          </div>
          <div class="w100 gap10 flex jc-space-around">
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey600
                color-white
                fw-bold
                cursor-pointer
              "
              @click="routeName = routeName.toString() + 'F'"
            >
              F
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey600
                color-white
                fw-bold
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '小'"
            >
              小
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-kb-black
                color-white
                cursor-pointer
              "
              @click="focusInput('inputOfSearchRoute')"
            >
              其他
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString() + '0'"
            >
              0
            </div>
            <div
              class="
                py12
                border-rounded
                w100
                text-center
                bg-color-grey500
                cursor-pointer
              "
              @click="routeName = routeName.toString().slice(0, -1)"
            >
              清除
            </div>
          </div>
        </div>
      </div>
      <!-- 路線搜尋 結束 -->
      <!-- 特定路線的即時站牌資訊 開始 -->
      <div v-else class="overflow-scroll flex-grow-1">
        <StopsListPanel
          class="h100"
          :allDirectionsOfTheChosenRoute="allDirectionsOfTheChosenRoute"
          :prePage="nowPage"
          @renewStopsOfRoute="getStopsOfRoute"
          @changeDirection="changeDirectionForMap"
          @changeRoutesToAll="showFavoriteRoutesOrAllRoutesOfTaiwan"
          @renewFavoriteRoutes="renewFavoriteRoutes"
          @renewPopMarker="renewPopMarker"
          @resetNowDirection="indexOfChosenDirection = 0"
        ></StopsListPanel>
      </div>
      <!-- 特定路線的即時站牌資訊 結束 -->
    </section>
    <!-- 公車路線搜尋 或 所經站牌 結束 -->
    <!-- 地圖 開始 -->
    <section class="w100 w60-md w70-lg h100">
      <Map
        class="w100 h100"
        mapId="homeMap"
        :mapCenter="mapCenter"
        :stops="stopsOfChosenDirection"
        :routeGEOJSON="routeGEOJSON"
        :popMarker="popMarker"
      ></Map>
    </section>
    <!-- 地圖 結束 -->
  </div>
</template>
<script>
// import qs from "qs";
// import axios from "axios";
import getTdxData from "@/mixins/getTdxData";
import RouteSearchPanel from "@/components/RouteSearchPanel.vue";
import StopsListPanel from "@/components/StopsListPanel.vue";
import Map from "@/components/Map.vue";
export default {
  data() {
    return {
      allRoutesOfTaiwan: [],
      allRoutesOfFavorite: [],
      currentRoutes: [],
      currentRoutesFilterByKeywords: [],

      allDirectionsOfTheChosenRoute: [],
      indexOfChosenDirection: 0,
      // chosenDirectionOfChosenRoute: this.allDirectionsOfTheChosenRoute[this.indexOfChosenDirection],
      chosenDirectionOfChosenRoute: [],
      stopsOfChosenDirection: [],
      mapCenter: { Lat: "22.997572", Lon: "120.196029" },

      routeName: "",
      cities: [],

      routeGEOJSON: {},

      originalClientY: 0,
      nowClientY: 0,
      windowHeight: 0,
      originalBoardHeight: 0,
      newBoardHeight: 0,
      touchingInfoPanelOrNot: "",

      signOfEmptyFavoriteRoute: "",

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
          this.showFavoriteRoutesOrAllRoutesOfTaiwan();
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
        this.currentRoutesFilterByKeywords = [];
      } else {
        this.filterRouteByKeywords(this.routeName);
      }
    },
  },
  methods: {
    renewPopMarker(sequence) {
      if (sequence !== undefined && this.stopsOfChosenDirection[sequence]) {
        this.mapCenter.Lat =
          this.stopsOfChosenDirection[sequence].StopPosition.PositionLat;
        this.mapCenter.Lon =
          this.stopsOfChosenDirection[sequence].StopPosition.PositionLon;
      }
      this.popMarker = sequence;
    },
    renewFavoriteRoutes(saveOrNot, routeUID) {
      var renewRoute = this.currentRoutes.find((item) => {
        return item.RouteUID === routeUID;
      });
      renewRoute.savedInFavorite = saveOrNot;
    },
    focusInput(id) {
      document.getElementById(id).focus();
    },
    setOriginalClientY(e) {
      this.originalClientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.touchingInfoPanelOrNot = true;
    },
    changeTargetHeight(e) {
      if (this.touchingInfoPanelOrNot) {
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
      }
    },
    changeDirectionForMap(dir) {
      this.indexOfChosenDirection = dir;
      this.chosenDirectionOfChosenRoute =
        this.allDirectionsOfTheChosenRoute[dir];
      this.stopsOfChosenDirection = this.chosenDirectionOfChosenRoute.Stops;
    },
    filterRouteByKeywords(routeName) {
      this.currentRoutesFilterByKeywords = [];
      let _this = this;
      let reg = new RegExp(routeName);
      this.currentRoutes.forEach(function (route) {
        if (
          reg.test(route.RouteName.Zh_tw + "*")
        ) {
          _this.currentRoutesFilterByKeywords.push(route);
        }
      });
    },
    showFavoriteRoutesOrAllRoutesOfTaiwan() {
      this.deselectChosenRoute();
      this.saveFavoriteRoutesFromLocalStorage();
      if (this.$route.query.routes === "favorite") {
        this.setCurrentRoutesWith({
          routes: this.allRoutesOfFavorite,
          routesFilterByKeywords: this.allRoutesOfFavorite,
        });
      } else {
        this.setCurrentRoutesWith({ routes: this.allRoutesOfTaiwan });
      }
    },
    deselectChosenRoute() {
      this.routeName = "";
      this.chosenDirectionOfChosenRoute = [];
      this.stopsOfChosenDirection = [];
      this.routeGEOJSON = "";
    },
    async saveFavoriteRoutesFromLocalStorage() {
      var localRouteList = localStorage.getItem("favoriteRouteList");
      this.allRoutesOfFavorite = localRouteList
        ? JSON.parse(localRouteList)
        : [];

      this.allRoutesOfFavorite.forEach((favoriteRoute) => {
        let sameRoute = this.allRoutesOfTaiwan.filter((route) => {
          return route.RouteUID === favoriteRoute.RouteUID;
        });
        if (sameRoute[0]) {
          sameRoute[0].savedInFavorite = true;
        }
      });
    },
    setCurrentRoutesWith({
      routes = this.allRoutesOfTaiwan,
      routesFilterByKeywords = [],
    }) {
      this.currentRoutes = routes;
      this.currentRoutesFilterByKeywords = routesFilterByKeywords;
      this.signOfEmptyFavoriteRoute =
        routes.length === 0 ? "還沒有收藏的站牌YO" : "";
    },
    async getStopsOfRoute({
      cityOfRoute = this.$route.query.cityOfRoute,
      routeName = this.$route.query.routeName,
      RouteUID = this.$route.query.RouteUID,
      DepartureStopNameZh = this.$route.query.DepartureStopNameZh,
      DestinationStopNameZh = this.$route.query.DestinationStopNameZh,
      CityName = this.$route.query.CityName,
      savedInFavorite,
    }) {
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
      this.routeName = routeName;
      let _this = this;

      // 取得去程與返程分別所經站牌
      this.allDirectionsOfTheChosenRoute =
        await _this.sortRealTimeNearStopAndEstimatedTimeByStopsOfTheRoute(
          await this.getVehicleOfTaiwan(this.cities),
          cityOfRoute,
          routeName,
          RouteUID
        );
      // 將該路線的起迄點名稱，分別記到去程（direction 0）與回程（direction 1）資料中
      await _this.allDirectionsOfTheChosenRoute.forEach((direction) => {
        direction.DepartureStopNameZh = DepartureStopNameZh;
        direction.DestinationStopNameZh = DestinationStopNameZh;
        direction.CityName = CityName;
        direction.savedInFavorite = savedInFavorite;
      });
      // 以 indexOfChosenDirection (可能是去程 direction 0，或返程 direction 1）作為所經過站牌為初始站牌資料
      _this.chosenDirectionOfChosenRoute = await _this
        .allDirectionsOfTheChosenRoute[_this.indexOfChosenDirection];

      // 取得路徑圖資
      this.routeGEOJSON = await this.getRouteGEOJSON(cityOfRoute, routeName);

      _this.stopsOfChosenDirection = _this.chosenDirectionOfChosenRoute.Stops;
      let sequenceForCenterMap =
        this.popMarker === undefined
          ? parseInt(_this.stopsOfChosenDirection.length / 2)
          : this.popMarker;
      _this.mapCenter.Lat =
        _this.stopsOfChosenDirection[
          sequenceForCenterMap
        ].StopPosition.PositionLat;
      _this.mapCenter.Lon =
        _this.stopsOfChosenDirection[
          sequenceForCenterMap
        ].StopPosition.PositionLon;
    },
    showStopsOfSpecificRouteOrNot() {
      return (
        this.$route.query.cityOfRoute &&
        this.$route.query.routeName &&
        this.$route.query.RouteUID &&
        this.$route.query.DepartureStopNameZh &&
        this.$route.query.DestinationStopNameZh &&
        this.$route.query.CityName
      );
    },
  },
  mounted() {
    this.windowHeight = document.getElementById("infoPanel").offsetHeight / 0.9;

    // async function GetAuthorizationHeader() {
    //   const parameter = {
    //     grant_type: "client_credentials",
    //     client_id: "shooboost-0659506a-9440-4f49",
    //     client_secret: "f075a3b1-3567-47d5-9926-e413ba6d3d42",
    //   };
    //   let auth_url = `https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token`;
    //   try {
    //     let res = await axios({
    //       method: "POST",
    //       url: auth_url,
    //       data: qs.stringify(parameter),
    //       headers: { "content-type": "application/x-www-form-urlencoded" },
    //     });
    //     return res.data;
    //   } catch (err) {
    //     return err;
    //   }
    // }

    // async function GetApiResponse() {
    //   let accesstoken = await GetAuthorizationHeader();
    //   let apiUrl =
    //     "https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON";
    //   try {
    //     let res = await axios({
    //       method: "GET",
    //       url: apiUrl,
    //       headers: {
    //         authorization: `Bearer ${accesstoken.access_token}`,
    //       },
    //     });
    //     console.log("CIIIIITY", await res);
    //     return await res;
    //   } catch (err) {
    //     console.log("EEEERRRRRRR GET", err);
    //   }
    // }
    // GetApiResponse();
  },
  async created() {
    this.cities = await this.getCityList();
    this.allRoutesOfTaiwan = await this.getRoutesOfTaiwan(this.cities);
    // this.allRoutesOfTaiwan = await this.getRoutesOfTheCity("Taipei", "臺北市");
    this.showFavoriteRoutesOrAllRoutesOfTaiwan();

    if (this.showStopsOfSpecificRouteOrNot()) {
      this.getStopsOfRoute({});
    }
  },
};
</script>
