import { IoIosAdd, IoMdArrowBack } from "react-icons/io";
import React from "react";
import Link from "next/link";
import CustomTemplates from "@/components/Admin/Templates/CustomTemplates";
import FaqLists from "@/components/Admin/FAQ/FaqLists";

export default function Index() {
  return (
    <div className="container">
      <div className=" items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
        <div>
          <Link
            href={`/admin/dashboard`}
            className="mb-3 flex items-center gap-2"
          >
            <IoMdArrowBack size={18} />
            <p>Back to Dashboard</p>
          </Link>

          <h4 className="mt- text-4xl font-bold capitalize"> FAQ</h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>
      <div className="h-full p-6 py-8 sm:min-h-[calc(100vh_-_200px)]">
        <Link href={`/admin/faqs/create`} className="inline-block">
          <button type="button" className="btn btn-primary rounded-full">
            <IoIosAdd size={20} />
            Add FAQ
          </button>
        </Link>
        <div className="mt-4 h-full w-full">
          <FaqLists />
        </div>
      </div>
    </div>
  );
}
