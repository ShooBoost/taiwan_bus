import tdx from "@/mixins/tdx";
const state = {
  keywordsForSearchTheRoute: "",
  geoJsonOfChosenRoute: {},
};
const getters = {
  routesByKeywords(state, getters) {
    let filterResult = [];
    let reg = new RegExp(state.keywordsForSearchTheRoute);
    getters.routesOfCurrentPage.forEach(function (route) {
      if (reg.test(route.RouteName.Zh_tw + "*")) {
        filterResult.push(route);
      }
    });
    return filterResult;
  },
  routesOfCurrentPage(state, getters, rootState) {
    return rootState.isHomePage
      ? rootState.allRoutesOfTaiwan
      : rootState.allRoutesOfFavorite;
  },
};
const mutations = {
  setKeywordsForSearchTheRoute(state, payload) {
    state.keywordsForSearchTheRoute = payload;
  },
  setRoutesOfCurrentPage(state, payload) {
    state.routesOfCurrentPage = payload;
  },
  setGeoJsonOfChosenRoute(state, payload) {
    state.geoJsonOfChosenRoute = payload;
  },
};
const actions = {
  async fetchGeoJsonOfChosenRoute(context) {
    context.commit(
      "setGeoJsonOfChosenRoute",
      await tdx.getRouteGEOJSON(
        context.rootState.chosenRoute.City,
        context.rootState.chosenRoute.RouteName.Zh_tw
      )
    );
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
