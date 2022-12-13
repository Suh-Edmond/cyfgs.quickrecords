export function SET_ROLES (state, data) {
  state.roles = data
}
export function SET_ORGANISATION(state, data) {
  state.organisation = data
}

export function SET_MEMBERS(state, data){
  state.members = data
}

export function SET_IS_FETCHING(state, data) {
  state.is_fetching = data;
}


export function UPDATE_MEMBER(state, data) {
  state.updated_member = data
}
