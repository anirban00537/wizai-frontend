import {
  addFaqSettingsFormHandleApi,
  braintreeCredSettingsFormHandleApi,
  faqListsForAdminDeleteHandleApi,
  featureOfAiFormHandleApi,
  featureOfAiListsForAdminDeleteHandleApi,
  generalSettingsFormHandleApi,
  getAdminDashboardData,
  getBraintreeCredSettingsDataApi,
  getFaqDetailsApi,
  getFaqListsForAdminApi,
  getFeatureOfAiDetailsApi,
  getFeatureOfAiListsForAdminApi,
  getGeneralSettingsDataApi,
  getGithubAuthSettingsDataApi,
  getGoogleAuthSettingsDataApi,
  getMyUsesApi,
  getOpenAiModels,
  getOpenAiSettings,
  getPrivacyAndTermsSettingsDataApi,
  getProgramingLanguageDetailsApi,
  getProgramingLanguageListsForAdminApi,
  getReviewsDetailsApi,
  getReviewsListsForAdminApi,
  getSiteSettingsDataApi,
  getSmtpSettingsDataApi,
  getSocialMediaDetailsApi,
  getSocialMediaListsForAdminApi,
  getStripeCredSettingsDataApi,
  getTransactionHistoryList,
  getTransactionList,
  getUserListsForAdminApi,
  getUsesHistoryForAdminApi,
  githubAuthSettingsFormHandleApi,
  googleAuthSettingsFormHandleApi,
  privacyAndTermsSettingsFormHandleApi,
  programingLanguageForAdminDeleteHandleApi,
  programingLanguageFormHandleApi,
  reviewsFormHandleApi,
  reviewsListsForAdminDeleteHandleApi,
  siteSettingsFormHandleApi,
  smtpSettingsFormHandleApi,
  smtpTestMailSettingsFormHandleApi,
  socialMediaDeleteHandleApi,
  socialMediaFormHandleApi,
  socialMediaUpdateFormHandleApi,
  stripeCredSettingsFormHandleApi,
  updateFaqSettingsFormHandleApi,
  updateFeatureOfAiFormHandleApi,
  updateOpenAiSettings,
  updateProgramingLanguageFormHandleApi,
  updateReviewsFormHandleApi,
  updateUserStatusApi,
} from "@/service/admin";
import { processResponse } from "@/utils/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCommonSettings } from "./common.hook";

export const useGetGeneralSettingsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["generalSettingsData"],
    queryFn: () => getGeneralSettingsDataApi(),
  });

  return {
    data,
    isLoading,
  };
};
export const useGetTransactionList = () => {
  const [search, setSearch] = useState<any>("");
  const [currentPage, setCurrentPage] = useState<any>(1);

  const { data, isLoading } = useQuery({
    queryKey: ["getTransactionList", search],
    queryFn: () => getTransactionList(10, currentPage, search),
  });
  const handlePageClick = (event: any) => {
    setCurrentPage(event?.selected + 1);
  };
  return {
    data,
    isLoading,
    currentPage,
    setCurrentPage,
    handlePageClick,
    setSearch,
    search,
  };
};
export const useGetAdminDashboardData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin_dashboard"],
    queryFn: () => getAdminDashboardData(),
  });

  return {
    data: data?.data,
    isLoading,
  };
};

