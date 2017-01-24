<template>
    <div class="about-panel">
        <button class="about-panel__btn_contact btn btn-primary btn-lg" @click="switchPanel">
            <span class="icon-mail_outline"></span>
            <span class="btn__text">Contact</span>
        </button>
        <button class="about-panel__btn_close hidden-sm-down" @click="toggleStory">
            <span class='arrow'></span>
        </button>
        <button class="about-panel__btn_projects btn btn-primary btn-lg hidden-md-up" @click="togglePanel">
            <span class="icon-comment"></span>
            <span class="btn__text">Projects</span>
        </button>
        <div class="about-panel__content">
            <img src="../../assets/images/profile.jpg" class="rounded-circle">
            <h1>Hi I'm <strong>Benjamin</strong></h1>
            <h2>a front-end developer from Paris, France</h2>
            <p>I'm passionate about interface creation. I love thinking & crafting digital stuff.
                I am fairly competent with front-end as well as back-end.
                If you want to get something built, help with a project or just fancy saying hi, feel free to send me a message.</p>
        </div>
        <ul class="about-panel__social">
            <li><a href="https://github.com/benHND" target="_blank"><span class="icon-github"></span></a></li>
            <li><a href="https://twitter.com/BenHND1" target="_blank"><span class="icon-twitter"></span></a></li>
            <li><a href="https://fr.linkedin.com/in/benjamin-hernandez-79540b136" target="_blank"><span class="icon-linkedin"></span></a></li>
            <li><a href="https://www.facebook.com/benjamin.hernandez.756" target="_blank"><span class="icon-facebook"></span></a></li>
        </ul>
    </div>
</template>

<script>

import { eventBus } from '../../main'

export default {
    data () {
        return {
            currentPanel: true,
            hideStory: false,
            hidePanel: false
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
    methods: {
        switchPanel() {
            this.currentPanel = false
            this.$emit('switch', this.currentPanel)
        },
        toggleStory() {
            eventBus.$emit('showStory', !this.hideStory)
        },
        togglePanel() {
            eventBus.$emit('showPanel', !this.hidePanel)
        }
    }
}

</script>

<style src="./about.scss" lang="scss"></style>
