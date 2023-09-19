"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { AuthService } from "@/shared/services";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import {
  TanetLabel,
  TanetInput,
  TanetDecimal,
  TanetCheckbox,
  TanetSelect,
  TanetFormDate,
  TanetTextArea,
} from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { taiSanNhaServices } from "../../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function AddOrEdit({ show, action, id, onClose }: IFormProps) {
  const titleTable = "Biến động tài sản nhà";
  const dataDefault = {
    taiSanId: 0,
    donViId: 0,
    maDonVi: "",
    tenDonVi: "",
    phongBanChiuPhiId: null,
    phongBanQuanLyId: null,
    soTheTaiSan: "",
    tenTaiSan: "",
    loaiTaiSanId: 0,
    nhomTaiSanId: 0,
    maNhomTaiSan: "",
    ngayNhapThongTin: null,
    ngaySuDung: null,
    ngaySuDungTruoc: null,
    maDiaBan: 0,
    diaChi: "",
    maMucDich: 0,
    maNguonGoc: 0,
    trangThaiSuDung: 0,
    nguyenGia: 0,
    nguyenGiaTangGiam: 0,
    giaTriConLai: 0,
    giaTriConLaiTG: 0,
    giaTriKhauHao: 0,
    giaTriKhauHaoTG: 0,
    thoiGianKhauHao: 0,
    thoiGianKhauHaoTG: 0,
    dienTichXayDung: 0,
    dienTichXayDungTG: 0,
    dienTichSanXd: 0,
    dienTichSanXdTG: 0,
    soTang: 0,
    soTangTG: 0,
    htCoSoSxKd: 0,
    htCoSoSxKdTG: 0,
    htLamNhaO: 0,
    htLamNhaOTG: 0,
    htChoThue: 0,
    htChoThueTG: 0,
    htBoTrong: 0,
    htBoTrongTG: 0,
    htBiLanChiem: 0,
    htBiLanChiemTG: 0,
    htKhac: 0,
    htKhacTG: 0,
    tinhTrangPasx: null,
    pasxDuocDuyet: null,
    matTien: null,
    chieuSau: null,
    capCongTrinh: null,
    ghiChu: "",
    donViNhanDcId: null,
    hinhThucThanhLy: null,
    thuTuGiam: 0,
    chiPhiGiam: 0,
    ngayBienDong: null,
    lyDoBienDong: 0,
    laDcNguyenGia: false,
    laDcNgayDuaVaoSd: false,
    laDcKhauHao: false,
    laDcThoiGianKh: false,
    laDCNhomTaiSan: false,
    laThayDoiThongTin: false,
    trangThaiBienDong: 0,
    loaiDieuChinhThongTin: 1,
    loaiBienDong: 1,
    loaiTaiSanGoc: 2,
    laBienDongCuoi: false,
    thuTuBienDong: 1,
    maTinh: null,
    maHuyen: null,
    maXa: null,
  };
  const schema = object({
    donViId: number().nullable(),
    maDonVi: string().trim().nullable().max(250, "Bạn nhập tối đa 250 ký tự"),
    phongBanChiuPhiId: number().nullable(),
    phongBanQuanLyId: number().nullable(),
    soTheTaiSan: string()
      .trim()
      .nullable()
      .max(250, "Bạn nhập tối đa 250 ký tự"),
    tenTaiSan: string()
      .trim()
      .nullable()
      .max(1000, "Bạn nhập tối đa 1000 ký tự"),
    loaiTaiSanId: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
    nhomTaiSanId: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
    maNhomTaiSan: string()
      .trim()
      .nullable()
      .max(250, "Bạn nhập tối đa 250 ký tự"),
    ngayNhapThongTin: date().nullable(),
    ngaySuDung: date().nullable(),
    ngaySuDungTruoc: date().nullable(),
    maDiaBan: number().nullable(),
    diaChi: string().trim().nullable().max(1000, "Bạn nhập tối đa 1000 ký tự"),
    maMucDich: number().nullable(),
    maNguonGoc: number().nullable(),
    trangThaiSuDung: number().nullable(),
    nguyenGia: number().nullable(),
    nguyenGiaTangGiam: number().nullable(),
    giaTriConLai: number().nullable(),
    giaTriConLaiTG: number().nullable(),
    giaTriKhauHao: number().nullable(),
    giaTriKhauHaoTG: number().nullable(),
    thoiGianKhauHao: number()
      .nullable()
      .integer("Bạn phải nhập kiểu số nguyên"),
    thoiGianKhauHaoTG: number()
      .nullable()
      .integer("Bạn phải nhập kiểu số nguyên"),
    dienTichXayDung: number().nullable(),
    dienTichXayDungTG: number().nullable(),
    dienTichSanXd: number().nullable(),
    dienTichSanXdTG: number().nullable(),
    soTang: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
    soTangTG: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
    htCoSoSxKd: number().nullable(),
    htCoSoSxKdTG: number().nullable(),
    htLamNhaO: number().nullable(),
    htLamNhaOTG: number().nullable(),
    htChoThue: number().nullable(),
    htChoThueTG: number().nullable(),
    htBoTrong: number().nullable(),
    htBoTrongTG: number().nullable(),
    htBiLanChiem: number().nullable(),
    htBiLanChiemTG: number().nullable(),
    htKhac: number().nullable(),
    htKhacTG: number().nullable(),
    tinhTrangPasx: number().nullable(),
    pasxDuocDuyet: number().nullable(),
    matTien: number().nullable(),
    chieuSau: number().nullable(),
    capCongTrinh: number().nullable(),
    ghiChu: string().trim().nullable(),
    donViNhanDcId: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
    hinhThucThanhLy: number().nullable(),
    thuTuGiam: number().nullable(),
    chiPhiGiam: number().nullable(),
    ngayBienDong: date().nullable(),
    lyDoBienDong: number().nullable(),
    trangThaiBienDong: number()
      .nullable()
      .integer("Bạn phải nhập kiểu số nguyên"),
    loaiDieuChinhThongTin: number()
      .nullable()
      .integer("Bạn phải nhập kiểu số nguyên"),
    loaiBienDong: number().nullable(),
    loaiTaiSanGoc: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
    thuTuBienDong: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
  });
  const [idTinh, setIdTinh] = useState(null);
  const [idHuyen, setIdHuyen] = useState(null);
  const [newDataDefault, setnewDataDefault] = useState(dataDefault);
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = taiSanNhaServices.GetById(id!);
  const { data: dataPhongBanChiuPhis } = taiSanNhaServices.GetPhongBanChiuPhi();
  const { data: dataPhongBanQuanLys } = taiSanNhaServices.GetPhongBanQuanLy();
  const { data: dataMaMucDichs } = taiSanNhaServices.GetMaMucDich();
  const { data: dataTrangThaiSuDungs } = taiSanNhaServices.GetTrangThaiSuDung();
  const { data: dataTinhTrangPasxs } = taiSanNhaServices.GetTinhTrangPasx();
  const { data: dataPasxDuocDuyets } = taiSanNhaServices.GetPasxDuocDuyet();
  const { data: dataCapCongTrinhs } = taiSanNhaServices.GetCapCongTrinh();
  const { data: dataLyDoBienDongs } = taiSanNhaServices.GetLyDoBienDong(2, 1);
  const { data: dataLoaiTaiSans } = taiSanNhaServices.GetLoaiTaiSan();
  const { data: dataNhomTaiSans } = taiSanNhaServices.GetNhomTaiSan();
  const { data: dataTinhs } = taiSanNhaServices.GetMaDiaBan("", 1);
  const { data: dataHuyens } = taiSanNhaServices.GetMaDiaBan(idTinh!, 2);
  const { data: dataXas } = taiSanNhaServices.GetMaDiaBan(idHuyen!, 3);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await taiSanNhaServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await taiSanNhaServices.create(values);
        toast.success("Thêm thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Thêm mới không thành công");
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    const { getOauth } = AuthService();
    var auth = getOauth();
    if (auth) {
      newDataDefault.maDonVi = auth.unitCode;
      newDataDefault.donViId = auth.unitId;
      newDataDefault.tenDonVi = auth.unitName;
    }
    if (data) {
      setIdTinh(data?.maTinh);
      setIdHuyen(data?.maHuyen);
    }
    dispatch({ type: action });
  }, [action, id, isLoading]);
  const onSumValue = (setFieldValue: any, values: any) => {
    let total =
      parseFloat(values.htCoSoSxKd) +
      parseFloat(values.htLamNhaO) +
      parseFloat(values.htChoThue) +
      parseFloat(values.htBoTrong) +
      parseFloat(values.htBiLanChiem) +
      parseFloat(values.htKhac);
    setFieldValue("dienTichSanXd", total);
  };
  const onChangeNhomTaiSan = (setFieldValue: any, e: any) => {
    if (e.target.value)
      setFieldValue(
        "maNhomTaiSan",
        dataNhomTaiSans.find((c: any) => c.value == e.target.value).maNhomTS
      );
    else setFieldValue("maNhomTaiSan", "");
  };
  const onChangeTinh = (setFieldValue: any, e: any) => {
    // setFieldValue("maTinh", null);
    setFieldValue("maHuyen", null);
    setFieldValue("maXa", null);
    setIdTinh(e.target.value);
    setIdHuyen(null);
  };
  const onChangeHuyen = (setFieldValue: any, e: any) => {
    setFieldValue("maXa", null);
    setIdHuyen(e.target.value);
  };
  return (
    <>
      <Modal show={show} size="xxl" loading={loading}>
        <Formik
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={schema}
          initialValues={data ? data : newDataDefault}
          enableReinitialize={true}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form
              noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}
            >
              <Modal.Header onClose={onClose}>
                {computedTitle(id, state?.editMode, titleTable)}
              </Modal.Header>
              <Modal.Body nameClass="grid-cols-12 items-center">
                <h5 className="col-span-12 font-bold">
                  Thông tin quản lý
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel
                    label="Mã/Tên chi nhánh quản lý"
                    required={true}
                    name="maDonVi"
                  />
                </div>
                <div className="col-span-3">
                  <TanetInput
                    required={true}
                    view={true}
                    id="maDonVi"
                    name="maDonVi"
                  />
                </div>
                <div className="col-span-7">
                  <TanetInput
                    required={true}
                    view={true}
                    id="tenDonVi"
                    name="tenDonVi"
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Phòng ban chịu phí"
                    required={false}
                    name="phongBanChiuPhiId"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="phongBanChiuPhiId"
                    name="phongBanChiuPhiId"
                    options={dataPhongBanChiuPhis}
                    placeholder="Chọn phòng ban chịu phí..."
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Phòng ban quản lý tài sản"
                    required={false}
                    name="phongBanQuanLyId"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="phongBanQuanLyId"
                    name="phongBanQuanLyId"
                    options={dataPhongBanQuanLys}
                    placeholder="Chọn phòng ban quản lý..."
                  />
                </div>
                <h5 className="col-span-12 font-bold">
                  Thông tin tài sản
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel
                    label="Số thẻ/Tên tài sản"
                    required={true}
                    name="soTheTaiSan"
                  />
                </div>
                <div className="col-span-3">
                  <TanetInput
                    label=""
                    required={false}
                    view={true}
                    id="soTheTaiSan"
                    name="soTheTaiSan"
                  />
                </div>
                <div className="col-span-7">
                  <TanetInput
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="tenTaiSan"
                    name="tenTaiSan"
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Loại tài sản"
                    required={true}
                    name="loaiTaiSanId"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="loaiTaiSanId"
                    name="loaiTaiSanId"
                    options={dataLoaiTaiSans}
                    placeholder="Chọn loại tài sản..."
                  />
                </div>
                <div className="col-span-6"></div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Mã/Tên nhóm tài sản"
                    required={true}
                    name="maNhomTaiSan"
                  />
                </div>
                <div className="col-span-3">
                  <TanetInput
                    label=""
                    required={false}
                    view={true}
                    id="maNhomTaiSan"
                    name="maNhomTaiSan"
                  />
                </div>
                <div className="col-span-7">
                  <TanetSelect
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="nhomTaiSanId"
                    name="nhomTaiSanId"
                    options={dataNhomTaiSans}
                    placeholder="Chọn nhóm tài sản..."
                    onChange={(e: any) => {
                      onChangeNhomTaiSan(setFieldValue, e);
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Ngày nhập tài sản"
                    required={true}
                    name="ngayNhapThongTin"
                  />
                </div>
                <div className="col-span-4">
                  <TanetFormDate
                    label=""
                    required={false}
                    view={state?.viewMode}
                    dateFormat="dd/MM/yyyy"
                    id="ngayNhapThongTin"
                    name="ngayNhapThongTin"
                    placeholder="dd/MM/yyyy"
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Ngày đưa vào sử dụng"
                    required={true}
                    name="ngaySuDung"
                  />
                </div>
                <div className="col-span-4">
                  <TanetFormDate
                    label=""
                    required={false}
                    view={state?.viewMode}
                    dateFormat="dd/MM/yyyy"
                    id="ngaySuDung"
                    name="ngaySuDung"
                    placeholder="dd/MM/yyyy"
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Lý do tăng"
                    required={true}
                    name="lyDoBienDong"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    required={false}
                    view={state?.viewMode}
                    id="lyDoBienDong"
                    name="lyDoBienDong"
                    options={dataLyDoBienDongs}
                  />
                </div>
                <div className="col-span-6"></div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Thuộc đất của đơn vị/CN"
                    name="maNguonGoc"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    required={false}
                    view={state?.viewMode}
                    id="maNguonGoc"
                    name="maNguonGoc"
                    //options={dataMaNguonGocs}
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Chọn đất
                  </button>
                </div>
                <div className="col-span-4"></div>
                <div className="col-span-2">
                  <TanetLabel label="Tên tài sản đất" name="maNguonGoc" />
                </div>
                <div className="col-span-10">
                  <div className="flex w-full items-center gap-4 mb-4">
                    <div className="w-2/3">
                      <TanetInput
                        label=""
                        view={state?.viewMode}
                        id="maNhomTaiSan"
                        name="maNhomTaiSan"
                      />
                    </div>
                    <div className="w-1/3">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          required={false}
                          view={state?.viewMode}
                          id="maNhomTaiSan"
                          name="maNhomTaiSan"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">m2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center gap-4">
                    <div className="w-2/3">
                      <TanetInput
                        label=""
                        view={state?.viewMode}
                        id="maNhomTaiSan"
                        name="maNhomTaiSan"
                      />
                    </div>
                    <div className="w-1/3">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          required={false}
                          view={state?.viewMode}
                          id="maNhomTaiSan"
                          name="maNhomTaiSan"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">m2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Địa chỉ" required={true} name="maDiaBan" />
                </div>
                <div className="col-span-10">
                  <div className="flex w-full items-center gap-4">
                    <div className="w-1/3">
                      <TanetSelect
                        label=""
                        required={false}
                        view={state?.viewMode}
                        id="maTinh"
                        name="maTinh"
                        options={dataTinhs}
                        placeholder="Chọn tỉnh/thành..."
                        onChange={(e: any) => {
                          onChangeTinh(setFieldValue, e);
                        }}
                      />
                    </div>
                    <div className="w-1/3">
                      <TanetSelect
                        label=""
                        required={false}
                        view={state?.viewMode}
                        id="maHuyen"
                        name="maHuyen"
                        options={dataHuyens}
                        placeholder="Chọn quận/huyện..."
                        onChange={(e: any) => {
                          onChangeHuyen(setFieldValue, e);
                        }}
                      />
                    </div>
                    <div className="w-1/3">
                      <TanetSelect
                        label=""
                        required={false}
                        view={state?.viewMode}
                        id="maXa"
                        name="maXa"
                        options={dataXas}
                        placeholder="Chọn xã/phường..."
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Số nhà/ngõ xóm"
                    required={false}
                    name="diaChi"
                  />
                </div>
                <div className="col-span-10">
                  <TanetInput
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="diaChi"
                    name="diaChi"
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Mục đích sử dụng"
                    required={true}
                    name="maMucDich"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    label=""
                    required={true}
                    view={state?.viewMode}
                    id="maMucDich"
                    name="maMucDich"
                    options={dataMaMucDichs}
                    placeholder="Chọn mục đích sử dụng..."
                  />
                </div>
                <div className="col-span-6"></div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Trạng thái sử dụng"
                    name="trangThaiSuDung"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    label=""
                    view={state?.viewMode}
                    id="trangThaiSuDung"
                    name="trangThaiSuDung"
                    options={dataTrangThaiSuDungs}
                    placeholder="Chọn trạng thái sử dụng..."
                  />
                </div>
                <div className="col-span-6"></div>
                <h5 className="col-span-12 font-bold">
                  Giá trị tài sản
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel
                    label="Nguyên giá tài sản"
                    required={true}
                    name="nguyenGia"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={true}
                      view={state?.viewMode}
                      id="nguyenGia"
                      name="nguyenGia"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">VNĐ</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Giá trị còn lại"
                    required={true}
                    name="giaTriConLai"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={true}
                      view={state?.viewMode}
                      id="giaTriConLai"
                      name="giaTriConLai"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">VNĐ</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Thời gian khấu hao"
                    required={false}
                    name="thoiGianKhauHao"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={true}
                      view={state?.viewMode}
                      id="thoiGianKhauHao"
                      name="thoiGianKhauHao"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">Tháng</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-6"></div>
                <h5 className="col-span-12 font-bold">
                  Diện tích
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích"
                    required={true}
                    name="dienTichXayDung"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={true}
                      view={state?.viewMode}
                      id="dienTichXayDung"
                      name="dienTichXayDung"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Số tầng" required={true} name="soTang" />
                </div>
                <div className="col-span-4">
                  <TanetDecimal
                    label=""
                    required={true}
                    view={state?.viewMode}
                    id="soTang"
                    name="soTang"
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích sàn xây dựng"
                    required={true}
                    name="dienTichSanXd"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={true}
                      view={true}
                      id="dienTichSanXd"
                      name="dienTichSanXd"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-6"></div>
                <div className="col-span-12">
                  <p className="text-base font-normal text-left text-blue-600">
                    Hiện trạng sử dụng
                  </p>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Cơ sở sản xuất kinh doanh"
                    required={false}
                    name="htCoSoSxKd"
                    className="mb-2"
                  />
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={false}
                      view={state?.viewMode}
                      id="htCoSoSxKd"
                      name="htCoSoSxKd"
                      onBlur={() => {
                        onSumValue(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Làm nhà ở"
                    required={false}
                    name="htLamNhaO"
                    className="mb-2"
                  />
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={false}
                      view={state?.viewMode}
                      id="htLamNhaO"
                      name="htLamNhaO"
                      onBlur={() => {
                        onSumValue(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Cho thuê"
                    required={false}
                    name="htChoThue"
                    className="mb-2"
                  />
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={false}
                      view={state?.viewMode}
                      id="htChoThue"
                      name="htChoThue"
                      onBlur={() => {
                        onSumValue(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Bỏ trống"
                    required={false}
                    name="htBoTrong"
                    className="mb-2"
                  />
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={false}
                      view={state?.viewMode}
                      type="text"
                      id="htBoTrong"
                      name="htBoTrong"
                      onBlur={() => {
                        onSumValue(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Bị lấn chiếm"
                    required={false}
                    name="htBiLanChiem"
                    className="mb-2"
                  />
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={false}
                      view={state?.viewMode}
                      type="text"
                      id="htBiLanChiem"
                      name="htBiLanChiem"
                      onBlur={() => {
                        onSumValue(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Sử dụng mục đích khác"
                    required={false}
                    name="htKhac"
                    className="mb-2"
                  />
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={false}
                      view={state?.viewMode}
                      type="text"
                      id="htKhac"
                      name="htKhac"
                      onBlur={() => {
                        onSumValue(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <h5 className="col-span-12 font-bold">
                  Phương án sắp xếp nhà đất
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel
                    label="Tình trạng phê duyệt PASX"
                    required={false}
                    name="paSdDuocDuyet"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="tinhTrangPasx"
                    name="tinhTrangPasx"
                    options={dataTinhTrangPasxs}
                    placeholder="Chọn tình trạng phê duyệt PASX..."
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="PASX được phê duyệt"
                    required={false}
                    name="paSdDuocDuyet"
                  />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="pasxDuocDuyet"
                    name="pasxDuocDuyet"
                    options={dataPasxDuocDuyets}
                    placeholder="Chọn PASX được phê duyệt..."
                  />
                </div>
                <h5 className="col-span-12 font-bold">
                  Thông tin bổ sung
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel label="Mặt tiền" name="matTien" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="matTien"
                      name="matTien"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Chiều sâu" name="chieuSau" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="chieuSau"
                      name="chieuSau"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Cấp công trình" name="capCongTrinh" />
                </div>
                <div className="col-span-4">
                  <TanetSelect
                    label=""
                    view={state?.viewMode}
                    id="capCongTrinh"
                    name="capCongTrinh"
                    options={dataCapCongTrinhs}
                    placeholder="Chọn cấp công trình..."
                  />
                </div>
                <div className="col-span-6"></div>
                <div className="col-span-2">
                  <TanetLabel label="Ghi chú" required={false} name="ghiChu" />
                </div>
                <div className="col-span-10">
                  <TanetTextArea
                    label=""
                    required={false}
                    view={state?.viewMode}
                    rows={3}
                    id="ghiChu"
                    name="ghiChu"
                  />
                </div>
                <h5 className="col-span-12 font-bold">
                  Thông tin hồ sơ tài sản
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel
                    label="Thêm hồ sơ"
                    required={false}
                    name="ttHoSoPhapLy"
                  />
                </div>
                <div className="col-span-4">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Thêm hồ sơ
                  </button>
                </div>
              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                {!state?.viewMode ? (
                  <>
                    <button
                      data-modal-hide="large-modal"
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Lưu
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
