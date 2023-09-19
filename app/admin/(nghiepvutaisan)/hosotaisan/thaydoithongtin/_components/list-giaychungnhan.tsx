"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import {
  handleChangeAction,
  formatDateTime,
  formatCurrentcy,
  delAction,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
} from "@/lib/common";
import {
  TanetInput,
  TanetSelect,
  TanetLabel
} from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { hoSoTaiSanServices } from "../services";
import {
  AiOutlineSearch,
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
  AiFillDollarCircle,
} from "react-icons/ai";
import HoSoTaiSanChangeForm from "./hosotaisan-change-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export interface IListTSProps {
  onChange: (isRefresh: boolean,) => void;
}
export default function ListGiayChungNhan({onChange}:IListTSProps) {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Danh mục tài sản";
  const { data, isLoading, mutate } = hoSoTaiSanServices.GetListDanhSachGCN(meta);
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
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
      onChange(isRefresh);
    }
  };
  useEffect(() => {
    setPermisson(getPermisson("hosotaisan"));

  }, []);
  const renderFileAttach = (files: any) => {

    if (files) {
      return (
        <ul>
          {files.map((item: any, index: any) => (
            <li key={index}><a className="underline text-blue-600" onClick={() => hoSoTaiSanServices.onDownloadFile(item.url)}>{item.title}</a></li>
          ))}
        </ul>
      );
    }
    return null;
  }
  return (
    <>
      <GridView handleChange={handleChange} loading={isLoading}>
        <GridView.Header
          keySearch={meta.search}
          meta={meta}

          isNotFixAdvanceFilter={true}
          AdvanceFilter={
            <>
              <div className="grid gap-2">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-2">
                    <TanetLabel
                      label='Số giấy phát hành GCN'
                    /></div>
                  <div className="col-span-2">
                    <TanetInput
                      id='soPhatHanhGCN1'
                      name='soPhatHanhGCN1'
                    />
                  </div>
                  <div className="col-span-2">
                    <TanetInput
                      id='soPhatHanhGCN2'
                      name='soPhatHanhGCN2'
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-2">
                    <TanetLabel
                      label='Người sử dụng đất'
                    /></div>
                  <div className="col-span-10">
                    <TanetInput
                      id='nguoiSuDungSoHuu'
                      name='nguoiSuDungSoHuu'
                    />
                  </div>
                </div>
                <div className="text-center">
                  <button
                    data-modal-hide="large-modal"
                    type="submit"
                    className="text-white bg-lemonyellow hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                  >
                    <AiOutlineSearch className="text-[20px] inline" />
                    Tìm kiếm
                  </button>
                </div>
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
          <GridView.Table.Column style={{}} title="Số hồ sơ" sortKey="soPhatHanhGCN" body={({ item }) => (<a title="Thay đổi thông tin" className="text-blue-800 cursor-pointer" onClick={() => dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })}>{item.soPhatHanhGCN}</a>)} />
          <GridView.Table.Column style={{}} title="Ngày phát hành" sortKey="ngayPhatHanh" body={({ item }) => (<span>{formatDateTime(item.ngayPhatHanh)}</span>)} />
          <GridView.Table.Column style={{}} title="Người sử dụng đất, chủ sở hữu nhà" sortKey="nguoiSuDungSoHuu" body={({ item }) => (<span>{item.nguoiSuDungSoHuu}</span>)} />
          <GridView.Table.Column style={{}} title="File đính kèm" body={({ item }) => renderFileAttach(item.lstFileDinhKem)} />
          <GridView.Table.Column
            style={{ width: "7%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                {permisson.per_View && <AiTwotoneEye
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Xem chi tiết"
                  onClick={() => dispatch({ type: ACTION_TYPES.READ, Id: item.id })}
                />}
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      <HoSoTaiSanChangeForm show={state.show} onClose={onClose} action={state.action} id={state.Id} />
      <ConfirmationDialog />
    </>
  );
}
