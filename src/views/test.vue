<template>
<input @input="filterVehicleByKeywords(plateNumb)" v-model="plateNumb" placeholder="plateNumb"/>{{vechile}}
  <input @input="filterRouteByKeywords(routeName)" v-model="routeName" />
  {{ routeName }}
  <ul>
    <li v-for="(item, i) in routesByKeywords" :key="i">
      <div
        @click="setRouteCityAndNameForGetStops(item.City, item.RouteName.Zh_tw, item.RouteUID)"
      >
        <span v-if="item.RouteName">{{ item.RouteName.Zh_tw }} </span>

        <span v-if="item.DepartureStopNameZh"
          >{{ item.DepartureStopNameZh }} -</span
        >
        {{ item.DestinationStopNameZh }}
      </div>
    </li>
  </ul>
  <div v-if="stopsOfTheRoute[0]">
    <h3>stopsOfTheRoute {{ stopsOfTheRoute[0].RouteName.Zh_tw }}</h3>
    <ul>
      <li v-for="(stop, i) in stopsOfTheRoute[0].Stops" :key="i">
        {{ stop.Direction }}
        {{ stop.StopSequence }}
        {{stop.EstimateTime}}
        {{ stop.StopName.Zh_tw }}
        <b v-if="stop.busDeparture">離站中
          <ul>
            <li v-for="(bus, k) in stop.busDeparture" :key="k">{{bus.PlateNumb}}{{bus.VehicleType}}</li>
          </ul>
        </b>
        <b v-if="stop.busArrival">進站中
          <ul>
            <li v-for="(bus, k) in stop.busArrival" :key="k">{{bus.PlateNumb}}{{bus.VehicleType}}</li>
          </ul>
        </b>
      </li>
    </ul>
  </div>

</template>

<script>
// @ is an alias to /src
import getTdxData from "@/mixins/getTdxData";

export default {
  name: "test",
  mixins: [getTdxData],
  data() {
    return {
      now: "",
      routes: [],
      routesByKeywords: [],
      stopsOfTheRoute: [],
      cityOfRoute: "",
      routeName: "",
      vehicleOfTaiwan: [],
      cityList: [],
      vechile:"",
    };
  },
  computed: {
    // stopsOfTheRoute() {
    //   console.log("change stopsOfTheRoute");
    //   let _this = this;
    //   // let stopsOfTheRoute = [];
    //   return (async function () {
    //     return await _this.sortRealTimeNearStopAndEstimatedTimeByStopsOfTheRoute(_this.cityOfRoute, _this.routeName);
    //   })();
    //   // return stopsOfTheRoute;
    // },
  },
  methods: {
    consoleLogHaHa(e) {
      console.log(e.target.value);
      console.log(e.target["data-value"]);
      console.log(e);
    },
    filterVehicleByKeywords(plateNumb){
      this.vechile = this.vehicleOfTaiwan.find((vechile)=>{
        console.log("vechile")
        if (vechile) {
                return vechile.PlateNumb === plateNumb;
              }})
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
    async setRouteCityAndNameForGetStops(cityOfRoute, routeName, RouteUID) {
      this.cityOfRoute = cityOfRoute;
      this.routeName = routeName;
      console.log("setRouteCityAndNameForGetStops", cityOfRoute, routeName, RouteUID);
      console.log("change stopsOfTheRoute");
      let _this = this;
      // let stopsOfTheRoute = [];
      this.stopsOfTheRoute = await _this.sortRealTimeNearStopAndEstimatedTimeByStopsOfTheRoute(this.vehicleOfTaiwan, cityOfRoute, routeName, RouteUID);
    },
  },
  async created() {
    var _this = this;
    (async function () {
      _this.cityList = await _this.getCityList();
      _this.routes = await _this.getRoutesOfTaiwan(await _this.cityList);
      _this.vehicleOfTaiwan = await _this.getVehicleOfTaiwan(await _this.cityList)
      
    })();
  },
};
</script>
