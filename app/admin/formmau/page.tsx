"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import { handleChangeAction, formatDateTime, delAction, listReducer,getPermisson, INITIAL_STATE_LIST, ACTION_TYPES } from "@/lib/common";
import { TanetInput, TanetSelectTreeCheck, TanetSelect, SelectAsync, TanetFormDate } from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { formMauServices } from "./services";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
} from "react-icons/ai";
import FormMauForm from "./components/formmau-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Bảng mẫu";
  const { data, isLoading, mutate } = formMauServices.GetList(meta);
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
    setPermisson(getPermisson("formmau"));
  }, []);
  return (
    <>
      <GridView title={'Danh sách ' + titleTable} handleChange={handleChange} loading={isLoading}>
        <GridView.Header
          keySearch={meta.search}
          meta={meta}
          ActionBar={
            permisson.per_Add && <button
              className="btn-add"
              onClick={() => dispatch({ type: ACTION_TYPES.ADD, Id: 0 })}
            >
              <AiOutlinePlus className="text-[20px]" /> Thêm mới
            </button>
          }
          AdvanceFilter={
            <>
              <div className="">
                <TanetInput
                  label='Tiêu đề'
                  id='tieuDe'
                  name='tieuDe'
                />
              </div>
              <div className="">
                <TanetFormDate
                  label='Ngày sinh từ ngày'
                  dateFormat='dd/MM/yyyy'
                  formatOutput='yyyy-MM-dd'
                  id='ngaySinhFrom'
                  name='ngaySinhFrom'
                />
              </div>
              <div className="">
                <TanetFormDate
                  label='Ngày sinh đến ngày'
                  dateFormat='dd/MM/yyyy'
                  formatOutput='yyyy-MM-dd'
                  id='ngaySinhTo'
                  name='ngaySinhTo'
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
          <GridView.Table.Column style={{}} title="Tiêu đề" sortKey="tieuDe" body={({ item }) => (<span>{item.tieuDe}</span>)} />
          <GridView.Table.Column style={{}} title="Điểm số" sortKey="diem" body={({ item }) => (<span>{item.diem}</span>)} />
          <GridView.Table.Column style={{}} title="Ngày sinh" sortKey="ngaySinh" body={({ item }) => (<span>{formatDateTime(item.ngaySinh)}</span>)} />
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
                  onClick={() => delAction(item, formMauServices, data, setMeta, meta, mutate)}
                />
                }
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      <FormMauForm show={state.show} onClose={onClose} action={state.action} id={state.Id} />
      <ConfirmationDialog />
    </>
  );
}
