import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../../store";
import PerfectScrollbar from "react-perfect-scrollbar";

import { setPageTitle } from "../../../store/themeConfigSlice";
import { IoIosAdd } from "react-icons/io";
import { BsCurrencyDollar, BsFillPencilFill } from "react-icons/bs";
import { BiUserPlus } from "react-icons/bi";
import { AiFillCamera } from "react-icons/ai";

import Link from "next/link";
import { useGetAdminDashboardData } from "@/hooks/admin";
import WeeklyRevenue from "@/components/Charts/WeeklyRevenue.comp";
import moment from "moment";
import { PACKAGE_DURATION, PACKAGE_TYPES } from "@/helpers/coreConstant";
import ApexChart from "@/components/Charts/ApexChart";
import NoItemFound from "@/components/Common/NoItemFound.comp";
import SectionLoader from "@/components/SectionLoader";

const Index = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetAdminDashboardData();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });

  if (isLoading) return <SectionLoader />;

  return (
    <>
      <div className="container">
        <div className=" items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
          <div>
            <p className="mb-3">Dashboard</p>
            <h4 className="mt- text-4xl font-bold"> Overview</h4>
          </div>
          <div className="mt-2 flex items-center gap-3 md:mt-0">
            <Link href={"/admin/templates/custom-templates/create"}>
              <button
                type="button"
                className="btn btn-outline-primary rounded-full px-3 py-1 text-xs"
              >
                <IoIosAdd size={20} />
                Create Template
              </button>
            </Link>
            <Link href={"/admin/payments/packages/create"}>
              <button
                type="button"
                className="btn btn-outline-primary rounded-full px-3 py-1 text-xs"
              >
                <IoIosAdd size={20} />
                Add Package
              </button>
            </Link>
          </div>
        </div>

        <div className="px-6 pt-5">
          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-4 ">
            <div className="flex items-center rounded-md border border-[#f1f3f4] bg-white px-4 py-6">
              <div className="h-16 w-16 ltr:mr-3 rtl:ml-3">
                <div className="grid h-16 w-16 place-content-center  rounded-full bg-primary-light text-primary dark:bg-primary dark:text-primary-light">
                  <BsCurrencyDollar size={30} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-white-dark ltr:ml-auto rtl:mr-auto">
                  {data?.totalSale ? data?.totalSale : 0}
                </p>
                <div className="mb-2 flex font-semibold text-white-dark">
                  <h6>Total Sale</h6>
                </div>
              </div>
            </div>
            <div className="flex items-center rounded-md border border-[#f1f3f4] bg-white px-4 py-6">
              <div className="h-16 w-16 ltr:mr-3 rtl:ml-3">
                <div className="grid h-16 w-16 place-content-center  rounded-full bg-secondary-light text-secondary dark:bg-success dark:text-secondary-light">
                  <BiUserPlus size={30} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-white-dark ltr:ml-auto rtl:mr-auto">
                  {data?.totalUsers ? data?.totalUsers : 0}
                </p>
                <div className="mb-2 flex font-semibold text-white-dark">
                  <h6>Total users</h6>
                </div>
              </div>
            </div>
            <div className="flex items-center rounded-md border border-[#f1f3f4] bg-white px-4 py-6">
              <div className="h-16 w-16  ltr:mr-3 rtl:ml-3">
                <div className="grid h-16 w-16  place-content-center  rounded-full bg-primary-light text-primary dark:bg-primary dark:text-primary-light">
                  <BsFillPencilFill size={25} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-white-dark ltr:ml-auto rtl:mr-auto">
                  {data?.totalWordGenerated ? data?.totalWordGenerated : 0}
                </p>
                <div className="mb-2 flex font-semibold text-white-dark">
                  <h6>
                    {data?.totalWordGenerated === 0 ? "Word" : "Words "}
                    Generated
                  </h6>
                </div>
              </div>
            </div>
            <div className="flex items-center rounded-md border border-[#f1f3f4] bg-white px-4 py-6">
              <div className="h-16 w-16 ltr:mr-3 rtl:ml-3">
                <div className="grid h-16 w-16 place-content-center  rounded-full bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">
                  <AiFillCamera size={30} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-white-dark ltr:ml-auto rtl:mr-auto">
                  {data?.totalImageGenerated ? data?.totalImageGenerated : 0}
                </p>
                <div className="mb-2 flex font-semibold text-white-dark">
                  <h6>
                    {data?.totalImageGenerated === 0 ? "Image" : "Images"}{" "}
                    Generated
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="panel h-full">
                <div className="mb-5 flex items-center justify-between dark:text-white-light">
                  <h5 className="text-lg font-semibold">This Week Revenue</h5>
                </div>

                <div className="relative">
                  <div className="rounded-lg bg-white dark:bg-black">
                    {isMounted ? (
                      <>
                        {data?.weeklySalesData && (
                          <WeeklyRevenue value={data.weeklySalesData} />
                        )}
                      </>
                    ) : (
                      <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                        <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-6 grid">
                <div className="panel h-full">
                  <div className="mb-5 flex items-center justify-between dark:text-white-light">
                    <h5 className="text-lg font-semibold">
                      New Users This Year
                    </h5>
                  </div>

                  <div className="relative">
                    <div className="rounded-lg bg-white dark:bg-black">
                      {isMounted && window ? (
                        <>
                          {data?.usersCountByMonth && (
                            <ApexChart
                              data={data?.usersCountByMonth}
                              name="User Count"
                            />
                          )}
                        </>
                      ) : (
                        <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                          <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 grid">
            <div className="panel h-full overflow-auto">
              <div className="-mx-5 mb-5 flex items-start justify-between border-b border-white-light p-5 pt-0  dark:border-[#1b2e4b] dark:text-white-light">
                <h5 className="text-lg font-semibold ">Pricing packages</h5>
              </div>

              <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:-mr-3 ltr:pr-3 rtl:-ml-3 rtl:pl-3">
                <div className="table-responsive">
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Created At</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Duration</th>
                        <th className="px-4 py-2">Total Purchased</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.packageAndSubscriptions?.map((item: any) => (
                        <tr key={item?.id}>
                          <td className=" px-4 py-2">
                            {item?.type === PACKAGE_TYPES.PACKAGE
                              ? "Package"
                              : "Subscription"}
                          </td>
                          <td className=" px-4 py-2">{item?.name}</td>
                          <td className=" px-4 py-2">
                            {moment(item?.created_at).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </td>
                          <td className=" px-4 py-2">
                            {item?.price} {item?.currency}
                          </td>
                          <td className=" px-4 py-2">
                            {item?.duration === PACKAGE_DURATION.WEEKLY
                              ? "Weekly"
                              : item?.duration === PACKAGE_DURATION.MONTHLY
                              ? "Monthly"
                              : "Yearly"}
                          </td>
                          <td className=" px-4 py-2">{item?.total_purchase}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data?.packageAndSubscriptions.length <= 0 && (
                    <NoItemFound message="No Item Found" />
                  )}
                </div>
              </PerfectScrollbar>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="panel h-full w-full">
              <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">
                  Latest Transactions
                </h5>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th className="ltr:rounded-l-md rtl:rounded-r-md">
                        Customer
                      </th>
                      <th>Package</th>
                      <th>Transaction Time</th>
                      <th>Price</th>
                      <th className="ltr:rounded-r-md rtl:rounded-l-md">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.latest_transaction_list.map((item: any) => (
                      <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                        <td className="min-w-[150px] text-black dark:text-white">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                              src={
                                item?.User?.photo
                                  ? item?.User?.photo
                                  : "/assets/images/user-profile.png"
                              }
                              alt="avatar"
                            />
                            <span className="whitespace-nowrap">
                              {item?.User?.last_name}
                            </span>
                          </div>
                        </td>
                        <td className="text-primary">{item?.Package?.name}</td>
                        <td>
                          {moment(item?.created_at).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                        <td>${item?.price}</td>
                        <td>
                          <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.latest_transaction_list?.length <= 0 && (
                  <NoItemFound message="No Transaction List found" />
                )}
              </div>
            </div>
            <div className="panel h-full w-full">
              <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">
                  Top Country Based On User's
                </h5>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th className="ltr:rounded-l-md rtl:rounded-r-md">
                        COUNTRY
                      </th>
                      <th>USERS</th>
                      <th>POPULARITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.user_count_by_country?.data?.map((item: any) => (
                      <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                        <td className="min-w-[150px] text-black dark:text-white">
                          <p>
                            {item?.country ? item?.country : "Not Specified"}
                          </p>
                        </td>
                        <td className="text-primary">{item?._count}</td>
                        <td>{(item?._count / data?.totalUsers) * 100}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.user_count_by_country?.data?.length <= 0 && (
                  <NoItemFound message="No item found" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
