import {
  useGetAiTranslateDetails,
  useGetDocDetails,
  useUpdateDocFormHandler,
} from "@/hooks/templateSettings.hook";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { IoMdArrowBack } from "react-icons/io";
import dynamic from "next/dynamic";
import SectionLoader from "@/components/SectionLoader";
import ButtonTextWithLoader from "@/components/ButtonTextWithLoader";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [] }],
    ["bold", "italic", "underline", "strike"],
    ["link", "image"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["color", "background"],
    ["clean"],
  ],
};

export default function Index() {
  const [docValue, setDocValue] = useState<any>("");

  const router = useRouter();

  const idFromQuery = router.query.trnslate_id;
  const { data: docDetails, isLoading } =
    useGetAiTranslateDetails(idFromQuery) || {};

 
  useEffect(() => {
    if (!docDetails) {
      return;
    }
    setDocValue(docDetails.data.result);
  }, [docDetails]);

  if (isLoading) return <SectionLoader />;
  return (
    <div className="container">
      <div className=" items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
        <div>
          <Link href={`/dashboard`} className="mb-3 flex items-center gap-2">
            <IoMdArrowBack size={18} />
            <p>Back to Dashboard</p>
          </Link>

          <h4 className="mt- text-4xl font-bold capitalize"> Translate</h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>
      <div className="py-10 px-6">
        <div className="container">
          <div className="mx-auto md:w-2/3">
            <div>
              <h4 className="mb-4 text-xl font-bold">Translate Details</h4>
            </div>
            <div>
              <div>
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="document Title"
                  className="form-input"
                  value={docDetails.data.title}
                  readOnly
                />
              </div>
              <div className="mt-4">
                <label htmlFor="text">Text</label>
                <textarea
                  id="text"
                  rows={3}
                  className="form-textarea"
                  placeholder="Enter Text"
                  value={docDetails.data.text}
                  readOnly
                ></textarea>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="name">Translated Text</label>
              <ReactQuill
                modules={modules}
                theme="snow"
                value={docValue}
                onChange={setDocValue}
                className="h-full"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
