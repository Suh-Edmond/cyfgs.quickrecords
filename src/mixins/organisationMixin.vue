<script>
import { LocalStorage } from 'quasar';

export default {
  data() {},
  computed: {
    getOrganisationId() {
      return LocalStorage.getItem("organisation").id
    },
  },
};
</script>
>
