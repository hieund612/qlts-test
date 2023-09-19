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
import {
  TanetInput,
  TanetSelectTreeCheck,
  TanetSelect,
  SelectAsync,
  TanetFormDate,
} from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { taiSanNhaServices } from "../../services";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
} from "react-icons/ai";
import AddOrEdit from "./addoredit";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function List() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Biến động tài sản nhà";
  const { data, isLoading, mutate } = taiSanNhaServices.GetList(meta, 1);
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const { data: dataMaNguonGocs } = taiSanNhaServices.GetMaNguonGoc();
  const actions = {
    meta,
  };
  const handleChange = (res: any) => {
    const newMeta = handleChangeAction(res, actions, null);
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
    setPermisson(getPermisson("hinha"));
  }, []);
  return (
    <>
      <GridView
        title={"Danh sách " + titleTable}
        handleChange={handleChange}
        loading={isLoading}
      >
        <GridView.Header
          keySearch={meta.search}
          meta={meta}
          ActionBar={null}
          AdvanceFilter={
            <>
              <div className="">
                <TanetInput
                  label="Số thẻ/Tên tài sản"
                  id="soTheTaiSan"
                  name="soTheTaiSan"
                />
              </div>
              <div className="">
                <TanetInput
                  label="Số thẻ/Tên tài sản"
                  id="tenTaiSan"
                  name="tenTaiSan"
                />
              </div>
              <div className="">
                <TanetInput
                  label="Mã/Tên nhóm tài sản"
                  type="number"
                  id="nhomTaiSanId"
                  name="nhomTaiSanId"
                />
              </div>
              <div className="">
                <TanetInput
                  label="Mã/Tên nhóm tài sản"
                  id="maNhomTaiSan"
                  name="maNhomTaiSan"
                />
              </div>
              <div className="">
                <TanetSelect
                  label="Lý do tăng"
                  id="maNguonGoc"
                  name="maNguonGoc"
                  options={dataMaNguonGocs}
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
          <GridView.Table.Column
            style={{}}
            title="Số thẻ/Tên tài sản"
            sortKey="soTheTaiSan"
            body={({ item }) => <span>{item.soTheTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Số thẻ/Tên tài sản"
            sortKey="tenTaiSan"
            body={({ item }) => <span>{item.tenTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Mã/Tên nhóm tài sản"
            sortKey="maNhomTaiSan"
            body={({ item }) => <span>{item.maNhomTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Ngày nhập tài sản"
            sortKey="ngayNhapThongTin"
            body={({ item }) => (
              <span>{formatDateTime(item.ngayNhapThongTin)}</span>
            )}
          />
          <GridView.Table.Column
            style={{}}
            title="Ngày đưa vào sử dụng"
            sortKey="ngaySuDung"
            body={({ item }) => <span>{formatDateTime(item.ngaySuDung)}</span>}
          />
          <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                {permisson.per_View && (
                  <AiTwotoneEye
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Xem chi tiết"
                    onClick={() =>
                      dispatch({ type: ACTION_TYPES.READ, Id: item.id })
                    }
                  />
                )}
                {permisson.per_Edit && (
                  <AiFillEdit
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Chỉnh sửa"
                    onClick={() =>
                      dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })
                    }
                  />
                )}
                {permisson.per_Delete && (
                  <AiFillDelete
                    className="cursor-pointer text-lg mr-1 text-red-700"
                    title="Xóa"
                    onClick={() =>
                      delAction(
                        item,
                        taiSanNhaServices,
                        data,
                        setMeta,
                        meta,
                        mutate
                      )
                    }
                  />
                )}
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      <AddOrEdit
        show={state.show}
        onClose={onClose}
        action={state.action}
        id={state.Id}
      />
      <ConfirmationDialog />
    </>
  );
}
