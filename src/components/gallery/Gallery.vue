<template>
    <div class="gallery row" :style="fullHeight" :class="hideStory ? 'hide' : ''">
        <div class="col-6 hidden-lg-down" :style="fullHeight">
            <div class="gallery-nav">
                <div id="js-carousel" class="gallery-nav__content">
                    <a href="#" v-for="(project, index) in projects" @click.stop.prevent="hideDetails=true,currentIndex=index">
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
                <div class="gallery-slide" v-if="hideDetails" :key="currentIndex">
                    <button class="btn btn-primary btn-lg gallery-slide__btn_story hidden-sm-down" @click="toggleStory" :class="!hideStory ? 'hide' : ''">
                        <span class="icon-comment"></span>
                        <span class="btn__text">Story</span>
                    </button>
                    <button class="btn btn-primary btn-lg gallery-slide__btn_story hidden-md-up" @click="togglePanel">
                        <span class="icon-comment"></span>
                        <span class="btn__text">Story</span>
                    </button>
                    <button class="gallery-slide__btn_prev" @click="prev">
                        <span class="icon-keyboard_arrow_left"></span>
                    </button>
                    <button class="gallery-slide__btn_next" @click="next">
                        <span class="icon-keyboard_arrow_right"></span>
                    </button>
                    <div class="gallery-slide__title">
                        <h1>{{ currentName }}</h1>
                        <button class="btn btn-primary btn-lg" @click="hideDetails=!hideDetails">
                            <span class="icon-list"></span>
                            <span class="btn__text">Details</span>
                        </button>
                        <button class="btn btn-primary btn-lg" @click="addLike">
                            <span class="icon-favorite"></span>
                            <span class="btn__text">{{ currentLikes }}</button></span>
                    </div>
                    <img class="gallery-slide__image" :src="currentBackground" :style="fullHeight">
                </div>
                <div class="gallery-details" v-else>
                    <div class="gallery-details__panel" :style="fullHeight">
                        <img :src="currentPicture">
                        <h2>{{ currentName }}</h2>
                        <ul>
                            <li class="clearfix"><strong>Solution</strong><span>{{ currentSolution }}</span></li>
                            <li class="clearfix"><strong>Category</strong><span>{{ currentCategory }}</span></li>
                            <li class="clearfix"><strong>Year</strong><span>{{ currentYear }}</span>  </li>
                        </ul>
                        <button class="btn btn-primary btn-lg" @click="hideDetails=!hideDetails">Back</button>
                        <a class="btn btn-primary btn-lg" :href="currentUrl" target="_blank" role="button">Visit Website</a>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>

import { eventBus } from '../../main'

export default {
    props: ['windowHeight'],
    data() {
        return {
            projects: [],
            projectsLoaded: false,
            visibleProjects: 3,
            topButton: false,
            bottomButton: true,
            hideStory: false,
            hidePanel: false,
            hideDetails: true,
            showPreloader: true,
            currentIndex: 0,
            currentName: '',
            currentLikes: '',
            currentBackground: '',
            currentPicture: '',
            currentSolution: '',
            currentYear: '',
            currentCategory: '',
            currentUrl: ''
        }
    },
    created() {
        this.getProjects(),
        eventBus.$on('showStory',(state) => {
            this.hideStory = state
        }),
        eventBus.$on('showPanel',(state) => {
            this.hidePanel = state
        })
    },
    watch: {
        currentIndex: function(){
           this.currentProject()
        }
    },
    methods: {
        toggleStory() {
            eventBus.$emit('showStory', !this.hideStory)
        },
        togglePanel() {
            eventBus.$emit('showPanel', !this.hidePanel)
        },
        togglePreloader() {
            eventBus.$emit('showPreloader', !this.showPreloader)
        },
        getProjects() {
            this.$http.get('https://portfolio-a199d.firebaseio.com/data.json').then((response) => {
                this.projects = response.data
                this.currentProject()
                this.togglePreloader()
                this.projectsLoaded = true
            }, (response) => {
                console.log('error', response);
            })
        },
        currentProject() {
            let proj = this.projects[this.currentIndex]
            let that = this
            let loadedBg = new window.Image()
            let loadedPic = new window.Image()
            this.currentName = proj.name
            this.currentLikes = proj.likes
            this.currentSolution = proj.solution
            this.currentYear = proj.year
            this.currentCategory = proj.category
            this.currentUrl = proj.url
            loadedBg.onload = function() {
                 that.currentBackground = this.src
            }
            loadedBg.src = 'static/imgs/' + proj.background

            loadedPic.onload = function() {
                 that.currentPicture = this.src
            }
            loadedPic.src = 'static/imgs/' + proj.picture
        },
        next() {
            this.currentIndex ++
            if(this.currentIndex >= this.projects.length) {
                this.currentIndex = 0
            }
        },
        prev() {
            this.currentIndex --
            if(this.currentIndex < 0) {
                this.currentIndex = this.projects.length - 1
            }
        },
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
                    console.log('error')
                })
            }
        }
    },
    computed: {
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
