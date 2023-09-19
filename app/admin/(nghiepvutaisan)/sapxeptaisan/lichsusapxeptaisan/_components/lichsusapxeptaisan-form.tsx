"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState,useReducer } from "react";
import { array, number, object, ref, string,date } from "yup";
import { lichSuSapXepTaiSanServices } from "../services";
import { formReducer,INITIAL_STATE_FORM,computedTitle } from "@/lib/common";
export default function LichSuSapXepTaiSanForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable="Phương án đề xuất";  
  const dataDefault = {
        phuongAnSapXepId: null,
    thaoTacThucHien: null,
    trangThai: null,
    ngayTao: null,
  };
  const schema = object({
        phuongAnSapXepId: number().nullable().required('Phương án sắp xếp không được để trống'),
    thaoTacThucHien: number().nullable().required('Thao tác thực hiện không được để trống').integer('Bạn phải nhập kiểu số nguyên'),
    trangThai: number().nullable().required('Trạng thái không được để trống').integer('Bạn phải nhập kiểu số nguyên').max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    ngayTao: date().nullable().required('Trường này không được để trống'),
  });    
  const [state,dispatch] = useReducer(formReducer,INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = lichSuSapXepTaiSanServices.GetById(id!);
  const { data:dataPhuongAnSapXeps }=lichSuSapXepTaiSanServices.GetPhuongAnSapXep()
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await lichSuSapXepTaiSanServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await lichSuSapXepTaiSanServices.create(values);
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
	label='Phương án sắp xếp'
	required={true}
	view={state?.viewMode}
	id='phuongAnSapXepId'
	name='phuongAnSapXepId'
	options ={ dataPhuongAnSapXeps}
	/></div>
<div className='col-span-12'>
	<TanetInput
	label='Thao tác thực hiện'
	required={true}
	view={state?.viewMode}
	type='number'
	id='thaoTacThucHien'
	name='thaoTacThucHien'
	/></div>
<div className='col-span-12'>
	<TanetInput
	label='Trạng thái'
	required={true}
	view={state?.viewMode}
	type='number'
	id='trangThai'
	name='trangThai'
	/></div>
<div className='col-span-12'>
	<TanetFormDate
	label='Ngày tạo'
	required={true}
	view={state?.viewMode}
	dateFormat='dd/MM/yyyy'
	id='ngayTao'
	name='ngayTao'
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
