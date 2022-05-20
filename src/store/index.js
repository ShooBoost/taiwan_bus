import { createStore } from "vuex";
import stops from "./modules/stops";
import routes from "./modules/routes";
import tdx from "@/mixins/tdx";

export default createStore({
  state: {
    allCitiesOfTaiwan: [],
    allRoutesOfTaiwan: [],
    allRoutesOfFavorite: [],
    chosenRoute: {},
    allDirectionsOfChosenRoute: [],
    isHomePage: true,
    test: { a: [0, 0, 0], b: [1, 1, 1] },
  },
  getters: {},
  mutations: {
    setTest(state) {
      // console.log(state.test);
      state.test.a[0] = "change";
      // console.log(state.test);
    },
    setAllRoutesOfFavorite(state) {
      var localRouteList = localStorage.getItem("favoriteRouteList");
      state.allRoutesOfFavorite = localRouteList
        ? JSON.parse(localRouteList)
        : [];
    },
    setChosenRoute(state, payload) {
      state.chosenRoute = payload;
    },
    setAllDirectionsOfChosenRoute(state, payload) {
      state.allDirectionsOfChosenRoute = payload;
    },
    setAllCitiesOfTaiwan(state, payload) {
      state.allCitiesOfTaiwan = payload;
    },
    setAllRoutesOfTaiwanWithFavorite(state) {
      console.log(
        "setAllRoutesOfTaiwanWithFavorite",
        state.allRoutesOfFavorite
      );
      state.allRoutesOfFavorite.forEach((favoriteRoute) => {
        let sameRoute = state.allRoutesOfTaiwan.filter((route) => {
          return route.RouteUID === favoriteRoute.RouteUID;
        });
        if (sameRoute[0]) {
          sameRoute[0].savedInFavorite = true;
        }
        console.log(sameRoute);
      });
    },
    setAllRoutesOfTaiwan(state, payload) {
      state.allRoutesOfTaiwan = payload;
      state.allRoutesOfFavorite.forEach((favoriteRoute) => {
        let sameRoute = state.allRoutesOfTaiwan.filter((route) => {
          return route.RouteUID === favoriteRoute.RouteUID;
        });
        if (sameRoute[0]) {
          sameRoute[0].savedInFavorite = true;
        }
      });
    },
    setIsHomePage(state, payload) {
      state.isHomePage = payload;
    },
  },
  actions: {
    async fetchAllCitiesOfTaiwan(context) {
      context.commit("setAllCitiesOfTaiwan", await tdx.getCityList());
    },
    async fetchAllRoutesOfTaiwan(context) {
      context.commit("setAllRoutesOfFavorite");
      await context.dispatch("fetchAllCitiesOfTaiwan");
      let allRoutesOfTaiwan = await tdx.getRoutesOfTaiwan(
        await context.state.allCitiesOfTaiwan
      );
      await context.commit("setAllRoutesOfTaiwan", allRoutesOfTaiwan);
    },
    async fetchAllDirectionsOfChosenRoute(context) {
      let allDirectionsOfChosenRoute =
        await tdx.sortRealTimeNearStopAndEstimatedTimeByStopsOfTheRoute(
          await tdx.getVehicleOfTaiwan(context.state.allCitiesOfTaiwan),
          context.state.chosenRoute.City,
          context.state.chosenRoute.RouteName.Zh_tw,
          context.state.chosenRoute.RouteUID
        );
      // 將該路線的起迄點名稱，分別記到去程（direction 0）與回程（direction 1）資料中
      await allDirectionsOfChosenRoute.forEach((direction) => {
        direction.DepartureStopNameZh =
          context.state.chosenRoute.DepartureStopNameZh;
        direction.DestinationStopNameZh =
          context.state.chosenRoute.DestinationStopNameZh;
        direction.CityName = context.state.chosenRoute.CityName;
        direction.savedInFavorite = context.state.chosenRoute.savedInFavorite;
      });
      context.commit(
        "setAllDirectionsOfChosenRoute",
        await allDirectionsOfChosenRoute
      );
    },
  },
  modules: {
    stops,
    routes,
  },
});
