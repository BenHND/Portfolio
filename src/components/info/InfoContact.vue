<template>

    <div class="contact-panel">
        <button class="contact-panel__btn_about btn btn-primary btn-lg" @click="switchPanel">
            <span class="icon-face"></span>
            <span class="btn__text">About</span>
        </button>
        <div class="contact-panel__content">
            <h2>Contact details</h2>
            <ul class="contact-panel__content_details">
                <li class="clearfix"><strong>Mail</strong><span>hello@hb-interactive.com</span></li>
                <li class="clearfix"><strong>Phone</strong><span>+ 33 6 06 83 96 35</span></li>
                <li class="clearfix"><strong>Address</strong><span>8 rue Fouquet 92110 Clichy</span>  </li>
            </ul>
            <h2>Use form below</h2>
            <ul class="contact-panel__content_errors" v-show="errors">
                <li v-show="!validation.message">* Message cannot be empty.</li>
                <li v-show="!validation.email">* Please provide a valid email address.</li>
            </ul>
            <div role="form">
                <div class="form-group contact-email">
                    <label for="contact-email">Email</label>
                    <input type="text" name="email" class="form-control" id="contact-email" v-model="form.email">
                </div>
                <div class="form-group contact-subject">
                    <label for="contact-subject">Subject</label>
                    <input type="text" name="subject" class="form-control" id="contact-subject" v-model="form.subject">
                </div>
                <div class="form-group contact-message">
                    <label for="contact-message">Message</label>
                    <textarea name="message" class="form-control" id="contact-message" v-model="form.message "></textarea>
                </div>
                <button class="btn btn-primary btn-lg" @click="submitForm">{{ submit }}</button>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    data () {
        return {
            currentPanel: false,
            form: {
                email: '',
                subject: '',
                message: ''
            },
            submit: 'send',
            sent: false,
            errors: false
        }
    },
    computed: {
        validation: function() {
            let emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return {
                message: !!this.form.message.trim(),
                email: emailRE.test(this.form.email)
            }
        },
        isValid: function() {
            let validation = this.validation
            return Object.keys(validation).every(function (key) {
                return validation[key]
            })
        }
    },
    methods: {
        switchPanel() {
            this.currentPanel = true
            this.$emit('switch', this.currentPanel)
        },
        submitForm() {
            if(this.isValid){
                if(this.sent !== true){
                    this.submit = 'Sending message ...'
                    this.$http.post('https://portfolio-a199d.firebaseio.com/message.json', this.form).then((response) => {
                        this.submit = 'Message sent, thank You !'
                        this.form.email = ''
                        this.form.subject = ''
                        this.form.message = ''
                        this.sent = true
                    }, (response) => {
                        this.submitted = 'Error, try again !'
                    })
                } else {
                    this.submit = 'Message already sent !'
                }
            } else {
                this.errors = true
            }
        }
    }
}

</script>

<style src="./contact.scss" lang="scss"></style>
