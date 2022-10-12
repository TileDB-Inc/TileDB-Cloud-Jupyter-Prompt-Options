import { v1 } from '@tiledb-inc/tiledb-cloud';
import { Organization, User } from '@tiledb-inc/tiledb-cloud/lib/v1';
import getTileDBAPI from './tiledbAPI';
import { AxiosResponse } from 'axios';

const { UserApi, OrganizationApi } = v1;
interface IDefaultS3Data {
  default_s3_path?: string;
  default_s3_path_credentials_name?: string;
}

/**
 * Returns the default_s3_path_credentials_name of the selected owner
 * @param user The user's username
 * @param owner The selected owner
 * @returns The default credentials name of the owner
 */
const getDefaultS3DataFromNamespace = async (
  user: string,
  owner: string
): Promise<IDefaultS3Data> => {
  const userTileDBAPI = await getTileDBAPI(UserApi);
  const orgTileDBAPI = await getTileDBAPI(OrganizationApi);
  const isOwnerOrganization = user !== owner;
  /**
   * If the current owner is the user we use UserAPI to get user's data
   * otherwise the current owner is an organization so we use OrganizationApi
   * to get the org's data
   */
  const getOwnerData = (): Promise<AxiosResponse<User | Organization>> =>
    isOwnerOrganization
      ? orgTileDBAPI.getOrganization(owner)
      : userTileDBAPI.getUser();
  const ownerResponse = await getOwnerData();

  return {
    default_s3_path:
      (ownerResponse.data.asset_locations?.notebooks as any) ||
      ownerResponse.data.default_s3_path,
    default_s3_path_credentials_name: ownerResponse.data
      .default_s3_path_credentials_name as string,
  };
};

export default getDefaultS3DataFromNamespace;
