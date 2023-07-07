
export default function () {
  return {
    roles: [],
    organisation:null,
    members:[],
    is_fetching: false,
    sessions:[],
    report_data:[],



    updated_member: null,
    payment_categories:[],
    updated_payment_category:null,
    payment_items: null,
    current_payment_catgeory:null,
    updated_payment_item:null,
    expenditure_categories:[],
    updated_expenditure_category:null,
    expenditure_items:[],
    current_expenditure_category: null,
    updated_expenditure_item:null,
    expenditure_item_details:null,
    current_expenditure_item:null,
    updated_expenditure_item_detail:null,
    organisation_members_savings:null,
    member_savings:null,
    updated_member_saving:null,
    current_member_saving:null,
    income_activities:null,
    updated_income_activity:null,
    current_income_activity:null,
    members_contributions:null,
    current_payment_item:null,
    selected_contribution:null,
    expenditures:null,
    expenditure_category:null,// this is the category been selected during the approve state
    savings:[],//for approveing to be done
    expenditure_item_name:null,
    search_saving_param:null,
    filtered_contributions:null,
    intermediate_tabs:[],
    member_contributions:[],
    payment_activities:[],
    sponsorships:[],
    selected_sponsorship:null,
    member_to_register:null,
    current_member:null,
    current_year:null,
    reg_amount:0.0,
    bar_chart_data:[],
    pie_chart_data:[],
    total_yearly_contribution:0
  };
}
