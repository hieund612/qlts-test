"use client";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput } from "@/lib";
import { useState } from "react";
import { object, ref, string } from "yup";
import { userServices } from "../services";
interface IResetPasswordProps {
    show: boolean;
    username?: string | null;
    onClose: (isRefresh: boolean) => void;
}
export default function ResetPassword({
    show,
    username,
    onClose,
}: IResetPasswordProps) {
    const defaultUser = {
        username: "",
        oldPassword: "",
        newPassword: "",
        repassword: "",
    };
    const schema = object({
        oldPassword: string()
            .trim()
            .required("Bạn chưa nhập mật khẩu cũ"),
        newPassword: string()
            .trim()
            .required("Bạn phải nhập mật khẩu mới")
            .min(6, "Bạn nhập tối thiểu 6 ký tự")
            .max(30, "Bạn nhập tối đa 30 ký tự")
            .matches(
                /(?=^.{6,30}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                "Mật khẩu phải có ít nhất một chữ cái, một chữ hoa, một chữ số, một ký tự đặc biệt"
            ),
        repassword: string()
            .trim()
            .required("Bạn chưa nhập lại mật khẩu")
            .oneOf([ref("newPassword"), ""], "Mật khẩu nhập lại không đúng"),
    });
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);

        try {
            await userServices.ResetPassword({
                username: username,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                repassword: values.repassword,
            });

            setLoading(false);

            toast.success("Đổi mật khẩu thành công!");

            await onClose(false);
        } catch (error: any) {
            setLoading(false);
            toast.error("Mật khẩu hiện tại chưa chính xác!");
            await onClose(false);
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
                    initialValues={defaultUser}
                    enableReinitialize={true}
                >
                    <Form>
                        <Modal.Header onClose={onClose}>Reset mật khẩu</Modal.Header>
                        <Modal.Body>
                            <div className="">
                                <TanetInput
                                    label="Nhập mật khẩu cũ"
                                    required={true}
                                    id="oldPassword"
                                    name="oldPassword"
                                    type="password"
                                />
                            </div>
                            <div className="">
                                <TanetInput
                                    label="Nhập mật khẩu mới"
                                    required={true}
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                />
                            </div>
                            <div className="">
                                <TanetInput
                                    label="Nhập lại mật khẩu mới"
                                    required={true}
                                    id="repassword"
                                    name="repassword"
                                    type="password"
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer onClose={onClose}>
                            <>
                                <button
                                    data-modal-hide="large-modal"
                                    type="submit"
                                    className="btn-submit"
                                >
                                    Lưu
                                </button>
                            </>
                        </Modal.Footer>
                    </Form>
                </Formik>
            </Modal>
        </>
    );
}
