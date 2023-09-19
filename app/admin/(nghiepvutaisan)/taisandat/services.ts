import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta, loaiBienDong:any) => {	
	meta.filter.loaiBienDong=loaiBienDong??null;
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
  GetTaiSanById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `${this.url}/asdat/${id}` : null, () => api.get(`${this.url}/asdat/${id}`));
	if(data){
		data.ngayBienDong=null;
	}
    return {
      data,
	  error,
      isLoading,
      mutate,
    };
  }; 
  GetDonVi = () => { //type=1=>value=id, type=2=>value=maDV
    const { data, isLoading } = useSWR('api/donvinoibo/treeselect/', () => api.get('api/donvinoibo/treeselect'));
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
      node.value =node.id; // Thêm thuộc tính Value với giá trị từ Id
      node.title = node.maDV + "-" + node.tenDV;
      if (node.children.length > 0) {
        this.addValueToTree(node.children); // Đệ quy cho các node con
      }
    }
  }
GetPhongBanChiuPhi = () => {
	const { data, isLoading } = useSWR('api/phongban', () => api.get('api/phongban'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenPB,
	};
	}),
	isLoading,
	};
	}; 
GetPhongBanQuanLy = () => {
	const { data, isLoading } = useSWR('api/phongban', () => api.get('api/phongban'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenPB,
	};
	}),
	isLoading,
	};
	}; 
GetLoaiTaiSan = () => {
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
GetNhomTaiSan = () => {
	const { data, isLoading } = useSWR('api/nhomtaisan/optionselect', () => api.get('api/nhomtaisan/optionselect?loaiTaiSanGoc=1'));
	if(data){
		return {
			data: data.map((item: any) => {
			return {
			value: item.id,
			label: item.tenNhomTS,
			isDisabled:item.isParents,
			maNhomTS: item.maNhomTS,
			};
			}),
			isLoading,
			};
	}else{
		return {data:[],isLoading};
	}
	
	}; 
GetMaDiaBan = (id:any,cap:any) => {
	const { data, isLoading } = useSWR('api/diadiem/optionselect/'+id+'/'+cap, () => api.get('api/diadiem/optionselect?parentId='+id+'&cap='+cap));
	if(data){
		return {
			data: data.map((item: any) => {
			return {
				value: item.id,
				label: item.tenDiaBan,
			};
			}),
			isLoading,
		};
	}else{
		return {data:[],isLoading};
	}
	}; 
GetMaMucDich = () => {
	const { data, isLoading } = useSWR('api/mucdichsudung', () => api.get('api/mucdichsudung'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenMD,
	};
	}),
	isLoading,
	};
	}; 
GetThoiHanSuDung = () => {
	const { data, isLoading } = useSWR('api/thoihansudung', () => api.get('api/thoihansudung'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenTH,
	};
	}),
	isLoading,
	};
	}; 
GetMaNguonGoc = () => {
	const { data, isLoading } = useSWR('api/nguongoc', () => api.get('api/nguongoc'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenNG,
	};
	}),
	isLoading,
	};
	}; 
GetTrangThaiSuDung = () => {
	const { data, isLoading } = useSWR('api/trangthaisudung', () => api.get('api/trangthaisudung'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenTT,
	};
	}),
	isLoading,
	};
	}; 
GetThoiDiemCoPhanHoa = () => {
	const { data, isLoading } = useSWR('api/thoidiemcph', () => api.get('api/thoidiemcph'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenThoiDiemCPH,
	};
	}),
	isLoading,
	};
	}; 
GetPaSdDuocDuyet = () => {
	const { data, isLoading } = useSWR('api/phuongansd', () => api.get('api/phuongansd'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenPASD,
	};
	}),
	isLoading,
	};
	}; 
GetTinhTrangPasx = () => {
	const { data, isLoading } = useSWR('api/tinhtrangpasx', () => api.get('api/tinhtrangpasx'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenTT,
	};
	}),
	isLoading,
	};
	}; 
GetPasxDuocDuyet = () => {
	const { data, isLoading } = useSWR('api/phuongansx', () => api.get('api/phuongansx'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenPASX,
	};
	}),
	isLoading,
	};
	}; 
GetTtHoSoPhapLy = () => {
	const { data, isLoading } = useSWR('api/trangthaihspl', () => api.get('api/trangthaihspl'));
	return {
	data: data?.data.map((item: any) => {
	return {
	value: item.id,
	label: item.tenTT,
	};
	}),
	isLoading,
	};
	}; 
GetCapCongTrinh = () => {
	const { data, isLoading } = useSWR('api/capcongtrinh', () => api.get('api/capcongtrinh'));
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
GetLyDoBienDong = (loaiTaiSanGoc:number, loaiBienDong:number) => {
	const { data, isLoading } = useSWR('api/lydobiendong/getallbytype?loaiTaiSanGoc='+loaiTaiSanGoc+'&loaiBienDong='+loaiBienDong, () => api.get('api/lydobiendong/getallbytype?loaiTaiSanGoc='+loaiTaiSanGoc+'&loaiBienDong='+loaiBienDong));
	if(data){
		return {
			data: data.map((item: any) => {
			return {
				value: item.id,
				label: item.tenLyDoBD,
			};
			}),
			isLoading,
		};
	}else{
		return {data:[],isLoading};
	}
	}; 
}
const taiSanDatServices = new services("api/dat");
export { taiSanDatServices };
