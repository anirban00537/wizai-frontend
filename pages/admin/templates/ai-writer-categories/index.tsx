import { IoIosAdd, IoMdArrowBack } from "react-icons/io";
import React from "react";
import Link from "next/link";
import AiWriterCategories from "@/components/Admin/Templates/AiWriterCategories";

export default function Index() {
  return (
    <div className="container">
      <div className="items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
        <div>
          <Link
            href={`/admin/dashboard`}
            className="mb-3 flex items-center gap-2"
          >
            <IoMdArrowBack size={18} />
            <p>Back to Dashboard</p>
          </Link>

          <h4 className="mt- text-4xl font-bold capitalize">
            {" "}
            Ai Writer Categories
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>
      <div className="p-2 md:p-10 h-full sm:min-h-[calc(100vh_-_200px)]">
        <Link href={`/admin/templates/ai-writer-categories/create`} className="inline-block">
          <button type="button" className="btn btn-primary rounded-full">
            <IoIosAdd size={20} />
            Add Category
          </button>
        </Link>
        <div className=" mt-4 h-full  w-full">
          <AiWriterCategories />
        </div>
      </div>
    </div>
  );
}
