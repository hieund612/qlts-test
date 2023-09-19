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
  const titleTable = "Giảm TSCĐ là đất";
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
    nguyenGia: 0,
    nguyenGiaTangGiam: 0,
    giaTriConLai: 0,
    giaTriConLaiTG: 0,
    giaTriKhauHao: 0,
    giaTriKhauHaoTG: 0,
    thoiGianKhauHao: 0,
    thoiGianKhauHaoTG: 0,
    dienTich: 0,
    dienTichTG: 0,
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
    lyDoBienDong: 3,
    laDcNguyenGia: false,
    laDcNgayDuaVaoSd: false,
    laDcKhauHao: false,
    laDcThoiGianKh: false,
    laDCNhomTaiSan: false,
    laThayDoiThongTin: false,
    trangThaiBienDong: 0,
    ghiChu: "",
    loaiDieuChinhThongTin: 1,
    loaiBienDong: 1,
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
  const [newDataDefault, setnewDataDefault] = useState(dataDefault);
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = taiSanDatServices.GetById(id!);
  const { data: dataTaiSan } = taiSanDatServices.GetTaiSanById(customId!);
  const { data: dataDonVis } = taiSanDatServices.GetDonVi();
  const { data: dataLyDoBienDongs } = taiSanDatServices.GetLyDoBienDong(1, 4);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    values.ngayBienDong = values.ngayNhapThongTin;
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
                    label="Lý do giảm"
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
                    placeholder="Chọn lý do giảm..."
                  />
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Đơn vị nhận điều chuyển"
                    required={true}
                    name="donViNhanDcId"
                  />
                </div>
                <div className="col-span-6">
                  <TanetSelect
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="donViNhanDcId"
                    name="donViNhanDcId"
                    options={dataDonVis}
                    placeholder="Chọn đơn vị..."
                  />
                </div>
                <div className="col-span-4">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="laCoGiamLienQuan"
                    name="laCoGiamLienQuan"
                  >
                    Giảm nhà, tài sản khác gắn liền với đất
                  </TanetCheckbox>
                </div>
                <div className="col-span-2">
                  <TanetLabel
                    label="Hình thức thanh lý"
                    required={true}
                    name="hinhThucThanhLy"
                  />
                </div>
                <div className="col-span-6">
                  <TanetSelect
                    label=""
                    required={false}
                    view={state?.viewMode}
                    id="hinhThucThanhLy"
                    name="hinhThucThanhLy"
                    options={dataDonVis}
                    placeholder="Chọn hình thức..."
                  />
                </div>
                <div className="col-span-4"></div>
                <div className="col-span-2">
                  <TanetLabel label="Thu trừ giảm" name="thuTuGiam" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="thuTuGiam"
                      name="thuTuGiam"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">VNĐ</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <TanetLabel label="Chi phí giảm" name="chiPhiGiam" />
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <TanetDecimal
                      label=""
                      view={state?.viewMode}
                      id="chiPhiGiam"
                      name="chiPhiGiam"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-2 pr-4">
                      <span className="text-gray-500">VNĐ</span>
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
