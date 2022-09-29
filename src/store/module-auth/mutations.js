export function LOGIN_USER (state, data) {
  state.is_authenticated = data
}

export function REGISTER_USER (state, data){
  state.has_logged_in = data
}
