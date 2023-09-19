"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetDecimal, TanetTextArea, TanetFormDate, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, string, date } from "yup";
import { suaChuaBaoDuongServices } from "../services";
import { asTaiSanServices } from "../../danhsachtaisan/services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function SuaChuaBaoDuongForm({
  show,
  action,
  id,
  customId,
  onClose,
}: IFormProps) {
  const titleTable = "Sửa chữa bảo dưỡng";

  const schema = object({
    soTheTaiSan: string().trim().nullable().required('Số thẻ tài sản không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
    tenTaiSan: string().trim().nullable().required('Tên tài sản không được để trống').max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    lyDoBaoDuong: string().trim().nullable().required('Lý do bảo dưỡng không được để trống').max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    donViBaoDuong: string().trim().nullable().required('Đơn vị bảo dưỡng không được để trống').max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    thoiGianBaoDuong: date().nullable().required('Trường này không được để trống'),
    soTienBaoDuong: number().nullable().required('Số tiền bảo dưỡng không được để trống'),
    ghiChu: string().trim().nullable().max(2000, 'Bạn nhập tối đa 2000 ký tự'),
    fileDinhKemAttachs: array().nullable(),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = suaChuaBaoDuongServices.GetById(id!);
  const { data: dataTaiSan } = asTaiSanServices.GetById(customId!);
  const dataDefault = {
    soTheTaiSan: dataTaiSan?.soTheTaiSan ?? '',
    tenTaiSan: dataTaiSan?.tenTaiSan ?? '',
    taiSanId: dataTaiSan?.id ?? '',
    lyDoBaoDuong: '',
    donViBaoDuong: '',
    thoiGianBaoDuong: null,
    soTienBaoDuong: null,
    ghiChu: '',
    fileDinhKemAttachs: [],
  };
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await suaChuaBaoDuongServices.updatewithfile(values, 'SuaChuaBaoDuongUpdateDto', [{ name: 'fileDinhKems', file: 'fileDinhKemAttachs' }]);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await suaChuaBaoDuongServices.createwithfile(values, 'SuaChuaBaoDuongCreateDto', [{ name: 'fileDinhKems', file: 'fileDinhKemAttachs' }]);
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

  }, [action, id, customId]);
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
                <div className='col-span-3'>
                  <TanetInput
                    label='Mã tài sản'
                    view={true}
                    id='soTheTaiSan'
                    name='soTheTaiSan'
                  /></div>
                <div className='col-span-9'>
                  <TanetInput
                    label='Tên tài sản'
                    view={true}
                    id='tenTaiSan'
                    name='tenTaiSan'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Lý do bảo dưỡng'
                    required={true}
                    view={state?.viewMode}
                    id='lyDoBaoDuong'
                    name='lyDoBaoDuong'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Đơn vị bảo dưỡng'
                    required={true}
                    view={state?.viewMode}
                    id='donViBaoDuong'
                    name='donViBaoDuong'
                  /></div>
                <div className='col-span-6'>
                  <TanetFormDate
                    label='Thời gian bảo dưỡng'
                    required={true}
                    view={state?.viewMode}
                    dateFormat='dd/MM/yyyy'
                    id='thoiGianBaoDuong'
                    name='thoiGianBaoDuong'
                  /></div>
                <div className='col-span-6'>
                  <TanetDecimal
                    label='Số tiền bảo dưỡng (VND)'
                    required={true}
                    view={state?.viewMode}
                    id="soTienBaoDuong"
                    name="soTienBaoDuong"
                  />
                </div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Ghi chú'
                    required={false}
                    view={state?.viewMode}
                    id='ghiChu'
                    name='ghiChu'
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
