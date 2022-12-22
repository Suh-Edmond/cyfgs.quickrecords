<script>
import organisationMixinVue from './organisationMixin.vue';

export default {
  mixins:[organisationMixinVue],

  methods: {
    getOrganisationMemberSavings(){
      let id = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${id}/user-savings`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch members savings",
        has_commit: true,
        show_feedback: false,
        commit: "SET_ORGANISATION_MEMBERS_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {

      });
    }
  }
}
</script>
