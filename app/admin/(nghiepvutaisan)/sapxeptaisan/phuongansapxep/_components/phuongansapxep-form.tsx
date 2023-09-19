"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState,useReducer } from "react";
import { array, number, object, ref, string,date } from "yup";
import { phuongAnSapXepServices } from "../services";
import { formReducer,INITIAL_STATE_FORM,computedTitle } from "@/lib/common";
export default function PhuongAnSapXepForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable="Phương án đề xuất";  
  const dataDefault = {
        donViId: null,
    ngayDeXuat: null,
    dienGiai: '',
    fileDinhKemAttachs: [],
  };
  const schema = object({
        donViId: number().nullable().required('Đơn vị, chi nhánh không được để trống'),
    ngayDeXuat: date().nullable().required('Trường này không được để trống'),
    dienGiai: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    fileDinhKemAttachs: array().nullable(),
  });    
  const [state,dispatch] = useReducer(formReducer,INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = phuongAnSapXepServices.GetById(id!);
  const { data:dataDonVis }=phuongAnSapXepServices.GetDonVi()
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await phuongAnSapXepServices.updatewithfile(values, 'PhuongAnSapXepUpdateDto',[{ name: 'fileDinhKems',file: 'fileDinhKemAttachs'}]);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await phuongAnSapXepServices.createwithfile(values, 'PhuongAnSapXepCreateDto',[{ name: 'fileDinhKems',file: 'fileDinhKemAttachs'}]);
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
               <div className='col-span-12'>
	<TanetSelect
	label='Đơn vị, chi nhánh'
	required={true}
	view={state?.viewMode}
	id='donViId'
	name='donViId'
	options ={ dataDonVis}
	/></div>
<div className='col-span-12'>
	<TanetFormDate
	label='Ngày đề xuất'
	required={true}
	view={state?.viewMode}
	dateFormat='dd/MM/yyyy'
	id='ngayDeXuat'
	name='ngayDeXuat'
	/></div>
<div className='col-span-12'>
	<TanetTextArea
	label='Diễn giải'
	required={false}
	view={state?.viewMode}
	rows={3}
	id='dienGiai'
	name='dienGiai'
	/></div>
<div className='col-span-12'>
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
