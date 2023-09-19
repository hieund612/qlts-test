import useSWR from "swr";
import { BaseService } from "@/shared/services";
import api from "@/shared/services/axios-custom";
import { Meta } from "@/shared/model";
class services extends BaseService {
  GetList = (meta: Meta, loaiBienDong: number) => {
    meta.filter.loaiBienDong = loaiBienDong ?? null;
    const { data, error, isLoading, mutate } = useSWR([this.url, meta], () =>
      this.getMany(meta)
    );
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(
      id ? `${this.url}${id}` : null,
      () => api.get(`${this.url}/${id}`)
    );
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetTaiSanById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(
      id ? `${this.url}/asnha/${id}` : null,
      () => api.get(`${this.url}/asnha/${id}`)
    );
    if (data) {
      data.ngayBienDong = null;
    }
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetTaiSan = () => {
    const { data, isLoading } = useSWR("api/astaisan", () =>
      api.get("api/astaisan")
    );
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
    const { data, isLoading } = useSWR("api/donvinoibo", () =>
      api.get("api/donvinoibo")
    );
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
  GetPhongBanChiuPhi = () => {
    const { data, isLoading } = useSWR("api/phongban", () =>
      api.get("api/phongban")
    );
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
    const { data, isLoading } = useSWR("api/phongban", () =>
      api.get("api/phongban")
    );
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
  GetMaDiaBan = (id: any, cap: any) => {
    const { data, isLoading } = useSWR(
      "api/diadiem/optionselect/" + id + "/" + cap,
      () => api.get("api/diadiem/optionselect?parentId=" + id + "&cap=" + cap)
    );
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
  GetMaMucDich = () => {
    const { data, isLoading } = useSWR("api/mucdichsudung", () =>
      api.get("api/mucdichsudung")
    );
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
  GetMaNguonGoc = () => {
    const { data, isLoading } = useSWR("api/nguongoc", () =>
      api.get("api/nguongoc")
    );
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
    const { data, isLoading } = useSWR("api/trangthaisudung", () =>
      api.get("api/trangthaisudung")
    );
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
  GetTinhTrangPasx = () => {
    const { data, isLoading } = useSWR("api/tinhtrangpasx", () =>
      api.get("api/tinhtrangpasx")
    );
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
    const { data, isLoading } = useSWR("api/phuongansx", () =>
      api.get("api/phuongansx")
    );
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
  GetCapCongTrinh = () => {
    const { data, isLoading } = useSWR("api/capcongtrinh", () =>
      api.get("api/capcongtrinh")
    );
    return {
      data: data?.data.map((item: any) => {
        return {
          value: item.id,
          label: item.tenCap,
        };
      }),
      isLoading,
    };
  };
  GetHinhThucThanhLy = () => {
    const { data, isLoading } = useSWR("api/hinhthucthanhly", () =>
      api.get("api/hinhthucthanhly")
    );
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
  GetLyDoBienDong = (loaiTaiSanGoc: number, loaiBienDong: number) => {
    const { data, isLoading } = useSWR(
      "api/lydobiendong/getallbytype?loaiTaiSanGoc=" +
        loaiTaiSanGoc +
        "&loaiBienDong=" +
        loaiBienDong,
      () =>
        api.get(
          "api/lydobiendong/getallbytype?loaiTaiSanGoc=" +
            loaiTaiSanGoc +
            "&loaiBienDong=" +
            loaiBienDong
        )
    );
    if (data) {
      return {
        data: data.map((item: any) => {
          return {
            value: item.id,
            label: item.tenLyDoBD,
          };
        }),
        isLoading,
      };
    } else {
      return { data: [], isLoading };
    }
  };
  GetLoaiBienDong = () => {
    const { data, isLoading } = useSWR("api/loaibiendong", () =>
      api.get("api/loaibiendong")
    );
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
  GetLoaiTaiSan = () => {
    const { data, isLoading } = useSWR("api/loaitaisan", () =>
      api.get("api/loaitaisan")
    );
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
    const { data, isLoading } = useSWR("api/nhomtaisan/optionselect", () =>
      api.get("api/nhomtaisan/optionselect?loaiTaiSanGoc=2")
    );
    if (data) {
      return {
        data: data.map((item: any) => {
          return {
            value: item.id,
            label: item.tenNhomTS,
            isDisabled: item.isParents,
            maNhomTS: item.maNhomTS,
          };
        }),
        isLoading,
      };
    } else {
      return { data: [], isLoading };
    }
  };
}
const taiSanNhaServices = new services("api/nha");
export { taiSanNhaServices };
