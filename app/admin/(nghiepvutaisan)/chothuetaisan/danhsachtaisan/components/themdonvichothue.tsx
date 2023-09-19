"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import {
    handleChangeAction,
    formatDateTime,
    formatCurrentcy,
    listReducer,
    getPermisson,
    INITIAL_STATE_LIST,
    ACTION_TYPES,
    formReducer,
    INITIAL_STATE_FORM,
} from "@/lib/common";
import {
    TanetDecimal,
    TanetInput,
    TanetLabel,
    TanetSelect,
    TanetFormDate,
    UploadFile,
} from "@/lib";
import { useReducer, useState, useEffect } from "react";

import {
    AiTwotoneEye,
    AiFillDollarCircle,
    AiFillPlusCircle,
} from "react-icons/ai";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import loading from "@/app/admin/loading";
import { Formik, Form } from "formik";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { donViChoThueServices } from '../../../../donvichothue/_services/services';
import { object, string } from "yup";

// export interface IListProps {
//   show: boolean;
// }
export default function ThemDonViChothue({ show, onClose, action, id }: IFormProps) {
    const [meta, setMeta] = useState<any>({
        ...DefaultMeta,
    });
    const [permisson, setPermisson] = useState<any>({
        ...DefaulPer,
    });
    const dataDefault = {
        tenDVThue: "",
        maSoDN: "",
        nguoiDaiDien: "",

    };
    const actions = {
        meta,
    };
    const schema = object({
        tenDVThue: string().trim().nullable().required('Tên đơn vị thuê không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
        maSoDN: string().trim().nullable().required('Mã số doanh nghiệp không được để trống').max(20, 'Bạn nhập tối đa 20 ký tự'),
        nguoiDaiDien: string().trim().nullable().required('Người đại diện không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
    });
    const [loading, setLoading] = useState(false);
    const [newDataDefault, setnewDataDefault] = useState(dataDefault);
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);

    useEffect(() => {

    }, [action]);

    const onSubmit = async (values: any) => {
        try {
            await donViChoThueServices.createwithfile(values, 'DonViChoThueCreateDto', []);
            toast.success("Thêm thành công");
            await onClose(true);
        } catch (err: any) {
            toast.error("Thêm mới không thành công");
        }
    };

    return (
        <>
            <Modal show={show} size="md" loading={loading}>
                <Formik
                    onSubmit={(values) => {
                        onSubmit(values);
                    }}
                    validationSchema={schema}
                    initialValues={newDataDefault}
                    enableReinitialize={true}
                >
                    {({ handleSubmit, setFieldValue, values }) => (
                        <Form
                            noValidate
                            onSubmit={handleSubmit}
                            onKeyPress={(ev) => {
                                ev.stopPropagation();
                            }}
                        >
                            <Modal.Header onClose={onClose}>
                                Thêm mới đơn vị thuê
                            </Modal.Header>
                            <Modal.Body nameClass="grid-cols-12 items-center">

                                <div className="col-span-3">
                                    <TanetLabel
                                        label="Tên đơn vị thuê"
                                        required={true}
                                    />
                                </div>
                                <div className="col-span-9">
                                    <TanetInput
                                        label=""
                                        required={true}
                                        view={false}
                                        id="tenDVThue"
                                        name="tenDVThue"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <TanetLabel
                                        label="Mã số doanh nghiệp"
                                        required={true}
                                    />
                                </div>
                                <div className="col-span-9">
                                    <TanetInput
                                        label=""
                                        required={true}
                                        view={false}
                                        id="maSoDN"
                                        name="maSoDN"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <TanetLabel
                                        label="Người đại diện"
                                        required={true}
                                    />
                                </div>
                                <div className="col-span-9">
                                    <TanetInput
                                        label=""
                                        required={true}
                                        view={false}
                                        id="nguoiDaiDien"
                                        name="nguoiDaiDien"
                                    />
                                </div>
                            </Modal.Body>
                            <Modal.Footer onClose={onClose}>
                                <>
                                    <button
                                        data-modal-hide="large-modal"
                                        type="submit"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Lưu
                                    </button>
                                </>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>

        </>
    );
}
