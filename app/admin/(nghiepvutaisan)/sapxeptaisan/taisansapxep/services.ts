import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useSWR([this.url, meta], () => this.getMany(meta));
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
  GetTaiSan = () => {
	const { data, isLoading } = useSWR('api/astaisan', () => api.get('api/astaisan'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.title,
	};
	}),
	isLoading,
	};
	}; 
GetPhuongAnSapXep = () => {
	const { data, isLoading } = useSWR('api/phuongansapxep', () => api.get('api/phuongansapxep'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.title,
	};
	}),
	isLoading,
	};
	}; 
GetTinhTrangPheDuyet = () => {
	const { data, isLoading } = useSWR('api/phuongansx', () => api.get('api/phuongansx'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.title,
	};
	}),
	isLoading,
	};
	}; 
}
const taiSanSapXepServices = new services("api/taisansapxep");
export { taiSanSapXepServices };
