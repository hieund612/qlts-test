"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import {
    handleChangeAction,
    formatDateTime,
    delAction,
    listReducer,
    getPermisson,
    INITIAL_STATE_LIST,
    ACTION_TYPES,
} from "@/lib/common";
import { TanetInput, TanetSelectTreeCheck, TanetSelect, SelectAsync, TanetFormDate } from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { lichSuSapXepTaiSanServices } from "./services";
import {
    AiOutlinePlus,
    AiFillEdit,
    AiFillDelete,
    AiTwotoneEye,
} from "react-icons/ai";
import LichSuSapXepTaiSanForm from "./_components/lichsusapxeptaisan-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function Page() {
    const [meta, setMeta] = useState<any>({
        ...DefaultMeta,
    });
    const [permisson, setPermisson] = useState<any>({
        ...DefaulPer,
    });
    const titleTable = "Phương án đề xuất";
    const { data, isLoading, mutate } = lichSuSapXepTaiSanServices.GetList(meta);
    const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
    const { data: dataPhuongAnSapXeps } = lichSuSapXepTaiSanServices.GetPhuongAnSapXep()
    const actions = {
        meta,
    };
    const handleChange = (res: any) => {
        const newMeta = handleChangeAction(res, actions);
        if (newMeta) {
            setMeta({
                ...meta,
                newMeta,
            });
        }
    };
    const onClose = async (isRefresh: boolean) => {
        dispatch({ type: ACTION_TYPES.CLOSE });
        if (isRefresh) {
            await mutate();
        }
    };
    useEffect(() => {
        setPermisson(getPermisson("lichsusapxeptaisan"));
    }, []);
    return (
        <>
            <GridView title={'Danh sách ' + titleTable} handleChange={handleChange} loading={isLoading}>
                <GridView.Header
                    keySearch={meta.search}
                    meta={meta}
                    ActionBar={
                        permisson.per_Add && (
                            <button
                                className="btn-add"
                                onClick={() => dispatch({ type: ACTION_TYPES.ADD, Id: 0 })}
                            >
                                <AiOutlinePlus className="text-[20px]" /> Thêm mới
                            </button>
                        )
                    }
                    AdvanceFilter={
                        <>
                            <div className="">
                                <TanetSelect
                                    label='Phương án sắp xếp'
                                    id='phuongAnSapXepId'
                                    name='phuongAnSapXepId'
                                    options={dataPhuongAnSapXeps}
                                />
                            </div>
                        </>
                    }
                ></GridView.Header>
                <GridView.Table
                    className="col-12"
                    data={data?.data}
                    keyExtractor={({ item }) => {
                        return item.id;
                    }}
                    page={data?.currentPage}
                    page_size={data?.pageSize}
                    total={data?.totalRows}
                    noSelected={true}
                >
                    <GridView.Table.Column
                        style={{ width: "3%" }}
                        title="STT"
                        className="text-center"
                        body={({ index }) => (
                            <span>{index + 1 + (meta.page - 1) * meta.page_size}</span>
                        )}
                    />
                    <GridView.Table.Column style={{}} title="Phương án sắp xếp" sortKey="phuongAnSapXepId" body={({ item }) => (<span>{item.phuongAnSapXepId}</span>)} />
                    <GridView.Table.Column style={{}} title="Thao tác thực hiện" sortKey="thaoTacThucHien" body={({ item }) => (<span>{item.thaoTacThucHien}</span>)} />
                    <GridView.Table.Column style={{}} title="Trạng thái" sortKey="trangThai" body={({ item }) => (<span>{item.trangThai}</span>)} />
                    <GridView.Table.Column style={{}} title="Ngày tạo" sortKey="ngayTao" body={({ item }) => (<span>{formatDateTime(item.ngayTao)}</span>)} />
                    <GridView.Table.Column
                        style={{ width: "10%" }}
                        className="view-action"
                        title="Tác vụ"
                        body={({ item }) => (
                            <div className="flex flex-row">
                                {permisson.per_View && <AiTwotoneEye
                                    className="cursor-pointer text-lg mr-1 text-blue-800"
                                    title="Xem chi tiết"
                                    onClick={() => dispatch({ type: ACTION_TYPES.READ, Id: item.id })}
                                />}
                                {permisson.per_Edit && <AiFillEdit
                                    className="cursor-pointer text-lg mr-1 text-blue-800"
                                    title="Chỉnh sửa"
                                    onClick={() => dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })}
                                />}
                                {permisson.per_Delete && <AiFillDelete
                                    className="cursor-pointer text-lg mr-1 text-red-700"
                                    title="Xóa"
                                    onClick={() => delAction(item, lichSuSapXepTaiSanServices, data, setMeta, meta, mutate)}
                                />
                                }
                            </div>
                        )}
                    />
                </GridView.Table>
            </GridView>
            <LichSuSapXepTaiSanForm show={state.show} onClose={onClose} action={state.action} id={state.Id} />
            <ConfirmationDialog />
        </>
    );
}
