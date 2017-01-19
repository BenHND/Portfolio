<template>

    <div id="app">

        <div class="container-fluid" :style="fullHeight">

                <transition name="pageLoad">
                    <div class="preloader" v-if="loading">
                        <div class="spinner">Loading</div>
                    </div>
                </transition>

                <div class="row main-content" :class="[hideStory ? 'hide' : '', hidePanel ? 'toggle' : '']">

                    <div class="col-24 col-md-7">
                        <info :windowHeight="windowHeight"></info>
                    </div>

                    <div class="col-24 col-md-17">
                        <gallery :windowHeight="windowHeight"></gallery>
                    </div>

                </div>

        </div>

    </div>

</template>

<script>

import './components/gallery/GalleryDirective'
import gallery from './components/gallery/gallery.vue'
import store from './components/gallery/GalleryStore'
import info from './components/info/Info.vue'
import { eventBus } from './main'

export default {

    components: {
        gallery, info
    },
    data() {
        return {
            windowHeight: 0,
            hideStory: false,
            hidePanel: false,
            loading: true
        }
    },
     created() {
        eventBus.$on('showStory',(state) => {
            this.hideStory = state;
        }),
        eventBus.$on('showPanel',(state) => {
            this.hidePanel = state;
        })
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.getWindowHeight);
            this.getWindowHeight()
        })
        setTimeout( () => {
            this.loading = false
        },1000);

    },
    beforeDestroy() {
        window.removeEventListener('resize', this.getWindowHeight);
    },
    methods: {
        getWindowHeight(event) {
            this.windowHeight = document.documentElement.clientHeight;
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

<style src="./app.scss" lang="scss"></style>
