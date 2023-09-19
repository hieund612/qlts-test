import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    meta.filter.laPhienBanHienTai = true;
    meta.filter.loaiHoSoId = 0;
    meta.filter.phienBan = 0;
    meta.filter.isThayDoi = false;
    const { data, error, isLoading, mutate } = useSWR([this.url + '/danhsachhsts', meta], () => this.getMany(meta));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetListApproved = (meta: Meta, id: number) => {
    meta.filter.laPhienBanHienTai = false;
    meta.filter.loaiHoSoId = 0;
    meta.filter.phienBan = 0;
    meta.filter.isThayDoi = false;
    meta.filter.hoSoTaiSanId = id;
    const { data, error, isLoading, mutate } = useSWR([this.url + '/danhsachpheduyet', id], () => this.getMany(meta));
    if (data) {
      data.data.map((item: any) => {
        item.hideCheck = item.trangThai == 2 ? false : true
        return item;
      })
    }
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
  GetListTaiSan = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `${this.url}/listasset/${id}` : null, () => api.get(`${this.url}/listasset/${id}`));
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

  pheDuyet = async (id: number, type: number) => { //type: 1: đồng ý, 2: từ chối    
    const res: any = await api.put(`api/hihosotaisan/${type == 1 ? 'approved' : 'deny'}/${id}`);
    return res;
  }
  pheDuyetMutil = async (ids: any, taiSanId:number, type: number) => { //type: 1: đồng ý, 2: từ chối    
    const res: any = await api.put(`api/hihosotaisan/${type == 1 ? 'approved-mutil' : 'deny-mutil'}`, { ids: ids, taiSanId:taiSanId });
    return res;
  }
}
const hoSoTaiSanServices = new services("api/hihosotaisan");
export { hoSoTaiSanServices };
