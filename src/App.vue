<template>
  <div class="flex flex-direction-column h100 pos-relative">
    <header id="nav" class="w40-md w30-lg bg-color-white display-none display-block-md pos-absolute z-index99999  border-bottom-grey520">
      <ul class="flex color-white jc-space-around ai-center">
        <li class="w100 text-center">
          <router-link
            to="/"
            class="border-box w100 p12 fz30 bg-white-color-primary"
            :class="{
              'material-icons-round': showHome,
              'material-icons-outlined': !showHome,
            }"
            >directions_bus_filled</router-link
          >
          <!-- <p>台灣公車 e 點通</p> -->
        </li>
        <li class="w100 text-center">
          <router-link
            to="?routes=favorite"
            class="material-icons-outlined border-box w100 p12 fz30 bg-white-color-primary"
            >{{ favoriteBorderOrFill }}</router-link
          >
        </li>
        <li class="w100 text-center">
          <span
            @click="shareUrl"
            class="material-icons-outlined border-box w100 p12 fz30 cursor-pointer bg-white-color-primary"
          >
            link
          </span>
        </li>
      </ul>
    </header>
    <!-- <header id="nav" class="bg-color-white display-none display-block-md fz48">
      <router-link to="/">Home</router-link> |
      <router-link to="?routes=favorite">favorite</router-link> |
      <router-link to="/about">About</router-link>
    </header> -->
    <router-view class="w100 flex-grow-1 overflow-scroll" />
    <footer
      class="footer bg-color-white border-box pos-relative display-none-md border-top-grey520"
    >
      <ul class="flex h100 color-white jc-space-around ai-center">
        <li class="w100 text-center">
          <router-link
            to="/"
            class="border-box w100 p12 fz32 bg-white-color-primary"
            :class="{
              'material-icons-round': showHome,
              'material-icons-outlined': !showHome,
            }"
            >directions_bus_filled</router-link
          >
          <!-- <p>台灣公車 e 點通</p> -->
        </li>
        <li class="w100 text-center">
          <router-link
            to="?routes=favorite"
            class="material-icons-outlined border-box w100 p12 fz32 bg-white-color-primary"
            >{{ favoriteBorderOrFill }}</router-link
          >
        </li>
        <li class="w100 text-center">
          <span
            @click="shareUrl"
            class="material-icons-outlined border-box w100 p12 fz32 cursor-pointer bg-white-color-primary"
          >
            ios_share
          </span>
        </li>
      </ul>
    </footer>
  </div>
</template>

<style lang="scss">
@import "@/assets/style/scss/_main.scss";

html,
body,
#app {
  height: 100%;
  max-height: -webkit-fill-available;
}
header,
footer {
  // useless cause flex is working well
  // height: 200px;
}
</style>
<script>
export default {
  data() {
    return {
      showHome: this.$route.query.routes === "favorite" ? false : true,
      favoriteBorderOrFill:
        this.$route.query.routes === "favorite"
          ? "favorite"
          : "favorite_border",
    };
  },
  watch: {
    showHome() {
      this.favoriteBorderOrFill = this.showHome
        ? "favorite_border"
        : "favorite";
    },
    "$route.query": {
      handler(query) {
        this.showHome = query.routes === "favorite" ? false : true;
      },
      deep: true,
    },
  },
  methods: {
    async shareUrl() {
      if (navigator.share) {
        navigator
          .share({
            title: "台灣公車查詢",
            text: "網頁連結:",
            url: this.$route.fullPath,
          })
          .then(() => {
            console.log("成功！");
          })
          .catch((error) => {
            console.log("發生錯誤", error);
          });
      } else {
        // var path = this.$route.fullPath;
        // window.clipboardData.setData("text",path)
        navigator.clipboard.writeText(window.location.href);
        alert("複製成功");
      }
    },
  },
  created() {},
};
</script>
