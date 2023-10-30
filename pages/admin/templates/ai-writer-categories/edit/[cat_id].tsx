import ButtonTextWithLoader from "@/components/ButtonTextWithLoader";
import SectionLoader from "@/components/SectionLoader";
import {
  useAddCategoriesFormHandler,
  useGetSingleCategoryData,
  useUpdateCategoriesFormHandler,
} from "@/hooks/templateSettings.hook";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import Select from "react-select";

const status = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

export default function Index() {
  const router = useRouter();

  const idFromQuery = router.query.cat_id;
  const { data: categoryDetails, isLoading } =
    useGetSingleCategoryData(idFromQuery) || {};
  const {
    register,
    handleSubmit,
    handleUpdateCategorySettings,
    Controller,
    control,
    setValue,
    errors,
    isLoading: isProcessing,
  } = useUpdateCategoriesFormHandler();

  useEffect(() => {
    setValue("name", categoryDetails?.data?.name);
    setValue("id", categoryDetails?.data?.id);
    setValue("description", categoryDetails?.data?.description);

    setValue("status", setStatusValue(categoryDetails?.data?.status));
  }, [categoryDetails?.data]);
  const setStatusValue = (data: any) => {
    let newData = status.find((item) => item.value == data);

    return newData;
  };

  if (isLoading) return <SectionLoader />;
  return (
    <>
      <div className=" items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
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
            Update Categories
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>
      <div className="py-10 px-6">
        <div className="container">
          <form onSubmit={handleSubmit(handleUpdateCategorySettings)}>
            <div>
              <div>
                <h4 className="mb-4 text-xl font-bold">Update Categories</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Category Name"
                    className="form-input"
                    {...register("name")}
                  />
                </div>
                <div>
                  <label>Status</label>

                  <Controller
                    control={control}
                    defaultValue={status[0]}
                    name="status"
                    render={({ field }: any) => (
                      <Select
                        classNamePrefix={"wizai-select"}
                        options={status}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows={3}
                    className="form-textarea"
                    placeholder="Category Description"
                    {...register("description")}
                  ></textarea>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-8 min-w-[180px] rounded-full"
              disabled={isProcessing}
            >
              <ButtonTextWithLoader
                normalText="Update"
                loadingText="Updating"
                isBtnLoading={isProcessing}
              />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
