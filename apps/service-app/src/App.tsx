import React from "react";
import ServiceList from "./components/ServiceList";

export default function App() {
  return (
    <div className="p-6 font-sans">
      <h2 className="text-xl font-semibold">Service App — chế độ standalone</h2>
      <p className="mt-1 text-gray-500">
        Đang chạy độc lập tại http://localhost:5001. Khi Host App fetch module này qua
        Module Federation, chỉ &lt;ServiceList /&gt; được render bên trong Host.
      </p>
      <div className="mt-4">
        <ServiceList token={null} theme="light" />
      </div>
    </div>
  );
}
