import axios from 'axios';

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  (config) => {
    const { status } = config.response;
    if (status === 401) {
      window.location.href = `${window.location.origin}/login`;
    }
    else if (status === 403) {
      window.location.href = `${window.location.origin}/pipelines`;
      return {
        data: { status: 'error', message: 'Access denied' },
      };
    }
    return {
      data: {
        status: 'error',
        message: config.response.data.message || 'Unable to connect to backend service.',
      },
    };
  },
);

export default axios;
