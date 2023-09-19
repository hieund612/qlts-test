"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { toast } from "react-toastify";
import { GridView } from "@/shared/components/data-grid";
import { hoSoTaiSanServices } from "../services";
import { formatDateTime } from "@/lib/common";
import { DefaulPer } from "@/public/app-setting";
import { handleChangeAction, listReducer, getPermisson, INITIAL_STATE_LIST, ACTION_TYPES } from "@/lib/common";
import { useReducer, useState, useEffect } from "react";
import HoSoTaiSanForm from "./hosotaisan-form";

import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiTwotoneEye,
  AiOutlinePlus,
} from "react-icons/ai";
export default function PheDuyetHoSoTaiSan({
  show,
  action,
  id,
  onClose,
}: IFormProps) {

  const DefaultMeta = {
    page: 1,
    page_size: 15,
    sort: { phienBan: 'asc' },
    search: '',
    filter: {},
    total: 0,
  };
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [showView, setShowView] = useState(false);
  const [hiTaiSanId, setHiTaiSanId] = useState(null);
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const { data, isLoading, mutate } = hoSoTaiSanServices.GetListApproved(meta, id);
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const actions = {
    meta
  };
  const handleChange = (res: any) => {
    const newMeta = handleChangeAction(res, actions, setSelectedItem);
    if (newMeta) {
      setMeta({
        ...meta,
        newMeta,
      });
    }
  };

  useEffect(() => {
    setPermisson(getPermisson("hihosotaisan"));
  }, [id]);

  const onApproved = async (item: any) => {
    try {
      await hoSoTaiSanServices.pheDuyet(item.id, 1);
      toast.success("Phê duyệt thành công");
      await mutate();
      await onClose(true);
    } catch (err: any) {
      toast.error("Phê duyệt thất bại");
    }
  }
  const onReject = async (item: any) => {
    try {
      await hoSoTaiSanServices.pheDuyet(item.id, 2);
      toast.success("Từ chối phê duyệt thành công");
      await mutate();
      await onClose(true);
    } catch (err: any) {
      toast.error("Từ chối phê duyệt thất bại");
    }
  }
  const onApproveMutil = async () => {
    if (!selectedItem || selectedItem.length == 0) {
      toast.error("Bạn chưa chọn hồ sơ nào");
      return false;
    }
    else {
      try {
        await hoSoTaiSanServices.pheDuyetMutil(selectedItem, id, 1);
        toast.success("Phê duyệt thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Phê duyệt thất bại");
      }
    }
  }
  const onRejectMutil = async () => {
    if (!selectedItem || selectedItem.length == 0) {
      toast.error("Bạn chưa chọn hồ sơ nào");
      return false;
    }
    else {
      try {
        await hoSoTaiSanServices.pheDuyetMutil(selectedItem, id, 2);
        toast.success("Từ chối thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Từ chối thất bại");
      }
    }
  }
  const onCloseView = () => {
    setShowView(false);
    setHiTaiSanId(null);
  }
  return (
    <>
      <Modal show={show} size="xxl" loading={isLoading}>
        <>
          <Modal.Header onClose={onClose}>Phê duyệt hồ sơ tài sản</Modal.Header>
          <Modal.Body nameClass="gap-2">
            <GridView handleChange={handleChange} loading={isLoading}>
              <GridView.Header
                keySearch={meta.search}
                meta={meta}
                ActionBar={
                  permisson.per_Approve && (
                    <>

                      <button type="button" className="mr-2 btn-add" onClick={() => onApproveMutil()}>Phê duyệt</button>
                      <button type="button" className="btn-del" onClick={() => onRejectMutil()}>Từ chối</button>

                    </>
                  )
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
                noSelected={false}
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
                <GridView.Table.Column style={{}} title="Loại biến động" sortKey="phienBan" body={({ item }) => (<span>{item.phienBan <= 1 ? 'Khai báo' : 'Thay đổi thông tin'}</span>)} />
                <GridView.Table.Column style={{}} title="Ngày biến động" body={({ item }) => (<span>{item.phienBan <= 1 ? formatDateTime(item.ngayPhatHanh) : formatDateTime(item.ngayThayDoi)}</span>)} />
                <GridView.Table.Column style={{}} title="Trạng thái" sortKey="trangThai" body={({ item }) => (<span>{item.trangThaiText}</span>)} />
                <GridView.Table.Column
                  style={{ width: "7%" }}
                  className="view-action"
                  title="Tác vụ"
                  body={({ item }) => (
                    <div className="flex flex-row">
                      {permisson.per_View && <AiTwotoneEye
                        className="cursor-pointer text-lg mr-1 text-blue-800"
                        title="Xem chi tiết"
                        onClick={() => {
                          setShowView(true);
                          setHiTaiSanId(item.id);
                        }}
                      />}
                      {permisson.per_Approve && item.trangThai == 2 && <AiFillCheckCircle
                        className="cursor-pointer text-lg mr-1 text-green-700"
                        title="Đồng ý"
                        onClick={() => onApproved(item)}
                      />}
                      {permisson.per_Approve && item.trangThai == 2 && <AiFillCloseCircle
                        className="cursor-pointer text-lg mr-1 text-red-700"
                        title="Từ chối"
                        onClick={() => onReject(item)}
                      />
                      }
                    </div>
                  )}
                />
              </GridView.Table>
            </GridView>
            <HoSoTaiSanForm show={showView} onClose={onCloseView} action={"readhi"} id={hiTaiSanId} />
          </Modal.Body>
          <Modal.Footer onClose={onClose}>
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
}
