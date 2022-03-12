<template>
  <div class="about">
    <h1>This is an about page</h1>
    <section>
      <div class="item">
        <p class="title">寶寶城堡</p>
        <span class="item-progress">
          <span class="item-dot"></span>
        </span>
      </div>
    </section>
    <section>
      <div class="item">
        <p class="title">寶寶城堡</p>
        <span class="item-progress-inside-span">
          <span class="before"></span>
          <span class="item-dot"></span>
          <span class="after"></span>
        </span>
      </div>
    </section>
  </div>
</template>
<style scoped lang="scss">
* {
  border: 1px solid #000;
}
p {
  display: inline;
}
span {
  display: inline-block;
}
.item {
  height: 200px;
  display: flex;
  align-items: center;
  position: relative;
}
.item-progress-inside-span {
  margin-left: auto;
  margin-right: 30px;
  border: none;
  // 要有高
  height: 100%;
  position: relative;

  .before {
    content: "";
    position: relative;
    display: block;
    // 才能有高趴數
    height: 50%;
    border-right: 2px solid rgb(209, 102, 102);
  }

  .after {
    content: "";
    position: relative;
    display: block;
    // 才能有高趴數
    height: 50%;
    border-right: 2px solid rgb(209, 102, 102);
  }
}
.item-progress {
  margin-left: auto;
  border: none;
  // 要有高
  height: 100%;
  position: relative;

  &:before {
    content: "";
    position: relative;
    display: block;
    // 才能有高趴數
    height: 50%;
    border-right: 2px solid rgb(209, 102, 102);
  }

  &:after {
    content: "";
    position: relative;
    display: block;
    // 才能有高趴數
    height: 50%;
    border-right: 2px solid rgb(209, 102, 102);
  }
}
.item-dot {
  width: 12px;
  height: 12px;
  display: inline-block;
  background-color: rgb(122, 113, 113);
  position: absolute;
  z-index: 5;
  border-radius: 100%;
  right: 0;
  transform: translate(50%, -50%);
  // border: none;
  box-sizing: border-box;
  border: 2px solid #c4c4c4;
}
</style>
