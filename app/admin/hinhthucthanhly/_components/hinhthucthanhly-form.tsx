"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { hinhThucThanhLyServices } from "../_services/services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function HinhThucThanhLyForm({
    show,
    action,
    id,
    onClose,
}: IFormProps) {
    const titleTable = "Hình thức thanh lý";
    const dataDefault = {
        maHT: '',
        tenHT: '',
        loaiTS: null,
    };
    const schema = object({
        maHT: string().trim().nullable().required('Mã hình thức không được để trống').max(20, 'Bạn nhập tối đa 20 ký tự'),
        tenHT: string().trim().nullable().required('Tên hình thức không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
        loaiTS: number().nullable(),
    });
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data, error, isLoading, mutate } = hinhThucThanhLyServices.GetById(id!);
    const { data: dataLoaiTSs } = hinhThucThanhLyServices.GetLoaiTS()
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        if (id) {
            try {
                await hinhThucThanhLyServices.update(id, values);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await hinhThucThanhLyServices.create(values);
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
                                        label='Mã hình thức'
                                        required={true}
                                        view={state?.viewMode}
                                        id='maHT'
                                        name='maHT'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetInput
                                        label='Tên hình thức'
                                        required={true}
                                        view={state?.viewMode}
                                        id='tenHT'
                                        name='tenHT'
                                    /></div>
                                <div className='col-span-12'>
                                    <TanetSelect
                                        label='Áp dụng loại tài sản'
                                        required={false}
                                        view={state?.viewMode}
                                        id='loaiTS'
                                        name='loaiTS'
                                        options={dataLoaiTSs}
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
