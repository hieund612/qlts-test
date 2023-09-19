"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { trangThaiHSPLServices } from "../_services/services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function TrangThaiHSPLForm({
    show,
    action,
    id,
    onClose,
}: IFormProps) {
    const titleTable = "Trạng thái hồ sơ";
    const dataDefault = {
        maTT: '',
        tenTT: '',
        moTa: '',
    };
    const schema = object({
        maTT: string().trim().nullable().required('Mã trạng thái không được để trống').max(20, 'Bạn nhập tối đa 20 ký tự'),
        tenTT: string().trim().nullable().required('Tên trạng thái không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
        moTa: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    });
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data, error, isLoading, mutate } = trangThaiHSPLServices.GetById(id!);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        if (id) {
            try {
                await trangThaiHSPLServices.update(id, values);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await trangThaiHSPLServices.create(values);
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
                                <div className='col-span-6'>
                                    <TanetInput
                                        label='Mã trạng thái'
                                        required={true}
                                        view={state?.viewMode}
                                        id='maTT'
                                        name='maTT'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Tên trạng thái'
                                        required={true}
                                        view={state?.viewMode}
                                        id='tenTT'
                                        name='tenTT'
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
