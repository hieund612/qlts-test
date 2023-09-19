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
GetDonVi = () => {
	const { data, isLoading } = useSWR('api/donvinoibo', () => api.get('api/donvinoibo'));
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
GetDonViVanHanh = () => {
	const { data, isLoading } = useSWR('api/donvivanhanhtoanha', () => api.get('api/donvivanhanhtoanha'));
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
const vanHanhToaNhaServices = new services("api/vanhanhtoanha");
export { vanHanhToaNhaServices };
