"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { diaDiemServices } from "../_services/services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function DiaDiemForm({
    show,
    action,
    id,
    onClose,
}: IFormProps) {
    const titleTable = "Địa bàn";
    const dataDefault = {
        maDiaBan: '',
        tenDiaBan: '',
        parent_Id: null,
        cap: null,
        maTinh: null,
        maHuyen: null,
        maXa: null,
    };
    const schema = object({
        maDiaBan: string().trim().nullable().required('Mã địa bàn không được để trống').max(20, 'Bạn nhập tối đa 20 ký tự'),
        tenDiaBan: string().trim().nullable().required('Tên địa bàn không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
        parent_Id: number().nullable(),
        cap: number().nullable().integer('Bạn phải nhập kiểu số nguyên'),
        maTinh: number().nullable().integer('Bạn phải nhập kiểu số nguyên'),
        maHuyen: number().nullable().integer('Bạn phải nhập kiểu số nguyên'),
        maXa: number().nullable().integer('Bạn phải nhập kiểu số nguyên'),
    });
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data, error, isLoading, mutate } = diaDiemServices.GetById(id!);
    const { data: dataParents } = diaDiemServices.GetParent()
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        if (id) {
            try {
                await diaDiemServices.update(id, values);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await diaDiemServices.create(values);
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
                                        label='Mã địa bàn'
                                        required={true}
                                        view={state?.viewMode}
                                        id='maDiaBan'
                                        name='maDiaBan'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Tên địa bàn'
                                        required={true}
                                        view={state?.viewMode}
                                        id='tenDiaBan'
                                        name='tenDiaBan'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetSelect
                                        label='Cấp cha'
                                        required={false}
                                        view={state?.viewMode}
                                        id='parent_Id'
                                        name='parent_Id'
                                        options={dataParents}
                                    /></div>
                                {/*<div className='col-span-12'>
                                    <TanetInput
                                        label='Cấp'
                                        required={false}
                                        view={state?.viewMode}
                                        type='number'
                                        id='cap'
                                        name='cap'
                                    /></div>*/}
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Mã tỉnh, thành phố'
                                        required={false}
                                        view={state?.viewMode}
                                        type='number'
                                        id='maTinh'
                                        name='maTinh'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Mã quận, huyện'
                                        required={false}
                                        view={state?.viewMode}
                                        type='number'
                                        id='maHuyen'
                                        name='maHuyen'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Mã phường, xã'
                                        required={false}
                                        view={state?.viewMode}
                                        type='number'
                                        id='maXa'
                                        name='maXa'
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
