<template>
  <div
    v-if="Object.keys(stopsOfChosenDirection).length !== 0"
    class="h100 flex flex-direction-column"
  >
    <!-- 返回搜尋與收藏站牌 - 開始 -->
    <div class="flex jc-space-between px20 pt20-md mb10-md">
      <p @click="backToHomeOrFavorite(prePage)" class="cursor-pointer">
        ❮ 返回搜尋
      </p>
      <FavoriteBtn
        :route="stopsOfChosenDirection"
        @saveToFavorite="saveToFavorite"
      ></FavoriteBtn>
    </div>
    <!-- 返回搜尋與收藏站牌 - 結束 -->
    <!-- 路線名稱 - 開始 -->
    <div class="mb24">
      <h3 class="text-center fz36 fw-bold">
        {{ chosenDirection.RouteName.Zh_tw }}
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
            chosenDirection.DestinationStopNameZh
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
          <span class="fw-bold">{{ chosenDirection.DepartureStopNameZh }}</span>
        </p>
      </li>
    </ul>
    <ul class="h100 overflow-scroll">
      <li
        v-for="(stop, i) in stopsOfChosenDirection"
        :key="i"
        class="pos-relative cursor-pointer hover-bg-grey"
        @click="setSequenceOfChosenStop(i)"
        @mouseover="setSequenceOfChosenStop(i)"
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
              { 'visibility-hidden': i === stopsOfChosenDirection.length - 1 },
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
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      nowDirection: 0,
      direction0Active: true,
      updateDataInterval: {},
      timeBarInterval: {},
    };
  },
  computed: {
    ...mapState("stops", [
      "allDirectionsOfChosenRoute",
      "sequenceOfChosenStop",
    ]),
    ...mapGetters("stops", ["stopsOfChosenDirection", "chosenDirection"]),
  },
  props: ["prePage"],
  emit: ["renewFavoriteRoutes"],
  components: { FavoriteBtn },
  methods: {
    ...mapMutations("stops", [
      "setIndexOfChosenDirection",
      "setSequenceOfChosenStop",
    ]),
    ...mapActions(["fetchAllDirectionsOfChosenRoute"]),
    changeDirection(dir) {
      this.setIndexOfChosenDirection(dir);
      this.direction0Active = !this.direction0Active;
    },
    saveToFavorite(saveOrNot) {
      this.allDirectionsOfChosenRoute.forEach((direction) => {
        direction.savedInFavorite = saveOrNot;
      });
      this.$emit(
        "renewFavoriteRoutes",
        saveOrNot,
        this.chosenDirection.RouteUID
      );
    },
    backToHomeOrFavorite(prePage = "home") {
      if (prePage === "favorite") {
        this.$router.replace({ query: { routes: "favorite" } });
      } else {
        this.$router.replace({ path: "/" });
      }
    },
  },
  mounted() {
    var _this = this;
    var timeBarWidth = document.getElementById("timeBar").clientWidth;
    var nowTimeBarWidth = timeBarWidth;
    this.updateDataInterval = setInterval(function () {
      document.getElementById("timeBar").style.width = timeBarWidth + "px";
      nowTimeBarWidth = timeBarWidth + timeBarWidth / 30;
      _this.fetchAllDirectionsOfChosenRoute();

      console.log("=========== NEW DATA +++++++++++++++ ");
    }, 10000);
    this.timeBarInterval = setInterval(function () {
      nowTimeBarWidth -= timeBarWidth / 10;
      document.getElementById("timeBar").style.width = nowTimeBarWidth + "px";
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.updateDataInterval);
    clearInterval(this.timeBarInterval);
    this.setSequenceOfChosenStop(0);
    console.log("=========== NO DATA +++++++++++++++");
  },
  unmounted() {
    this.setIndexOfChosenDirection(0);
  },
};
</script>
