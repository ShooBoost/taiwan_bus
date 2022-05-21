<template>
  <ul>
    <li
      v-for="(item, i) in routesByKeywords"
      :key="i"
      class="px32 cursor-pointer hover-bg-grey"
    >
      <div
        @click="showChosenRoutePage(item)"
        class="flex jc-space-between border-bottom border-color-grey py12"
      >
        <div class="">
          <h6 v-if="item.RouteName" class="fz20 fw-bold mb4">
            {{ item.RouteName.Zh_tw }}
          </h6>
          <p class="color-grey">
            <span v-if="item.DepartureStopNameZh"
              >{{ item.DepartureStopNameZh }} -</span
            >
            {{ item.DestinationStopNameZh }}
          </p>
        </div>
        <div class="text-center">
          <FavoriteBtn :route="item"></FavoriteBtn>
          <p class="color-grey">{{ item.CityName.slice(0, 2) }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import FavoriteBtn from "@/components/FavoriteBtn.vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "RouteSearchPanel",
  data() {
    return {};
  },
  computed: {
    ...mapState("routes", ["keywordsForSearchTheRoute"]),
    ...mapGetters("routes", ["routesByKeywords"]),
  },
  components: { FavoriteBtn },
  methods: {
    ...mapMutations(["setChosenRoute"]),
    ...mapActions(["fetchChosenRoute", "fetchAllDirectionsOfChosenRoute"]),
    ...mapActions("routes", ["fetchGeoJsonOfChosenRoute"]),
    showChosenRoutePage(route) {
      this.fetchChosenRoute(route);
      this.$router.replace({
        query: {
          routeName: route.RouteName.Zh_tw,
          RouteUID: route.RouteUID,
          DepartureStopNameZh: route.DepartureStopNameZh,
          DestinationStopNameZh: route.DestinationStopNameZh,
          City: route.City,
        },
      });
    },
  },
};
</script>
