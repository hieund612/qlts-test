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
import { TanetInput, TanetLabel, TanetSelect, SelectAsync, TanetFormDate } from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { hoSoTaiSanServices } from "../services";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  FaShare,
} from "react-icons/fa";
import HoSoTaiSanForm from "./hosotaisan-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function ListThayDoi() {
 
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Sửa chữa bảo dưỡng";
  const { data, isLoading, mutate } = hoSoTaiSanServices.GetList(meta);
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
    setPermisson(getPermisson("hosotaisan"));

  }, []);

  const sendHoSo = async (item: any) => {
    confirm("Bạn có chắc chắn muốn gửi duyệt hồ sơ này?", async () => {
      try {
        await hoSoTaiSanServices.onSendHoSo(item.id);
        toast.success("Gửi duyệt thành công");
        if (data?.data.length === 1 && data.currentPage !== 1) {
          setMeta({
            ...meta,
            page: data?.currentPage - 1,
          });
        } else await mutate();
      } catch (err) {
        toast.error("Gửi duyệt thất bại");
      }
    });
  };
  
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
                  <div className="col-span-2">
                    <TanetLabel
                      label='Ngày thay đổi'
                    /></div>
                  <div className="col-span-2">

                    <TanetFormDate
                      dateFormat='dd/MM/yyyy'
                      id='ngayThayDoiFrom'
                      name='ngayThayDoiFrom'
                      placeholder="Từ ngày"
                    />
                  </div>
                  <div className="col-span-2">
                    <TanetFormDate
                      dateFormat='dd/MM/yyyy'
                      id='ngayThayDoiTo'
                      name='ngayThayDoiTo'
                      placeholder="đến ngày"
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
          <GridView.Table.Column style={{}} title="Số hồ sơ" sortKey="soPhatHanhGCN" body={({ item }) => (<a title="Thay đổi thông tin" className="text-blue-800 cursor-pointer" onClick={() => dispatch({ type: ACTION_TYPES.EDIT, Id: item.hoSoTaiSanId })}>{item.soPhatHanhGCN}</a>)} />
          <GridView.Table.Column style={{}} title="Ngày phát hành" sortKey="ngayPhatHanh" body={({ item }) => (<span>{formatDateTime(item.ngayPhatHanh)}</span>)} />
          <GridView.Table.Column style={{}} title="Người sử dụng đất, chủ sở hữu nhà" sortKey="nguoiSuDungSoHuu" body={({ item }) => (<span>{item.nguoiSuDungSoHuu}</span>)} />
          <GridView.Table.Column style={{}} title="Ngày thay đổi" sortKey="ngayThayDoi" body={({ item }) => (<span>{formatDateTime(item.ngayThayDoi)}</span>)} />
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
                {permisson.per_Edit && item.isEdit && <AiFillEdit
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Chỉnh sửa"
                  onClick={() => dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })}
                />}
                {permisson.per_Delete && item.isEdit && <AiFillDelete
                  className="cursor-pointer text-lg mr-1 text-red-700"
                  title="Xóa"
                  onClick={() => delAction(item, hoSoTaiSanServices, data, setMeta, meta, mutate)}
                />
                }
                {permisson.per_Edit && item.isSend && <FaShare
                  className="cursor-pointer text-lg mr-1 text-blue-700"
                  title="Gửi duyệt"
                  onClick={() => sendHoSo(item)}
                />
                }
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      <HoSoTaiSanForm show={state.show} onClose={onClose} action={state.action} id={state.Id} />
      <ConfirmationDialog />
    </>
  );
}
