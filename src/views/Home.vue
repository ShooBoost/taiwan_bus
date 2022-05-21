<template>
  <div class="flex-md w100 pos-relative border-box">
    <!-- 公車路線搜尋 或 所經站牌 開始 -->
    <section
      id="infoPanel"
      class="w100 w40-md w30-lg h90 h100-md pos-absolute pos-relative-md b0 z-index9999 bg-color-white flex flex-direction-column border-rounded-top-24 border-rounded-none-md pt68-md border-box"
    >
      <!-- mobile 版才有的觸控調整 infoPanel 大小 開始 -->
      <div
        @touchstart.prevent.self="setOriginalClientY"
        @touchmove.prevent.self="changeTargetHeight"
        @touchend.prevent.self="touchingInfoPanelOrNot = false"
        @mousedown.prevent.self="setOriginalClientY"
        @mousemove.prevent.self="changeTargetHeight"
        @mouseup.prevent="touchingInfoPanelOrNot = false"
        class="py12 text-center material-icons-round fw-bold cursor-pointer display-none-md"
      >
        horizontal_rule
      </div>
      <!-- mobile 版才有的觸控調整 infoPanel 大小 結束 -->
      <!-- 路線搜尋 開始 -->
      <div
        v-if="Object.keys(chosenDirection).length === 0"
        class="flex flex-direction-column overflow-scroll flex-grow-1"
        :class="{ 'jc-center': signOfEmptyFavoriteRoute }"
      >
        <div class="px32">
          <input
            id="inputOfSearchRoute"
            class="w100 border-box mb20 bg-color-grey300 border-none p12 border-rounded-10-md"
            v-model="routeName"
            placeholder="🔍"
          />
        </div>
        <p
          class="text-center pt12"
          v-if="$route.query.routes === 'favorite' && signOfEmptyFavoriteRoute"
        >
          {{ signOfEmptyFavoriteRoute }}
        </p>
        <RouteSearchPanel
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
      <!-- 路線搜尋 結束 -->
      <!-- 特定路線的即時站牌資訊 開始 -->
      <div v-else class="overflow-scroll flex-grow-1">
        <StopsListPanel class="h100" :prePage="nowPage"></StopsListPanel>
      </div>
      <!-- 特定路線的即時站牌資訊 結束 -->
    </section>
    <!-- 公車路線搜尋 或 所經站牌 結束 -->
    <!-- 地圖 開始 -->
    <section class="w100 w60-md w70-lg h100">
      <Map class="w100 h100" mapId="homeMap"></Map>
    </section>
    <!-- 地圖 結束 -->
  </div>
</template>
<script>
import getTdxData from "@/mixins/getTdxData";
import RouteSearchPanel from "@/components/RouteSearchPanel.vue";
import StopsListPanel from "@/components/StopsListPanel.vue";
import Map from "@/components/Map.vue";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      originalClientY: 0,
      nowClientY: 0,
      windowHeight: 0,
      originalBoardHeight: 0,
      newBoardHeight: 0,
      touchingInfoPanelOrNot: "",

      nowPage: "home",
    };
  },
  computed: {
    ...mapState(["chosenRoute", "allRoutesOfFavorite", "allRoutesOfTaiwan"]),
    ...mapState("stops", ["sequenceOfChosenStop"]),
    ...mapState("routes", ["keywordsForSearchTheRoute", "routesOfCurrentPage"]),
    ...mapGetters("routes", ["routesByKeywords"]),
    ...mapGetters("stops", [
      "indexOfChosenDirection",
      "stopsOfChosenDirection",
      "chosenDirection",
      "mapCenter",
      "sequenceForCenterMap",
    ]),
    routeName: {
      get() {
        return this.keywordsForSearchTheRoute;
      },
      set(value) {
        this.setKeywordsForSearchTheRoute(value);
      },
    },
    signOfEmptyFavoriteRoute() {
      return this.allRoutesOfFavorite.length === 0 ? "還沒有收藏的站牌YO" : "";
    },
  },
  components: { RouteSearchPanel, Map, StopsListPanel },
  mixins: [getTdxData],
  watch: {
    "$route.query": {
      handler: function (query) {
        this.setAllRoutesOfFavorite();

        this.showFavoriteRoutesOrAllRoutesOfTaiwan();

        this.setAllRoutesOfTaiwan();
        this.nowPage =
          query.routes === "favorite"
            ? "favorite"
            : Object.keys(query).length === 0
            ? "home"
            : this.nowPage;
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations("stops", [
      "setIndexOfChosenDirection",
      "setSequenceOfChosenStop",
    ]),
    ...mapMutations("routes", [
      "setKeywordsForSearchTheRoute",
      "setRoutesOfCurrentPage",
      "setGeoJsonOfChosenRoute",
    ]),
    ...mapMutations([
      "setAllRoutesOfTaiwan",
      "setChosenRoute",
      "setAllDirectionsOfChosenRoute",
      "setIsHomePage",
      "setAllRoutesOfFavorite",
    ]),
    ...mapActions("routes", ["fetchGeoJsonOfChosenRoute"]),
    ...mapActions([
      "fetchAllCitiesOfTaiwan",
      "fetchAllRoutesOfTaiwan",
      "fetchAllDirectionsOfChosenRoute",
    ]),
    renewFavoriteRoutes(saveOrNot, routeUID) {
      var renewRoute = this.routesOfCurrentPage.find((item) => {
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
      this.setIndexOfChosenDirection(dir);
    },
    showRoutes() {
      this.deselectChosenRoute();
      this.setChosenRoute({});
      this.setAllDirectionsOfChosenRoute([]);
    },
    async showFavoriteRoutesOrAllRoutesOfTaiwan() {
      if (this.$route.query.routes === "favorite") {
        this.setIsHomePage(false);
        this.showRoutes();
      } else if (Object.keys(this.$route.query).length === 0) {
        this.setIsHomePage(true);
        this.showRoutes();
      }
    },
    deselectChosenRoute() {
      this.routeName = "";
      this.chosenDirectionOfChosenRoute = [];
    },
    saveFavoriteRoutesFromLocalStorage() {
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
  },
  created() {
    this.fetchAllRoutesOfTaiwan();

    this.showFavoriteRoutesOrAllRoutesOfTaiwan();

    if (this.showStopsOfSpecificRouteOrNot()) {
      this.getStopsOfRoute({});
    }
  },
};
</script>
