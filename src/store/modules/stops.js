const state = {
  indexOfChosenDirection: 0,
  sequenceOfChosenStop: 0,
};
const getters = {
  mapCenter(state, getters) {
    return {
      Lat: getters.stopsOfChosenDirection[getters.sequenceForCenterMap]
        ? getters.stopsOfChosenDirection[getters.sequenceForCenterMap]
            .StopPosition.PositionLat
        : "22.997572",
      Lon: getters.stopsOfChosenDirection[getters.sequenceForCenterMap]
        ? getters.stopsOfChosenDirection[getters.sequenceForCenterMap]
            .StopPosition.PositionLon
        : "120.196029",
    };
  },
  sequenceForCenterMap(state, getters) {
    return state.sequenceOfChosenStop === undefined
      ? parseInt(getters.stopsOfChosenDirection.length / 2)
      : state.sequenceOfChosenStop;
  },
  stopsOfChosenDirection(state, getters) {
    return getters.chosenDirection.Stops ? getters.chosenDirection.Stops : [];
  },
  chosenDirection(state, getters, rootState) {
    return rootState.allDirectionsOfChosenRoute[state.indexOfChosenDirection]
      ? rootState.allDirectionsOfChosenRoute[state.indexOfChosenDirection]
      : [];
  },
};
const actions = {};
const mutations = {
  setIndexOfChosenDirection(state, payload) {
    state.indexOfChosenDirection = payload;
  },

  setSequenceOfChosenStop(state, payload) {
    state.sequenceOfChosenStop = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
