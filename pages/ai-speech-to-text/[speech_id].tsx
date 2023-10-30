import { useGetAiSpeachToTextDetails } from "@/hooks/templateSettings.hook";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { IoMdArrowBack } from "react-icons/io";
import dynamic from "next/dynamic";
import SectionLoader from "@/components/SectionLoader";

export default function Index() {
  const router = useRouter();

  const idFromQuery = router.query.speech_id;
  const { data: docDetails, isLoading } =
    useGetAiSpeachToTextDetails(idFromQuery) || {};

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
            Ai Speech To Text
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>
      <div className="py-10 px-6">
        <div className="container">
          <div className="mx-auto md:w-2/3">
            <div>
              <h4 className="mb-4 text-xl font-bold">Speech To Text Details</h4>
            </div>
            <div>
              <div className="mt-4">
                <textarea
                  id="text"
                  rows={3}
                  className="form-textarea"
                  placeholder="Enter Text"
                  value={docDetails?.data?.result}
                  readOnly
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
