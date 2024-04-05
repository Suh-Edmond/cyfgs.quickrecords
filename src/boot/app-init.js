import { Loading } from "quasar";

export default () => {
  Loading.show({
    backgroundColor: "primary",
    sanitize: true,
    delay: 1000,
  });

  Loading.hide();
};
