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
  GetParent = () => {
    const { data, isLoading } = useSWR('api/rolecategory/tree', () => api.get('api/rolecategory/tree'));
    if (data && data.data) {
      let arr = data.data;
      this.addValueToTree(arr);
      return {
        data: arr,
        isLoading,
      };
    }
    else {
      return {
        data: [],
        isLoading,
      };
    }
  };
  addValueToTree(tree: any) {
    for (const node of tree) {
      node.value = node.id; // Thêm thuộc tính Value với giá trị từ Id
      node.title = node.tieuDe;
      if (node.children.length > 0) {
        this.addValueToTree(node.children); // Đệ quy cho các node con
      }
    }
  }
}
const roleCategoryServices = new services("api/rolecategory");
export { roleCategoryServices };
