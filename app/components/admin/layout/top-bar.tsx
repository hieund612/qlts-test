"use client";
import { useState, useEffect, Fragment } from "react";
import {
    AiFillBell,
    AiFillCheckCircle,
    AiOutlineMenu,
    AiFillEdit,
    AiFillCaretDown,
    AiFillInteraction,
    AiOutlineLogout,
    AiFillInfoCircle,
} from "react-icons/ai";
import { Menu, Transition, Popover } from "@headlessui/react";
import Link from "next/link";
import { AuthService } from "@/shared/services";
import { useRouter } from "next/navigation";
import SideBar from "./side-bar";
import UserForm from "@/app/admin/(quantrihethong)/users/_components/user-form";
import ResetPassword from "@/app/admin/(quantrihethong)/users/_components/user-reset-password";
import { notificationServices } from "@/app/admin/(tienich)/notification/services";
import dynamic from 'next/dynamic';

export default function TopBar({
    showNav,
    setShowNav,
}: {
    showNav: boolean;
    setShowNav: any;
}) {
    const { setLogout, getOauth } = AuthService();
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const { data } = notificationServices.GetSoLuongThongBao();
    useEffect(() => {
        var auth = getOauth();
        if (auth) {
            console.log(auth);
            setUserName(auth.fullName);
            setUserId(auth.idTaiKhoan);
        }
    }, []);
    const router = useRouter();
    const logOut = () => {
        setLogout();
        router.push("/admin");
    };

    const [edit, setEdit] = useState(false);
    const [view, setView] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div
                className={`fixed w-full z-40 h-12 bg-white flex justify-between items-center transition-all duration-[450ms] ${showNav ? "pl-56" : ""
                    }`}
            >
                <div className="pl-2 md:pl-4">
                    <AiOutlineMenu
                        className="text-[26px] text-slate-500 cursor-pointer"
                        onClick={() => setShowNav(!showNav)}
                    />
                </div>
                <div className="uppercase text-xl font-bold text-turquoise-400">
                    Phần mềm quản lý tài sản bất động sản
                </div>
                <div className="flex items-center pr-4 md:pr-4">
                    <Popover className="relative">
                        <Popover.Button style={{ position: 'relative' }} onClick={() => { window.location.href = "/admin/thongbao" }} className="outline-none mr-5 md:mr-8 cursor-pointer text-slate-500">
                            <AiFillBell className="h-6 w-6" />
                            {data && <span id="bell-head">{data}</span>}
                        </Popover.Button>
                        {/* <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform scale-95"
                            enterTo="transform scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform scale-100"
                            leaveTo="transform scale-95"
                        >
                            <Popover.Panel className="absolute -right-16 sm:right-4 z-50 mt-2 bg-white shadow-sm rounded max-w-xs sm:max-w-sm w-screen">
                                <div className="relative p-3">
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-gray-700 font-medium">Notification</p>
                                        <a className="text-sm text-orange-500" href="#">
                                            Mark all as read
                                        </a>
                                    </div>

                                    <div className="mt-4 grid gap-4 grid-cols-1 overflow-hidden">
                                        <div className="flex">
                                            <div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
                                                <AiFillCheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="font-medium text-gray-700">
                                                    Notification Title
                                                </p>
                                                <p className="text-sm text-gray-700 truncate">
                                                    Test Notification texxt for design
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
                                                <AiFillCheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="font-medium text-gray-700">
                                                    Notification Title
                                                </p>
                                                <p className="text-sm text-gray-700 truncate">
                                                    Test Notification texxt for design
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition> */}
                    </Popover>
                    <Menu
                        as="div"
                        className="relative inline-block text-left text-slate-500"
                    >
                        <div>
                            <Menu.Button className="inline-flex w-full justify-center items-center">
                                <picture>
                                    <img
                                        src="/user.jpg"
                                        className="rounded-full h-8 w-8 md:mr-4 border-2 border-white shadow-sm"
                                        alt="profile picture"
                                    />
                                </picture>
                                <span className="hidden md:block font-medium ">{userName}</span>
                                <AiFillCaretDown className="ml-2 h-4 w-4" />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform scale-95"
                            enterTo="transform scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform scale-100"
                            leaveTo="transform scale-95"
                        >
                            <Menu.Items className="absolute right-0 w-56 z-50 mt-2 origin-top-right bg-white rounded shadow-sm">
                                <div className="p-1">
                                    <Menu.Item>
                                        <a
                                            onClick={() => setView(true)}
                                            className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-color items-center"
                                        >
                                            <button className="flex flex-row">
                                                <AiFillInfoCircle className="h-4 w-4 mr-2" />
                                                Xem thông tin
                                            </button>
                                        </a>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <a
                                            onClick={() => setEdit(true)}
                                            className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-color items-center"
                                        >
                                            <button className="flex flex-row">
                                                <AiFillEdit className="h-4 w-4 mr-2" />
                                                Sửa thông tin
                                            </button>
                                        </a>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <a
                                            onClick={() => setChangePassword(true)}
                                            className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-color items-center"
                                        >
                                            <button className="flex flex-row">
                                                <AiFillInteraction className="h-4 w-4 mr-2" />
                                                Đổi mật khẩu
                                            </button>
                                        </a>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Link
                                            href="#"
                                            className="flex border-t-2 border-dashed border-sky-400 hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-color items-center"
                                            onClick={() => logOut()}
                                        >
                                            <AiOutlineLogout className="h-4 w-4 mr-2" />
                                            Đăng xuất
                                        </Link>
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
                <UserForm show={view} onClose={() => setView(false)} action="read" id={userId} />
                <UserForm show={edit} onClose={() => setEdit(false)} action="edit" id={userId} />
                <ResetPassword
                    show={changePassword}
                    onClose={() => setChangePassword(false)}
                    username={userName}
                />
            </div>
            <Transition
                show={showNav}
                enter="transition ease-in-out duration-400 transform"
                enterFrom="-translate-x-full"
                enterTo=""
                leave="transition ease-in-out duration-400 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
            >
                <SideBar />
            </Transition>
        </>
    );
}
