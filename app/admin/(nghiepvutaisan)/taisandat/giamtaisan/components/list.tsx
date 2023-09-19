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
  TanetSelectTreeCheck,
  TanetSelect,
  SelectAsync,
  TanetFormDate,
} from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { taiSanDatServices } from "../../services";
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
  const titleTable = "Điều chỉnh thông tin tài chính";
  const { data, isLoading, mutate } = taiSanDatServices.GetList(meta, 4);
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const { data: dataNhomTaiSans } = taiSanDatServices.GetNhomTaiSan();
  const { data: dataMaNguonGocs } = taiSanDatServices.GetMaNguonGoc();
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
    setPermisson(getPermisson("astaisan"));
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
                <TanetSelect
                  label="Mã/Tên nhóm tài sản"
                  id="nhomTaiSanId"
                  name="nhomTaiSanId"
                  options={dataNhomTaiSans}
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
                  label="Nguồn gốc sử dụng đất"
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
            title="Số thẻ tài sản"
            sortKey="soTheTaiSan"
            body={({ item }) => <span>{item.soTheTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Tên tài sản"
            sortKey="tenTaiSan"
            body={({ item }) => <span>{item.tenTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Lý do giảm"
            sortKey="teNhomTaiSan"
            body={({ item }) => <span>{item.teNhomTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Ngày biến động"
            sortKey="ngayBienDong"
            body={({ item }) => (
              <span>{formatDateTime(item.ngayBienDong)}</span>
            )}
          />
          <GridView.Table.Column
            style={{}}
            title="Nguyên giá"
            sortKey="nguyenGia"
            body={({ item }) => <span>{formatCurrentcy(item.nguyenGia)}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Trạng thái"
            sortKey="tenTrangThai"
            body={({ item }) => <span>{item.tenTrangThai}</span>}
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
                        taiSanDatServices,
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
        onSetTab={function (isSetTab: number): void {
          throw new Error("Function not implemented.");
        }}
      />
      <ConfirmationDialog />
    </>
  );
}
