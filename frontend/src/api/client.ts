import { Configuration, DefaultApi } from './index';

const config = new Configuration({
    basePath: 'http://localhost:8080/api/v1',
});

export const apiClient = new DefaultApi(config);
