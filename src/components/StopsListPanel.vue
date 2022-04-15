<template>
  <div
    v-if="Object.keys(stopsOfTheRoute).length !== 0"
    class="h100 flex flex-direction-column"
  >
    <!-- 返回搜尋與收藏站牌 - 開始 -->
    <div class="flex jc-space-between px20 pt20-md mb10-md">
      <p @click="backToHomeOrFavorite(prePage)" class="cursor-pointer">
        ❮ 返回搜尋
      </p>
      <FavoriteBtn
        :route="stopsOfTheRoute"
        @saveToFavorite="saveToFavorite"
      ></FavoriteBtn>
    </div>
    <!-- 返回搜尋與收藏站牌 - 結束 -->
    <!-- 路線名稱 - 開始 -->
    <div class="mb24">
      <h3 class="text-center fz36 fw-bold">
        {{ stopsOfTheRoute.RouteName.Zh_tw }}
      </h3>
    </div>
    <!-- 路線名稱 - 結束 -->

    <ul class="flex jc-space-between cursor-pointer">
      <li
        @click="changeDirection(0)"
        class="w50 text-center py10 border-rounded-top"
        :class="{
          'bg-primary-color-white': direction0Active,
          'bg-grey400-color-grey900': !direction0Active,
        }"
      >
        <p>
          往
          <span class="fw-bold">{{
            stopsOfTheRoute.DestinationStopNameZh
          }}</span>
        </p>
      </li>
      <li
        @click="changeDirection(1)"
        class="w50 text-center py10 border-rounded-top"
        :class="{
          'bg-primary-color-white': !direction0Active,
          'bg-grey400-color-grey900': direction0Active,
        }"
      >
        <p>
          往
          <span class="fw-bold">{{ stopsOfTheRoute.DepartureStopNameZh }}</span>
        </p>
      </li>
    </ul>
    <ul class="h100 overflow-scroll">
      <li
        v-for="(stop, i) in stopsOfTheRoute.Stops"
        :key="i"
        class="pos-relative cursor-pointer hover-bg-grey"
        @click="$emit('renewPopMarker', i)"
        @mouseover="$emit('renewPopMarker', i)"
      >
        <div class="px32 flex fz14 ai-center">
          <!-- {{ stop.StopSequence }} -->
          <p
            class="mt12 mb12 border-rounded busNotInService p5 me18 w20 text-center"
            :class="[
              {
                busStopByStop:
                  stop.EstimateTime === '將進站' ||
                  stop.EstimateTime === '進站中',
              },
              {
                busWillStop: typeof stop.EstimateTime === 'number',
              },
            ]"
          >
            {{ stop.EstimateTime }}
          </p>
          <p class="mt12 mb12">{{ stop.StopName.Zh_tw }}</p>

          <b v-if="stop.busDeparture" class="me8 ml-auto color-secondary">
            <ul>
              <li v-for="(bus, k) in stop.busDeparture" :key="k">
                {{ bus.PlateNumb
                }}<span
                  v-if="bus.VehicleType"
                  class="material-icons vertical-align-middle"
                >
                  accessible_forward
                </span>
              </li>
            </ul>
          </b>
          <b v-if="stop.busArrival" class="me8 ml-auto color-secondary">
            <ul>
              <li v-for="(bus, k) in stop.busArrival" :key="k">
                {{ bus.PlateNumb
                }}<span
                  v-if="bus.VehicleType"
                  class="material-icons vertical-align-middle"
                >
                  accessible_forward
                </span>
              </li>
            </ul>
          </b>
        </div>

        <span class="vechileProgressBar">
          <span
            class="vechileProgressBar-before"
            :class="[
              {
                busArrival:
                  stop.EstimateTime === '將進站' ||
                  stop.EstimateTime === '進站中',
              },
              { 'visibility-hidden': i === 0 },
            ]"
          ></span>
          <span
            class="vechileProgressBar-dot"
            :class="{
              busStopByStop:
                stop.EstimateTime === '將進站' ||
                stop.EstimateTime === '進站中',
            }"
          ></span>
          <span
            class="vechileProgressBar-after"
            :class="[
              { 'visibility-hidden': i === stopsOfTheRoute.Stops.length - 1 },
            ]"
          ></span>
        </span>
      </li>
    </ul>
    <!-- time bar - 開始 -->
    <div class="bg-color-secondary timeBar" id="timeBar"></div>
    <!-- time bar - 結束 -->
  </div>
