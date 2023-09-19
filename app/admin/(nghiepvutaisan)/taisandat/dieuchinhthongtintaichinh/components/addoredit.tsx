"use client";
import { IFormPropExtends } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { AuthService } from "@/shared/services";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import {
  TanetLabel,
  TanetInput,
  TanetDecimal,
  TanetCheckbox,
  TanetSelect,
  TanetFormDate,
} from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { number, object, string, date } from "yup";
import { taiSanDatServices } from "../../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function AddOrEdit({
  show,
  action,
  id,
  customId,
  onClose,
  onSetTab,
}: IFormPropExtends) {
  const titleTable = "Điều chỉnh thông tin tài chính";
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
    viTri: "",
    maMucDich: 0,
    thoiHanSuDung: 0,
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
    dienTichTruocDc: 0,
    dienTich: 0,
    dienTichTG: 0,
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
    htSuDungChung: false,
    dtSuDungChung: 0,
    htSuDungRieng: false,
    dtSuDungRieng: 0,
    daDauTuXd: false,
    dtDaDauTuXd: 0,
    dangDauTuXd: false,
    dtDangDauTuXd: 0,
    chuanBiDauTuXd: false,
    dtChuanBiDauTuXd: 0,
    trongChuaSuDung: false,
    dtTrongChuaSuDung: 0,
    thoiDiemCoPhanHoa: null,
    paSdDuocDuyet: null,
    tinhTrangPasx: null,
    pasxDuocDuyet: null,
    coHoSoTaiSan: false,
    ttHoSoPhapLy: null,
    donViNhanDcId: null,
    laCoGiamLienQuan: false,
    hinhThucThanhLy: null,
    thuTuGiam: 0,
    chiPhiGiam: 0,
    ngayBienDong: null,
    lyDoBienDong: null,
    laDcNguyenGia: false,
    laDcNgayDuaVaoSd: false,
    laDcKhauHao: false,
    laDcThoiGianKh: false,
    laDCNhomTaiSan: false,
    laThayDoiThongTin: false,
    trangThaiBienDong: 0,
    ghiChu: "",
    loaiDieuChinhThongTin: 1,
    loaiBienDong: 2,
    loaiTaiSanGoc: 1,
    laBienDongCuoi: true,
    thuTuBienDong: 1,
    maTinh: null,
    maHuyen: null,
    maXa: null,
  };
  const schema = object({
    donViId: number().nullable(),
    maDonVi: string().trim().nullable(),
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
    loaiTaiSanId: number().nullable(),
    nhomTaiSanId: number().nullable(),
    maNhomTaiSan: string()
      .trim()
      .nullable()
      .max(250, "Bạn nhập tối đa 250 ký tự"),
    ngayNhapThongTin: date().nullable(),
    ngaySuDung: date().nullable(),
    maDiaBan: number().nullable(),
    diaChi: string().trim().nullable().max(1000, "Bạn nhập tối đa 1000 ký tự"),
    viTri: string().trim().nullable().max(1000, "Bạn nhập tối đa 1000 ký tự"),
    maMucDich: number().nullable(),
    thoiHanSuDung: number().nullable(),
    maNguonGoc: number().nullable(),
    trangThaiSuDung: number().nullable(),
    nguyenGia: number().nullable(),
    giaTriConLai: number().nullable(),
    thoiGianKhauHao: number()
      .nullable()
      .integer("Bạn phải nhập kiểu số nguyên"),
    giaTriKhauHao: number().nullable(),
    dienTich: number().nullable(),
    dienTichSanXayDung: number().nullable(),
    htCoSoSxKd: number().nullable(),
    htLamNhaO: number().nullable(),
    htChoThue: number().nullable(),
    htBoTrong: number().nullable(),
    htBiLanChiem: number().nullable(),
    htKhac: number().nullable(),
    dtSuDungChung: number().nullable(),
    dtSuDungRieng: number().nullable(),
    dtDaDauTuXd: number().nullable(),
    dtDangDauTuXd: number().nullable(),
    dtChuanBiDauTuXd: number().nullable(),
    dtTrongChuaSuDung: number().nullable(),
    thoiDiemCoPhanHoa: number().nullable(),
    paSdDuocDuyet: number().nullable(),
    tinhTrangPasx: number().nullable(),
    pasxDuocDuyet: number().nullable(),
    ttHoSoPhapLy: number().nullable(),
    soTang: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
    matTien: number().nullable(),
    chieuSau: number().nullable(),
    capCongTrinh: number().nullable(),
    ghiChu: string().trim().nullable(),
    ngayGiam: date().nullable(),
    loaiTaiSanGoc: number().nullable().integer("Bạn phải nhập kiểu số nguyên"),
  });
  const router = useRouter();
  const [newDataDefault, setnewDataDefault] = useState(dataDefault);
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = taiSanDatServices.GetById(id!);
  const { data: dataTaiSan } = taiSanDatServices.GetTaiSanById(customId!);
  const { data: dataPhongBanChiuPhis } = taiSanDatServices.GetPhongBanChiuPhi();
  const { data: dataPhongBanQuanLys } = taiSanDatServices.GetPhongBanQuanLy();
  const { data: dataLoaiTaiSans } = taiSanDatServices.GetLoaiTaiSan();
  const { data: dataNhomTaiSans } = taiSanDatServices.GetNhomTaiSan();
  const { data: dataLyDoBienDongs } = taiSanDatServices.GetLyDoBienDong(1, 2);

  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await taiSanDatServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onSetTab(2);
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      values.loaiDieuChinhThongTin = 1;
      values.loaiBienDong = 2;
      try {
        await taiSanDatServices.create(values);
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

    dispatch({ type: action });
  }, [action, id, isLoading, customId, newDataDefault]);

  const onChangeValues = (setFieldValue: any, values: any) => {
    if (values.nguyenGiaTangGiam)
      setFieldValue(
        "nguyenGia",
        parseFloat(values.nguyenGiaTruocDc) +
          parseFloat(values.nguyenGiaTangGiam)
      );
    else setFieldValue("nguyenGia", values.nguyenGiaTruocDc);

    if (values.giaTriKhauHaoTG)
      setFieldValue(
        "giaTriKhauHao",
        parseFloat(values.giaTriKhauHaoTruocDc) +
          parseFloat(values.giaTriKhauHaoTG)
      );
    else setFieldValue("giaTriKhauHao", values.giaTriKhauHaoTruocDc);

    if (values.thoiGianKhauHaoTG)
      setFieldValue(
        "thoiGianKhauHao",
        parseFloat(values.thoiGianKhauHaoTruocDc) +
          parseFloat(values.thoiGianKhauHaoTG)
      );
    else setFieldValue("thoiGianKhauHao", values.thoiGianKhauHaoTruocDc);

    if (values.htCoSoSxKdTG)
      setFieldValue(
        "htCoSoSxKd",
        parseFloat(values.htCoSoSxKdTruocDc) + parseFloat(values.htCoSoSxKdTG)
      );
    else setFieldValue("htCoSoSxKd", values.htCoSoSxKdTruocDc);

    if (values.htLamNhaOTG)
      setFieldValue(
        "htLamNhaO",
        parseFloat(values.htLamNhaOTruocDc) + parseFloat(values.htLamNhaOTG)
      );
    else setFieldValue("htLamNhaO", values.htLamNhaOTruocDc);

    if (values.htChoThueTG)
      setFieldValue(
        "htChoThue",
        parseFloat(values.htChoThueTruocDc) + parseFloat(values.htChoThueTG)
      );
    else setFieldValue("htChoThue", values.htChoThueTruocDc);

    if (values.htBoTrongTG)
      setFieldValue(
        "htBoTrong",
        parseFloat(values.htBoTrongTruocDc) + parseFloat(values.htBoTrongTG)
      );
    else setFieldValue("htBoTrong", values.htBoTrongTruocDc);

    if (values.htBiLanChiemTG)
      setFieldValue(
        "htBiLanChiem",
        parseFloat(values.htBiLanChiemTruocDc) +
          parseFloat(values.htBiLanChiemTG)
      );
    else setFieldValue("htBiLanChiem", values.htBiLanChiemTruocDc);

    if (values.htKhacTG)
      setFieldValue(
        "htKhac",
        parseFloat(values.htKhacTruocDc) + parseFloat(values.htKhacTG)
      );
    else setFieldValue("htKhac", values.htKhacTruocDc);

    let total =
      parseFloat(values.htCoSoSxKd) +
      parseFloat(values.htLamNhaO) +
      parseFloat(values.htChoThue) +
      parseFloat(values.htBoTrong) +
      parseFloat(values.htBiLanChiem) +
      parseFloat(values.htKhac);
    setFieldValue("dienTich", total);
  };
  const onChecked = (setFieldValue: any, e: any, values: any) => {
    if (e.target.value) setFieldValue("ngaySuDung", null);
    else setFieldValue("ngaySuDung", values.ngaySuDungTruoc);
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
                    view={true}
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
                    view={true}
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
                    view={true}
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
                    view={true}
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
                    required={false}
                    view={state?.viewMode}
                    dateFormat="dd/MM/yyyy"
                    id="ngayBienDong"
                    name="ngayBienDong"
                    placeholder="dd/MM/yyyy"
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
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="lyDoBienDong"
                    name="lyDoBienDong"
                    options={dataLyDoBienDongs}
                    placeholder="Chọn lý do điều chỉnh..."
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
                    onChange={(e: any) => {
                      onChecked(setFieldValue, e, values);
                    }}
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
                        name="nguyenGiaTruocDc"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          view={true}
                          id="nguyenGiaTruocDc"
                          name="nguyenGiaTruocDc"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                          <span className="text-gray-500">VNĐ</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6"></div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Nguyên giá điều chỉnh"
                        required={true}
                        name="nguyenGiaTangGiam"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          required={true}
                          view={state?.viewMode}
                          id="nguyenGiaTangGiam"
                          name="nguyenGiaTangGiam"
                          onBlur={(e: any) => {
                            onChangeValues(setFieldValue, values);
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                          <span className="text-gray-500">VNĐ</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Nguyên giá sau điều chỉnh"
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
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
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
                        name="ngaySuDungTruoc"
                      />
                    </div>
                    <div className="col-span-4">
                      <TanetFormDate
                        label=""
                        view={true}
                        dateFormat="dd/MM/yyyy"
                        id="ngaySuDungTruoc"
                        name="ngaySuDungTruoc"
                        className=" cursor-not-allowed bg-gray-200"
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
                        placeholder="dd/MM/yyyy"
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
                        name="giaTriKhauHaoTruocDc"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          view={true}
                          id="giaTriKhauHaoTruocDc"
                          name="giaTriKhauHaoTruocDc"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                          <span className="text-gray-500">VNĐ</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6"></div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Khấu hao điều chỉnh"
                        required={true}
                        name="giaTriKhauHaoTG"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          required={true}
                          view={state?.viewMode}
                          id="giaTriKhauHaoTG"
                          name="giaTriKhauHaoTG"
                          onBlur={(e: any) => {
                            onChangeValues(setFieldValue, values);
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                          <span className="text-gray-500">VNĐ</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Khấu hao sau điều chỉnh"
                        name="giaTriKhauHao"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          view={true}
                          id="giaTriKhauHao"
                          name="giaTriKhauHao"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
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
                        name="thoiGianKhauHaoTruocDc"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetInput
                          label=""
                          view={true}
                          type="text"
                          id="thoiGianKhauHaoTruocDc"
                          name="thoiGianKhauHaoTruocDc"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                          <span className="text-gray-500">Tháng</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6"></div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Thời gian khấu hao điều chỉnh"
                        required={true}
                        name="thoiGianKhauHaoTG"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="relative">
                        <TanetDecimal
                          label=""
                          view={state?.viewMode}
                          id="thoiGianKhauHaoTG"
                          name="thoiGianKhauHaoTG"
                          onBlur={(e: any) => {
                            onChangeValues(setFieldValue, values);
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
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
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                          <span className="text-gray-500">Tháng</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <h5 className="col-span-12 font-bold">
                  Diện tích
                  <hr className="mt-1"></hr>
                </h5>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích trước điều chỉnh"
                    required={true}
                    name="dienTichTruocDc"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={true}
                      view={true}
                      id="dienTichTruocDc"
                      name="dienTichTruocDc"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Diện tích sau điều chỉnh"
                    required={true}
                    name="dienTich"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      required={true}
                      view={true}
                      id="dienTich"
                      name="dienTich"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
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
                    name="htCoSoSxKdTG"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="htCoSoSxKdTG"
                      name="htCoSoSxKdTG"
                      onBlur={(e: any) => {
                        onChangeValues(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Cơ sở sản xuất kinh doanh"
                    name="htCoSoSxKd"
                  />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="htCoSoSxKd"
                      name="htCoSoSxKd"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Làm nhà ở" name="htLamNhaOTG" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="htLamNhaOTG"
                      name="htLamNhaOTG"
                      onBlur={(e: any) => {
                        onChangeValues(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Làm nhà ở" name="htLamNhaO" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="htLamNhaO"
                      name="htLamNhaO"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Cho thuê" name="htChoThueTG" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="htChoThueTG"
                      name="htChoThueTG"
                      onBlur={(e: any) => {
                        onChangeValues(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Cho thuê" name="htChoThue" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="htChoThue"
                      name="htChoThue"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Bỏ trống" name="htBoTrongTG" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="htBoTrongTG"
                      name="htBoTrongTG"
                      onBlur={(e: any) => {
                        onChangeValues(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Bỏ trống" name="htBoTrong" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="htBoTrong"
                      name="htBoTrong"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Bị lấn chiếm" name="htBiLanChiemTG" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="htBiLanChiemTG"
                      name="htBiLanChiemTG"
                      onBlur={(e: any) => {
                        onChangeValues(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Bị lấn chiếm" name="htBiLanChiem" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="htBiLanChiem"
                      name="htBiLanChiem"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Sử dụng mục đích khác" name="htKhacTG" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="htKhacTG"
                      name="htKhacTG"
                      onBlur={(e: any) => {
                        onChangeValues(setFieldValue, values);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">m2</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Sử dụng mục đích khác" name="htKhac" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={true}
                      id="htKhac"
                      name="htKhac"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
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
