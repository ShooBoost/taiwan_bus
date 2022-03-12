<template>
  <div class="flex w100 h100">
    <section><!-- <a
          :href="
            '/RouteDetail?City=' +
            item.City +
            '&RouteName=' +
            item.RouteName.Zh_tw +
            '&RouteUID=' +
            item.RouteUID +
            '&DepartureStopNameZh=' +
            item.DepartureStopNameZh +
            '&DestinationStopNameZh=' +
            item.DestinationStopNameZh
          "
          
        ></a> --></section>
    <section class="w30 overflow-scroll">
      <div v-if="stopsOfTheRoute[0]">
        <h3>stopsOfTheRoute {{ stopsOfTheRoute[0].RouteName.Zh_tw }}</h3>
        <ul>
          <li>
            <a href="#">{{ stopsOfTheRoute.DepartureStopNameZh }}</a>
          </li>
          <li>
            <a href="#">{{ stopsOfTheRoute.DestinationStopNameZh }}</a>
          </li>
        </ul>
        <ul>
          <li v-for="(stop, i) in stopsOfTheRoute[0].Stops" :key="i">
            {{ stop.Direction }}
            {{ stop.StopSequence }}
            {{ stop.EstimateTime }}
            {{ stop.StopName.Zh_tw }}
            <b v-if="stop.busDeparture"
              >離站中
              <ul>
                <li v-for="(bus, k) in stop.busDeparture" :key="k">
                  {{ bus.PlateNumb }}{{ bus.VehicleType }}
                </li>
              </ul>
            </b>
            <b v-if="stop.busArrival"
              >進站中
              <ul>
                <li v-for="(bus, k) in stop.busArrival" :key="k">
                  {{ bus.PlateNumb }}{{ bus.VehicleType }}
                </li>
              </ul>
            </b>
          </li>
        </ul>
      </div>
    </section>
    <section class="w70 h100">
      <Map
        class="w100 h100"
        mapId="mapBear"
        lat="22.997572"
        lon="120.196029"
      ></Map>
    </section>
  </div>
</template>
<script>
import getTdxData from "@/mixins/getTdxData";
import Map from "@/components/Map.vue";
export default {
  data() {
    return {
      routes: [],
      routesByKeywords: [],
      stopsOfTheRoute: [],
      cityOfRoute: "",
      routeName: "",
      vehicleOfTaiwan: [],
      cityList: [],
      vechile: "",
    };
  },
  components: { Map },
  mixins: [getTdxData],
  methods: {
    consoleLogHaHa(e) {
      console.log(e.target.value);
      console.log(e.target["data-value"]);
      console.log(e);
    },
    filterVehicleByKeywords(plateNumb) {
      this.vechile = this.vehicleOfTaiwan.find((vechile) => {
        console.log("vechile");
        if (vechile) {
          return vechile.PlateNumb === plateNumb;
        }
      });
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
    async setRouteCityAndNameForGetStops(
      cityOfRoute,
      routeName,
      RouteUID,
      DepartureStopNameZh,
      DestinationStopNameZh
    ) {
      this.cityOfRoute = cityOfRoute;
      this.routeName = routeName;

      let _this = this;
      // let stopsOfTheRoute = [];
      this.stopsOfTheRoute =
        await _this.sortRealTimeNearStopAndEstimatedTimeByStopsOfTheRoute(
          this.vehicleOfTaiwan,
          cityOfRoute,
          routeName,
          RouteUID
        );
      _this.stopsOfTheRoute.DepartureStopNameZh = DepartureStopNameZh;
      _this.stopsOfTheRoute.DestinationStopNameZh = DestinationStopNameZh;
    },
  },
  async created() {
    var _this = this;
    (async function () {
        _this.cityList = await _this.getCityList();
        _this.routes = await _this.getRoutesOfTaiwan(await _this.cityList);
        _this.vehicleOfTaiwan = await _this.getVehicleOfTaiwan(
          await _this.cityList
        );
        await _this.setRouteCityAndNameForGetStops(
          _this.$route.query.City,
          _this.$route.query.RouteName,
          _this.$route.query.RouteUID,
          _this.$route.query.DepartureStopNameZh,
          _this.$route.query.DestinationStopNameZh
        );
      })();
  },
};
</script>
<style lang="scss">
@import "@/assets/style/scss/_main.scss";
</style>