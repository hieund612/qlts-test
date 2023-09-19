"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta,DefaulPer } from "@/public/app-setting";
import { handleChangeAction,delAction,listReducer,getPermisson, INITIAL_STATE_LIST,ACTION_TYPES } from "@/lib/common";
import { useReducer, useState,useEffect } from "react";
import { userServices } from "./services";
import {
  AiOutlinePlus,
  AiOutlineRetweet,
  AiFillLock,
  AiFillUnlock,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
} from "react-icons/ai";
import UserForm from "./_components/user-form";
import ResetPassword from "./_components/user-reset-password";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const { data, isLoading, mutate } = userServices.GetList(meta);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [state,dispatch] = useReducer(listReducer,INITIAL_STATE_LIST);
  const actions = {
    meta
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
  const onReset = (item: any) => {
    setShowResetPassword(true);
    setUsername(item.username);
  };
  const onClose = async (isRefresh: boolean) => {
    dispatch({type:ACTION_TYPES.CLOSE});
    if (isRefresh) {
      await mutate();
    }
  };
  const active = async (item: any) => {
    confirm("Bạn có muốn kích hoạt bản ghi này?", async () => {
      try {
        await userServices.ActiveUser(item.id);
        toast.success("Kích hoạt thành công");
        await mutate();
      } catch (err) {
        toast.error("Kích hoạt thất bại");
      }
    });
  };

  const deactive = async (item: any) => {
    confirm("Bạn có muốn hủy kích hoạt bản ghi này?", async () => {
      try {
        await userServices.DeactiveUser(item.id);
        toast.success("Hủy kích hoạt thành công");
        await mutate();
      } catch (err) {
        toast.error("Hủy kích hoạt thất bại");
      }
    });
  };
  useEffect(() => {
    setPermisson(getPermisson("users"));
  }, []);
  return (
    <>
      <GridView title='Danh sách người dùng' handleChange={handleChange} loading={isLoading}>
        <GridView.Header
          keySearch={meta.search}
          ActionBar={
            permisson.per_Add && (<button
              className="btn-add"
              onClick={() => dispatch({type:ACTION_TYPES.ADD,Id:0})}
            >
               
              <AiOutlinePlus className="text-[20px]" /> Thêm mới
            </button>)
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
            style={{ width: "20%" }}
            title="Tên đăng nhập"
            sortKey="username"
            body={({ item }) => <span>{item.username}</span>}
          />
          <GridView.Table.Column
            title="Họ và tên"
            sortKey="fullName"
            body={({ item }) => <span>{item.fullName}</span>}
          />
          <GridView.Table.Column
            style={{ width: "12%" }}
            title="Trạng thái"
            sortKey="status"
            className="text-center"
            body={({ item }) => (
              <span>
                {item.status === 1 ? (
                  <span className="badge badge-danger">Không hoạt động</span>
                ) : item.status === 2 ? (
                  <span className="badge badge-success">Đang hoạt động</span>
                ) : (
                  ""
                )}
              </span>
            )}
          />
          <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                {permisson.per_Edit &&<AiOutlineRetweet
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Reset mật khẩu"
                  onClick={() => onReset(item)}
                />}
                {item.status === 1 && permisson.per_Edit ? (
                  <AiFillUnlock
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="kích hoạt"
                    onClick={() => active(item)}
                  />
                ) : permisson.per_Edit && (
                  <AiFillLock
                    className="cursor-pointer text-lg mr-1 text-red-700"
                    title="khóa"
                    onClick={() => deactive(item)}
                  />
                )}
                {permisson.per_View &&<AiTwotoneEye
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Xem chi tiết"
                  onClick={() => dispatch({type:ACTION_TYPES.READ,Id:item.id})}
                />}
                {permisson.per_Edit &&<AiFillEdit
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Chỉnh sửa"
                  onClick={() => dispatch({type:ACTION_TYPES.EDIT,Id:item.id})}
                />}
                {permisson.per_Delete &&<AiFillDelete
                  className="cursor-pointer text-lg mr-1 text-red-700"
                  title="Xóa"
                  onClick={() => delAction(item,userServices,data,setMeta,meta,mutate)}
                />}
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      <UserForm show={state.show} onClose={onClose} action={state.action} id={state.Id} />
      <ResetPassword
        show={showResetPassword}
        onClose={onClose}
        username={username}
      />
      <ConfirmationDialog />
    </>
  );
}
