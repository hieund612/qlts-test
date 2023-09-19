"use client";
import { useState } from "react";
import ListSuaChuaBaoDuong from "./_components/list-suachuabaoduong";
import ListTaiSan from "./_components/list-taisan";
export default function Page() { 
  const Tab = ({ label, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`${isActive
        ? 'bg-blue-500 text-white'
        : 'bg-gray-300 text-gray-600 hover:bg-blue-500 hover:text-white'
        } px-4 py-2 rounded-t-lg`}
    >
      {label}
    </button>
  );

  const TabContent = ({ children }) => (
    <div className="p-4 border border-t-0 rounded-b-lg">{children}</div>
  );
  const [activeTab, setActiveTab] = useState(1);
  const tabs = [
    { id: 1, label: 'Danh sách tài sản', content: 'This is the content of Tab 1.' },
    { id: 2, label: 'Danh sách các lần bảo dưỡng', content: 'This is the content of Tab 2.' },
  ];
  const onChange = (isRefresh: boolean) => {   
    if (isRefresh) {     
      setActiveTab(2);
    }
  }; 

  return (
    <>
      <div>
        <div className="flex">
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              label={tab.label}
              onClick={() => setActiveTab(tab.id)}
              isActive={tab.id === activeTab}
            />
          ))}
        </div>
        <TabContent>
          {activeTab == 1 && <>
            <ListTaiSan onChange={onChange}/>
          </>}
          {activeTab == 2 && <>
            <ListSuaChuaBaoDuong />
           </>}
        </TabContent>
      </div>

    </>
  );
}
