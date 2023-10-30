import { IoIosAdd, IoMdArrowBack } from "react-icons/io";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import CustomTemplates from "@/components/Admin/Templates/CustomTemplates";
import {
  useGetTransactionHistoryList,
  useGetTransactionList,
} from "@/hooks/admin";
import CustomPagination from "@/components/CustomPagination";
import SectionLoader from "@/components/SectionLoader";
import DynamicTable from "@/components/Table/DynamicTable.comp";
import moment from "moment";
import SearchBox from "@/components/SearchBox";

export default function Index() {
  const {
    data,
    isLoading,
    setCurrentPage,
    handlePageClick,
    setSearch,
    search,
  } = useGetTransactionHistoryList();

  const columns = useMemo(
    () => [
      { Header: "Package", accessor: "Package.name" },
      {
        Header: "Price",
        Cell: ({ row }: any) => (
          <span>
            {row?.original?.price} {row?.original?.Package?.currency}
          </span>
        ),
      },
      {
        Header: "Total Words",
        Cell: ({ row }: any) => <span>{row.original.Package.total_words}</span>,
      },
      {
        Header: "Total Image",
        Cell: ({ row }: any) => (
          <span>{row.original.Package.total_images}</span>
        ),
      },
      {
        Header: "Transaction Time",
        accessor: (data: any) =>
          moment(data?.created_at).format("MMMM Do YYYY"),
      },
    ],
    []
  );
  return (
    <div className="container">
      <div className=" items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
        <div>
          <Link href={`/dashboard`} className="mb-3 flex items-center gap-2">
            <IoMdArrowBack size={18} />
            <p>Back to Dashboard</p>
          </Link>

          <h4 className="mt- text-4xl font-bold capitalize">
            Transactions History
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>

      <div className="h-full p-2 py-8 sm:min-h-[calc(100vh_-_200px)]">
        <div className="h-full w-full">
          <div className="text-end">
            <SearchBox setSearch={setSearch} search={search} />
          </div>

          <div className="panel h-full">
            <DynamicTable
              data={data?.data?.list || []}
              loading={isLoading}
              columns={columns}
              totalItems={data?.data?.meta?.total}
              perPageItems={data?.data?.meta?.perPage}
              handlePageClick={handlePageClick}
              onPageChange={setCurrentPage}
              activePage={data?.data?.meta?.currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
