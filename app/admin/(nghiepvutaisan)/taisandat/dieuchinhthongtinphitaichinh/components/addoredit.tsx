"use client";
import { IFormPropExtends } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { AuthService } from "@/shared/services";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import {
  TanetLabel,
  TanetInput,
  TanetTextArea,
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
    lyDoBienDong: 23,
    laDcNguyenGia: false,
    laDcNgayDuaVaoSd: false,
    laDcKhauHao: false,
    laDcThoiGianKh: false,
    laDCNhomTaiSan: false,
    laThayDoiThongTin: false,
    trangThaiBienDong: 0,
    ghiChu: "",
    loaiDieuChinhThongTin: 2,
    loaiBienDong: 3,
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
    loaiTaiSanId: number(),
    // .when("laDCNhomTaiSan", {
    //   is: true, // alternatively: (val) => val == true
    //   then: number().nullable().required("dsadsadsad"),
    //   otherwise: number().nullable(),
    // }),
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

  const [idTinh, setIdTinh] = useState(null);
  const [idHuyen, setIdHuyen] = useState(null);
  const [newDataDefault, setnewDataDefault] = useState(dataDefault);
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = taiSanDatServices.GetById(id!);
  const { data: dataTaiSan } = taiSanDatServices.GetTaiSanById(customId!);
  const { data: dataPhongBanChiuPhis } = taiSanDatServices.GetPhongBanChiuPhi();
  const { data: dataPhongBanQuanLys } = taiSanDatServices.GetPhongBanQuanLy();
  const { data: dataLoaiTaiSans } = taiSanDatServices.GetLoaiTaiSan();
  const { data: dataNhomTaiSans } = taiSanDatServices.GetNhomTaiSan();
  const { data: dataTinhs } = taiSanDatServices.GetMaDiaBan("", 1);
  const { data: dataHuyens } = taiSanDatServices.GetMaDiaBan(idTinh!, 2);
  const { data: dataXas } = taiSanDatServices.GetMaDiaBan(idHuyen!, 3);
  const { data: dataMaMucDichs } = taiSanDatServices.GetMaMucDich();
  const { data: dataThoiHanSuDungs } = taiSanDatServices.GetThoiHanSuDung();
  const { data: dataMaNguonGocs } = taiSanDatServices.GetMaNguonGoc();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    values.ngayBienDong = values.ngayNhapThongTin;
    if (id) {
      try {
        await taiSanDatServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
        await onSetTab(2);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      values.loaiDieuChinhThongTin = 2;
      values.loaiBienDong = 3;
      try {
        await taiSanDatServices.create(values);
        toast.success("Thêm thành công");
        await mutate();
        await onClose(true);
        await onSetTab(2);
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
  }, [action, id, isLoading, customId, data, newDataDefault]);
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

  const addValueToTree = (tree: any, value: any) => {
    for (const node of tree) {
      if (value == node.id) return node.maDV;
      if (node.children.length > 0) {
        addValueToTree(node.children, value); // Đệ quy cho các node con
      }
    }
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
                <div className="col-span-6"></div>
                <div className="col-span-2"></div>
                <div className="col-span-3">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="laDCNhomTaiSan"
                    name="laDCNhomTaiSan"
                  >
                    Điều chỉnh nhóm tài sản
                  </TanetCheckbox>
                </div>
                <div className="col-span-3">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="laThayDoiThongTin"
                    name="laThayDoiThongTin"
                  >
                    Thay đổi thông tin
                  </TanetCheckbox>
                </div>
                <div className="col-span-4"></div>
                {values.laDCNhomTaiSan && (
                  <>
                    <h5 className="col-span-12 font-bold">
                      Điều chỉnh nhóm tài sản
                      <hr className="mt-1"></hr>
                    </h5>
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
                  </>
                )}
                {values.laThayDoiThongTin && (
                  <>
                    <h5 className="col-span-12 font-bold">
                      Thay đổi thông tin
                      <hr className="mt-1"></hr>
                    </h5>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Địa chỉ"
                        required={true}
                        name="maDiaBan"
                      />
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
                        label="Vị trí"
                        required={false}
                        name="viTri"
                      />
                    </div>
                    <div className="col-span-4">
                      <TanetInput
                        label=""
                        required={false}
                        view={state?.viewMode}
                        id="viTri"
                        name="viTri"
                      />
                    </div>
                    <div className="col-span-6"></div>
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
                    <div className="col-span-2">
                      <TanetLabel
                        label="Thời hạn sử dụng"
                        required={true}
                        name="thoiHanSuDung"
                      />
                    </div>
                    <div className="col-span-4">
                      <TanetSelect
                        label=""
                        required={true}
                        view={state?.viewMode}
                        id="thoiHanSuDung"
                        name="thoiHanSuDung"
                        options={dataThoiHanSuDungs}
                        placeholder="Chọn thời hạn sử dụng..."
                      />
                    </div>
                    <div className="col-span-2">
                      <TanetLabel
                        label="Nguồn gốc sử dụng đất"
                        required={true}
                        name="maNguonGoc"
                      />
                    </div>
                    <div className="col-span-4">
                      <TanetSelect
                        label=""
                        required={true}
                        view={state?.viewMode}
                        id="maNguonGoc"
                        name="maNguonGoc"
                        options={dataMaNguonGocs}
                        placeholder="Chọn nguồn gốc sử dụng..."
                      />
                    </div>
                    <div className="col-span-6"></div>
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
                        label="Diện tích"
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
                  </>
                )}

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
