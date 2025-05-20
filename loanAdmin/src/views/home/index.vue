<template>
  <div class="gi_page home" id="home">

    <div class="home__content">
      <div>
        <div class="home__item">
          <ProjectCard />
        </div>
      </div>
      <div class="home__item" style="width:100%;height:350px;">
        <AccessTrendCard />
      </div>
    </div>

    <a-back-top :visible-height="100" target-container="#home" />
  </div>
</template>

<script setup lang="ts">

import ProjectCard from './components/ProjectCard.vue'
import AccessTrendCard from './components/AccessTrendCard.vue'


const open = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
.gi_page {
  width: 100%;

  .home__content {
    width: 100%;
    height: 800px;
    overflow-y: auto;


  }
}

.a-col {
  padding: 0;
  margin: 0;
}

.home {
  padding: 0;
  user-select: none;
  cursor: pointer;

  span.link {
    cursor: pointer;
    color: rgb(var(--arcoblue-6));
    font-weight: bold;

    &:hover {
      opacity: 0.7;
    }
  }

  &__content {
    padding: 6px;
  }

  &__item {
    padding: 6px;
    box-sizing: border-box;
  }

  .backtop-icon {
    cursor: pointer;
  }
}
</style>
