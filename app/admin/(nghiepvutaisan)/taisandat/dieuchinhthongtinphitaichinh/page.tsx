"use client";
import React, { useState } from "react";
import ListBienDong from "./components/list";
import ListTaiSan from "../../danhsachtaisan/components/list";
export default function Page() {
  const [openTab, setOpenTab] = useState<number>(1);
  return (
    <>
      <div className="mt-4 mb-4 border-b-2 border-green-600">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          role="tablist"
        >
          <li>
            <a
              className={
                "inline-block p-2 rounded-tl-lg border-b border-green-600" +
                (openTab === 1
                  ? " bg-green-600 text-white"
                  : " bg-white text-gray-600 hover:bg-green-600 hover:text-white")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(1);
              }}
              data-toggle="tab"
              href="#link1"
              role="tablist"
            >
              Danh sách tài sản
            </a>
          </li>
          <li>
            <a
              className={
                "inline-block p-2 rounded-tr-lg border-b border-green-600" +
                (openTab === 2
                  ? " bg-green-600 text-white"
                  : " bg-white text-gray-600 hover:bg-green-600 hover:text-white")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(2);
              }}
              data-toggle="tab"
              href="#link2"
              role="tablist"
            >
              Danh sách biến động
            </a>
          </li>
        </ul>
      </div>
      <div className="tab-content tab-space">
        <div className={openTab === 1 ? "block" : "hidden"} id="link1">
          {openTab === 1 && (
            <ListTaiSan
              loaiTaiSanGoc={1}
              loaiBienDong={3}
              setOpenTab={setOpenTab}
            />
          )}
        </div>
        <div className={openTab === 2 ? "block" : "hidden"} id="link2">
          {openTab === 2 && <ListBienDong />}
        </div>
      </div>
    </>
  );
}
