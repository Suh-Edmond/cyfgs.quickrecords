<template>
  <div class="row q-mt-lg ">
    <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
    <!----------------LOGO--------------------->
    <div class="col-2 col-md-2 col-sm-12 col-xs-12">
      <q-avatar
        size="110px"
        font-size="52px"
        v-if="getOrganisation.logo != null"
      >
        <img src="../assets/pcc_logo.png" alt="" width="160px" />
      </q-avatar>
    </div>
    <!-------------END OF LOGO----------------->

    <!---------------DETAILS--------------------->
    <div
      class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12  text-center"
    >
      <label>
        <span class="text-uppercase detail text-weight-bolder">{{
          getOrganisation.name
        }}</span>
        <br />
        <span class="detail">{{ getOrganisation.salutation }}</span> <br />
        <span class="detail"
          >{{ getOrganisation.region }} {{ getOrganisation.address }},
          {{ getOrganisation.box_number }}</span
        ><br />
        <span class="detail"><span class="text-weight-meduim" >{{ $t('app.phone') }} </span>: {{ getOrganisation.telephone }}</span
        ><br />
        <span class="detail"> <span class="text-weight-meduim" >{{ $t('app.emailLabel') }}</span> : {{ getOrganisation.email }}</span
        ><br />
        <span class="detail">{{ $t('app.printedDate') }}: {{ getPrintedDate }}</span
        ><br />
      </label>
    </div>
    <!-------------END OF DETAILS------------->

    <!----------------LOGO--------------------->
    <div class="col-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 flex justify-end" >
      <q-avatar
        size="110px"
        font-size="52px"
        v-if="getOrganisation.logo != null"
      >
        <img :src="getOrganisationLogo" alt="" width="160px" />
      </q-avatar>
    </div>
    <!-------------END OF LOGO----------------->

    <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  computed: {
    getOrganisation() {
      return this.$store.getters.getOrganisation;
    },

    getPrintedDate() {
      return moment(new Date()).format("MM/DD/YYYY");
    },

    getOrganisationLogo() {
      return (
        process.env.API_BASE_URL + this.$store.getters.getOrganisation.logo
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  font-family: "Roboto";
  font-style: normal;
  // font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.01em;
}


</style>
