export function LOGIN_USER (state, data) {
  state.has_logged_in = data
}

export function REGISTER_USER (state, data){
  state.is_exist_user = data;
  state.has_logged_in = data;
}
