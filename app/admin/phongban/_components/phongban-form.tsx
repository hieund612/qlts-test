"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { phongBanServices } from "../_services/services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function PhongBanForm({
    show,
    action,
    id,
    onClose,
}: IFormProps) {
    const titleTable = "Phòng ban";
    const dataDefault = {
        maPB: '',
        tenPB: '',
        donViNoiBo_Id: null,
    };
    const schema = object({
        maPB: string().trim().nullable().required('Mã phòng ban không được để trống').max(20, 'Bạn nhập tối đa 20 ký tự'),
        tenPB: string().trim().nullable().required('Tên phòng ban không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
        donViNoiBo_Id: number().nullable(),
    });
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data, error, isLoading, mutate } = phongBanServices.GetById(id!);
    const { data: dataDonViNoiBos } = phongBanServices.GetDonViNoiBo()
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        if (id) {
            try {
                await phongBanServices.update(id, values);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await phongBanServices.create(values);
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
                                        label='Mã phòng ban'
                                        required={true}
                                        view={state?.viewMode}
                                        id='maPB'
                                        name='maPB'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Tên phòng ban'
                                        required={true}
                                        view={state?.viewMode}
                                        id='tenPB'
                                        name='tenPB'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetSelect
                                        label='Đơn vị nội bộ'
                                        required={false}
                                        view={state?.viewMode}
                                        id='donViNoiBo_Id'
                                        name='donViNoiBo_Id'
                                        options={dataDonViNoiBos}
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
