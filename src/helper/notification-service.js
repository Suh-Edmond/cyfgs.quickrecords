export function sendMessage(message, type) {
  this.$q.notify({
    type: type,
    position: 'top-right',
    message: `${message}`,
    progress: true
  })
}
