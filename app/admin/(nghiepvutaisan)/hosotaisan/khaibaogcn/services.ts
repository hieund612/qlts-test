import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    meta.filter.phienBan=1;
    meta.filter.loaiHoSoId=1;
    meta.filter.laPhienBanHienTai = false;
    meta.filter.isThayDoi = false;
    const { data, error, isLoading, mutate } = useSWR([this.url+'/khaibaogcn', meta], () => this.getMany(meta));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetLoaiHoSo = () => {
    const { data, isLoading } = useSWR('api/loaihoso', () => api.get('api/loaihoso'));
    return {
      data: data?.data.map((item: any) => {
        return {
          value: item.id,
          label: item.tenLoaiHS,
        };
      }),
      isLoading,
    };
  };
  onSendHoSo = async (id: number) => {
    const res: any = await api.put(`${this.url}/sendapprove/${id}`);
    return res;
  };
}
const hoSoTaiSanServices = new services("api/hihosotaisan");
export { hoSoTaiSanServices };
