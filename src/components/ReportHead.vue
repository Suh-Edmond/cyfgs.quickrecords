<template>
  <div class="q-mt-lg">
    <div class="row">
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
          <span class="text-uppercase detail text-weight-bolder">PRESBYTERIAN CHURCH IN CAMEROON (PCC)</span><br />
          <span class="text-uppercase detail text-weight-bolder">YOUTH WORK DEPARTMENT</span><br />
          <span class="text-uppercase detail text-weight-bolder">CHRISTIAN YOUTH FELLOWSHIP (C.Y.F)</span><br />
          <span class="text-uppercase detail text-weight-bolder">FAKO NORTH PRESBYTERY</span><br />
          <span class="text-uppercase detail text-weight-bolder">BUEA ZONE</span><br />
          <span class="text-uppercase detail text-weight-bolder">{{
          getOrganisation.name
        }} - {{ getOrganisation.address }}</span>
          <br />
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
    <div class="row q-mt-lg">
      <div class="col-2 col-md-2 col-sm-12 col-xs-12"></div>
      <div class="col-2 col-md-2 col-sm-12 col-xs-12">
        <label  class="text-capitalize detail text-weight-medium"> P.O. Box {{getOrganisation.box_number}}, {{getOrganisation.address}}</label> <br/>
        <label class="detail text-weight-medium">Email: {{getOrganisation.email}}</label>
      </div>
      <div class="col-2 col-md-2 col-sm-12 col-xs-12"></div>
      <div class="col-2 col-md-2 col-sm-12 col-xs-12">
       <div class="flex justify-end items-end">
         <label class="detail text-weight-medium">
           Mobile:
         </label>
       </div>
      </div>
      <div class="col-2 col-md-2 col-sm-12 col-xs-12 detail text-weight-medium q-ml-md">
        <span style="list-style-type: none" v-for="(value, index) in getOrganisationTelephone" :key="index">
            {{value}}<br/>
          </span>
      </div>
      <div class="col-2 col-md-2 col-sm-12 col-xs-12"></div>
    </div>

    <hr style="border-bottom: 5px solid #213c65; margin-bottom: 1rem; margin-top: 4px"/>
    <div class="flex justify-end">
       <label class="detail">{{ $t('app.printedDate') }}: {{ getPrintedDate }}</label>
    </div>
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

    getOrganisationTelephone(){
      return this.$store.getters.getOrganisation.telephone.split("/");
    }
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
