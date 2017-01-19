<template>

    <div>
        <div class="gallery row" :style="fullHeight" :class="hideStory ? 'hide' : ''">

            <div class="col-6 hidden-lg-down" :style="fullHeight">

                <div class="gallery-nav">

                    <div id="js-carousel" class="gallery-nav__content">

                        <a href="#" v-for="(project, index) in projects" v-gallery="index" @click="showDetails=true">
                            <img :src="'static/imgs/' + project.thumb" alt="" :style="elemHeight">
                        </a>

                    </div>

                    <button class="gallery-nav__btn_top" :class="topButton ? 'visible' : ''" @click="changeSlide('prev')">
                        <span class="icon-keyboard_arrow_up">
                    </button>

                    <button class="gallery-nav__btn_bottom" :class="bottomButton ? 'visible' : ''" @click="changeSlide('next')">
                        <span class="icon-keyboard_arrow_down">
                    </button>

                </div>

            </div>

            <div class="col-24 col-xl-18" :style="fullHeight" v-if="projectsLoaded">

                <transition name="fade" mode="out-in">

                    <div class="gallery-slide" v-if="showDetails" :currentIndex="getName" :key="getName">

                        <button class="btn btn-primary btn-lg gallery-slide__btn_story hidden-sm-down" @click="toggleStory" :class="!hideStory ? 'hide' : ''">
                            <span class="icon-comment"></span>
                            <span class="btn__text">Story</span>
                        </button>

                        <button class="btn btn-primary btn-lg gallery-slide__btn_story hidden-md-up" @click="togglePanel">
                            <span class="icon-comment"></span>
                            <span class="btn__text">Story</span>
                        </button>

                        <img class="gallery-slide__image" :src="'static/imgs/' + getBg" :style="fullHeight">

                        <button class="gallery-slide__btn_prev" @click="prev">
                            <span class="icon-keyboard_arrow_left"></span>
                        </button>

                        <button class="gallery-slide__btn_next" @click="next">
                            <span class="icon-keyboard_arrow_right"></span>
                        </button>

                        <div class="gallery-slide__title">
                            <h1>{{ getName }}</h1>
                            <button class="btn btn-primary btn-lg" @click="showDetails=!showDetails">
                                <span class="icon-list"></span>
                                <span class="btn__text">Details</span>
                            </button>
                            <button class="btn btn-primary btn-lg" @click="addLike">
                                <span class="icon-favorite"></span>
                                <span class="btn__text">{{ getLikes }}</button></span>
                        </div>

                    </div>

                    <div class="gallery-details" v-else>

                        <div class="gallery-details__panel" :style="fullHeight">

                            <img :src="'static/imgs/' + getPic">

                            <h2>{{ getName }}</h2>

                            <ul>
                                <li class="clearfix"><strong>Solution</strong><span>{{ getSol }}</span></li>
                                <li class="clearfix"><strong>Category</strong><span>{{ getCat }}</span></li>
                                <li class="clearfix"><strong>Year</strong><span>{{ getYear }}</span>  </li>
                            </ul>

                            <button class="btn btn-primary btn-lg" @click="showDetails=!showDetails">Back</button>
                            <a class="btn btn-primary btn-lg" :href="getUrl" target="_blank" role="button">Visit Website</a>

                        </div>

                    </div>

                </transition>

            </div>

        </div>

    </div>

</template>

<script>

import store from './GalleryStore'
import { eventBus } from '../../main'

export default {

    props: ['windowHeight'],
    data() {
        return {
            projects: [],
            projectsLoaded: false,
            state: store.state,
            showDetails: true,
            visibleProjects: 3,
            topButton: false,
            bottomButton: true,
            hideStory: false,
            hidePanel: false
        }
    },
    created() {
        this.projects = [],
        this.getProjects(),
        eventBus.$on('showStory',(state) => {
            this.hideStory = state;
        }),
        eventBus.$on('showPanel',(state) => {
            this.hidePanel = state;
        })
    },
    methods: {
        getProjects() {
            this.$http.get('https://portfolio-a199d.firebaseio.com/data.json').then((response) => {
            store.state.projectList = response.data
            this.projects = response.data
            this.projectsLoaded = true
            }, (response) => {
                console.log('error', response);
            })
        },
        toggleStory() {
            eventBus.$emit('showStory', !this.hideStory)
        },
        togglePanel() {
            eventBus.$emit('showPanel', !this.hidePanel)
        },
        next() { store.next() },
        prev() { store.prev() },
        navButtons(projects, projectsLength) {
            if(projects === 3) {
                this.topButton = false
            } else {
                this.topButton = true
            }
            if (projects >= projectsLength) {
                this.bottomButton = false
            }else {
                this.bottomButton = true
            }
        },
        changeSlide(direction){

            let carousel = document.getElementById('js-carousel')
            let projectsLength = this.projects.length
            let shiftValue = 100 / projectsLength
            let isAnimating = false

            if (isAnimating === false) {
                isAnimating = true;
                setTimeout( () => {
                    isAnimating = false
                }, 1000)
                if(direction === 'next' && this.visibleProjects < projectsLength) {
                    this.visibleProjects += 1
                    let value = (shiftValue * (this.visibleProjects - 3)) * -1
                    carousel.style.transform = "translate3d(0," + value + "%,0)"
                    this.navButtons(this.visibleProjects, projectsLength)

                } else if (direction === 'prev' && this.visibleProjects > 3) {
                    this.visibleProjects -= 1
                    let value = (shiftValue * (this.visibleProjects - 3))
                    carousel.style.transform = "translate3d(0," + value + "%,0)"
                    this.navButtons(this.visibleProjects, projectsLength)
                }
            }
        },
        addLike(index){

            if(!sessionStorage.getItem(this.state.index)) {

                let likes = parseInt(this.getLikes)

                let like = String(likes += 1)

                this.$http.put('https://portfolio-a199d.firebaseio.com/data/' + this.state.index + '/likes.json', like).then((response) => {
                    sessionStorage.setItem(this.state.index,true)
                    store.state.projectList[store.state.index].likes = parseInt(like);
                }, (response) => {
                })
            }
        }
    },
    computed: {
        getName () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].name
            }
        },
        getSol () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].solution
            }
        },
        getCat () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].category
            }
        },
        getYear () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].year
            }
        },
        getUrl () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].url
            }
        },
        getSrc () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].thumb
            }
        },
        getBg () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].background
            }
        },
        getPic () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].picture
            }
        },
        getLikes () {
            if(store.state.projectList[store.state.index]){
                return store.state.projectList[store.state.index].likes
            }
        },
        fullHeight () {
            return {
                height: this.windowHeight + 'px'
            }
        },
        elemHeight () {
           return {
                height: (this.windowHeight / 3) + 'px'
           }
        }
    }
}

</script>

<style src="./gallery.scss" lang="scss"></style>
