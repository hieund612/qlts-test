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
	GetMaDiaBan = (id:any,cap:any) => {
		const { data, isLoading } = useSWR('api/diadiem/optionselect/' + id + '/' + cap, () => api.get('api/diadiem/optionselect?parentId=' + id + '&cap=' + cap));
		if (data) {
			return {
				data: data.map((item: any) => {
					return {
						value: item.id,
						label: item.tenDiaBan,
					};
				}),
				isLoading,
			};
		} else {
			return { data: [], isLoading };
		}
	};

	GetDataDonViThue = (date:any) => {
		const { data, isLoading } = useSWR('api/donvichothue/'+date.toString(), () => api.get('api/donvichothue'));
		return {
			data: data?.data.map((item: any) => {
				return {
					value: item.id,
					label: item.nguoiDaiDien,
				};
			}),
			isLoading,
		};
	};		
	
}
const asChoThueTaiSanServices = new services("api/denghichothue");
export { asChoThueTaiSanServices };
