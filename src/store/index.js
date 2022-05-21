import { createStore } from "vuex";
import stops from "./modules/stops";
import routes from "./modules/routes";
import tdx from "@/mixins/tdx";

export default createStore({
  state: {
    allCitiesOfTaiwan: [],
    allRoutesOfTaiwan: [],
    allRoutesOfTaiwanWithoutFavorite: [],
    allRoutesOfFavorite: [],
    chosenRoute: {},
    allDirectionsOfChosenRoute: [],
    isHomePage: true,
  },
  getters: {},
  mutations: {
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
    setAllRoutesOfTaiwanWithoutFavorite(state, payload) {
      state.allRoutesOfTaiwanWithoutFavorite = payload;
    },
    setAllRoutesOfTaiwan(state) {
      state.allRoutesOfTaiwan = JSON.parse(
        JSON.stringify(state.allRoutesOfTaiwanWithoutFavorite)
      );
      state.allRoutesOfFavorite.forEach((favoriteRoute) => {
        let sameRoute = state.allRoutesOfTaiwan.find(
          (route) => route.RouteUID === favoriteRoute.RouteUID
        );
        if (sameRoute) {
          sameRoute.savedInFavorite = true;
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
      await context.commit(
        "setAllRoutesOfTaiwanWithoutFavorite",
        allRoutesOfTaiwan
      );
      await context.commit("setAllRoutesOfTaiwan");
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
        direction.CityName = context.state.chosenRoute.City;
        direction.savedInFavorite = context.state.chosenRoute.savedInFavorite;
      });
      context.commit(
        "setAllDirectionsOfChosenRoute",
        await allDirectionsOfChosenRoute
      );
    },
    fetchChosenRoute(context, payload) {
      context.commit("setChosenRoute", payload);
      context.dispatch("fetchAllDirectionsOfChosenRoute");
      context.dispatch("routes/fetchGeoJsonOfChosenRoute");
    },
  },
  modules: {
    stops,
    routes,
  },
});