export const useGeneralSettingsFormHandler = () => {
  const [siteLogoId, setsiteLogoId] = useState();
  const [favId, setFavId] = useState();
  const [uploadImageUrlForLogo, setuploadImageUrlForLogo] = useState();
  const [uploadImageUrlForFav, setuploadImageUrlForFav] = useState();
  const { refetch } = useCommonSettings();

  const schema = yup
    .object({
      site_name: yup.string().required("Site name is required"),
      site_copy_right_text: yup
        .string()
        .required("Copy Right Text is required"),
      site_url: yup.string().required("Site url is required"),
      site_email: yup.string().required("Site email is required"),

      default_country: yup
        .object()
        .shape({
          value: yup.string().required(),
          label: yup.string().required(),
        })
        .required("Default country is required"),

      social_login_github_status: yup.boolean(),
      social_login_google_status: yup.boolean(),
      site_logo: yup.number(),
      site_fav_icon: yup.number(),
      meta_title: yup.string(),
      meta_keywords: yup.string(),
      meta_description: yup.string(),
      google_analytics_tracking_id: yup.string(),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return generalSettingsFormHandleApi(data);
  });

  const handleGeneralSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        default_country: data.default_country?.value,
        default_currency: data.default_currency?.value,
        social_login_github_status: data.social_login_github_status ? 1 : 0,
        social_login_google_status: data.social_login_google_status ? 1 : 0,
      };
      const response = await mutateAsync(value);
      processResponse(response);
      refetch();
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleGeneralSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
    uploadImageUrlForLogo,
    setuploadImageUrlForLogo,
    setuploadImageUrlForFav,
    uploadImageUrlForFav,
    siteLogoId,
    setsiteLogoId,
    setFavId,
    favId,
  };
};
export const useOpenAi = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { mutateAsync, isLoading: IsUpdating } = useMutation((data: any) => {
    return updateOpenAiSettings(data);
  });
  const handleUpdate = async (data: any) => {
    try {
      let value = {
        ...data,
        open_ai_model: data.open_ai_model.value,
      };

      if (value.open_ai_secret.includes("*".repeat(3))) {
        delete value.open_ai_secret;
      }

      // Convert temperature and max_output_length to numbers
      value.open_ai_temperature = Number(value.open_ai_temperature);
      value.open_ai_max_output_length = Number(value.open_ai_max_output_length);

      const response = await mutateAsync(value);

      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getOpenAiModels"],
    queryFn: () => getOpenAiModels(),
  });
  const { data: SettingsData, isLoading: SettingsLoading } = useQuery({
    queryKey: ["getOpenAiSettings"],
    queryFn: () => getOpenAiSettings(),
  });
  return {
    data,
    isLoading,
    register,
    handleSubmit,
    SettingsData,
    SettingsLoading,
    IsUpdating,
    handleUpdate,
    Controller,
    control,
    errors,
    setValue,
  };
};
export const useGetSmtpSettingsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["smtpSettingsData"],
    queryFn: () => getSmtpSettingsDataApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useSmtpSettingsFormHandler = () => {
  const schema = yup
    .object({
      smtp_host: yup.string().nullable().required("SMTP Host is required"),
      smtp_port: yup
        .number()
        .integer("SMTP Port must be an integer")
        .nullable()
        .required("SMTP Port is required"),
      smtp_user_name: yup
        .string()
        .nullable()
        .required("SMTP User Name is required"),
      smtp_password: yup
        .string()
        .nullable()
        .required("SMTP Password is required"),
      smtp_sender_email: yup
        .string()
        .nullable()
        .required("SMTP Sender Email is required"),
      smtp_sender_name: yup
        .string()
        .nullable()
        .required("SMTP Sender Name is required"),
      smtp_encryption: yup
        .string()
        .nullable()
        .required("SMTP Encryption is required"),
      mail_driver: yup.string().nullable().required("Mail Driver is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return smtpSettingsFormHandleApi(data);
  });

  const handleSmtpSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        smtp_port: Number(data.smtp_port),
        mail_driver: data.mail_driver.toLowerCase(), // Convert to lowercase
      };

      const response = await mutateAsync(value);

      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleSmtpSettings,
    isLoading,
    errors,
    setValue,
  };
};

export const useSmtpSettingsTestMailHandler = () => {
  const { register, handleSubmit, control } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return smtpTestMailSettingsFormHandleApi(data);
  });

  const handleSmtpTestMail = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleSmtpTestMail,
    isLoading,
  };
};

// for privacy and terms

export const useGetPrivacyAndTermsSettingsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["privacyAndTermsData"],
    queryFn: () => getPrivacyAndTermsSettingsDataApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const usePrivacyAndTermsSettingsFormHandler = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm();

  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return privacyAndTermsSettingsFormHandleApi(data);
  });

  const handlePrivacyAndTermsSettings = async (data: any) => {
    try {
      let value = {
        privacy_policy: data.privacy_policy.replace(/<[^>]*>/g, ""),
        terms_condition: data.terms_condition.replace(/<[^>]*>/g, ""),
        privacy_policy_status: Number(data.privacy_policy_status?.value),
        terms_condition_status: Number(data.terms_condition_status?.value),
      };

      const response = await mutateAsync(value);

      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handlePrivacyAndTermsSettings,
    isLoading,
    errors,
    setValue,
    watch,
    Controller,
    control,
  };
};

export const useGetGoogleAuthSettingsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["googleAuthSettingsData"],
    queryFn: () => getGoogleAuthSettingsDataApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetGithubAuthSettingsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["githubAuthSettingsData"],
    queryFn: () => getGithubAuthSettingsDataApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGoogleAuthSettingsFormHandler = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return googleAuthSettingsFormHandleApi(data);
  });

  const handleGoogleAuthSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleGoogleAuthSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
  };
};

export const useGithubAuthSettingsFormHandler = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return githubAuthSettingsFormHandleApi(data);
  });

  const handleGithubAuthSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleGithubAuthSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
  };
};

export const useGetStripeCredSettingsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["stripeCredSettingsData"],
    queryFn: () => getStripeCredSettingsDataApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useStripeCredSettingsFormHandler = () => {
  const { refetch } = useCommonSettings();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return stripeCredSettingsFormHandleApi(data);
  });

  const handleStripeCredSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      refetch();
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleStripeCredSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
  };
};

export const useAddFaqSettingsFormHandler = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addFaqSettingsFormHandleApi(data);
  });

  const handleAddFaqSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        type: Number(data.type),
      };

      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push("/admin/faqs");
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleAddFaqSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
  };
};

export const useGetFaqListsForAdmin = (currentPage: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["faqListsForAdmin", currentPage],
    queryFn: () => getFaqListsForAdminApi(currentPage),
  });

  return {
    data,
    isLoading,
  };
};

export const useDeleteFaqListsForAdmin = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return faqListsForAdminDeleteHandleApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["faqListsForAdmin"]);
      },
    }
  );

  const faqListsForAdminDeleteHandle = async (temp_id: any) => {
    try {
      const response = await mutateAsync(temp_id);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    faqListsForAdminDeleteHandle,
    isLoading,
  };
};

export const useGetFaqDetails = (faq_id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["faqDetails", faq_id],
    queryFn: () => getFaqDetails(faq_id),
    enabled: faq_id ? true : false,
  });

  const getFaqDetails = async (faq_id: any) => {
    if (!faq_id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getFaqDetailsApi(faq_id);

    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateFaqSettingsFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateFaqSettingsFormHandleApi(data);
  });

  const handleUpdateFaqSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        type: Number(data.type),
      };

      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push("/admin/faqs");
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleUpdateFaqSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
  };
};

export const useGetSiteSettingsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["siteSettingsData"],
    queryFn: () => getSiteSettingsDataApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useSiteSettingsFormHandler = () => {
  const [bannerImageId, setBannerImageId] = useState();
  const [uploadImageUrlForBannerImage, setUploadImageUrlForBannerImage] =
    useState();

  const [logoId, setLogoId] = useState();
  const [uploadImageUrlForLogo, setUploadImageUrlForLogo] = useState();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return siteSettingsFormHandleApi(data);
  });

  const handleSiteSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        landing_page_first_img_url: Number(data.landing_page_first_img_url),
      };
      if (!bannerImageId) {
        delete value.landing_page_first_img_url;
      }

      const response = await mutateAsync(value);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleSiteSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
    uploadImageUrlForBannerImage,
    setUploadImageUrlForBannerImage,
    bannerImageId,
    setBannerImageId,
    setLogoId,
    logoId,
    uploadImageUrlForLogo,
    setUploadImageUrlForLogo,
  };
};

// for feature of Ai

export const useFeatureOfAiListsForAdmin = (currentPage: any) => {
  const [search, setSearch] = useState<any>("");
  const { data, isLoading } = useQuery({
    queryKey: ["featureOfAiListsForAdmin", currentPage, search],
    queryFn: () => getFeatureOfAiListsForAdminApi(currentPage, search),
  });

  return {
    data,
    isLoading,
    search,
    setSearch,
  };
};

export const useFeatureOfAiFormHandler = () => {
  const router = useRouter();
  const [featureImage, setFeatureImage] = useState();
  const [uploadFeatureImage, setUploadFeatureImage] = useState();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return featureOfAiFormHandleApi(data);
  });

  const handlFeatureOfAi = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push("/admin/site-settings/feature-of-ai");
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handlFeatureOfAi,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
    uploadFeatureImage,
    setUploadFeatureImage,
    featureImage,
    setFeatureImage,
  };
};

export const useDeleteFeatureOfAiListsForAdmin = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return featureOfAiListsForAdminDeleteHandleApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["featureOfAiListsForAdmin"]);
      },
    }
  );

  const featureOfAiListsForAdminDelete = async (temp_id: any) => {
    try {
      const response = await mutateAsync(temp_id);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    featureOfAiListsForAdminDelete,
    isLoading,
  };
};

