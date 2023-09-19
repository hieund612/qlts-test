"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { huongDanSuDungServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function HuongDanSuDungForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Hướng dẫn sử dụng";
  const dataDefault = {
    stt: null,
    tieuDe: '',
    moTa: '',
    dinhKemAttachs: [],
  };
  const schema = object({
    stt: number().nullable().integer('Bạn phải nhập kiểu số nguyên'),
    tieuDe: string().trim().nullable().required('Tiêu đề không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
    moTa: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    dinhKemAttachs: array().nullable(),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = huongDanSuDungServices.GetById(id!);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await huongDanSuDungServices.updatewithfile(values, 'HuongDanSuDungUpdateDto', [{ name: 'dinhKems', file: 'dinhKemAttachs' }]);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await huongDanSuDungServices.createwithfile(values, 'HuongDanSuDungCreateDto', [{ name: 'dinhKems', file: 'dinhKemAttachs' }]);
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
                    label='STT'
                    required={false}
                    view={state?.viewMode}
                    type='number'
                    id='stt'
                    name='stt'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Tiêu đề'
                    required={true}
                    view={state?.viewMode}
                    id='tieuDe'
                    name='tieuDe'
                  /></div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Mô tả'
                    required={false}
                    view={state?.viewMode}
                    rows={3}
                    id='moTa'
                    name='moTa'
                  /></div>
                <div className='col-span-12'>
                  <UploadFile
                    action={action}
                    nameAttach='dinhKemAttachs'
                    nameDelete='lstDinhKemDeletes'
                    fileType='fileImage'
                    maxFiles={1}
                    loading={isLoading}
                    data={data?.lstDinhKem}
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
