"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState,useReducer } from "react";
import { array, number, object, ref, string,date } from "yup";
import { kiemTraVanHanhServices } from "../services";
import { formReducer,INITIAL_STATE_FORM,computedTitle } from "@/lib/common";
export default function KiemTraVanHanhForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable="Quản lý sửa chữa bảo dưỡng";  
  const dataDefault = {
        vanHanhId: null,
    tuNgay: null,
    denNgay: null,
    nguoiThucHien: '',
    chiTiet: '',
    fileDinhKemAttachs: [],
  };
  const schema = object({
        vanHanhId: number().nullable().required('Vận hành tòa nhà Id không được để trống'),
    tuNgay: date().nullable().required('Trường này không được để trống'),
    denNgay: date().nullable().required('Trường này không được để trống'),
    nguoiThucHien: string().trim().nullable().max(400, 'Bạn nhập tối đa 400 ký tự'),
    chiTiet: string().trim().nullable().required('Chi tiết công việc không được để trống'),
    fileDinhKemAttachs: array().nullable(),
  });    
  const [state,dispatch] = useReducer(formReducer,INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = kiemTraVanHanhServices.GetById(id!);
  const { data:dataVanHanhs }=kiemTraVanHanhServices.GetVanHanh()
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await kiemTraVanHanhServices.updatewithfile(values, 'KiemTraVanHanhUpdateDto',[{ name: 'fileDinhKems',file: 'fileDinhKemAttachs'}]);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await kiemTraVanHanhServices.createwithfile(values, 'KiemTraVanHanhCreateDto',[{ name: 'fileDinhKems',file: 'fileDinhKemAttachs'}]);
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
	label='Vận hành tòa nhà Id'
	required={true}
	view={state?.viewMode}
	id='vanHanhId'
	name='vanHanhId'
	options ={ dataVanHanhs}
	/></div>
<div className='col-span-6'>
	<TanetFormDate
	label='Thời gian thực hiện từ'
	required={true}
	view={state?.viewMode}
	dateFormat='dd/MM/yyyy'
	id='tuNgay'
	name='tuNgay'
	/></div>
<div className='col-span-6'>
	<TanetFormDate
	label='Thời gian thực hiện đến'
	required={true}
	view={state?.viewMode}
	dateFormat='dd/MM/yyyy'
	id='denNgay'
	name='denNgay'
	/></div>
<div className='col-span-6'>
	<TanetInput
	label='Người thực hiện kiểm tra'
	required={false}
	view={state?.viewMode}
	id='nguoiThucHien'
	name='nguoiThucHien'
	/></div>
<div className='col-span-6'>
	<TanetTextArea
	label='Chi tiết công việc'
	required={true}
	view={state?.viewMode}
	rows={3}
	id='chiTiet'
	name='chiTiet'
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
