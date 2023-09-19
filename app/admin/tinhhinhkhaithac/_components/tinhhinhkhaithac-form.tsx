"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { tinhHinhKhaiThacServices } from "../_services/services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function TinhHinhKhaiThacForm({
    show,
    action,
    id,
    onClose,
}: IFormProps) {
    const titleTable = "Tình hình khai thác sử dụng";
    const dataDefault = {
        maTH: '',
        tenTH: '',
        moTa: '',
    };
    const schema = object({
        maTH: string().trim().nullable().required('Mã tình hình khai thác không được để trống').max(20, 'Bạn nhập tối đa 20 ký tự'),
        tenTH: string().trim().nullable().required('Tên tình hình khai thác không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
        moTa: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    });
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data, error, isLoading, mutate } = tinhHinhKhaiThacServices.GetById(id!);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        if (id) {
            try {
                await tinhHinhKhaiThacServices.update(id, values);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await tinhHinhKhaiThacServices.create(values);
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
                                        label='Mã tình hình khai thác'
                                        required={true}
                                        view={state?.viewMode}
                                        id='maTH'
                                        name='maTH'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Tên tình hình khai thác'
                                        required={true}
                                        view={state?.viewMode}
                                        id='tenTH'
                                        name='tenTH'
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
