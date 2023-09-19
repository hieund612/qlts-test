"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer, ApiUrl } from "@/public/app-setting";
import {
  handleChangeAction,
  formatDateTime,
  delAction,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
} from "@/lib/common";
import { AiOutlineSearch } from "react-icons/ai";
import { BsListCheck } from "react-icons/bs";
import { TanetInput, TanetLabel, TanetSelect, TanetFormDate } from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { hoSoTaiSanServices } from "./services";
import {
  AiOutlineInfoCircle,
  AiTwotoneEye,
} from "react-icons/ai";
import HoSoTaiSanForm from "./_components/hosotaisan-form";
import PheDuyetHoSoTaiSan from "./_components/pheduyet";
import ListTaiSanForm from "./_components/listasset-form";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const [showAs, setShowAs] = useState(false);
  const [showAprove, setShowAprove] = useState(false);
  const [hoSoTaiSanId, setHoSoTaiSanId] = useState(null);
  const { data, isLoading, mutate } = hoSoTaiSanServices.GetList(meta);
  const { data: dataLoaiHoSos } = hoSoTaiSanServices.GetLoaiHoSo();
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const actions = {
    meta,
  };
  const dataTinhTrangs = [
    { value: 1, label: 'Tạo mới' },
    { value: 2, label: 'Chờ duyệt' },
    { value: 3, label: 'Phê duyệt' },
    { value: 4, label: 'Từ chối' },
  ]
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
  const actViewApproved = (data: any) => {
    setShowAprove(true);
    setHoSoTaiSanId(data.hoSoTaiSanId);
  }
  const onCloseApprove = () => {
    setShowAprove(false);
    setHoSoTaiSanId(null);
  };
  const onCloseAs = () => {
    setShowAs(false);
    setHoSoTaiSanId(null);
  };
  return (
    <>
      <GridView title="Danh sách hồ sơ" handleChange={handleChange} loading={isLoading}>
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
                      label='Loại hồ sơ'
                    /></div>
                  <div className="col-span-4">
                    <TanetSelect
                      id='loaiHoSoId'
                      name='loaiHoSoId'
                      options={dataLoaiHoSos}
                      placeholder="Chọn"
                    />
                  </div>
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
                      label='Số hồ sơ'
                    /></div>
                  <div className="col-span-4">
                    <TanetInput
                      id='soPhatHanhGCN'
                      name='soPhatHanhGCN'
                    />
                  </div>
                  <div className="col-span-2">
                    <TanetLabel
                      label='Ngày phát hành'
                    /></div>
                  <div className="col-span-2">

                    <TanetFormDate
                      required={true}
                      dateFormat='dd/MM/yyyy'
                      id='ngayPhatHanhFrom'
                      name='ngayPhatHanhFrom'
                      placeholder="Từ ngày"
                    />
                  </div>
                  <div className="col-span-2">
                    <TanetFormDate
                      required={true}
                      dateFormat='dd/MM/yyyy'
                      id='ngayPhatHanhTo'
                      name='ngayPhatHanhTo'
                      placeholder="đến ngày"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-2">
                    <TanetLabel
                      label='Tình trạng'
                    /></div>
                  <div className="col-span-4">
                    <TanetSelect
                      id='trangThai'
                      name='trangThai'
                      options={dataTinhTrangs}
                      placeholder="Chọn"
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
          <GridView.Table.Column style={{}} title="Số hồ sơ" sortKey="soPhatHanhGCN" body={({ item }) => (<a title="Thay đổi thông tin" className="text-blue-800 cursor-pointer" onClick={() => dispatch({ type: ACTION_TYPES.EDIT, Id: item.hoSoTaiSanId })}>{item.soPhatHanhGCN}</a>)} />
          <GridView.Table.Column style={{}} title="Ngày phát hành" sortKey="ngayPhatHanh" body={({ item }) => (<span>{formatDateTime(item.ngayPhatHanh)}</span>)} />
          <GridView.Table.Column style={{}} title="Loại hồ sơ" sortKey="loaiHoSoText" body={({ item }) => (<span>{item.loaiHoSoText}</span>)} />
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
                {permisson.per_Approve && item.loaiHoSoId == 1 && <BsListCheck
                  className="cursor-pointer text-lg mr-2 text-blue-800"
                  title="Phê duyệt"
                  onClick={() => actViewApproved(item)}
                />}
                {permisson.per_Approve && item.loaiHoSoId == 1 && <AiOutlineInfoCircle
                  className="cursor-pointer text-lg mr-2 text-gray-800"
                  title="Danh sách tài sản"
                  onClick={() => {
                    setHoSoTaiSanId(item.hoSoTaiSanId);
                    setShowAs(true);
                  }}
                />}
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      <HoSoTaiSanForm show={state.show} onClose={onClose} action={"read"} id={state.Id} />
      <PheDuyetHoSoTaiSan show={showAprove} onClose={onCloseApprove} action="approved" id={hoSoTaiSanId} />
      <ListTaiSanForm show={showAs} onClose={onCloseAs} action="read" id={hoSoTaiSanId} />
      <ConfirmationDialog />
    </>
  );
}
