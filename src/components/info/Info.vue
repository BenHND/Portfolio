<template>
    <div class="info" :style="fullHeight">

        <transition name="slide" mode="out-in">

            <about v-if="currentPanel" @switch="currentPanel = $event"></about>

            <contact v-else @switch="currentPanel = $event"></contact>

        </transition>

    </div>
</template>

<script>

import about from './InfoAbout.vue'
import contact from './InfoContact.vue'

export default {
    components: { about, contact },
    props: ['windowWidth','windowHeight'],
    data () {
        return {
            currentPanel: true
        }
    },
    computed: {
        fullHeight () {
            return {
                height: this.windowHeight + 'px'
            }
        }
    }
}

</script>

<style lang="scss">

    .slide-enter {
        transform: translateX(-100%);
    }
    .slide-enter-active {
        transition: transform 0.8s;
    }
    .slide-leave {
        transform: translateX(0);
    }
    .slide-leave-active {
        transition: transform 0.8s;
        transform: translateX(-100%);
    }

</style>
