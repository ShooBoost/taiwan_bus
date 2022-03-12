<template>
  <div @click.stop="saveToFavorite(!route.savedInFavorite, route)" class="cursor-pointer">
    <span
      v-if="route.savedInFavorite"
      class="material-icons mb6 color-secondary"
    >
      favorite
    </span>
    <span v-else class="material-icons mb6 hover-color-sencodary">
      favorite_border
    </span>
  </div>
</template>

<script>
export default {
  props: ["route"],
  emit: ["saveToFavorite"],
  methods: {
    // 收藏到我的最愛
    saveToFavorite(saveOrNot, route) {
      var localRouteList = localStorage.getItem("favoriteRouteList");
      var favoriteRouteList = localRouteList ? JSON.parse(localRouteList) : [];
      route.savedInFavorite = saveOrNot ? true : false;
      // emit
      this.$emit('saveToFavorite',saveOrNot);
      if (saveOrNot) {
        // 新增
        favoriteRouteList.push({
          City: route.City,
          CityName: route.CityName,
          RouteName: { Zh_tw: route.RouteName.Zh_tw },
          RouteUID: route.RouteUID,
          DepartureStopNameZh: route.DepartureStopNameZh,
          DestinationStopNameZh: route.DestinationStopNameZh,
          savedInFavorite: true,
        });
      } else {
        // 刪除已存在的
        favoriteRouteList.find((item, index) => {
          if (item.RouteUID === route.RouteUID) {
            favoriteRouteList.splice(index, 1);
          }
          return item.RouteUID === route.RouteUID;
        });
      }
      // 存到 localStorage
      localStorage.setItem(
        "favoriteRouteList",
        JSON.stringify(favoriteRouteList)
      );
      // console.log(JSON.parse(localStorage.getItem("favoriteRouteList")));
    },
  },
};
</script>

<style>
</style>