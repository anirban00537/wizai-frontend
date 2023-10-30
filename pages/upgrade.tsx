import UpgradeItem from "@/components/Admin/Packages/UpgradeItem";
import { loadStripe } from "@stripe/stripe-js";
import { PACKAGE_DURATION, PACKAGE_TYPES } from "@/helpers/coreConstant";
import { Elements } from "@stripe/react-stripe-js";
import {
  useBraintreeDropInPaymentHandler,
  useGetAllPackage,
} from "@/hooks/paymentSettings.hook";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import { createStripePaymentIntent } from "@/service/payemnt";
import { toast } from "react-toastify";
import CardPayment from "@/components/CardPayment";
import NoItemFound from "@/components/Common/NoItemFound.comp";
import SectionLoader from "@/components/SectionLoader";

import DropIn from "braintree-web-drop-in-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function Index() {
  const [addPaymentModal, setAddPaymentModal] = useState<any>(false);
  const [showStripeModal, setShowStripeModal] = useState<any>(false);

  const [selectedPack, setSelectedPack] = useState<any>({});
  const [instance, setInstance] = useState<any>(null);

  const [packDetails, setPackDetails] = useState<any>();
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
  );

  const { isSubscribed, details: subscriptionDetails } = useSelector(
    (state: IRootState) => state.subcription
  );

  const { settings } = useSelector((state: IRootState) => state?.common?.data);

  const stripePromise = loadStripe(settings?.pm_stripe_client_id_live);

  const combinedArray = [
    subscriptionDetails?.remaining_words || 0,
    subscriptionDetails?.remaining_images || 0,
  ];

  const imagesAndWords: any = {
    series: [5000, 50],
    options: {
      chart: {
        type: "donut",
        height: 180,
        fontFamily: "Nunito, sans-serif",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 10,
        colors: isDark ? "#0e1726" : "#fff",
      },
      colors: isDark ? ["#645CBB", "#A084DC"] : ["#645CBB", "#A084DC"],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        height: 25,
        offsetY: 20,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "55%",
            background: "transparent",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "16px",
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "14px",
                color: isDark ? "#bfc9d4" : undefined,
                offsetY: 16,
                formatter: (val: any) => {
                  return val;
                },
              },
              total: {
                show: false,
                label: "Tokens",
                color: "#888ea8",
                fontSize: "16px",
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce(function (
                    a: any,
                    b: any
                  ) {
                    return a + b;
                  },
                  0);
                },
              },
            },
          },
        },
      },
      labels: [
        `Word (${subscriptionDetails?.remaining_words || 0})`,
        `Image (${subscriptionDetails?.remaining_images || 0})`,
      ],
      states: {
        hover: {
          filter: {
            type: "none",
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: "none",
            value: 0.15,
          },
        },
      },
    },
  };
  const [paymentIntent, setPaymentIntent] = React.useState<any>(null);
  const { data: subscriptions, isLoading: loadingForSubscriptions } =
    useGetAllPackage(PACKAGE_TYPES.SUBSCRIPTION);
  const { data: aditionalPacks, isLoading: loadingForAditionalPacks } =
    useGetAllPackage(PACKAGE_TYPES.PACKAGE);

  const { isLoading: isBraintreePaymentLoading, handleBraintreeDropInPayment } =
    useBraintreeDropInPaymentHandler();

  if (loadingForSubscriptions || loadingForAditionalPacks)
    return <SectionLoader />;

  const sripePaymentHandler = async (item: any) => {
    try {
      const paymentIntentResponse = await createStripePaymentIntent(
        parseFloat(item?.price)
      );
      if (!paymentIntentResponse.success) {
        toast.error(paymentIntentResponse.message);
        return;
      }
      setPaymentIntent(paymentIntentResponse.data.intent);
      setAddPaymentModal(false);
      setShowStripeModal(true);
      setPackDetails(item);
    } catch (error: any) {
      if (!error.response.data.success) {
        toast.error(error.response.data.message);
      }
    }
  };

  const paymentHandler = (item: any) => {
    setAddPaymentModal(true);
    setSelectedPack(item);
  };

  const buyPack = async () => {
    try {
      const { nonce } = await instance.requestPaymentMethod();
      if (!nonce) {
        return;
      }
      const data = await handleBraintreeDropInPayment({
        amount: Number(selectedPack?.price),
        payment_method_nonce: nonce,
        packageId: selectedPack?.id,
        type: selectedPack?.type,
      });

      setAddPaymentModal(false);
    } catch (err: any) {
      // if (err.message) {
      //   toast.error(err.message);
      // }
    }
  };

  return (
    <>
      <div className=" items-center justify-between border-b border-[#f1f3f4] py-5 px-6 md:flex">
        <div className="container">
          <Link
            href={`/admin/dashboard`}
            className="mb-3 flex items-center gap-2"
          >
            <IoMdArrowBack size={18} />
            <p>Back to Dashboard</p>
          </Link>

          <h4 className="mt- text-4xl font-bold capitalize">
            Upgrade Settings
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>
      <div className="px-6">
        <div className="container mb-5">
          <div className="mx-auto max-w-[320px] dark:text-white-dark md:max-w-[1140px]">
            <div>
              <h4 className="mt-4 text-xl font-bold">Current plan</h4>
            </div>
            <div className="mt-4 mb-10 ">
              <div className="rounded-md border border-white-light p-4 transition-all duration-300  lg:p-9">
                <div className="md:grid md:grid-cols-2 md:gap-4 ">
                  <div>
                    <div className="mb-4">
                      <h4 className="text-xl font-bold">Upgrade</h4>
                    </div>
                    <div>
                      {isSubscribed ? (
                        <p>
                          You are subscribed to{" "}
                          <strong>{subscriptionDetails?.package?.name}</strong>.
                        </p>
                      ) : (
                        <p>
                          You have no subscription at the moment. Please select
                          a subscription plan or a token pack.
                        </p>
                      )}

                      <p className="mt-4">
                        Total{" "}
                        <strong>
                          {subscriptionDetails?.remaining_words || 0}
                        </strong>{" "}
                        words and{" "}
                        <strong>
                          {subscriptionDetails?.remaining_images || 0}
                        </strong>{" "}
                        images left.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-black">
                    <ReactApexChart
                      series={combinedArray}
                      options={imagesAndWords.options}
                      type="donut"
                      height={250}
                      width={"100%"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {subscriptions?.data?.packages?.length !== 0 && (
          <div className="container mb-5">
            <div className="mx-auto max-w-[320px] dark:text-white-dark md:max-w-[1140px]">
              <div>
                <h4 className="mt-4 text-xl font-bold">Subscriptions</h4>
              </div>
              <div className="mt-4 mb-10 space-y-4 text-white-dark md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                {subscriptions?.data?.packages?.map((item: any, index: any) => (
                  <UpgradeItem
                    item={item}
                    key={index}
                    sripePaymentHandler={paymentHandler}
                    type={PACKAGE_TYPES.SUBSCRIPTION}
                    isSubscribed={isSubscribed}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {aditionalPacks?.data?.packages?.length !== 0 && (
          <div className="container mb-5">
            <div className="mx-auto max-w-[320px] dark:text-white-dark md:max-w-[1140px]">
              <div>
                <h4 className="mt-4 text-xl font-bold">Aditional Packs</h4>
              </div>
              <div className="mt-4 mb-10 space-y-4 text-white-dark md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                {aditionalPacks?.data?.packages?.map(
                  (item: any, index: any) => (
                    <UpgradeItem
                      item={item}
                      key={index}
                      sripePaymentHandler={paymentHandler}
                      type={PACKAGE_TYPES.PACKAGE}
                      isSubscribed={isSubscribed}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Transition appear show={showStripeModal} as={Fragment}>
        <Dialog
          as="div"
          open={showStripeModal}
          onClose={() => setShowStripeModal(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                  <button
                    type="button"
                    onClick={() => setShowStripeModal(false)}
                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  {paymentIntent?.client_secret && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret: paymentIntent.client_secret,
                      }}
                    >
                      <CardPayment
                        setAddPaymentModal={setShowStripeModal}
                        packDetails={packDetails}
                      />
                    </Elements>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={addPaymentModal} as={Fragment}>
        <Dialog
          as="div"
          open={addPaymentModal}
          onClose={() => setAddPaymentModal(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                  <button
                    type="button"
                    onClick={() => setAddPaymentModal(false)}
                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <div className="m-8">
                    <DropIn
                      options={{
                        authorization: settings?.braintree_tokenization_keys,
                        card: false,
                        googlePay: {
                          merchantId: settings?.braintree_google_merchant_id,
                          googlePayVersion: 1,
                          transactionInfo: {
                            currencyCode: "USD",
                            totalPriceStatus: "FINAL",
                            totalPrice: selectedPack?.price,
                          },
                        },
                        paypal: {
                          flow: "checkout",
                          amount: selectedPack?.price,
                          currency: "USD",
                        },
                      }}
                      onInstance={setInstance}
                    />

                    <div className="text-center">
                      <p>Or</p>
                      <div
                        className="mt-4 flex cursor-pointer items-center gap-x-4 rounded-md border py-[12px] px-[10px]"
                        onClick={() => sripePaymentHandler(selectedPack)}
                      >
                        <img
                          src="/assets/images/card.png"
                          alt=""
                          className="h-[35px] w-[48px]"
                        />
                        <span>Card</span>
                      </div>
                    </div>

                    <div>
                      <button
                        className="btn btn-primary mt-4 w-full rounded-full"
                        disabled={
                          !instance || (instance && isBraintreePaymentLoading)
                        }
                        onClick={buyPack}
                      >
                        {instance && isBraintreePaymentLoading
                          ? `Processing..`
                          : `Buy`}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
