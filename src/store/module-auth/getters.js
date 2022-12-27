export function getRoles(state) {
  return state.roles;
}
export function getOrganisation(state) {
  return state.organisation
}

export function getMembers(state){
  return state.members
}

export function getFetchingState(state){
  return state.is_fetching
}

export function getUpdatedMember(state) {
  return state.updated_member
}

export function getPaymentCategories(state) {
  return state.payment_categories;
}

export function getUpdatedPaymentCategory(state) {
  return state.updated_payment_category;
}

export function getPaymentItems(state) {
  return state.payment_items;
}

//the category that has be click inorder to view its items
export function getCurrentPaymentCategory(state) {
  return state.current_payment_catgeory
}

//get the current updated payment item
export function getUpdatedPaymentItem(state) {
  return state.updated_payment_item
}

export function getExpenditureCategories(state) {
  return state.expenditure_categories;
}

export function getUpdatedExpenditureCategory(state) {
  return state.updated_expenditure_category;
}

export function getExpenditureItems(state) {
  return state.expenditure_items;
}

export function getCurrentExpenditureCategory(state) {
  return state.current_expenditure_category;
}

export function getUpdatedExpenditureItem(state) {
  return state.updated_expenditure_item
}

export function getEditState(state) {
  return state.is_edit_state;
}

export function getExpenditureItemDetails(state) {
  return state.expenditure_item_details;
}

export function getCurrentExpenditureItem(state) {
  return state.current_expenditure_item;
}

export function getUpdatedExpenditureItemDetail(state) {
  return state.updated_expenditure_item_detail;
}

export function getOrganisationMembersSavings(state) {
  return state.organisation_members_savings;
}

export function getMemberSavings(state) {
  return state.member_savings
}

export function getUpdatedMemberSaving(state) {
  return state.updated_member_saving;
}

export function getCurrentMemberSaving(state) {
  return state.current_member_saving
}

export function getIncomeActivities(state) {
  return state.income_activities
}
