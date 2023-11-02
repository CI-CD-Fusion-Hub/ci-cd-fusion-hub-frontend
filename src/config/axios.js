import axios from "axios";

axios.interceptors.response.use(
  function (config) {
    return config;
  },
  function (config) {
    const { status } = config.response;
    if (status === 401) {
      window.location.href = window.location.origin + "/login";
    } else if (status === 403) {
      window.location.href = window.location.origin + "/pipelines";
      return Promise.reject({
        data: { status: "error", message: "Access denied" },
      });
    }
    return Promise.reject({
      data: {
        status: "error",
        message: config.response.statusText || "Unable to connect to backend service.",
      },
    });
  }
);

export default axios;
