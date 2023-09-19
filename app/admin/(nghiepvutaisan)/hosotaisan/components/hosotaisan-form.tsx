"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState,useReducer } from "react";
import { array, number, object, ref, string,date } from "yup";
import { hoSoTaiSanServices } from "../services";
import { formReducer,INITIAL_STATE_FORM,computedTitle } from "@/lib/common";
export default function HoSoTaiSanForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable="Quản lý hồ sơ tài sản";  
  const dataDefault = {
        loaiHoSoId: null,
    soPhatHanhGCN1: '',
    soPhatHanhGCN2: '',
    ngayPhatHanh: null,
    nguoiSuDungSoHuu: '',
    coDongSoHuu: false,
    nguoiDongSoHuu: '',
    soThuaDat: '',
    coQuanCapGcn: '',
    soCapGcn: '',
    ghiChu: '',
    fileDinhKemAttachs: [],
  };
  const schema = object({
        loaiHoSoId: number().nullable().required('Loại hồ sơ không được để trống'),
    soPhatHanhGCN1: string().trim().nullable().max(50, 'Bạn nhập tối đa 50 ký tự'),
    soPhatHanhGCN2: string().trim().nullable().max(50, 'Bạn nhập tối đa 50 ký tự'),
    ngayPhatHanh: date().nullable().required('Trường này không được để trống'),
    nguoiSuDungSoHuu: string().trim().nullable().max(400, 'Bạn nhập tối đa 400 ký tự'),
    nguoiDongSoHuu: string().trim().nullable().max(4000, 'Bạn nhập tối đa 4000 ký tự'),
    soThuaDat: string().trim().nullable().max(4000, 'Bạn nhập tối đa 4000 ký tự'),
    coQuanCapGcn: string().trim().nullable().max(400, 'Bạn nhập tối đa 400 ký tự'),
    soCapGcn: string().trim().nullable().max(150, 'Bạn nhập tối đa 150 ký tự'),
    ghiChu: string().trim().nullable(),
    fileDinhKemAttachs: array().nullable(),
  });    
  const [state,dispatch] = useReducer(formReducer,INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = hoSoTaiSanServices.GetById(id!);
  const { data:dataLoaiHoSos }=hoSoTaiSanServices.GetLoaiHoSo()
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await hoSoTaiSanServices.updatewithfile(values, 'HoSoTaiSanUpdateDto',[{ name: 'fileDinhKems',file: 'fileDinhKemAttachs'}]);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await hoSoTaiSanServices.createwithfile(values, 'HoSoTaiSanCreateDto',[{ name: 'fileDinhKems',file: 'fileDinhKemAttachs'}]);
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
    dispatch({type:action});
  }, [action, id]);
  return (
    <>
      <Modal show={show} size="xl" loading={loading}>
        <Formik
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={schema}
          initialValues={data ? data : dataDefault}
          enableReinitialize={true}
        >
          {({ handleSubmit}) => (
          <Form noValidate
          onSubmit={handleSubmit}
          onKeyPress={(ev) => {
            ev.stopPropagation();
          }}>
            <Modal.Header onClose={onClose}>{computedTitle(id,state?.editMode, titleTable)}</Modal.Header>
            <Modal.Body nameClass="grid-cols-12">
               <div className='col-span-6'>
	<TanetSelect
	label='Loại hồ sơ'
	required={true}
	view={state?.viewMode}
	id='loaiHoSoId'
	name='loaiHoSoId'
	options ={ dataLoaiHoSos}
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Số phát hành GCN'
	required={false}
	view={state?.viewMode}
	id='soPhatHanhGCN1'
	name='soPhatHanhGCN1'
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Số phát hành GCN'
	required={false}
	view={state?.viewMode}
	id='soPhatHanhGCN2'
	name='soPhatHanhGCN2'
	/></div>
<div className='col-span-6'>
	<TanetFormDate
	label='Ngày phát hành GCN'
	required={true}
	view={state?.viewMode}
	dateFormat='dd/MM/yyyy'
	id='ngayPhatHanh'
	name='ngayPhatHanh'
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Người sử dụng đất, chủ sở hữu nhà'
	required={false}
	view={state?.viewMode}
	id='nguoiSuDungSoHuu'
	name='nguoiSuDungSoHuu'
	/></div>
<div className='col-span-6'>
	<TanetCheckbox
	view={state?.viewMode}
	id='coDongSoHuu'
	name='coDongSoHuu'
	>Đất có đồng chủ sở hữu</TanetCheckbox></div>
<div className='col-span-6'>
	<TanetInput
	label='Người đồng sở hữu'
	required={false}
	view={state?.viewMode}
	id='nguoiDongSoHuu'
	name='nguoiDongSoHuu'
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Số thửa đất'
	required={false}
	view={state?.viewMode}
	id='soThuaDat'
	name='soThuaDat'
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Cơ quan cấp GCN'
	required={false}
	view={state?.viewMode}
	id='coQuanCapGcn'
	name='coQuanCapGcn'
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Số vào sổ cấp GCN'
	required={false}
	view={state?.viewMode}
	id='soCapGcn'
	name='soCapGcn'
	/></div>
<div className='col-span-6'>
	<TanetTextArea
	label='Ghi chú'
	required={false}
	view={state?.viewMode}
	rows={3}
	id='ghiChu'
	name='ghiChu'
	/></div>
<div className='col-span-6'>
	<UploadFile
	action ={action}
	nameAttach='fileDinhKemAttachs'
	nameDelete='lstFileDinhKemDeletes'
	fileType='fileImage'
	maxFiles={1}
	loading={isLoading}
	data={data?.lstFileDinhKem}
	displayImage={false}
	/></div>
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
