"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetTextArea, TanetFormDate, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, object, string, date } from "yup";
import { notificationServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function ThongBaoForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Thông báo";
  const dataDefault = {
    tieuDe: '',
    noiDung: '',
    dateFrom: null,
    dateTo: null,
    fileDinhKemAttachs: [],
    lstDonViIds: [],
  };
  const schema = object({
    tieuDe: string().trim().nullable().required('Tiêu đề thông báo không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
    noiDung: string().trim().nullable().required('Nội dung thông báo không được để trống').max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    dateFrom: date().nullable().required('Trường này không được để trống'),
    dateTo: date().nullable().required('Trường này không được để trống'),
    fileDinhKemAttachs: array().nullable(),
    lstDonViIds: array().nullable().required('Bạn chưa chọn đơn vị').min(1, 'Bạn chưa chọn đơn vị'),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = notificationServices.GetById(id!);
  const { data: dataDonVis } = notificationServices.GetDonVi(1)
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await notificationServices.updatewithfile(values, 'NotificationUpdateDto', [{ name: 'fileDinhKems', file: 'fileDinhKemAttachs' }]);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await notificationServices.createwithfile(values, 'NotificationCreateDto', [{ name: 'fileDinhKems', file: 'fileDinhKemAttachs' }]);
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
    dispatch({ type: action });
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
          {({ handleSubmit }) => (
            <Form noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}>
              <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode, titleTable)}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-12'>
                  <TanetInput
                    label='Tiêu đề thông báo'
                    required={true}
                    view={state?.viewMode}
                    id='tieuDe'
                    name='tieuDe'
                  /></div>
                <div className='col-span-12'>
                  {
                    !isLoading &&
                    <TanetSelectTreeCheck
                      label="Đơn vị nhận thông báo"
                      name="lstDonViIds"
                      id='lstDonViIds'
                      view={state?.viewMode}
                      data={dataDonVis}                  
                    />}
                  
                </div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Nội dung thông báo'
                    required={true}
                    view={state?.viewMode}
                    rows={3}
                    id='noiDung'
                    name='noiDung'
                  /></div>
                <div className='col-span-6'>
                  <TanetFormDate
                    label='Thời gian áp dụng từ'
                    required={true}
                    view={state?.viewMode}
                    dateFormat='dd/MM/yyyy'
                    id='dateFrom'
                    name='dateFrom'
                  /></div>
                <div className='col-span-6'>
                  <TanetFormDate
                    label='Thời gian áp dụng đến'
                    required={true}
                    view={state?.viewMode}
                    dateFormat='dd/MM/yyyy'
                    id='dateTo'
                    name='dateTo'
                  /></div>
                <div className='col-span-12'>
                  <UploadFile
                    action={action}
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
