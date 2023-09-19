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
} from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { asTaiSanServices } from "../../danhsachtaisan/services";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
  AiFillDollarCircle,
} from "react-icons/ai";
import SuaChuaBaoDuongForm from "./suachuabaoduong-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export interface IListTSProps {
  onChange: (isRefresh: boolean,) => void;
}
export default function ListTaiSan({onChange}:IListTSProps) {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Danh mục tài sản";
  const [showDcTaiChinh, setShowDcTaiChinh] = useState(false);
  const [taiSanId, setTaiSanId] = useState(null);
  const { data, isLoading, mutate } = asTaiSanServices.GetList(meta);
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const { data: dataNhomTaiSans } = asTaiSanServices.GetNhomTaiSan();
  const { data: dataMaNguonGocs } = asTaiSanServices.GetMaNguonGoc();
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
    setPermisson(getPermisson("astaisan"));
  }, []);
  const actDcTaiChinh = (data: any) => {
    setShowDcTaiChinh(true);
    setTaiSanId(data.id);
  };
  const onCloseDcTaiChinh = () => {
    setShowDcTaiChinh(false);
    setTaiSanId(null);
  };
  return (
    <>
      <GridView
        title=""
        handleChange={handleChange}
        loading={isLoading}
      >
        <GridView.Header
          keySearch={meta.search}
          meta={meta}
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
            body={({ item }) => (<a title="" className="text-blue-800 cursor-pointer" onClick={() => dispatch({ type: ACTION_TYPES.ADD, Id: item.id })}>{item.soTheTaiSan}</a>)}
          />
          <GridView.Table.Column
            style={{}}
            title="Tên tài sản"
            sortKey="tenTaiSan"
            body={({ item }) => <span>{item.tenTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Nhóm tài sản"
            sortKey="teNhomTaiSan"
            body={({ item }) => <span>{item.teNhomTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Ngày đưa vào sử dụng"
            sortKey="ngaySuDung"
            body={({ item }) => <span>{formatDateTime(item.ngaySuDung)}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Nguyên giá"
            sortKey="nguyenGia"
            body={({ item }) => <span>{formatCurrentcy(item.nguyenGia)}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Phòng ban quản lý"
            sortKey="tenPhongBanQuanLy"
            body={({ item }) => <span>{item.tenPhongBanQuanLy}</span>}
          />                   
        </GridView.Table>
      </GridView>
      <SuaChuaBaoDuongForm show={state.show} onClose={onClose} action={state.action} customId={state.Id} id={null} />
      <ConfirmationDialog />
    </>
  );
}
