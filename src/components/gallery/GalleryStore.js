class galleryStore {

    constructor () {
        this.state = {
            projectList: [],
            index: 0
        }
    }

    next () {
        this.state.index ++
        if(this.state.index >= this.state.projectList.length) {
            this.state.index = 0
        }
    }

    prev () {
        this.state.index --
        if(this.state.index < 0) {
            this.state.index = this.state.projectList.length - 1
        }
    }

}

export default new galleryStore()