export const useGetFeatureOfAiDetails = (feature_id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["FeatureOfAiDetails", feature_id],
    queryFn: () => getFeatureOfAiDetails(feature_id),
    enabled: feature_id ? true : false,
  });

  const getFeatureOfAiDetails = async (feature_id: any) => {
    if (!feature_id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getFeatureOfAiDetailsApi(feature_id);

    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateFeatureOfAiFormHandler = () => {
  const router = useRouter();
  const [featureImage, setFeatureImage] = useState();
  const [uploadFeatureImage, setUploadFeatureImage] = useState();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateFeatureOfAiFormHandleApi(data);
  });

  const handlFeatureOfAi = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push("/admin/site-settings/feature-of-ai");
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handlFeatureOfAi,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
    uploadFeatureImage,
    setUploadFeatureImage,
    featureImage,
    setFeatureImage,
  };
};

// for Reviews

export const useReviewsListsForAdmin = (currentPage: any) => {
  const [search, setSearch] = useState<any>("");
  const { data, isLoading } = useQuery({
    queryKey: ["reviewsListsForAdmin", currentPage, search],
    queryFn: () => getReviewsListsForAdminApi(currentPage, search),
  });

  return {
    data,
    isLoading,
    setSearch,
    search,
  };
};

export const useReviewsFormHandler = () => {
  const router = useRouter();
  const [featureImage, setFeatureImage] = useState();
  const [uploadFeatureImage, setUploadFeatureImage] = useState();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return reviewsFormHandleApi(data);
  });

  const handlReviews = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        rating: Number(data.rating?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push("/admin/site-settings/reviews");
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handlReviews,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
    uploadFeatureImage,
    setUploadFeatureImage,
    featureImage,
    setFeatureImage,
  };
};

export const useDeleteReviewsListsForAdmin = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return reviewsListsForAdminDeleteHandleApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reviewsListsForAdmin"]);
      },
    }
  );

  const reviewsListsForAdminDelete = async (temp_id: any) => {
    try {
      const response = await mutateAsync(temp_id);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    reviewsListsForAdminDelete,
    isLoading,
  };
};

export const useGetReviewsDetails = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["reviewsListsForAdmin", id],
    queryFn: () => getReviewsDetails(id),
    enabled: id ? true : false,
  });

  const getReviewsDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getReviewsDetailsApi(id);

    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateReviewsFormHandler = () => {
  const router = useRouter();
  const [featureImage, setFeatureImage] = useState();
  const [uploadFeatureImage, setUploadFeatureImage] = useState();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateReviewsFormHandleApi(data);
  });

  const updateReviesHandler = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        rating: Number(data.rating?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push("/admin/site-settings/reviews");
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    updateReviesHandler,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
    uploadFeatureImage,
    setUploadFeatureImage,
    featureImage,
    setFeatureImage,
  };
};

// for Programing Language

export const useProgramingLanguageListsForAdmin = (currentPage: any) => {
  const [search, setSearch] = useState<any>("");
  const { data, isLoading } = useQuery({
    queryKey: ["programingLanguageListsForAdmin", currentPage, search],
    queryFn: () => getProgramingLanguageListsForAdminApi(currentPage, search),
  });

  return {
    data,
    isLoading,
    setSearch,
    search,
  };
};

export const useProgramingLanguageFormHandler = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return programingLanguageFormHandleApi(data);
  });

  const handlProgramingLanguage = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push("/admin/settings/programing-language");
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handlProgramingLanguage,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
  };
};

export const useDeleteProgramingLanguageForAdmin = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return programingLanguageForAdminDeleteHandleApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["programingLanguageListsForAdmin"]);
      },
    }
  );

  const programingLanguageForAdminDelete = async (temp_id: any) => {
    try {
      const response = await mutateAsync(temp_id);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    programingLanguageForAdminDelete,
    isLoading,
  };
};

export const useGetProgramingLanguageDetails = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["programingLanguageDetails", id],
    queryFn: () => getProgramingLanguageDetails(id),
    enabled: id ? true : false,
  });

  const getProgramingLanguageDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getProgramingLanguageDetailsApi(id);

    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateProgramingLanguageDetailsFormHandler = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateProgramingLanguageFormHandleApi(data);
  });

  const updateProgramingLanguageHandler = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push("/admin/settings/programing-language");
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    updateProgramingLanguageHandler,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
  };
};