</template>
<script>
import FavoriteBtn from "@/components/FavoriteBtn.vue";
export default {
  data() {
    return {
      nowDirection: 0,
      stopsOfTheRoute: this.allDirectionsOfTheChosenRoute[0] || [],
      direction0Active: true,
      updateDataInterval: {},
      timeBarInterval: {},
    };
  },
  props: ["allDirectionsOfTheChosenRoute", "prePage"],
  emit: [
    "changeRoutesToAll",
    "renewStopsOfRoute",
    "renewFavoriteRoutes",
    "renewPopMarker",
    "resetNowDirection",
  ],
  components: { FavoriteBtn },
  watch: {
    allDirectionsOfTheChosenRoute() {
      this.stopsOfTheRoute =
        this.allDirectionsOfTheChosenRoute[this.nowDirection] || [];
    },
  },
  methods: {
    changeDirection(dir) {
      this.nowDirection = dir;
      this.stopsOfTheRoute = this.allDirectionsOfTheChosenRoute[dir];
      this.$emit("changeDirection", dir);
      this.direction0Active = !this.direction0Active;
    },
    saveToFavorite(saveOrNot) {
      this.allDirectionsOfTheChosenRoute.forEach((direction) => {
        direction.savedInFavorite = saveOrNot;
      });
      this.$emit("renewFavoriteRoutes", saveOrNot, this.stopsOfTheRoute.RouteUID);
    },
    backToHomeOrFavorite(prePage = "home") {
      if (prePage === "favorite") {
        this.$router.replace({ query: { routes: "favorite" } });
      } else {
        // this.$router.push({ path: "/" });
        this.$router.replace({ path: "/" });
      }
      this.$emit("changeRoutesToAll");
    },
  },
  mounted() {
    // console.log(
    //   "stopPanel allDirectionsOfTheChosenRoute",
    //   this.allDirectionsOfTheChosenRoute
    // );
    console.log("prePage", this.prePage);
    var _this = this;
    var timeBarWidth = document.getElementById("timeBar").clientWidth;
    var nowTimeBarWidth = timeBarWidth;
    this.updateDataInterval = setInterval(function () {
      document.getElementById("timeBar").style.width = timeBarWidth + "px";
      nowTimeBarWidth = timeBarWidth + timeBarWidth / 30;
      _this.$emit("renewStopsOfRoute", {
        cityOfRoute: _this.stopsOfTheRoute.City,
        routeName: _this.stopsOfTheRoute.RouteName.Zh_tw,
        RouteUID: _this.stopsOfTheRoute.RouteUID,
        DepartureStopNameZh: _this.stopsOfTheRoute.DepartureStopNameZh,
        DestinationStopNameZh: _this.stopsOfTheRoute.DestinationStopNameZh,
        CityName: _this.stopsOfTheRoute.CityName,
        savedInFavorite: _this.stopsOfTheRoute.savedInFavorite,
      });

      console.log("=========== NEW DATA +++++++++++++++ ");
      console.log(timeBarWidth, nowTimeBarWidth);
    }, 10000);
    this.timeBarInterval = setInterval(function () {
      nowTimeBarWidth -= timeBarWidth / 10;
      document.getElementById("timeBar").style.width = nowTimeBarWidth + "px";
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.updateDataInterval);
    clearInterval(this.timeBarInterval);
    console.log("=========== NO DATA +++++++++++++++");
  },
  unmounted() {
    this.$emit("renewPopMarker", undefined);
    this.$emit("resetNowDirection");
  },
};
</script>
<style lang="scss" scoped></style>
