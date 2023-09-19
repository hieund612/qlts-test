"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState,useReducer } from "react";
import { array, number, object, ref, string,date } from "yup";
import { vanHanhToaNhaServices } from "../services";
import { formReducer,INITIAL_STATE_FORM,computedTitle } from "@/lib/common";
export default function VanHanhToaNhaForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable="Quản lý sửa chữa bảo dưỡng";  
  const dataDefault = {
        taiSanId: null,
    donViId: null,
    maTaiSan: '',
    tenTaiSan: '',
    donViVanHanhId: null,
    tuNgay: null,
    denNgay: null,
    hopDongSo: '',
    ngayHopDong: null,
    ghiChu: '',
    fileDinhKemAttachs: [],
  };
  const schema = object({
        taiSanId: number().nullable().required('Tài sản id không được để trống'),
    donViId: number().nullable().required('Đơn vị, chi nhánh không được để trống'),
    maTaiSan: string().trim().nullable().max(250, 'Bạn nhập tối đa 250 ký tự'),
    tenTaiSan: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    donViVanHanhId: number().nullable().required('Đơn vị vận hành tòa nhà không được để trống'),
    tuNgay: date().nullable().required('Trường này không được để trống'),
    denNgay: date().nullable().required('Trường này không được để trống'),
    hopDongSo: string().trim().nullable().max(400, 'Bạn nhập tối đa 400 ký tự'),
    ngayHopDong: date().nullable(),
    ghiChu: string().trim().nullable(),
    fileDinhKemAttachs: array().nullable(),
  });    
  const [state,dispatch] = useReducer(formReducer,INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = vanHanhToaNhaServices.GetById(id!);
  const { data:dataTaiSans }=vanHanhToaNhaServices.GetTaiSan()
const { data:dataDonVis }=vanHanhToaNhaServices.GetDonVi()
const { data:dataDonViVanHanhs }=vanHanhToaNhaServices.GetDonViVanHanh()
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await vanHanhToaNhaServices.updatewithfile(values, 'VanHanhToaNhaUpdateDto',[{ name: 'fileDinhKems',file: 'fileDinhKemAttachs'}]);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await vanHanhToaNhaServices.createwithfile(values, 'VanHanhToaNhaCreateDto',[{ name: 'fileDinhKems',file: 'fileDinhKemAttachs'}]);
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
	label='Tài sản id'
	required={true}
	view={state?.viewMode}
	id='taiSanId'
	name='taiSanId'
	options ={ dataTaiSans}
	/></div>
<div className='col-span-6'>
	<TanetSelect
	label='Đơn vị, chi nhánh'
	required={true}
	view={state?.viewMode}
	id='donViId'
	name='donViId'
	options ={ dataDonVis}
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Số thẻ/Tên tài sản'
	required={false}
	view={state?.viewMode}
	id='maTaiSan'
	name='maTaiSan'
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Số thẻ/Tên tài sản'
	required={false}
	view={state?.viewMode}
	id='tenTaiSan'
	name='tenTaiSan'
	/></div>
<div className='col-span-6'>
	<TanetSelect
	label='Đơn vị vận hành tòa nhà'
	required={true}
	view={state?.viewMode}
	id='donViVanHanhId'
	name='donViVanHanhId'
	options ={ dataDonViVanHanhs}
	/></div>
<div className='col-span-6'>
	<TanetFormDate
	label='Thời gian vận hành từ ngày'
	required={true}
	view={state?.viewMode}
	dateFormat='dd/MM/yyyy'
	id='tuNgay'
	name='tuNgay'
	/></div>
<div className='col-span-6'>
	<TanetFormDate
	label='Thời gian vận hành đến ngày'
	required={true}
	view={state?.viewMode}
	dateFormat='dd/MM/yyyy'
	id='denNgay'
	name='denNgay'
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Hợp đồng số'
	required={false}
	view={state?.viewMode}
	id='hopDongSo'
	name='hopDongSo'
	/></div>
<div className='col-span-6'>
	<TanetFormDate
	label='Ngày hợp đồng'
	required={false}
	view={state?.viewMode}
	dateFormat='dd/MM/yyyy'
	id='ngayHopDong'
	name='ngayHopDong'
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
