import Vue from 'vue'
import store from './GalleryStore'

Vue.directive('gallery', {
    bind: (el, binding) => {
        el.addEventListener('click', function(e) {
            e.preventDefault()
            store.state.index = binding.value
        })
    }
})
