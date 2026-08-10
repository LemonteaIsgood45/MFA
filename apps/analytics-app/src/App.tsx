import React from "react";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="p-6 font-sans">
      <h2 className="text-xl font-semibold">Analytics App — chế độ standalone</h2>
      <p className="mt-1 text-gray-500">
        Đang chạy độc lập tại http://localhost:5002. Khi Host App fetch module này qua
        Module Federation, chỉ &lt;Dashboard /&gt; được render bên trong Host.
      </p>
      <div className="mt-4">
        <Dashboard token={null} theme="light" />
      </div>
    </div>
  );
}
