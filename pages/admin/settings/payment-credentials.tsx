import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import React, { useEffect, useState } from "react";
import Select from "react-select";

import {
  useBraintreeCredSettingsFormHandler,
  useGetBraintreeCredSettingsData,
  useGetGithubAuthSettingsData,
  useGetGoogleAuthSettingsData,
  useGetStripeCredSettingsData,
  useGithubAuthSettingsFormHandler,
  useGoogleAuthSettingsFormHandler,
  useStripeCredSettingsFormHandler,
} from "@/hooks/admin";

import SectionLoader from "@/components/SectionLoader";
import ButtonTextWithLoader from "@/components/ButtonTextWithLoader";
import { BRAINTREE_MODE } from "@/helpers/coreConstant";

const brainTree = [
  { value: BRAINTREE_MODE.LIVE, label: "Live" },
  { value: BRAINTREE_MODE.SANDBOX, label: "Sandbox" },
];

export default function General() {
  const {
    register,
    handleSubmit,
    handleStripeCredSettings,
    setValue,
    errors,
    isLoading: isProcessing,
  } = useStripeCredSettingsFormHandler();

  const { data: stripeSettingsData, isLoading } =
    useGetStripeCredSettingsData();

  // for braintree
  const {
    register: isBraintreRegister,
    handleSubmit: isBraintreHandleSubmit,
    handleBraintreeCredSettings,
    setValue: isBraintreSetValue,
    errors: isBraintreErrors,
    isLoading: isBraintreProcessing,
    Controller,
    control,
  } = useBraintreeCredSettingsFormHandler();

  const { data: braintreeSettingsData, isLoading: isBraintreeLoading } =
    useGetBraintreeCredSettingsData();

  useEffect(() => {
    setValue(
      "pm_stripe_client_id_live",
      stripeSettingsData?.data?.pm_stripe_client_id_live
    );
    setValue(
      "pm_stripe_secret_key_live",
      stripeSettingsData?.data?.pm_stripe_secret_key_live
    );
  }, [stripeSettingsData?.data]);

  useEffect(() => {
    isBraintreSetValue(
      "braintree_merchant_id",
      braintreeSettingsData?.data?.braintree_merchant_id
    );
    isBraintreSetValue(
      "braintree_public_key",
      braintreeSettingsData?.data?.braintree_public_key
    );
    isBraintreSetValue(
      "braintree_private_key",
      braintreeSettingsData?.data?.braintree_private_key
    );
    isBraintreSetValue(
      "braintree_tokenization_keys",
      braintreeSettingsData?.data?.braintree_tokenization_keys
    );
    isBraintreSetValue(
      "braintree_google_merchant_id",
      braintreeSettingsData?.data?.braintree_google_merchant_id
    );

    isBraintreSetValue(
      "braintree_payment_mode",
      setStatusValue(braintreeSettingsData?.data?.braintree_payment_mode)
    );
  }, [braintreeSettingsData?.data]);

  const setStatusValue = (data: any) => {
    if (!data) {
      return brainTree[0];
    }

    let newData = brainTree.find((item) => item.value == data);

    if (!newData?.value) {
      return brainTree[0];
    }

    return newData;
  };

  if (isLoading || isBraintreeLoading) return <SectionLoader />;
  return (
    <div className="container">
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
            Payment Credentials Settings
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-3 md:mt-0"></div>
      </div>

      <div className="py-10 px-6">
        <div className="container">
          <div>
            <form onSubmit={handleSubmit(handleStripeCredSettings)}>
              <div>
                <div>
                  <h4 className="mb-4 text-xl font-bold">
                    Stripe Credentials Settings
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pm_stripe_client_id_live">
                      Stripe Client Id
                    </label>
                    <input
                      id="pm_stripe_client_id_live"
                      type="password"
                      placeholder="Stripe Client Id"
                      className="form-input"
                      {...register("pm_stripe_client_id_live")}
                      required
                    />
                    <p className="mt-1 text-danger">
                      <small>{errors.pm_stripe_client_id_live?.message}</small>
                    </p>
                  </div>
                  <div>
                    <label htmlFor="pm_stripe_secret_key_live">
                      Stripe Client Secret
                    </label>
                    <input
                      id="pm_stripe_secret_key_live"
                      type="password"
                      placeholder="Stripe Client Secret"
                      className="form-input"
                      {...register("pm_stripe_secret_key_live")}
                      required
                    />
                    <p className="mt-1 text-danger">
                      <small>{errors.pm_stripe_secret_key_live?.message}</small>
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-8 min-w-[180px] rounded-full"
                disabled={isProcessing}
              >
                <ButtonTextWithLoader
                  normalText="Save"
                  loadingText="Saveing"
                  isBtnLoading={isProcessing}
                />
              </button>
            </form>
            <div className="mt-8">
              <form
                onSubmit={isBraintreHandleSubmit(handleBraintreeCredSettings)}
              >
                <div>
                  <div>
                    <h4 className="mb-4 text-xl font-bold">
                      Braintree Credentials Settings
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label>Braintree Payment Mode</label>
                      <Controller
                        control={control}
                        name="braintree_payment_mode"
                        render={({ field }: any) => (
                          <Select
                            classNamePrefix={"wizai-select"}
                            options={brainTree}
                            {...field}
                            required
                          />
                        )}
                      />
                      <p className="mt-1 text-danger">
                        <small>{errors.braintree_payment_mode?.message}</small>
                      </p>
                    </div>
                    <div>
                      <label htmlFor="braintree_merchant_id">
                        Braintree Merchant Id
                      </label>
                      <input
                        id="braintree_merchant_id"
                        type="password"
                        placeholder="Braintree Merchant Id"
                        className="form-input"
                        {...isBraintreRegister("braintree_merchant_id")}
                        required
                      />
                      <p className="mt-1 text-danger">
                        <small>{errors.braintree_merchant_id?.message}</small>
                      </p>
                    </div>
                    <div>
                      <label htmlFor="braintree_public_key">
                        Braintree Public Key
                      </label>
                      <input
                        id="braintree_public_key"
                        type="password"
                        placeholder="Braintree Public Key"
                        className="form-input"
                        {...isBraintreRegister("braintree_public_key")}
                        required
                      />
                      <p className="mt-1 text-danger">
                        <small>{errors.braintree_public_key?.message}</small>
                      </p>
                    </div>
                    <div>
                      <label htmlFor="braintree_private_key">
                        Braintree Private Key
                      </label>
                      <input
                        id="braintree_private_key"
                        type="password"
                        placeholder="Braintree Private Key"
                        className="form-input"
                        {...isBraintreRegister("braintree_private_key")}
                        required
                      />
                      <p className="mt-1 text-danger">
                        <small>{errors.braintree_private_key?.message}</small>
                      </p>
                    </div>
                    <div>
                      <label htmlFor="braintree_tokenization_keys">
                        Braintree Tokenization Keys
                      </label>
                      <input
                        id="braintree_tokenization_keys"
                        type="password"
                        placeholder="Braintree Tokenization Keys"
                        className="form-input"
                        {...isBraintreRegister("braintree_tokenization_keys")}
                        required
                      />
                      <p className="mt-1 text-danger">
                        <small>
                          {errors.braintree_tokenization_keys?.message}
                        </small>
                      </p>
                    </div>
                    <div>
                      <label htmlFor="braintree_google_merchant_id">
                        Braintree Google Merchant Id
                      </label>
                      <input
                        id="Braintree Google Merchant Id"
                        type="password"
                        placeholder="Braintree Google Merchant Id"
                        className="form-input"
                        {...isBraintreRegister("braintree_google_merchant_id")}
                        required
                      />
                      <p className="mt-1 text-danger">
                        <small>
                          {errors.braintree_google_merchant_id?.message}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-8 min-w-[180px] rounded-full"
                  disabled={isBraintreProcessing}
                >
                  <ButtonTextWithLoader
                    normalText="Save"
                    loadingText="Saveing"
                    isBtnLoading={isBraintreProcessing}
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
