import { TBrand, TBrandDetail, TBrandUpdate, TNewBrandCreate } from 'types/brand';
import { BaseReponse } from 'types/response';
import { TStore, TStoreCreate, TStoreDetail } from 'types/store';
import { TUser, TUserCreate } from 'types/user';
import requestWebAdmin from 'utils/axios';
import { generateAPIWithPaging } from './utils';

const getBrandDetail = (brandId: string) => requestWebAdmin.get<TBrandDetail>(`brands/${brandId}`);

const getStoreOfBrand = (brandId: string, params?: any) => {
  return requestWebAdmin.get<BaseReponse<TStore>>(`brands/${brandId}/stores`, { params });
};
const getListUserOfBrand = (brandId: string, params?: any) => {
  return requestWebAdmin.get<BaseReponse<TUser>>(`brands/${brandId}/users`, { params });
};
const createUserOfBrand = (brandId: string, values: TUserCreate) => {
  return requestWebAdmin.post<BaseReponse<TUser>>(`brands/${brandId}/users`, values);
};

const createNewBrand = (data: TNewBrandCreate) => {
  return requestWebAdmin.post<BaseReponse<TBrandDetail>>('brands', data);
};

const updateBrandInformation = (brandId: string, values: TBrandUpdate) => {
  return requestWebAdmin.put<BaseReponse<TBrandDetail>>(`brands/${brandId}`, values);
};

const createNewBrandStore = (data: TStoreCreate) => {
  return requestWebAdmin.post<BaseReponse<TStoreDetail>>('stores', data);
};

const brandApi = {
  getBrandDetail,
  getStoreOfBrand,
  getListUserOfBrand,
  createUserOfBrand,
  createNewBrand,
  updateBrandInformation,
  createNewBrandStore,
  ...generateAPIWithPaging<TBrand>('brands')
};

export default brandApi;
