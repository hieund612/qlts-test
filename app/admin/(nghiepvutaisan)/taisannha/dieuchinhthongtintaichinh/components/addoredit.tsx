"use client";
import { IFormPropExtends } from "@/shared/model";
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
export default function AddOrEdit({
  show,
  action,
  id,
  customId,
  onClose,
  onSetTab,
}: IFormPropExtends) {
  const titleTable = "Biến động tài sản nhà";
  const dataDefault = {
    hiNhaId: "",
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
    nguyenGiaTruocDc: 0,
    nguyenGia: 0,
    nguyenGiaTangGiam: 0,
    giaTriConLai: 0,
    giaTriConLaiTG: 0,
    giaTriKhauHaoTruocDc: 0,
    giaTriKhauHao: 0,
    giaTriKhauHaoTG: 0,
    thoiGianKhauHaoTruocDc: 0,
    thoiGianKhauHao: 0,
    thoiGianKhauHaoTG: 0,
    dienTichXayDungTruocDc: 0,
    dienTichXayDung: 0,
    dienTichXayDungTG: 0,
    dienTichSanXdTruocDc: 0,
    dienTichSanXd: 0,
    dienTichSanXdTG: 0,
    soTang: 0,
    soTangTG: 0,
    htCoSoSxKdTruocDc: 0,
    htCoSoSxKd: 0,
    htCoSoSxKdTG: 0,
    htLamNhaOTruocDc: 0,
    htLamNhaO: 0,
    htLamNhaOTG: 0,
    htChoThueTruocDc: 0,
    htChoThue: 0,
    htChoThueTG: 0,
    htBoTrongTruocDc: 0,
    htBoTrong: 0,
    htBoTrongTG: 0,
    htBiLanChiemTruocDc: 0,
    htBiLanChiem: 0,
    htBiLanChiemTG: 0,
    htKhacTruocDc: 0,
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
    loaiBienDong: 2,
    loaiTaiSanGoc: 2,
    laBienDongCuoi: false,
    thuTuBienDong: 1,
    maTinh: null,
    maHuyen: null,
    maXa: null,
  };
  const schema = object({
    hiNhaId: string().trim().nullable().required("ID không được để trống"),
    taiSanId: number().nullable().required("Mã tài sản id không được để trống"),
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
  const { data: dataTaiSan } = taiSanNhaServices.GetTaiSanById(customId!);
  const { data: dataTaiSans } = taiSanNhaServices.GetTaiSan();
  const { data: dataDonVis } = taiSanNhaServices.GetDonVi();
  const { data: dataPhongBanChiuPhis } = taiSanNhaServices.GetPhongBanChiuPhi();
  const { data: dataPhongBanQuanLys } = taiSanNhaServices.GetPhongBanQuanLy();
  const { data: dataMaMucDichs } = taiSanNhaServices.GetMaMucDich();
  const { data: dataMaNguonGocs } = taiSanNhaServices.GetMaNguonGoc();
  const { data: dataTrangThaiSuDungs } = taiSanNhaServices.GetTrangThaiSuDung();
  const { data: dataTinhTrangPasxs } = taiSanNhaServices.GetTinhTrangPasx();
  const { data: dataPasxDuocDuyets } = taiSanNhaServices.GetPasxDuocDuyet();
  const { data: dataCapCongTrinhs } = taiSanNhaServices.GetCapCongTrinh();
  const { data: dataHinhThucThanhLys } = taiSanNhaServices.GetHinhThucThanhLy();
  const { data: dataLyDoBienDongs } = taiSanNhaServices.GetLyDoBienDong(2, 2);
  const { data: dataLoaiBienDongs } = taiSanNhaServices.GetLoaiBienDong();
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
        await onSetTab(2);
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await taiSanNhaServices.create(values);
        toast.success("Thêm thành công");
        await mutate();
        await onSetTab(2);
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
  }, [action, id, isLoading, customId, newDataDefault, data]);
  const onSumValue = (setFieldValue: any, values: any) => {
    let total =
      parseFloat(values.htCoSoSxKd) +
      parseFloat(values.htLamNhaO) +
      parseFloat(values.htChoThue) +
      parseFloat(values.htBoTrong) +
      parseFloat(values.htBiLanChiem) +
      parseFloat(values.htKhac);
    setFieldValue("dienTich", total);
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
          initialValues={data ? data : dataTaiSan ?? newDataDefault}
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
                  Thông tin tài sản
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
                    view={true}
                    id="nhomTaiSanId"
                    name="nhomTaiSanId"
                    options={dataNhomTaiSans}
                    placeholder="Chọn nhóm tài sản..."
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Ngày biến động"
                    required={true}
                    name="ngayBienDong"
                  />
                </div>
                <div className="col-span-4">
                  <TanetFormDate
                    label=""
                    view={state?.viewMode}
                    dateFormat="dd/MM/yyyy"
                    id="ngayBienDong"
                    name="ngayBienDong"
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Lý do điều chỉnh"
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
                <div className="col-span-3">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="laDcNguyenGia"
                    name="laDcNguyenGia"
                  >
                    Điều chỉnh nguyên giá
                  </TanetCheckbox>
                </div>
                <div className="col-span-3">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="laDcNgayDuaVaoSd"
                    name="laDcNgayDuaVaoSd"
                  >
                    Điều chỉnh ngày đưa vào sử dụng
                  </TanetCheckbox>
                </div>
                <div className="col-span-3">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="laDcKhauHao"
                    name="laDcKhauHao"
                  >
                    Điều chỉnh khấu hao
                  </TanetCheckbox>
                </div>
                <div className="col-span-3">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="laDcThoiGianKh"
                    name="laDcThoiGianKh"
                  >
                    Điều chỉnh thời gian khấu hao
                  </TanetCheckbox>
                </div>
                {values.laDcNguyenGia && (
                  <>
                    <h5 className="col-span-12 font-bold">
                      Điều chỉnh nguyên giá
                      <hr className="mt-1"></hr>
                    </h5>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Nguyên giá trước điều chỉnh"
                        name="nguyenGia"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          view={true}
                          id="nguyenGia"
                          name="nguyenGia"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">VNĐ</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6"></div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Nguyên giá điều chỉnh"
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
                        label="Nguyên giá sau điều chỉnh"
                        name="giaTriConLai"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          view={true}
                          id="giaTriConLai"
                          name="giaTriConLai"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">VNĐ</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {values.laDcNgayDuaVaoSd && (
                  <>
                    <h5 className="col-span-12 font-bold">
                      Điều chỉnh ngày đưa vào sử dụng
                      <hr className="mt-1"></hr>
                    </h5>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Ngày đưa vào sử dụng"
                        name="ngaySuDung"
                      />
                    </div>
                    <div className="col-span-4">
                      <TanetFormDate
                        label=""
                        view={true}
                        dateFormat="dd/MM/yyyy"
                        id="ngaySuDung"
                        name="ngaySuDung"
                      />
                    </div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Ngày đưa vào sử dụng điều chỉnh"
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
                      />
                    </div>
                  </>
                )}

                {values.laDcKhauHao && (
                  <>
                    <h5 className="col-span-12 font-bold">
                      Điều chỉnh khẩu hao
                      <hr className="mt-1"></hr>
                    </h5>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Khấu hao trước điều chỉnh"
                        name="giaTriConLai"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          view={true}
                          id="giaTriConLai"
                          name="giaTriConLai"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">VNĐ</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6"></div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Khấu hao điều chỉnh"
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
                        label="Khấu hao sau điều chỉnh"
                        name="giaTriConLai"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          view={true}
                          id="giaTriConLai"
                          name="giaTriConLai"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">VNĐ</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {values.laDcThoiGianKh && (
                  <>
                    <h5 className="col-span-12 font-bold">
                      Điều chỉnh thời gian khẩu hao
                      <hr className="mt-1"></hr>
                    </h5>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Thời gian khấu hao trước điều chỉnh"
                        name="thoiGianKhauHao"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetInput
                          label=""
                          view={true}
                          type="text"
                          id="thoiGianKhauHao"
                          name="thoiGianKhauHao"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">Tháng</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6"></div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Thời gian khấu hao điều chỉnh"
                        required={true}
                        name="thoiGianKhauHao"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetInput
                          label=""
                          required={true}
                          view={state?.viewMode}
                          type="text"
                          id="thoiGianKhauHao"
                          name="thoiGianKhauHao"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">Tháng</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Thời gian khấu hao sau điều chỉnh"
                        name="thoiGianKhauHao"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetInput
                          label=""
                          view={true}
                          type="text"
                          id="thoiGianKhauHao"
                          name="thoiGianKhauHao"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                          <span className="text-gray-500">Tháng</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <h5 className="col-span-12 font-bold">
                  Diện tích trước điều chỉnh
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích XD trước điều chỉnh"
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích sau điều chỉnh"
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích sàn XD trước điều chỉnh"
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-6"></div>
                <h5 className="col-span-12 font-bold">
                  Diện tích điều chỉnh
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel label="Diện tích XD điều chỉnh" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích XD sau điều chỉnh"
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Số tầng điều chỉnh" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Số tầng sau điều chỉnh" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích sàn XD điều chỉnh"
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích sàn XD sau điều chỉnh"
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <p className="text-base font-normal text-left text-blue-600">
                    Trong đó
                  </p>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Cơ sở sản xuất kinh doanh"
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Cơ sở sản xuất kinh doanh"
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Làm nhà ở" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Làm nhà ở" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Cho thuê" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Cho thuê" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Bỏ trống" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Bỏ trống" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Bị lấn chiếm" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Bị lấn chiếm" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Sử dụng mục đích khác" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Sử dụng mục đích khác" name="dienTich" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
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
