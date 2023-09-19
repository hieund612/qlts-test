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
    GetLoaiBD = () => {
        const { data, isLoading } = useSWR('api/loaibiendong', () => api.get('api/loaibiendong'));
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
    GetLoaiTS = () => {
        const { data, isLoading } = useSWR('api/loaitaisan', () => api.get('api/loaitaisan'));
        return {
            data: data?.data.map((item: any) => {
                return {
                    value: item.id,
                    label: item.tenLoaiTS,
                };
            }),
            isLoading,
        };
    };
}
const lyDoBienDongServices = new services("api/lydobiendong");
export { lyDoBienDongServices };
