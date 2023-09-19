"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaulPer, DefaultMeta } from "@/public/app-setting";
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
import { suaChuaBaoDuongServices } from "../services";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
} from "react-icons/ai";
import SuaChuaBaoDuongForm from "./suachuabaoduong-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function ListSuaChuaBaoDuong() {
 
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Sửa chữa bảo dưỡng";
  const { data, isLoading, mutate } = suaChuaBaoDuongServices.GetList(meta);
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
    }
  };

  useEffect(() => {
    setPermisson(getPermisson("suachuabaoduong"));
  }, []);

  
  return (
    <>
      <GridView title={''} handleChange={handleChange} loading={isLoading}>
        <GridView.Header
          keySearch={meta.search}
          meta={meta}
          ActionBar={
            <></>
            // permisson.per_Add && (
            //   <button
            //     className="btn-add"
            //     onClick={() => dispatch({ type: ACTION_TYPES.ADD, Id: 0 })}
            //   >
            //     <AiOutlinePlus className="text-[20px]" /> Thêm mới
            //   </button>
            // )
          }
          AdvanceFilter={
            <>
              <div className="">
                <TanetInput
                  label='Số thẻ tài sản'
                  id='soTheTaiSan'
                  name='soTheTaiSan'
                />
              </div>
              <div className="col-span-2">
                <TanetInput
                  label='Tên tài sản'
                  id='tenTaiSan'
                  name='tenTaiSan'
                />
              </div>
              <div className="">
                <TanetFormDate
                  label='Thời gian bảo dưỡng từ ngày'
                  dateFormat='dd/MM/yyyy'
                  id='thoiGianBaoDuongFrom'
                  name='thoiGianBaoDuongFrom'                  
                />
              </div>
              <div className="">
                <TanetFormDate
                  label='Thời gian bảo dưỡng đến ngày'
                  dateFormat='dd/MM/yyyy'
                  id='thoiGianBaoDuongTo'
                  name='thoiGianBaoDuongTo'
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
          <GridView.Table.Column style={{}} title="Số thẻ tài sản" sortKey="soTheTaiSan" body={({ item }) => (<span>{item.soTheTaiSan}</span>)} />
          <GridView.Table.Column style={{}} title="Tên tài sản" sortKey="tenTaiSan" body={({ item }) => (<span>{item.tenTaiSan}</span>)} />
          <GridView.Table.Column style={{}} title="Nhóm tài sản"  body={({ item }) => (<span>{item.nhomTaiSan}</span>)} />
          <GridView.Table.Column style={{}} title="Thời gian bảo dưỡng" sortKey="thoiGianBaoDuong" body={({ item }) => (<span>{formatDateTime(item.thoiGianBaoDuong)}</span>)} />
          <GridView.Table.Column style={{}} title="Số tiền bảo dưỡng" sortKey="soTienBaoDuong" body={({ item }) => (<span>{item.soTienBaoDuong}</span>)} />
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
                  onClick={() => delAction(item, suaChuaBaoDuongServices, data, setMeta, meta, mutate)}
                />
                }
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      <SuaChuaBaoDuongForm show={state.show} onClose={onClose} action={state.action} id={state.Id} />
      <ConfirmationDialog />
    </>
  );
}
