import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    meta.filter.isThayDoi = true;
    meta.filter.loaiHoSoId = 1;
    meta.filter.laPhienBanHienTai = false;
    meta.filter.phienBan=0;
    
    const { data, error, isLoading, mutate } = useSWR([this.url+'/thaydoithongtin', meta], () => this.getMany(meta));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };

  GetListDanhSachGCN = (meta: Meta) => {
    meta.filter.laPhienBanHienTai = true;
    meta.filter.loaiHoSoId = 1;
    meta.filter.phienBan = 0;
    meta.filter.isThayDoi = false;
    const { data, error, isLoading, mutate } = useSWR([this.url+'/danhsachgcn', meta], () => this.getMany(meta));
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
  GetHoSoById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `${this.url}/hosohi/${id}` : null, () => api.get(`${this.url}/${id}`));
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
  thayDoiThongTin = async (data: any, object: string, objectFile: any[]) => {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const formData = new FormData();
    if (objectFile && data) {
      objectFile.map((x) => {
        if (data[x.file]) {
          let attachs = data[x.file];
          for (let i = 0; i < attachs.length; i++) {
            formData.append(x.name, attachs[i]);
          }
        }
      });
    }
    formData.append(object, JSON.stringify(data));

    const res: any = await api.put(`api/hihosotaisan/changeinfo/${data.id ? data.id : data.Id}`, formData, {
      headers: headers
    });
    return res;
  }

  onSendHoSo = async (id: number) => {
    const res: any = await api.put(`${this.url}/sendapprove/${id}`);
    return res;
  };
}
const hoSoTaiSanServices = new services("api/hihosotaisan");
export { hoSoTaiSanServices };
