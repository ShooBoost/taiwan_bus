<template>
  <ul class="">
    <li
      v-for="(item, i) in routesByKeywords"
      :key="i"
      class="px32 cursor-pointer hover-bg-grey"
    >
      <div
        @click="
          intervalRenewStops(
            item.City,
            item.RouteName.Zh_tw,
            item.RouteUID,
            item.DepartureStopNameZh,
            item.DestinationStopNameZh,
            item.CityName,
            item.savedInFavorite
          )
        "
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
// import getTdxData from "@/mixins/getTdxData";
import FavoriteBtn from "@/components/FavoriteBtn.vue";
export default {
  name: "RouteSearchPanel",
  data() {
    return {};
  },
  components: { FavoriteBtn },
  props: ["routesByKeywords"],
  emit: ["getStopsOfRoute"],
  methods: {
    intervalRenewStops(
      City,
      RouteName,
      RouteUID,
      DepartureStopNameZh,
      DestinationStopNameZh,
      CityName,
      savedInFavorite
    ) {
      this.$emit("getStopsOfRoute", {
        cityOfRoute: City,
        routeName: RouteName,
        RouteUID: RouteUID,
        DepartureStopNameZh: DepartureStopNameZh,
        DestinationStopNameZh: DestinationStopNameZh,
        CityName: CityName,
        savedInFavorite: savedInFavorite,
      });
    },
  },
};
</script>