export const useGetUserListsForAdmin = (page: any) => {
  const [search, setSearch] = useState<any>("");
  const { data, isLoading } = useQuery({
    queryKey: ["userListsForAdmin", page, search],
    queryFn: () => getUserListsForAdminApi(page, search),
  });

  return {
    data,
    isLoading,
    setSearch,
    search,
  };
};

export const useUpdateUserStatusFormHandler = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateUserStatusApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userListsForAdmin"]);
      },
    }
  );

  const updateUserStatus = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    updateUserStatus,
    isLoading,
  };
};

export const useGetMyUses = (currentPage: any) => {
  const [search, setSearch] = useState<any>("");
  const { data, isLoading } = useQuery({
    queryKey: ["myUses", currentPage, search],
    queryFn: () => getMyUsesApi(currentPage, search),
  });

  return {
    data,
    isLoading,
    setSearch,
    search,
  };
};

export const useGetUsesHistoryForAdmin = (currentPage: any) => {
  const [search, setSearch] = useState<any>("");
  const { data, isLoading } = useQuery({
    queryKey: ["usesHistoryForAdmin", currentPage, search],
    queryFn: () => getUsesHistoryForAdminApi(currentPage, search),
  });

  return {
    data,
    isLoading,
    setSearch,
    search,
  };
};

export const useBraintreeCredSettingsFormHandler = () => {
  const { refetch } = useCommonSettings();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return braintreeCredSettingsFormHandleApi(data);
  });

  const handleBraintreeCredSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        braintree_payment_mode: Number(data?.braintree_payment_mode?.value),
      };
      const response = await mutateAsync(value);
      refetch();
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleBraintreeCredSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
  };
};

export const useGetBraintreeCredSettingsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["braintreeCredSettingsData"],
    queryFn: () => getBraintreeCredSettingsDataApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetTransactionHistoryList = () => {
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");

  const { data, isLoading } = useQuery({
    queryKey: ["getTransactionHistoryList", search, currentPage],
    queryFn: () => getTransactionHistoryList(10, currentPage, search),
  });
  const handlePageClick = (event: any) => {
    setCurrentPage(event?.selected + 1);
  };
  return {
    data,
    isLoading,
    currentPage,
    setCurrentPage,
    handlePageClick,
    setSearch,
    search,
  };
};

//for social media

export const useGetSocialMediaForAdmin = (currentPage: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["socialMediaLists", currentPage],
    queryFn: () => getSocialMediaListsForAdminApi(currentPage),
  });

  return {
    data,
    isLoading,
  };
};

export const useSocialMediaFormHandler = () => {
  const router = useRouter();

  const [socialImage, setSocialImage] = useState();
  const [uploadImage, setUploadImage] = useState();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return socialMediaFormHandleApi(data);
  });

  const handleSocialMediaSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push(`/admin/site-settings/social-media`);
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleSocialMediaSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
    socialImage,
    setSocialImage,
    uploadImage,
    setUploadImage,
  };
};

export const useDeleteSocialMediaForAdmin = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return socialMediaDeleteHandleApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["socialMediaLists"]);
      },
    }
  );

  const socialMediaDeleteHandler = async (temp_id: any) => {
    try {
      const response = await mutateAsync(temp_id);
      processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    socialMediaDeleteHandler,
    isLoading,
  };
};

export const useGetSocailMediaDetails = (media_id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["faqDetails", media_id],
    queryFn: () => getSocialMediaDetails(media_id),
    enabled: media_id ? true : false,
  });

  const getSocialMediaDetails = async (media_id: any) => {
    if (!media_id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getSocialMediaDetailsApi(media_id);

    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateSocialMediaFormHandler = () => {
  const router = useRouter();

  const [socialImage, setSocialImage] = useState();
  const [uploadImage, setUploadImage] = useState();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return socialMediaUpdateFormHandleApi(data);
  });

  const handleSocialMediaSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push(`/admin/site-settings/social-media`);
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    register,
    handleSubmit,
    handleSocialMediaSettings,
    Controller,
    control,
    isLoading,
    setValue,
    errors,
    socialImage,
    setSocialImage,
    uploadImage,
    setUploadImage,
  };
};
