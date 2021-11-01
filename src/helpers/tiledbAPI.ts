import { requestAPI } from './handler';

let data: any;

interface Config {
  apiKey: string;
  basePath: string;
}
interface Constructable<T> {
  new (c: Config): T;
}

const getTileDBAPI = async <T>(Api: Constructable<T>, apiVersion : string = 'v1'): Promise<T> => {
  if (!data) {
    data = await requestAPI();
  }
  const config: Config = {
    apiKey: data.token,
    basePath: `${data.api_host}/${apiVersion}`,
  };
  return new Api(config);
};

export default getTileDBAPI;
