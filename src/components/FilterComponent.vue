<template>
  <div class="q-pa-xs">
    <!---------------------------------------------MEMBER MANAGEMENT FILTERS----------------------------------------------->
    <div
      class="row q-ml-xs"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-show="show_member_filters"
    >
      <div
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
        <q-select
          v-model="year"
          outlined
          dense
          :options="getSessionsFromState"
          :label="$t('app.selectYearLabel')"
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t("app.noResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
        <q-select
          v-model="has_register"
          outlined
          dense
          :options="registrationStatuses"
          :label="$t('app.selectStatusLabel')"
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t("app.noResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
        <q-select
          v-model="gender"
          outlined
          dense
          :options="genders"
          :label="$t('app.selectGenderLabel')"
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t("app.noResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="flex col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <div :class="$q.screen.lg ? 'q-pr-md' : ''">
          <q-btn
            :label="$t('app.filter')"
            color="primary"
            :disabled="validateFilter"
            @click="filterMembers"
            no-caps
            icon-right="filter_list"
          >
          </q-btn>
        </div>
        <q-space />
        <div>
          <q-btn
            :label="$t('app.print')"
            :loading="getDownloadLoadingState"
            color="positive"
            :disabled="getDisableDownloadBtn"
            no-caps
            icon-right="print"
            @click="downloadMembers"
          ></q-btn>
        </div>
      </div>
    </div>
    <!---------------------------------------------END OF MEMBER MANAGEMENT FILTERS---------------------------------------->
  </div>
</template>

<script>
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";
export default {
  props: {
    show_member_filters: {
      required: true,
      type: Boolean,
    },

    loading_download:{
      required: true,
      type: Boolean,
    },

    disable_download_btn:{
      required: true,
      type: Boolean,
    }
  },

  mixins: [CurrentYearMixin],

  mounted() {
    if(this.getSessionsFromState.length == 0){
      this.getSessions();
    }
  },

  data() {
    return {
      year: "",
      has_register: "",
      gender: "",
      genders: ["MALE", "FEMALE", "ALL", "OTHER"],
      registrationStatuses: [
        "REGISTERED",
        "NOT_REGISTERED",
        "PENDING",
        "DECLINED",
        "ALL",
      ],
    };
  },

  computed: {
    validateFilter() {
      return (
        (this.has_register === "" || this.has_register === null) &&
        (this.year === "" || this.year === null) &&
        (this.gender === "" || this.gender === null)
      );
    },

    getDownloadLoadingState:{
      get(){
        return this.loading_download;
      },
      set(loading_download){
        return loading_download
      }
    },

    getDisableDownloadBtn:{
      get(){
        return this.disable_download_btn;
      },
      set(disable_download_btn){
        return disable_download_btn;
      }
    }
  },

  methods: {
    filterMembers() {
      let payload = {
        year: this.year !== null &&  this.year !== "" ?  this.year : "",
        has_register: this.has_register,
        gender: this.gender,
      };

      this.$emit("filter-members", payload);
    },
    downloadMembers() {
      let payload = {
        year: this.year,
        has_register: this.has_register,
        gender: this.gender,
      };

      this.$emit("download-members", payload);
    },


    stopFilterSelectInputFields(){

    }
  },
};
</script>

<style lang="scss" scoped></style>
