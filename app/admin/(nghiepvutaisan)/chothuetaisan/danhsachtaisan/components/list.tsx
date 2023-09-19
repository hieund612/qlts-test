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
} from "@/lib/common";
import {
  TanetInput,
  TanetSelect,
} from "@/lib";
import { asTaiSanServices } from "../../../../(nghiepvutaisan)/danhsachtaisan/services";
import {
  AiTwotoneEye,
  AiFillDollarCircle,
} from "react-icons/ai";
import Thongtindenghichothue from "./thongtindenghichothue";

export default function List() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Danh mục tài sản";
  const { data, isLoading, mutate } = asTaiSanServices.GetList(meta);
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
    setPermisson(getPermisson("astaisan"));
  }, []);
  let noActive = 'inline-block p-3 border-b-2 rounded-t-lg  hover:border-gray-300  border-transparent';
  let Active = 'inline-block p-3 border-b-2 rounded-t-lg  hover:border-gray-300 border-transparent active text-white border-white-600  dark:border-white-500';
console.log('state.action', state)
  return (
    <>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-1" >
            <a href="/admin/chothuetaisan/danhsachtaisan" className={Active}>Danh sách tài sản
            </a>
          </li>
          <li className="mr-1" >
            <a href="/admin/chothuetaisan/danhsachchothue" className={noActive}>Danh sách đề nghị cho thuê
            </a>
          </li>
        </ul>
      </div>
      <GridView>
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
            body={({ item }) => <span className="text-sky-500"
              onClick={() =>
                dispatch({ type: ACTION_TYPES.ADD, Id: item.id })
              }
            >{item.soTheTaiSan}</span>}
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
            title="Mục đích sử dụng"
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
                {permisson.per_View && (
                  <AiFillDollarCircle
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Điều chỉnh thông tin tài chính"

                  />
                )}
              </div>
            )}
          />
        </GridView.Table>
      </GridView>

      <Thongtindenghichothue
        show={state.show}
        onClose={onClose}
        action={state.action}
        id={state.Id}
      />
    </>
  );
}
