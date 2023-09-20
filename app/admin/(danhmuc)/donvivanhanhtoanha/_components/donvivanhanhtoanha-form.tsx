"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { donViVanHanhToaNhaServices } from "../_services/services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function DonViVanHanhToaNhaForm({
    show,
    action,
    id,
    onClose,
}: IFormProps) {
    const titleTable = "Đơn vị vận hành tòa nhà";
    const dataDefault = {
        tenDV: '',
        maSoDN: '',
        nguoiDaiDien: '',
        ccCD: '',
        moTa: '',
    };
    const schema = object({
        tenDV: string().trim().nullable().required('Tên đơn vị vận hành tòa nhà không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
        maSoDN: string().trim().nullable().required('Mã số doanh nghiệp không được để trống').max(20, 'Bạn nhập tối đa 20 ký tự'),
        nguoiDaiDien: string().trim().nullable().required('Người đại diện không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
        ccCD: string().trim().nullable().max(20, 'Bạn nhập tối đa 20 ký tự'),
        moTa: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    });
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data, error, isLoading, mutate } = donViVanHanhToaNhaServices.GetById(id!);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        if (id) {
            try {
                await donViVanHanhToaNhaServices.update(id, values);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await donViVanHanhToaNhaServices.create(values);
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
                                        label='Tên đơn vị vận hành tòa nhà'
                                        required={true}
                                        view={state?.viewMode}
                                        id='tenDV'
                                        name='tenDV'
                                    /></div>
                                <div className='col-span-6'>
                                    <TanetInput
                                        label='Mã số doanh nghiệp'
                                        required={true}
                                        view={state?.viewMode}
                                        id='maSoDN'
                                        name='maSoDN'
                                    /></div>
                                <div className='col-span-6'>
                                    <TanetInput
                                        label='Người đại diện'
                                        required={true}
                                        view={state?.viewMode}
                                        id='nguoiDaiDien'
                                        name='nguoiDaiDien'
                                    /></div>
                                <div className='col-span-6'>
                                    <TanetInput
                                        label='Số CCCD/CMTND'
                                        required={false}
                                        view={state?.viewMode}
                                        id='ccCD'
                                        name='ccCD'
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
