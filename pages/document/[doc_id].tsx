import {
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

  const idFromQuery = router.query.doc_id;
  const { data: docDetails, isLoading } = useGetDocDetails(idFromQuery) || {};
  const {
    register,
    handleSubmit,
    handleUpdateDoc,
    Controller,
    control,
    setValue,
    errors,
    isLoading: isUpdateing,
  } = useUpdateDocFormHandler();
  
  useEffect(() => {
    if (!docDetails) {
      return;
    }
    setDocValue(docDetails.data.result);
    setValue("title", docDetails.data.title);
    setValue("document_id", docDetails.data.id);
    
  }, [docDetails]);

  useEffect(() => {
    setValue("result", docValue);
  }, [docValue]);
  if (isLoading) return <SectionLoader />;
  return (
    <div className="container">
      <div className=" items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
        <div>
          <Link href={`/dashboard`} className="mb-3 flex items-center gap-2">
            <IoMdArrowBack size={18} />
            <p>Back to Dashboard</p>
          </Link>

          <h4 className="mt- text-4xl font-bold capitalize">
            {" "}
            Update document
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>
      <div className="py-10 px-6">
        <div className="container">
          <div className="mx-auto md:w-2/3">
            <form onSubmit={handleSubmit(handleUpdateDoc)}>
              <div>
                <h4 className="mb-4 text-xl font-bold">Update document</h4>
              </div>
              <div>
                <div>
                  <label htmlFor="title">document Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="document Title"
                    className="form-input"
                    {...register("title")}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="name">document Body</label>
                <ReactQuill
                  modules={modules}
                  theme="snow"
                  value={docValue}
                  onChange={setDocValue}
                  className="h-full"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-8 min-w-[180px] rounded-full"
                disabled={isUpdateing}
              >
                <ButtonTextWithLoader
                  normalText="Update"
                  loadingText="Updating"
                  isBtnLoading={isUpdateing}
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
