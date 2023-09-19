"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile, TanetLabel } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, string, date } from "yup";
import { hoSoTaiSanServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import { AiFillDelete } from "react-icons/ai";

export default function HoSoTaiSanForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const dataDefault = {
    loaiHoSoId: 1,
    soPhatHanhGCN1: '',
    soPhatHanhGCN2: '',
    soPhatHanhGCN: '',
    ngayPhatHanh: null,
    nguoiSuDungSoHuu: '',
    coDongSoHuu: false,
    nguoiDongSoHuu: '',
    soThuaDat: '',
    coQuanCapGcn: '',
    soCapGcn: '',
    ghiChu: '',
    fileDinhKemAttachs: [],
    nguoiDongSoHuuList: [],
    soThuaDatList: [],
  };
  const schema = object({
    loaiHoSoId: number().nullable().required('Loại hồ sơ không được để trống'),
    soPhatHanhGCN1: string().trim().nullable().required('Trường này không được để trống').max(50, 'Bạn nhập tối đa 50 ký tự'),
    soPhatHanhGCN2: string().trim().nullable().required('Trường này không được để trống').max(50, 'Bạn nhập tối đa 50 ký tự'),
    ngayThayDoi: date().nullable().required('Trường này không được để trống'),
    nguoiSuDungSoHuu: string().trim().nullable().max(400, 'Bạn nhập tối đa 400 ký tự'),
    nguoiDongSoHuu: string().trim().nullable().max(4000, 'Bạn nhập tối đa 4000 ký tự'),
    soThuaDat: string().trim().nullable().max(4000, 'Bạn nhập tối đa 4000 ký tự'),
    coQuanCapGcn: string().trim().nullable().required('Trường này không được để trống').max(400, 'Bạn nhập tối đa 400 ký tự'),
    soCapGcn: string().trim().nullable().required('Trường này không được để trống').max(150, 'Bạn nhập tối đa 150 ký tự'),
    ghiChu: string().trim().nullable(),
    fileDinhKemAttachs: array().nullable(),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = hoSoTaiSanServices.GetById(id!);
  const { data: dataLoaiHoSos } = hoSoTaiSanServices.GetLoaiHoSo()
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async (values: any) => {
    values.soPhatHanhGCN = values.soPhatHanhGCN1 + " " + values.soPhatHanhGCN2;
    if (values.coDongSoHuu) {
      if (!(values.nguoiDongSoHuuList && values.nguoiDongSoHuuList.length > 0)) {
        alert("Bạn chưa nhập người đồng sở hữu");
        return false;
      }
    }
    if (!(values.soThuaDatList && values.soThuaDatList.length > 0)) {
      alert("Bạn chưa nhập Số thửa đất và số tờ bản đồ");
      return false;
    }
    setLoading(true);
    try {
      await hoSoTaiSanServices.updatewithfile(values, 'HiHoSoTaiSanUpdateDto', [{ name: 'fileDinhKems', file: 'fileDinhKemAttachs' }]);
      toast.success("Thay đổi thông tin GCN thành công");
      await mutate();
      await onClose(true);
    } catch (err: any) {
      toast.error("Thay đổi thông tin GCN không thành công");
    }
    setLoading(false);
  };
  useEffect(() => {
    dispatch({ type: action });
  }, [action, id]);
  const addDongSoHuu = (value: any, arr: any, setFieldValue: any) => {
    if (value) {
      arr.push(value);
      setFieldValue("nguoiDongSoHuuList", arr);
      setFieldValue("nguoiDongSoHuuText", "");
      setFieldValue("nguoiDongSoHuu", JSON.stringify(arr));
    }
  }
  const removeDongSoHuu = (index: any, arr: any, setFieldValue: any) => {
    const updatedList = [...arr];
    updatedList.splice(index, 1);
    setFieldValue("nguoiDongSoHuuList", updatedList);
    setFieldValue("nguoiDongSoHuu", JSON.stringify(updatedList));
  }
  const addSoThuaDat = (soThuaDat: any, soToBanDo: any, arr: any, setFieldValue: any) => {
    if (soThuaDat && soToBanDo) {
      arr.push({ soThuaDat: soThuaDat, soToBanDo: soToBanDo });
      setFieldValue("soThuaDatList", arr);
      setFieldValue("soThuaDatText", "");
      setFieldValue("soToBanDoText", "");
      setFieldValue("soThuaDat", JSON.stringify(arr));
    }
  }
  const removeSoThuaDat = (index: any, arr: any, setFieldValue: any) => {
    const updatedList = [...arr];
    updatedList.splice(index, 1);
    setFieldValue("soThuaDatList", updatedList);
    setFieldValue("soThuaDat", JSON.stringify(updatedList));
  }

  return (
    <>
      <Modal show={show} size="xxl" loading={loading}>
        <Formik
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={schema}
          initialValues={data ? data : dataDefault}
          enableReinitialize={true}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <Form noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}>
              <Modal.Header onClose={onClose}>Khai báo GCN QSD đất</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-2'>
                  <TanetLabel
                    label='Loại hồ sơ'
                    required={true}
                  /></div>
                <div className='col-span-10'>
                  <TanetSelect
                    required={true}
                    view={true}
                    id='loaiHoSoId'
                    name='loaiHoSoId'
                    options={dataLoaiHoSos}
                  /></div>
                <div className='col-span-2'>
                  <TanetLabel
                    label='Số giấy phát hành GCN'
                    required={true}
                  /></div>
                <div className='col-span-2'>
                  <TanetInput
                    required={true}
                    view={true}
                    id='soPhatHanhGCN1'
                    name='soPhatHanhGCN1'
                  />
                </div>
                <div className='col-span-2'>
                  <TanetInput
                    required={true}
                    view={true}
                    id='soPhatHanhGCN2'
                    name='soPhatHanhGCN2'
                  />
                </div>
                <div className='col-span-2'>
                  <TanetLabel
                    label='Ngày thay đổi'
                    required={true}
                  /></div>
                <div className='col-span-4'>
                  <TanetFormDate
                    required={true}
                    view={state?.viewMode}
                    dateFormat='dd/MM/yyyy'
                    id='ngayThayDoi'
                    name='ngayThayDoi'
                  /></div>
                <div className='col-span-2'>
                  <TanetLabel
                    label='Người sử dụng đất, chủ sở hữu nhà'
                    required={true}
                  /></div>
                <div className='col-span-10'>
                  <TanetInput
                    required={false}
                    view={state?.viewMode}
                    id='nguoiSuDungSoHuu'
                    name='nguoiSuDungSoHuu'
                  /></div>
                <div className='col-span-2'></div>
                <div className='col-span-10'>
                  <TanetCheckbox
                    view={state?.viewMode}
                    id='coDongSoHuu'
                    name='coDongSoHuu'
                  >Đất có đồng chủ sở hữu</TanetCheckbox>
                </div>
                {values.coDongSoHuu && <>
                  <div className='col-span-2'>
                    <TanetLabel
                      label='Người đồng sở hữu'
                      required={true}
                    /></div>
                  <div className='col-span-10'>
                    {state && !state.viewMode && <div className="relative mb-4 flex flex-wrap items-stretch">
                      <TanetInput
                        view={state?.viewMode}
                        id='nguoiDongSoHuuText'
                        name='nguoiDongSoHuuText'
                        className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                      />
                      <button
                        className="z-[2] inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:z-[3] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        data-te-ripple-init
                        type="button" title="Thêm người đồng sở hữu" onClick={() => addDongSoHuu(values.nguoiDongSoHuuText, values.nguoiDongSoHuuList, setFieldValue)}>
                        Thêm
                      </button>
                    </div>}
                    {values.nguoiDongSoHuuList && <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <tbody>
                          {
                            values.nguoiDongSoHuuList.map((item, index) => {
                              return <tr key={index}>
                                {state && !state.viewMode && <td className="px-3 py-2 w-20"><AiFillDelete onClick={() => removeDongSoHuu(index, values.nguoiDongSoHuuList, setFieldValue)} title="Xóa" className="cursor-pointer text-lg mr-1 text-red-700 mr-3" /></td>}
                                <td className="px-3 py-2">{item}</td>
                              </tr>;
                            })}
                        </tbody></table>
                    </div>
                    }

                  </div>
                </>}
                <div className='col-span-2'>
                  <TanetLabel
                    label='Số thửa đất'
                    required={true}
                  /></div>
                <div className="col-span-10">
                  {state && !state.viewMode &&
                    <div className="gap-4 grid grid-cols-12">
                      <div className='col-span-1'>
                        <TanetInput
                          view={state?.viewMode}
                          id='soThuaDatText'
                          name='soThuaDatText'
                        />
                      </div>
                      <div className='col-span-1'>
                        <TanetLabel
                          label='Số tờ bản đồ'
                          required={true}
                        /></div>
                      <div className='col-span-1'>
                        <TanetInput
                          view={state?.viewMode}
                          id='soToBanDoText'
                          name='soToBanDoText'
                        />
                      </div>
                      <div className='col-span-1 text-right'>
                        <button
                          className="inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:z-[3] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                          data-te-ripple-init
                          type="button" onClick={() => addSoThuaDat(values.soThuaDatText, values.soToBanDoText, values.soThuaDatList, setFieldValue)}>
                          Thêm
                        </button>
                      </div>
                    </div>

                  }
                  {(values.soThuaDatList && values.soThuaDatList.length > 0) && <>
                    <div className='relative overflow-x-auto'>
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            {state && !state.viewMode && <th className="px-3 py-2 w-20">#
                            </th>}
                            <th className="px-3 py-2">
                              Số thửa đất
                            </th>
                            <th className="px-3 py-2">
                              Số tờ bản đồ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            values.soThuaDatList.map((item, index) => {
                              return <tr key={index}>
                                {state && !state.viewMode && <td className="px-3 py-2"><AiFillDelete onClick={() => removeSoThuaDat(index, values.soThuaDatList, setFieldValue)} title="Xóa" className="cursor-pointer text-lg mr-1 text-red-700 mr-3" /></td>}
                                <td className="px-3 py-2">{item.soThuaDat}</td>
                                <td className="px-3 py-2">{item.soToBanDo}</td>
                              </tr>;
                            })}
                        </tbody></table></div></>
                  }
                </div>
                <div className='col-span-2'>
                  <TanetLabel
                    label='Cơ quan cấp GCN'
                    required={true}
                  /></div>
                <div className='col-span-4'>
                  <TanetInput
                    required={false}
                    view={state?.viewMode}
                    id='coQuanCapGcn'
                    name='coQuanCapGcn'
                  /></div>
                <div className='col-span-2'>
                  <TanetLabel
                    label='Số vào sổ cấp GCN'
                    required={true}
                  /></div>
                <div className='col-span-4'>
                  <TanetInput
                    required={false}
                    view={state?.viewMode}
                    id='soCapGcn'
                    name='soCapGcn'
                  /></div>
                <div className='col-span-2'>
                  <TanetLabel
                    label='Ghi chú'
                    required={false}
                  /></div>
                <div className='col-span-10'>
                  <TanetTextArea
                    required={false}
                    view={state?.viewMode}
                    rows={3}
                    id='ghiChu'
                    name='ghiChu'
                  /></div>
                <div className='col-span-2'>
                  <TanetLabel
                    label='File đính kèm'
                    required={false}
                  /></div>
                <div className='col-span-10'>
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
