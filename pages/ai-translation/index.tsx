import {
  useAiTranslationForUser,
  useAiWriterGeneratorForUser,
  useGetSingleTemplateForGenerate,
} from "@/hooks/templateSettings.hook";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import "react-quill/dist/quill.snow.css";
import {
  AVAILABLE_FEATURES,
  CREATIVITY_CONSTANT,
  INPUT_FIELD_TYPE,
  OPEN_AI_TONE_OF_VOICE_CONSTANT,
} from "@/helpers/coreConstant";
import { toast } from "react-toastify";
import ButtonTextWithLoader from "@/components/ButtonTextWithLoader";
import Credits from "@/components/Common/Credits.comp";
import SectionLoader from "@/components/SectionLoader";
import { useCheckSectionSubscriptionStatus } from "@/hooks/paymentSettings.hook";
import PackageErrorMsg from "@/components/PackageErrorMsg";
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

const languageLists = [
  { value: "en-US", label: "English (USA)" },
  { value: "hi-IN", label: "Hindi (India)" },
];

export default function Index() {
  const [docValue, setDocValue] = useState<any>("");
  const router = useRouter();

  const idFromQuery = router.query.temp_id;

  const { data: templateDetails, isLoading } =
    useGetSingleTemplateForGenerate(idFromQuery) || {};

  const {
    register,
    handleSubmit,
    handleAiTranslationForUser,
    Controller,
    control,
    isLoading: isGenerateProcessing,
    setValue,
    errors,
    watch,
    data: generateData,
  } = useAiTranslationForUser();
  const { enable } = useCheckSectionSubscriptionStatus(
    AVAILABLE_FEATURES.TRANSLATION
  );

  useEffect(() => {
    setDocValue(generateData?.data?.result);
  }, [generateData]);

  return (
    <div className="min-h-screen">
      <div className="container">
        <div className=" items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
          <div>
            <Link href={`/dashboard`} className="mb-3 flex items-center gap-2">
              <IoMdArrowBack size={18} />
              <p>Back to Dashboard</p>
            </Link>

            <h4 className="mt- text-4xl font-bold capitalize">
              Ai Translation
            </h4>
            {
            !enable && (
              <PackageErrorMsg />
            )
          }
          </div>
        </div>
        <div className="py-10 px-6">
          <div className="container">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <form onSubmit={handleSubmit(handleAiTranslationForUser)}>
                  <div>
                    <div>
                      <div className="mb-4">
                        <label htmlFor="title">Title</label>
                        <input
                          id="title"
                          type="text"
                          placeholder="Title"
                          className="form-input"
                          {...register("title")}
                          required
                        />
                        <p className="mt-1 text-danger">
                          <small>{errors.title?.message}</small>
                        </p>
                      </div>
                      <div>
                        <label htmlFor="text">Enter Text</label>
                        <textarea
                          id="text"
                          rows={3}
                          className="form-textarea"
                          placeholder="Enter Text"
                          {...register("text")}
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label>Language</label>
                        <Controller
                          control={control}
                          defaultValue={languageLists[0]}
                          name="language"
                          render={({ field }: any) => (
                            <Select
                              classNamePrefix={"wizai-select"}
                              options={languageLists}
                              {...field}
                              required
                            />
                          )}
                        />
                        <p className="mt-1 text-danger">
                          <small>{errors.language?.message}</small>
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-8 min-w-[180px] rounded-full"
                    disabled={isGenerateProcessing || !enable}
                  >
                    <ButtonTextWithLoader
                      normalText="Translate"
                      loadingText="Translating"
                      isBtnLoading={isGenerateProcessing}
                    />
                  </button>
                </form>
              </div>
              <div>
                {isGenerateProcessing ? (
                  <SectionLoader />
                ) : (
                  <ReactQuill
                    modules={modules}
                    theme="snow"
                    value={docValue}
                    onChange={setDocValue}
                    className="custom-react-quil-cls h-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
