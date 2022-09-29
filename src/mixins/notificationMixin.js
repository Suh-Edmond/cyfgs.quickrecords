export default{
  methods: {
    sendMessage(type, message){
      this.$q.notify({
        type: type,
        position: 'top-right',
        message: `${message}`,
        progress: true
      })
    }
  }
}
