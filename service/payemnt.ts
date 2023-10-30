import request from "@/utils/request";

export const createStripePaymentIntent = async (amount: number) => {
  const { data } = await request.post("/payments/create-stripe-intent", {
    amount: amount,
  });
  return data;
};

export const verifyPaymentIntentApiForSubscription = async (
  payment_intent_id: any,
  subcription_package_Id: any
) => {
  const { data } = await request.post(
    "/payments/confirm-and-verify-stripe-payment",
    {
      payment_intent_id: payment_intent_id,
      subcription_package_Id: subcription_package_Id,
    }
  );
  return data;
};

export const verifyPaymentIntentApiForAditionPack = async (
  payment_intent_id: any,
  package_Id: any
) => {
  const { data } = await request.post("/payments/add-package-to-subscription", {
    payment_intent_id: payment_intent_id,
    packageId: package_Id,
  });
  return data;
};
