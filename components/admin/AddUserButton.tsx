"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import AddUserModal from "./AddUserModal";

export default function AddUserButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 px-8 py-5"
      >
        <UserPlus className="w-5 h-5" />
        إضافة مستخدم
      </button>

      {showModal && (
        <AddUserModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
