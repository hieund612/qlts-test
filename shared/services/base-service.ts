import api from './axios-custom';
import { Meta } from '../model';
import { ApiUrl } from "@/public/app-setting";

class BaseService {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  getMany = async (meta: Meta) => {

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
  get = async (url: string) => {
    const res: any = await api.get(url);
    return res;
  };

  findById = async (id: number) => {
    const res: any = await api.get(`${this.url}/${id}`);
    return res;
  };

  create = async (data: any) => {
    const res: any = await api.post(this.url, data);
    return res;
  };

  del = async (id: number) => {
    const res: any = await api.delete(`${this.url}/${id}`);
    return res;
  };

  update = async (id: number, data: any) => {
    const res: any = await api.put(`${this.url}/${id}`, data);
    return res;
  };

  put = async (url: string, data: any = null) => {
    const res: any = await api.put(url, data);
    return res;
  };

  post = async (url: string, data: any = null) => {
    const res: any = await api.post(url, data);
    return res;
  };
  getDataSelectTree = async (url: string, textSearch: string, fieldSearch: string = '') => {
    if (url) {
      if (!fieldSearch)
        fieldSearch = "FilterText";
      let apiurl = url + '?page=1&itemsPerPage=5&sortDesc=false&' + fieldSearch + '=' + textSearch;
      const data: any = await api.get(apiurl);
      return data.data;
    }
    else {
      return [];
    }
  };
  gettime = async () => {
    const res: any = await api.get("fileupload/gettime");
    return res;
  };

  onDownloadFile = async (url: any) => {
    let res = await this.gettime();
    let a = document.createElement("a");
    a.href = ApiUrl + url + "/" + res;
    a.target = "_blank";
    a.click();
};
  /**
   * Thêm mới với data file
   * @param data dữ liêu post đi
   * @param object tên đối tượng hứng trong API
   * @param objectFile danh sách đối tượng hứng trong API: [{name:'',file:''}] name là đối tượng trong API, file là nameAttach trong UploadFile
   * @returns 
   */
  createwithfile = async (data: any, object: string, objectFile: any[], urladd: any = null) => {
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
    const res: any = await api.post(`${this.url}`, formData, {
      headers: headers
    });
    return res;
  }
  /**
   * Cập nhật với data file
   * @param data dữ liệu post đi
   * @param object tên đối tượng hứng trong API
   * @param objectFile danh sách đối tượng hứng trong API: [{name:'',file:''}] name là đối tượng trong API, file là nameAttach trong UploadFile
   * @returns 
   */
  updatewithfile = async (data: any, object: string, objectFile: any[]) => {
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

    const res: any = await api.put(`${this.url}/${data.id ? data.id : data.Id}`, formData, {
      headers: headers
    });
    return res;
  }
  /** Update field table */
  async updateField(id: string, data: any = null) {
    const res: any = await api.put(`${this.url}/updateField/${id}`, data);
    return res;
  };
}

export default BaseService;
