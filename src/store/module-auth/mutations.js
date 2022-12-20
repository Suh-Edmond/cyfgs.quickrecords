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

export function SET_PAYMENT_CATEGORIES(state, data) {
  state.payment_categories = data
}

export function UPDATE_PAYMENT_CATEGORY(state, data) {
  state.updated_payment_category = data
}

export function SET_PAYMENT_ITEMS(state, data) {
  state.payment_items = data
}

export function SET_CURRENT_PAYMENT_CATEGORY(state, data) {
  state.current_payment_catgeory = data
}

export function SET_UPDATED_PAYMENT_ITEM(state, data) {
  state.updated_payment_item = data;
}

export function SET_EXPENDITURE_CATEGORIES(state, data) {
  state.expenditure_categories = data
}

export function UPDATE_EXPENDITURE_CATEGORY(state, data) {
  state.updated_expenditure_category = data
}
