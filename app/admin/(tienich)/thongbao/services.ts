import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  
 
  GetData = async (meta: Meta) => {
    let sortBy = "";
    let sortDesc = false;
    let title = meta.search;
    const { page, page_size, sort, filter } = meta;
    if (meta.sort) {
      sortBy = Object.keys(meta.sort)[0];
      sortDesc = sort[sortBy] === "desc";
    }
    const params = {
      page: page,
      itemsPerPage: page_size,
      sortBy: sortBy,
      sortDesc: sortDesc,
      FilterText: title,
      ...filter,
    };
    const res: any = await api.get(this.url, { params: params });
    return res;
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
  GetDonVi = (type:any) => { //type=1=>value=id, type=2=>value=maDV
    const { data, isLoading } = useSWR('api/donvinoibo/treeselect/'+type, () => api.get('api/donvinoibo/treeselect'));
    if (data && data.data) {
      let arr = data.data;
      this.addValueToTree(arr, type);
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
  addValueToTree(tree: any, type: number = 1) {
    for (const node of tree) {
      node.value = type==1?node.id:node.maDV; // Thêm thuộc tính Value với giá trị từ Id
      node.title = node.maDV + "-" + node.tenDV;
      if (node.children.length > 0) {
        this.addValueToTree(node.children, type); // Đệ quy cho các node con
      }
    }
  } 
}
const notificationServices = new services("api/notification");
export { notificationServices };
