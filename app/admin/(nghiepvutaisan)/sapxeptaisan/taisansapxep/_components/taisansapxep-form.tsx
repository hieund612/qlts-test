"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { taiSanSapXepServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function TaiSanSapXepForm({
    show,
    action,
    id,
    onClose,
}: IFormProps) {
    const titleTable = "Tài sản sắp xếp";
    const dataDefault = {
        phuongAnDeXuat: null,
        fileBienBanAttachs: [],
        fileQuyetDinhAttachs: [],
        soQuyetDinh: '',
        ngayQuyetDinh: null,
        ghiChuPheDuyet: '',
    };
    const schema = object({
        phuongAnDeXuat: number().nullable().integer('Bạn phải nhập kiểu số nguyên'),
        fileBienBanAttachs: array().nullable(),
        fileQuyetDinhAttachs: array().nullable(),
        soQuyetDinh: string().trim().nullable().max(100, 'Bạn nhập tối đa 100 ký tự'),
        ngayQuyetDinh: date().nullable(),
        ghiChuPheDuyet: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    });
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data, error, isLoading, mutate } = taiSanSapXepServices.GetById(id!);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        if (id) {
            try {
                await taiSanSapXepServices.updatewithfile(values, 'TaiSanSapXepUpdateDto', [{ name: 'fileBienBans', file: 'fileBienBanAttachs' }, { name: 'fileQuyetDinhs', file: 'fileQuyetDinhAttachs' }]);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await taiSanSapXepServices.createwithfile(values, 'TaiSanSapXepCreateDto', [{ name: 'fileBienBans', file: 'fileBienBanAttachs' }, { name: 'fileQuyetDinhs', file: 'fileQuyetDinhAttachs' }]);
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
                                        label='Phương án đề xuất'
                                        required={false}
                                        view={state?.viewMode}
                                        type='number'
                                        id='phuongAnDeXuat'
                                        name='phuongAnDeXuat'
                                    /></div>
                                <div className='col-span-12'>
                                    <UploadFile
                                        action={action}
                                        nameAttach='fileBienBanAttachs'
                                        nameDelete='lstFileBienBanDeletes'
                                        fileType='fileImage'
                                        maxFiles={1}
                                        loading={isLoading}
                                        data={data?.lstFileBienBan}
                                        displayImage={false}
                                    /></div>
                                <div className='col-span-12'>
                                    <UploadFile
                                        action={action}
                                        nameAttach='fileQuyetDinhAttachs'
                                        nameDelete='lstFileQuyetDinhDeletes'
                                        fileType='fileImage'
                                        maxFiles={1}
                                        loading={isLoading}
                                        data={data?.lstFileQuyetDinh}
                                        displayImage={false}
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Số QĐ phê duyệt'
                                        required={false}
                                        view={state?.viewMode}
                                        id='soQuyetDinh'
                                        name='soQuyetDinh'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetFormDate
                                        label='Ngày phê duyệt'
                                        required={false}
                                        view={state?.viewMode}
                                        dateFormat='dd/MM/yyyy'
                                        id='ngayQuyetDinh'
                                        name='ngayQuyetDinh'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Ghi chú phê duyệt'
                                        required={false}
                                        view={state?.viewMode}
                                        id='ghiChuPheDuyet'
                                        name='ghiChuPheDuyet'
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
