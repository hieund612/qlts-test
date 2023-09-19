"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TanetInput } from "@/lib/field-formik-custom";
import { Loading } from "../../shared/components/LoadingComponent";
import { AuthService } from "@/shared/services";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Page() {
    const router = useRouter();
    const { login, getOauth } = AuthService();
    const SignupSchema = Yup.object().shape({
        username: Yup.string()
            .min(2, "Tên đăng nhập tối thiểu 2 ký tự!")
            .max(70, "Tên đăng nhập tối đa 70 ký tự!")
            .required("Vui lòng nhập tên đăng nhập."),
        password: Yup.string().required("Vui lòng nhập mật khẩu."),
    });
    const initialValues = {
        username: "",
        password: "",
    };
    const [loading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        var auth = getOauth();
        if (auth) {
            router.push('/admin');
        }
    });
    const onSubmit = async (data: any) => {
        setIsLoading(true);
        if (await login(data)) {
            toast.success("Đăng nhập thành công");
            router.push('/admin');
        } else {
            setErrorMessage(
                "Tài khoản hoặc mật khẩu không chính xác, vui lòng kiểm tra lại."
            );
            setIsLoading(false);
        }
    };

    //const [passwordOff, setPasswordOff] = useState(false);

    //function onPasswordOff() {
    //    setPasswordOff((prevState) => !prevState);
    //}

    return (
        <>
            <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-min-size bg-gradient-to-b from-[#00524e] to-[#ffc62f]">
                <div className="w-96 mx-auto items-center justify-center px-8 py-8 rounded-lg bg-white">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="/logo-bidv.png"
                            alt="BIDV"
                        />
                        <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight">
                            Đăng nhập
                        </h2>
                        <p className="text-center text-sm text-red-500">{errorMessage}</p>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={SignupSchema}
                            onSubmit={onSubmit}
                        >
                            <Form className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium leading-6"
                                    >
                                        Tên đăng nhập
                                    </label>
                                    <div className="mt-2">
                                        <TanetInput
                                            label=""
                                            id="username"
                                            name="username"
                                            className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00524e] sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium leading-6"
                                        >
                                            Mật khẩu
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        {/*<button
                                            className="absolute pt-5 pl-64"
                                            onClick={onPasswordOff}
                                            type="button"
                                        >
                                            {passwordOff ? (
                                                <BsEyeSlashFill />
                                            ) : (
                                                <BsEyeFill />
                                            )}
                                        </button>*/}
                                        <TanetInput
                                            label=""
                                            id="password"
                                            name="password"
                                            type="password"
                                            className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00524e] sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00524e] bg-gradient-to-r from-[#00bfae] to-[#0066ad] hover:from-[#0066ad] hover:to-[#00bfae]"
                                    >
                                        Đăng nhập
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
            <Loading loading={loading} />
        </>
    );
}
