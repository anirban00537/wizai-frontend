import { AVAILABLE_FEATURES, CODING_LEVEL } from "@/helpers/coreConstant";
import {
  useAiCodeGeneratorForUser,
  useGetProgramingLanguageListsForUser,
} from "@/hooks/templateSettings.hook";
import Link from "next/link";
import { IRootState } from "@/store";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaCopy, FaDownload, FaFileAlt } from "react-icons/fa"; // Import the necessary React Icons
import Select from "react-select";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import ButtonTextWithLoader from "@/components/ButtonTextWithLoader";
import Credits from "@/components/Common/Credits.comp";
import SectionLoader from "@/components/SectionLoader";
import copy from "copy-to-clipboard"; // Import a library for copying text
import { toast } from "react-toastify";
import { useCheckSectionSubscriptionStatus } from "@/hooks/paymentSettings.hook";
import PackageErrorMsg from "@/components/PackageErrorMsg";

export default function Index() {
  const [langLists, setLangLists] = useState<any>([]);
  const [generateCodes, setGenerateCodes] = useState<any>();
  const { enable } = useCheckSectionSubscriptionStatus(AVAILABLE_FEATURES.CODE);
  const coding_level_data = [
    { label: "Beginner", value: CODING_LEVEL.BEGINNER },
    { label: "Intermediate", value: CODING_LEVEL.INTERMEDIATE },
    { label: "Advance", value: CODING_LEVEL.ADVANCE },
  ];
  const {
    register,
    handleSubmit,
    handleAiCodeGeneratorForUser,
    Controller,
    control,
    isLoading: isGenerateProcessing,
    data: generateData,
  } = useAiCodeGeneratorForUser();

  const { data: ProgramingLanguageLists, isLoading } =
    useGetProgramingLanguageListsForUser();

  useEffect(() => {
    if (!generateData) {
      return;
    }
    setGenerateCodes(generateData.data.result);
  }, [generateData]);

  useEffect(() => {
  
    if (!ProgramingLanguageLists) return;
    let newArray = [...ProgramingLanguageLists.data];
    newArray = newArray.map((item) => ({ value: item.name, label: item.name }));
   
    setLangLists(newArray);
  }, [ProgramingLanguageLists]);
  const handleCopyCode = () => {
    copy(generateCodes);
    toast.success("Code Copied!");
  };

  const handleGenerateDocumentToMarkdown = () => {
    const markdownContent = generateCodes;

    const blob = new Blob([markdownContent], { type: "text/markdown" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = Date.now() + ".md";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <SectionLoader />;

  return (
    <div className="container min-h-screen">
      <div className="items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
        <div>
          <Link href={`/dashboard`} className="mb-3 flex items-center gap-2">
            <IoMdArrowBack size={18} />
            <p>Back to Dashboard</p>
          </Link>

          <h4 className="mt- text-4xl font-bold capitalize">
            AI Code Generator
          </h4>
          {
            !enable && (
              <PackageErrorMsg />
            )
          }
        </div>
        <Credits />
      </div>
      <div className="py-10 px-6">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <form onSubmit={handleSubmit(handleAiCodeGeneratorForUser)}>
                <div>
                  <div className="mb-4">
                    <label htmlFor="title">Code Title</label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Code Title"
                      className="form-input"
                      {...register("title")}
                      required
                    />
                  </div>
                  <div>
                    <div className="mb-4">
                      <label htmlFor="description">
                        Describe What Kind of Code You Need
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        className="form-textarea"
                        placeholder="Describe What Kind of Code You Need"
                        {...register("description")}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label>Coding Level</label>
                    <Controller
                      control={control}
                      defaultValue={coding_level_data[0]}
                      name="coding_level"
                      render={({ field }: any) => (
                        <Select
                          classNamePrefix={"wizai-select"}
                          options={coding_level_data}
                          {...field}
                          required
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="coding_language">Coding Language</label>

                    <Controller
                      control={control}
                      name="coding_language"
                      render={({ field }: any) => (
                        <Select
                          classNamePrefix={"wizai-select"}
                          options={langLists}
                          {...field}
                          required
                        />
                      )}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-8 min-w-[180px] rounded-full"
                  disabled={isGenerateProcessing || !enable}
                >
                  <ButtonTextWithLoader
                    normalText="Generate"
                    loadingText="Generating"
                    isBtnLoading={isGenerateProcessing}
                  />
                </button>
              </form>
            </div>
            <div>
              <div className="flex items-end justify-end gap-1 p-6">
                <button
                  className="border p-2 "
                  onClick={handleCopyCode}
                  disabled={isGenerateProcessing}
                >
                  <FaCopy className="text-lg" />
                </button>
                <button
                  className="border p-2"
                  onClick={handleGenerateDocumentToMarkdown}
                  disabled={isGenerateProcessing}
                >
                  <FaDownload className="text-lg" />
                </button>
              </div>

              <div
                style={{
                  borderLeft: "1px solid #f1f3f4",
                  paddingLeft: "20px",
                }}
              >
                {isGenerateProcessing ? (
                  <SectionLoader />
                ) : (
                  <CodeMirror
                    value={generateCodes}
                    theme={vscodeDark}
                    readOnly={true}
                    maxHeight="400px"
                    style={{ borderRadius: "10px", overflow: "hidden" }}
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
