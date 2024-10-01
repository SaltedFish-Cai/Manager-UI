<template>
  <div
    class="little-bear"
    :style="{ top: bodyTop + 'px', left: bodyLeft + 'px' }"
    :onMousedown="e => mouseDown()"
    :onMousemove="e => mouseMove(e)"
    :onMouseup="e => mouseUp(e)"
  >
    <button class="fd5a29ad _5ef1ee4e _79c95847" aria-label="Make the animated wombat visibly giggle">
      <div class="_2d42592e">
        <div class="_83938fda _79c95847">
          <div class="_33c43af5">
            <div class="e7114814">
              <img src="./imgs/img1.png" alt="" role="presentation" class="_489835f0" />
              <img src="./imgs/img2.png" alt="" role="presentation" class="fe2acb34" />
              <img src="./imgs/img3.png" alt="" role="presentation" class="_8fb7c421" />
            </div>
          </div>
          <img alt="" role="presentation" src="./imgs/img4.png" />
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const bodyTop = ref(700);
const bodyLeft = ref(10);
let state = 0;
const _window: any = typeof window == "undefined" ? global : window;

onMounted(() => {
  const pos = _window.sessionStorage?.getItem("little-bear-position");
  if (pos) {
    const posJson = JSON.parse(pos);
    bodyTop.value = posJson.y;
    bodyLeft.value = posJson.x;
  }
});

function mouseDown() {
  state = 1;
}

function mouseMove(e) {
  if (state != 1) return;
  bodyTop.value = e.clientY - 75;
  bodyLeft.value = e.clientX - 75;
}

function mouseUp(e) {
  state = 0;
  const jsonObj = { x: e.clientX - 75, y: e.clientY - 75 };
  const jsonString = JSON.stringify(jsonObj);
  window.sessionStorage.setItem("little-bear-position", jsonString);
  // bodyTop.value = e.clientY;
  // bodyLeft.value = ;
}
</script>

<style scoped lang="scss">
.little-bear {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
}

/**
 * Base
 */
._83938fda {
  cursor: pointer;
  cursor: grab;
  cursor: -webkit-grab;
}
._83938fda * {
  pointer-events: none;
}
.a4b825a2 {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  overflow: hidden;
}
._5ef1ee4e:focus {
  outline: none;
}
._19b2d7f0 {
  position: absolute;
  top: 2px;
  height: 196px;
  width: 200px;
  border-radius: 9999px;
  z-index: 2;
  pointer-events: none;
  transform: translateY(0);
  transition: transform 200ms ease;
  outline: #0366d6 solid 0px;
  outline-offset: 3px;
  pointer-events: none;
}
.a4b825a2:focus-within + ._19b2d7f0 {
  outline: #0366d6 solid 2px;
}
/**
 * Face
 */
.e7114814 {
  left: 50%;
  margin-left: -29px;
  position: absolute;
  top: 48%;
  width: 58px;
}
.e7114814 img {
  left: 0;
  position: absolute;
  top: 0;
}
._489835f0 {
  animation-name: _11292128;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  display: block;
  will-change: opacity;
}
.fe2acb34 {
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-name: _49eaabc4;
  display: block;
  will-change: opacity;
}
._8fb7c421 {
  display: none;
}
/**
 * Interactions
 */
._83938fda:hover ._8fb7c421 {
  display: block;
}
._83938fda:hover ._489835f0,
._83938fda:hover .fe2acb34 {
  display: none;
}
/**
 * Animations
 */
._33c43af5 {
  position: absolute;
  width: 100%;
  height: 100%;
  animation-name: b847221f;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  transition-timing-function: ease;
  will-change: transform;
}
/**
 * Animations
 */
.fd5a29ad {
  width: 100%;
  height: 100%;
  animation-name: d83390b7;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  transform: rotate(-5deg);
  transition-timing-function: ease;
  transform-origin: bottom center;
  will-change: transform;
}
._2d42592e {
  width: 100%;
  height: 100%;
  animation-name: ee4ee7e2;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  transition-timing-function: ease;
  will-change: transform;
}
.ad3322f6 {
  animation-name: _05386921;
  animation-duration: 200ms;
  transition-timing-function: ease;
  will-change: transform;
}
/**
 * Animations: Keyframes
 */
@keyframes _11292128 {
  0% {
    opacity: 1;
  }
  49% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  51% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes _49eaabc4 {
  0% {
    opacity: 0;
  }
  49% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  51% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes b847221f {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}
/**
 * Animations: Keyframes
 */
@keyframes d83390b7 {
  0% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(4deg);
  }
  100% {
    transform: rotate(-4deg);
  }
}
@keyframes ee4ee7e2 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes _05386921 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}
/**
 * Accessibility
 */
@media screen and (prefers-reduced-motion: reduce) {
  ._33c43af5,
  ._489835f0,
  .fe2acb34 {
    animation-name: _266bc94d;
  }
  .fe2acb34 {
    display: none;
  }

  .fd5a29ad,
  ._2d42592e {
    animation-name: _152a7f90;
    animation-name: _3fec4c5b;
  }
  .fd5a29ad {
    transform: rotate(0deg);
  }
}
</style>
