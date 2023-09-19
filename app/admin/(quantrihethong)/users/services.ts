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
  GetAllGroups = () => {
    const { data, isLoading } = useSWR('api/groups', () => api.get('api/groups'));
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

  GetUserById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetTreeMenu = () => {
    const { data, error, isLoading, mutate } = useSWR('api/menumanager/treemenu', () => api.get('api/menumanager/treemenu'),{ revalidateOnFocus: false });
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  ActiveUser = async (id: string) => {
    const res = await api.put(`api/users/active/${id}`);

    return res;
  };

  DeactiveUser = async (id: string) => {
    const res = await api.put(`api/users/deactive/${id}`);

    return res;
  };
  ResetPassword = async (data: any) => {
    const res = await api.put('api/users/resetpass', data);

    return res;
  };

  AddUserToGroup = async (idUser: any, idGroup: any) => {
    const res = api.post('api/groupuser', { groupId: idGroup, userId: idUser });
    return res;
  };
  RemoveUserToGroup = async (idUser: any, idGroup: any) => {
    const res = api.put(`api/groupuser/remove`, { groupId: idGroup, userId: idUser });
    return res;
  };
  GetDonVi = () => { 
    const { data, isLoading } = useSWR('api/donvinoibo/treeselect', () => api.get('api/donvinoibo/treeselect'));
    if (data && data.data) {
      let arr = data.data;
      this.addValueToTree(arr, 1);
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
const userServices = new services("api/users");

export {userServices};

