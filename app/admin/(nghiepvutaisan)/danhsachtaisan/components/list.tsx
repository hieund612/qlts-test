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
import { asTaiSanServices } from "../services";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
  AiFillDollarCircle,
  AiFillExclamationCircle,
  AiOutlineDownCircle,
} from "react-icons/ai";
import DatTaiChinhForm from "../../taisandat/dieuchinhthongtintaichinh/components/addoredit";
import DatPhiTaiChinhForm from "../../taisandat/dieuchinhthongtinphitaichinh/components/addoredit";
import DatGiamTaiSanForm from "../../taisandat/giamtaisan/components/addoredit";

import NhaTaiChinhForm from "../../taisannha/dieuchinhthongtintaichinh/components/addoredit";
import NhaPhiTaiChinhForm from "../../taisannha/dieuchinhthongtinphitaichinh/components/addoredit";
//import NhaGiamTaiSanForm from "../../taisannha/giamtaisan/components/addoredit";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function List({
  loaiTaiSanGoc,
  loaiBienDong,
  setOpenTab,
}: {
  loaiTaiSanGoc: number;
  loaiBienDong: number;
  setOpenTab: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = " tài sản";
  const [showDcTaiChinh, setShowDcTaiChinh] = useState(false);
  const [showDcPhiTaiChinh, setShowDcPhiTaiChinh] = useState(false);
  const [showGiamTaiSan, setShowGiamTaiSan] = useState(false);
  const [taiSanId, setTaiSanId] = useState(null);
  const { data, isLoading, mutate } = asTaiSanServices.GetList(
    meta,
    loaiTaiSanGoc
  );
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const { data: dataNhomTaiSans } = asTaiSanServices.GetNhomTaiSan();
  const { data: dataMaNguonGocs } = asTaiSanServices.GetMaNguonGoc();
  const actions = {
    meta,
  };
  const handleChange = (res: any) => {
    const newMeta = handleChangeAction(res, actions, null);
    setOpenTab && setOpenTab(1);
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
  const actDcTaiChinh = (data: any) => {
    setShowDcTaiChinh(true);
    setTaiSanId(data.id);
  };
  const onCloseDcTaiChinh = () => {
    setShowDcTaiChinh(false);
    setTaiSanId(null);
  };
  const actDcPhiTaiChinh = (data: any) => {
    setShowDcPhiTaiChinh(true);
    setTaiSanId(data.id);
  };
  const onCloseDcPhiTaiChinh = () => {
    setShowDcPhiTaiChinh(false);
    setTaiSanId(null);
  };

  const actGiamTaiSan = (data: any) => {
    setShowGiamTaiSan(true);
    setTaiSanId(data.id);
  };
  const onCloseGiamTaiSan = () => {
    setShowGiamTaiSan(false);
    setTaiSanId(null);
  };
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
            title="Phòng ban quản lý"
            sortKey="tenPhongBanQuanLy"
            body={({ item }) => <span>{item.tenPhongBanQuanLy}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Nguyên giá"
            sortKey="nguyenGia"
            body={({ item }) => <span>{formatCurrentcy(item.nguyenGia)}</span>}
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
                {permisson.per_Edit && loaiBienDong === 2 && (
                  <AiFillDollarCircle
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Điều chỉnh thông tin tài chính"
                    onClick={() => actDcTaiChinh(item)}
                  />
                )}
                {permisson.per_Edit && loaiBienDong === 3 && (
                  <AiFillExclamationCircle
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Điều chỉnh thông tin phi tài chính"
                    onClick={() => actDcPhiTaiChinh(item)}
                  />
                )}
                {permisson.per_Edit && loaiBienDong === 4 && (
                  <AiOutlineDownCircle
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Giảm tài sản"
                    onClick={() => actGiamTaiSan(item)}
                  />
                )}
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      {showDcTaiChinh && loaiTaiSanGoc == 1 && loaiBienDong === 2 && (
        <DatTaiChinhForm
          show={showDcTaiChinh}
          onClose={onCloseDcTaiChinh}
          onSetTab={setOpenTab}
          action="dieuchinhtaichinh"
          id={null}
          customId={taiSanId}
        />
      )}
      {showDcPhiTaiChinh && loaiTaiSanGoc == 1 && loaiBienDong === 3 && (
        <DatPhiTaiChinhForm
          show={showDcPhiTaiChinh}
          onClose={onCloseDcPhiTaiChinh}
          onSetTab={setOpenTab}
          action="dieuchinhphitaichinh"
          id={null}
          customId={taiSanId}
        />
      )}
      {showGiamTaiSan && loaiTaiSanGoc == 1 && loaiBienDong === 4 && (
        <DatGiamTaiSanForm
          show={showGiamTaiSan}
          onClose={onCloseGiamTaiSan}
          onSetTab={setOpenTab}
          action="giamtaisan"
          id={null}
          customId={taiSanId}
        />
      )}

      {showDcTaiChinh && loaiTaiSanGoc == 2 && loaiBienDong === 2 && (
        <NhaTaiChinhForm
          show={showDcTaiChinh}
          onClose={onCloseDcTaiChinh}
          onSetTab={setOpenTab}
          action="dieuchinhtaichinh"
          id={null}
          customId={taiSanId}
        />
      )}
      {showDcPhiTaiChinh && loaiTaiSanGoc == 2 && loaiBienDong === 3 && (
        <NhaPhiTaiChinhForm
          show={showDcPhiTaiChinh}
          onClose={onCloseDcPhiTaiChinh}
          onSetTab={setOpenTab}
          action="dieuchinhphitaichinh"
          id={null}
          customId={taiSanId}
        />
      )}
      {/* {showGiamTaiSan && loaiTaiSanGoc == 2 && loaiBienDong === 4 && (
        <DatGiamTaiSanForm
          show={showGiamTaiSan}
          onClose={onCloseGiamTaiSan}
          onSetTab={setOpenTab}
          action="giamtaisan"
          id={null}
          customId={taiSanId}
        />
      )} */}
      <ConfirmationDialog />
    </>
  );
}
