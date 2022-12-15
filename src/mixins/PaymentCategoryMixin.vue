<script>
import organisationMixinVue from './organisationMixin.vue';

export default {
    mixins: [organisationMixinVue],
    data() {
        return {
            data:[]
        }
    },
    methods: {
        fetchCategories() {
            let organisationId = this.getOrganisationId;
            let payload = {
                url: `/api/protected/organisations/${organisationId}/payment-categories`,
                msg: "none",
                color: "default",
                status: "none",
                error_msg: "An Error occurred! Could not fetch payment categories",
                has_commit: false,
                show_feedback: false,
                commit: "none",
                to_be_store_data: {
                    required: false,
                    has_value: false,
                    data: [],
                },
            };
            this.$store.dispatch("getRequest", payload).then((res) => {
                if(res !== undefined){
                    res.data.forEach(element => {
                        this.data.push({
                            counter: res.data.indexOf(element) + 1,
                            name: element.name,
                            item: "View Payment Items",
                            id: element.id,
                            description: element.description
                        })
                    });

                    this.$store.dispatch("setPayCategories", this.data);
                }
            })
        }
    }
}
</script>
