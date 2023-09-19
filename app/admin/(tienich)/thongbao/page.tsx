"use client";
import { GridView } from "@/shared/components/data-grid";
import { Formik, Form, FormikState } from "formik";
import { DefaulPer } from "@/public/app-setting";
import {
  handleChangeAction,
  delAction,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
} from "@/lib/common";
import { TanetSelect, TanetLabel, TanetInput } from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { notificationServices } from "./services";
import ThongBaoForm from "./_components/thongbao-form";
import ConfirmationDialog from "@/shared/components/confirm";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineSearch } from "react-icons/ai";
export const DefaultMeta = {
  page: 1,
  page_size: 15,
  sort: { dateFrom: "desc" },
  search: "",
  filter: {},
  total: 0,
};
export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Thông báo";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);

  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);

  const actions = {
    meta,
  };
  const onClose = async (isRefresh: boolean) => {
    setId(null);
    setShow(false);
  };

  useEffect(() => {
    setPermisson(getPermisson("notification"));
    getData(meta);
  }, []);
  const getData = async (meta: any) => {
    setLoading(true);
    let data = await notificationServices.GetData(meta);
    if (data && data.data) {
      meta.total = data.totalRows;
      if (meta.total == 0) {
        setHasMore(false);
      }
      setMeta(meta);
      setLoading(false);
      if (meta.page == 1) {
        setItems(data.data);
      } else {
        setItems(items.concat(data.data));
      }
    } else {
      setLoading(false);
    }
  };
  const featchMoreData = () => {
    if (meta.page * meta.page_size > meta.total) {
      setHasMore(false);
    } else {
      meta.page = meta.page + 1;
      setMeta(meta);
      getData(meta);
    }
  };
  const onSearch = (values: any) => {
    meta.page = 1;
    meta.filter = values;
    setHasMore(true);
    setMeta(meta);
    getData(meta);
  };
  const onView = (item: any) => {
    if (item.loaiThongBao == 2) {
      setId(item.id);
      setShow(true);
    }
  };
  const resetFilter=()=>{  
    meta.page = 1;
    meta.filter = {};
    setHasMore(true);
    setMeta(meta);
    getData(meta);
  }
  return (
    <>
      <div className="flex text-base font-bold text-turquoise-400 my-2 uppercase">
        {titleTable}
      </div>
      <div
        className="relative bg-white overflow-x-auto shadow-xl sm:rounded-lg"
        style={{ height: "100vh" }}
      >
        <div className="relative p-4 pb-0 mx-2">
          <Formik
            onSubmit={(values: any) => {
              onSearch(values);
            }}
            initialValues={meta.filter}
          >
            {({ handleSubmit, resetForm }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <div className={`gap-4 grid grid-cols-12`}>
                  <div className="col-span-3">
                    <TanetLabel label="Loại thông báo" />
                  </div>
                  <div className="col-span-9">
                    <TanetSelect
                      name="type"
                      id="type"
                      options={[
                        { value: 1, label: "Tự động" },
                        { value: 2, label: "Thông báo gửi từ đơn vị cấp trên" },
                      ]}
                      placeholder="Tất cả"
                    />
                  </div>
                  <div className="col-span-3">
                    <TanetLabel label="Thông tin" />
                  </div>
                  <div className="col-span-9">
                    <TanetInput id="FilterText" name="FilterText" />
                  </div>
                  <div className="col-span-12 text-center">
                    <button
                      data-modal-hide="large-modal"
                      type="submit"
                      className=" mr-3 text-white bg-lemonyellow hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                    >
                      <AiOutlineSearch className="text-[20px] inline" />
                      Tìm kiếm
                    </button>
                    {/* <button
                      onClick={() => resetFilter()}
                      data-modal-hide="large-modal"
                      type="button"
                      className="text-white bg-lemonyellow hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                    >
                      Làm mới
                    </button> */}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="relative p-0 mt-2 mx-2 mb-3">
          <InfiniteScroll
            dataLength={items.length}
            next={featchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            //height={'30vh'}
            height={"80vh"}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>
                  {meta.total == 0
                    ? "Không có thông báo nào"
                    : "Đã hiển thị hết tất cả thông báo"}
                </b>
              </p>
            }
          >
            {items.map((i, index) => (
              <div className="p-3" key={index}>
                <a
                  onClick={() => onView(i)}
                  className="text-blue-900 text-xl no-underline hover:underline cursor-pointer"
                >
                  {i?.tieuDe}
                </a>
                <p className="text-base maxRow3">{i?.noiDung}</p>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
      {show && (
        <ThongBaoForm show={show} onClose={onClose} action={"read"} id={id} />
      )}
      <ConfirmationDialog />
    </>
  );
}
