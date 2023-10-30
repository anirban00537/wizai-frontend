import ButtonTextWithLoader from "@/components/ButtonTextWithLoader";
import { useAddCategoriesFormHandler } from "@/hooks/templateSettings.hook";
import Link from "next/link";
import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import Select from "react-select";

const status = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

export default function Index() {
  const {
    register,
    handleSubmit,
    handleAddCategoriesSettings,
    Controller,
    control,
    setValue,
    errors,
    isLoading,
  } = useAddCategoriesFormHandler();
  return (
    <div className="container">
      <div className=" min-h-screen">
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
              Create Categories
            </h4>
          </div>
          <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
        </div>
        <div className="py-10 px-6">
          <div className="container">
            <form onSubmit={handleSubmit(handleAddCategoriesSettings)}>
              <div>
                <div>
                  <h4 className="mb-4 text-xl font-bold">Create Categories</h4>
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
                disabled={isLoading}
              >
                <ButtonTextWithLoader
                  normalText="Create"
                  loadingText="Creating"
                  isBtnLoading={isLoading}
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
