"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import { useReducer, useState, useEffect } from "react";
import {
  handleChangeAction,
  formatDateTime,
  formatCurrentcy,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
  formartPriceVND,
  delAction
} from "@/lib/common";
import {
  TanetInput,
  TanetSelect,
} from "@/lib";

import { asChoThueTaiSanServices } from '../../services';
import {
  AiTwotoneEye,
  AiFillDollarCircle,
  AiFillEdit,
  AiFillDelete,
} from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import { RiRefreshFill } from "react-icons/ri";
import EditForm from './edit-form';

export default function List() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Danh mục tài sản";
  const { data, isLoading, mutate } = asChoThueTaiSanServices.GetList(meta);
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const actions = {
    meta,
  };
  // trangThaiDuyet: 1: tạo mới; 2 chờ duyệt; 3 :đã duyệt; 4: từ chối; 5: đóng
  const handleChange = (res: any) => {
    const newMeta = handleChangeAction(res, actions);
    if (newMeta) {
      setMeta({
        ...meta,
        newMeta,
      });
    }
  };

  useEffect(() => {
    setPermisson(getPermisson("chothuetaisan"));
  }, []);

  const onClose = async (isRefresh: boolean) => {
    dispatch({ type: ACTION_TYPES.CLOSE });
    if (isRefresh) {
      await mutate();
    }
  };

  let noActive = 'inline-block p-3 border-b-2 rounded-t-lg  hover:border-gray-300  border-transparent';
  let Active = 'inline-block p-3 border-b-2 rounded-t-lg  hover:border-gray-300 border-transparent active text-white border-white-600  dark:border-white-500';

  return (
    <>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-1" >
            <a href="/admin/chothuetaisan/danhsachtaisan" className={noActive}>Danh sách tài sản
            </a>
          </li>
          <li className="mr-1" >
            <a href="/admin/chothuetaisan/danhsachchothue" className={Active}>Danh sách đề nghị cho thuê
            </a>
          </li>
        </ul>
      </div>
      <GridView title={""}>
        <GridView.Header
          keySearch={meta.search}
          meta={meta}
          AdvanceFilter={
            <>
              <div className="">
                <TanetInput
                  label="Số thẻ tài sản"
                  id="soTheTaiSan"
                  name="soTheTaiSan"
                />
              </div>
              <div className="">
                <TanetInput
                  label="Tên tài sản"
                  id="tenTaiSan"
                  name="tenTaiSan"
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
            body={({ item }) => <span >{item.soTheTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Tên tài sản"
            sortKey="tenTaiSan"
            body={({ item }) => <span>{item.tenTaiSan}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Khách hàng thuê"
            sortKey="tenDVThue"
            body={({ item }) => <span>{item.tenDVThue}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Thời gian thuê "
            sortKey="thoigianTu"
            body={({ item }) => <span>{formatDateTime(item.thoigianTu)} - {formatDateTime(item.thoigianDen)}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Tổng tiền thuê"
            sortKey="tongTienThue"
            body={({ item }) => <span>{formartPriceVND(item.tongTienThue)}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Trạng thái"
            sortKey="trangThaiDuyet"
            body={({ item }) => (
              <>
                {(item.trangThaiDuyet == 1) && (
                  <span>Tạo mới</span>
                )}
                {item.trangThaiDuyet == 2 && (
                  <span>Chờ duyệt</span>
                )}
                {item.trangThaiDuyet == 3 && (
                  <span>Đã duyệt</span>
                )}
                {item.trangThaiDuyet == 4 && (
                  <span>Từ chối</span>
                )}
                {item.trangThaiDuyet == 5 && (
                  <span>Đóng</span>
                )}
              </>
            )}
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

                {(item.trangThaiDuyet == 0 || item.trangThaiDuyet == 1 || item.trangThaiDuyet == 4) && permisson.per_Edit && (
                  <AiFillEdit
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Chỉnh sửa"
                    onClick={() =>
                      dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })
                    }
                  />
                )}
                {(item.trangThaiDuyet == 0 || item.trangThaiDuyet == 1 || item.trangThaiDuyet == 4) && permisson.per_Delete && (
                  <AiFillDelete
                    className="cursor-pointer text-lg mr-1 text-red-700"
                    title="Xóa"
                    onClick={() =>
                      delAction(
                        item,
                        asChoThueTaiSanServices,
                        data,
                        setMeta,
                        meta,
                        mutate
                      )
                    }
                  />
                )}

                {(item.trangThaiDuyet == 0 || item.trangThaiDuyet == 1 || item.trangThaiDuyet == 4) && permisson.per_Edit && <FaShare
                  className="cursor-pointer text-lg mr-1 text-blue-700"
                  title="Gửi duyệt"
                // onClick={() => sendHoSo(item, hoSoTaiSanServices, data, setMeta, meta, mutate)}
                />
                }

                {item.trangThaiDuyet == 3 && permisson.per_Edit && <RiRefreshFill
                  className="cursor-pointer text-lg mr-1 text-blue-700"
                  title=""
                // onClick={() => sendHoSo(item, hoSoTaiSanServices, data, setMeta, meta, mutate)}
                />
                }
              </div>
            )}
          />
        </GridView.Table>
      </GridView>

    <EditForm show={state.show} action={state.action} id={state.Id} onClose={onClose}/>
    </>
  );
}
