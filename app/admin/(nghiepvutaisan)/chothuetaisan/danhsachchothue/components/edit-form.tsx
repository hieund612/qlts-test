"use client";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import {
    TanetDecimal,
    TanetInput,
    TanetLabel,
    TanetSelect,
    TanetFormDate,
    UploadFile,
    TanetTextArea,
} from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { asChoThueTaiSanServices } from "../../services";
import {
    AiTwotoneEye,
    AiFillDollarCircle,
    AiFillPlusCircle,
} from "react-icons/ai";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { number, object, string } from "yup";
import { toast } from "react-toastify";
import ThemDonViChothue from "../../danhsachtaisan/components/themdonvichothue";

export default function Thongtindenghichothue({
    show,
    action,
    id,
    onClose,
  }: IFormProps) {
    const [meta, setMeta] = useState<any>({
        ...DefaultMeta,
    });
    const [permisson, setPermisson] = useState<any>({
        ...DefaulPer,
    });
    const dataDefault = {
        ngayLapDeNghi: "",
        mucDichChoThue: "",
        khachHangThueId: 0,
        dienTichChoThue: "",
        thoigianTu: "",
        thoigianDen: "",
        soThangChoThue: 0,
        donGiaThueTheoThang: 0,
        tongTienThue: 0,
        thoiHanThanhToanTienThue: 0,
        tienDatCoc: 0,
        ghiChu: "",
        fileDinhKem: [],
        ngayTao: "",
        ngayCapNhat: "",
        trangThaiDuyet: 0,
        lyDoTuChoi: "",
    };
    const actions = {
        meta,
    };
    const schema = object({
        ngayLapDeNghi: string().trim().nullable().required('Ngày lập đề nghị'),
        khachHangThueId: string().nullable().required('Chọn'),
        dienTichChoThue: string().trim().nullable().required('Diện tích'),
        thoigianTu: string().trim().nullable().required('Thời gian dự kiến cho thuê từ'),
        thoigianDen: string().trim().nullable().required('Thời gian dự kiến cho thuê đến'),
        soThangChoThue: number().integer("Bạn phải nhập kiểu số nguyên"),
        donGiaThueTheoThang: string().trim().nullable().required('Đơn giá thuê theo tháng'),
        thoiHanThanhToanTienThue: string().trim().nullable().required('Thời hạn thanh toán tiền'),
        tongTienThue: string().trim().nullable().required('Tổng tiền thuê'),
    });
    const [loading, setLoading] = useState(false);
    const [isLoadDataKH, setIsLoadDataKH] = useState(new Date());
    const [newDataDefault, setnewDataDefault] = useState(dataDefault);
    const { data, error, isLoading, mutate } = asChoThueTaiSanServices.GetById(id!);
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const [idTinh, setIdTinh] = useState(null);
    const [idHuyen, setIdHuyen] = useState(null);
    const { data: dataTinhs } = asChoThueTaiSanServices.GetMaDiaBan("", 1);
    const { data: dataHuyens } = asChoThueTaiSanServices.GetMaDiaBan(idTinh!, 2);
    const { data: dataXas } = asChoThueTaiSanServices.GetMaDiaBan(idHuyen!, 3);
    const { data: KhachHangThueData } = asChoThueTaiSanServices.GetDataDonViThue(isLoadDataKH);

    const ThoiHanChoThue = [
        { value: 1, label: "Theo tháng" },
        { value: 2, label: "Theo quý" },
        { value: 3, label: "Theo năm" },
    ];
    const [showThemDonViChoThue, setShowThemDonViChoThue] = useState(false);
    const [showThongTinDeNghi, setThongTinDeNghi] = useState(true);
    useEffect(() => {

    }, [id, action]);
    
    const onTotalValue = (setFieldValue: any, values: any) => {
        let total = parseFloat(values.SoThangChoThue) * parseFloat(values.DonGiaThueTheoThang);
        if (total) {
            setFieldValue("TongTienThue", total);
        }
    };
    const actThemMoiDonViThue = () => {
        setShowThemDonViChoThue(true);
        setThongTinDeNghi(false);
    };

    const onCloseThemMoiDonViThue = (isRefresh: boolean) => {
        setShowThemDonViChoThue(false);
        setThongTinDeNghi(true);
        if (isRefresh) {
            setIsLoadDataKH(new Date());
        }
    };

    console.log('data', data)
    const onSubmit = async (values: any) => {
        try {
            console.log('values', values)
            await asChoThueTaiSanServices.updatewithfile(values, 'DeNghiChoThueUpdateDto', [{ name: 'FileDinhKem', file: 'fileDinhKemAttachs' }]);
            toast.success("Thêm thành công");
            await mutate();
            await onClose(true);
        } catch (err: any) {
            toast.error("Thêm mới không thành công");
        }
    };

    return (
        <>
            {showThongTinDeNghi &&
                <Modal show={show} size="xl" loading={loading}>
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
                                    Thông tin đề nghị cho thuê
                                </Modal.Header>
                                <Modal.Body nameClass="grid-cols-12 items-center">
                                    <h5 className="col-span-12 font-bold">
                                        Thông tin tài sản
                                        <hr className="mt-1"></hr>
                                    </h5>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Đơn vị, chi nhánh"
                                            required={true}
                                        />
                                    </div>
                                    <div className="col-span-9">
                                        <TanetInput
                                            label=""
                                            required={false}
                                            view={true}
                                            id="tenDVThue"
                                            name="tenDVThue"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Số thẻ/Tên tài sản "
                                            required={true}
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
                                    <div className="col-span-6">
                                        <TanetInput
                                            label=""
                                            required={false}
                                            view={true}
                                            id="tenTaiSan"
                                            name="tenTaiSan"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Địa chỉ "
                                            required={true}
                                            name="maDiaBan"
                                        />
                                    </div>
                                    <div className="col-span-9">
                                        <div className="flex w-full items-center gap-4">
                                            <div className="w-1/3">
                                                <TanetSelect
                                                    label=""
                                                    required={false}
                                                    // view={state?.viewMode}
                                                    view={true}
                                                    id="maTinh"
                                                    name="maTinh"
                                                    options={dataTinhs}
                                                    placeholder="Chọn tỉnh/thành..."

                                                />
                                            </div>
                                            <div className="w-1/3">
                                                <TanetSelect
                                                    label=""
                                                    required={false}
                                                    view={true}
                                                    id="maHuyen"
                                                    name="maHuyen"
                                                    options={dataHuyens}
                                                    placeholder="Chọn quận/huyện..."
                                                />
                                            </div>
                                            <div className="w-1/3">
                                                <TanetSelect
                                                    label=""
                                                    required={false}
                                                    view={true}
                                                    id="maXa"
                                                    name="maXa"
                                                    options={dataXas}
                                                    placeholder="Chọn xã/phường..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Ngày lập đề nghị"
                                            required={true}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TanetFormDate
                                            label=""
                                            required={false}
                                            view={state?.viewMode}
                                            dateFormat="dd/MM/yyyy"
                                            id="ngayLapDeNghi"
                                            name="ngayLapDeNghi"
                                        />
                                    </div>
                                    <div className="col-span-5"> </div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Cho thuê BĐS cho mục đích"
                                            required={false}
                                        />
                                    </div>
                                    <div className="col-span-9">
                                        <TanetInput
                                            label=""
                                            required={false}
                                            view={false}
                                            id="mucDichChoThue"
                                            name="mucDichChoThue"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Khách hàng thuê"
                                            required={true}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <TanetSelect
                                            label=""
                                            required={false}
                                            view={false}
                                            id="khachHangThueId"
                                            name="khachHangThueId"
                                            options={KhachHangThueData}
                                            placeholder="Chọn "
                                        />
                                    </div>
                                    <div className="col-span-1"><AiFillPlusCircle onClick={() => actThemMoiDonViThue()}
                                        className="text-sky-500" style={{ cursor: 'pointer' }} /></div>
                                    <div className="col-span-2">
                                        <TanetLabel
                                            label="Diện tích"
                                            required={true}
                                        />
                                    </div>
                                    <div className="relative col-span-3">
                                        <TanetDecimal
                                            label=""
                                            required={false}
                                            view={state?.viewMode}
                                            id="dienTichChoThue"
                                            name="dienTichChoThue"
                                            onBlur={onblur}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                                            <span className="text-gray-500">m2</span>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Thời gian dự kiến cho thuê"
                                            required={true}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <TanetFormDate
                                            label=""
                                            required={false}
                                            view={state?.viewMode}
                                            dateFormat="dd/MM/yyyy"
                                            id="thoigianTu"
                                            name="thoigianTu"
                                            placeholder="Thời gian từ"
                                        />
                                    </div>
                                    <div className="col-span-1" style={{ display: 'flex', justifyContent: 'center' }}>-</div>
                                    <div className="col-span-3">
                                        <TanetFormDate
                                            label=""
                                            required={false}
                                            view={state?.viewMode}
                                            dateFormat="dd/MM/yyyy"
                                            id="thoigianDen"
                                            name="thoigianDen"
                                            placeholder="Thời gian đến"
                                        />
                                    </div>
                                    <div className="col-span-2"></div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Số tháng cho thuê dự kiến"
                                            required={true}
                                            name="soThangChoThue"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <div className="relative">
                                            <TanetDecimal
                                                label=""
                                                required={false}
                                                view={state?.viewMode}
                                                type="text"
                                                id="soThangChoThue"
                                                name="soThangChoThue"
                                                onBlur={() => {
                                                    onTotalValue(setFieldValue, values);
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                                                <span className="text-gray-500">Tháng</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-6"></div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Đơn giá thuê theo tháng"
                                            required={true}
                                            name="donGiaThueTheoThang"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <div className="relative">
                                            <TanetDecimal
                                                label=""
                                                required={false}
                                                view={state?.viewMode}
                                                type="text"
                                                id="donGiaThueTheoThang"
                                                name="donGiaThueTheoThang"
                                                onBlur={() => {
                                                    onTotalValue(setFieldValue, values);
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                                                <span className="text-gray-500">VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <TanetLabel
                                            label="Tổng tiền thuê"
                                            required={true}
                                            name="tongTienThue"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <div className="relative">
                                            <TanetDecimal
                                                label=""
                                                required={false}
                                                view={state?.viewMode}
                                                type="text"
                                                id="tongTienThue"
                                                name="tongTienThue"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                                                <span className="text-gray-500">VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Thời hạn thanh toán tiền"
                                            required={true}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <TanetSelect
                                            label=""
                                            required={false}
                                            view={false}
                                            id="thoiHanThanhToanTienThue"
                                            name="thoiHanThanhToanTienThue"
                                            options={ThoiHanChoThue}
                                            placeholder="Chọn"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <TanetLabel
                                            label="Tiền đặt cọc"
                                            required={false}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <div className="relative">
                                            <TanetDecimal
                                                label=""
                                                required={false}
                                                view={state?.viewMode}
                                                type="text"
                                                id="tienDatCoc"
                                                name="tienDatCoc"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none z-20 pr-4">
                                                <span className="text-gray-500">VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="Ghi chú"
                                            required={false}
                                        />
                                    </div>
                                    <div className="col-span-9">
                                        <TanetTextArea
                                            label=""
                                            required={false}
                                            view={state?.viewMode}
                                            type="text"
                                            id="ghiChu"
                                            name="ghiChu"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <TanetLabel
                                            label="File đính kèm"
                                            required={false}
                                        />
                                    </div>
                                    <div className="col-span-9">
                                        <UploadFile
                                            action={action}
                                            nameAttach='fileDinhKemAttachs'
                                            nameDelete='fileDinhKem'
                                            fileType='fileDocument'
                                            maxFiles={1}
                                            loading={isLoading}
                                            data={data?.lstFileDinhKem}
                                            displayImage={false}
                                        />
                                    </div>
                                </Modal.Body>
                                <Modal.Footer onClose={onClose}>
                                    <>
                                        <button
                                            data-modal-hide="large-modal"
                                            type="submit"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Lưu
                                        </button>
                                    </>
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                </Modal>
            }
            {showThemDonViChoThue && (
                <ThemDonViChothue
                    show={showThemDonViChoThue}
                    onClose={onCloseThemMoiDonViThue}
                    action=""
                    id={null}
                />

            )}

        </>
    );
}
