import React, { useEffect, useState } from "react";
import SectionLoader from "@/components/SectionLoader";
import { ACTIVE } from "@/helpers/coreConstant";
import { useSignin } from "@/hooks/authentication.hook";
import { IRootState } from "@/store";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector } from "react-redux";
import BlankLayout from "@/components/Layouts/BlankLayout";
import GitHubLogin from "@/components/Common/GithubLogin.comp";
import Link from "next/link";

const LoginCover = () => {
  const { settings } = useSelector((state: IRootState) => state.common.data);

  const {
    errors,
    handleSubmit,
    register,
    handleLogin,
    isLoading,
    handleGoogleLogin,
    setValue, // Function to set form field values
  } = useSignin();

  const demoUsers = [
    { name: "User", email: "user@email.com", password: "123456" },
    { name: "Admin", email: "admin@email.com", password: "123456" },
    // Add more demo users as needed
  ];

  const selectDemoUser = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
  };

  if (isLoading) return <SectionLoader />;

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden min-h-screen w-1/2 flex-col items-center justify-center p-4 text-white before:absolute before:-z-10 before:h-full before:w-full before:bg-black before:bg-[url('/assets/images/ai-intro.gif')] before:bg-cover before:bg-left before:bg-no-repeat before:bg-blend-darken dark:text-black lg:flex">
        <div>
          <Link href={`/`}>
            <img
              src={settings?.site_logo ? settings?.site_logo : " "}
              alt=""
              className="mb-2 inline-block h-[90px] max-w-full"
            />
          </Link>
        </div>
        <h3 className="mb-4 text-center text-3xl font-bold">
          Join the AI Revolution
        </h3>
        <p className="mb-7">
          Experience the power of AI with our SaaS platform. Join us and unlock
          new levels of productivity and creativity.
        </p>
      </div>
      <div className="relative flex w-full items-center justify-center bg-white lg:w-1/2">
        <div className="w-full max-w-md rounded-lg p-5 md:p-10">
          <h2 className="mb-3 text-center text-3xl font-bold">Login</h2>
          <form
            className="space-y-5"
            onSubmit={handleSubmit((data) => {
              handleLogin(data.email, data.password);
            })}
          >
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input mt-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="Enter Email"
                {...register("email", { required: true })}
              />
              {errors.email?.type === "required" && (
                <p role="alert" className="mt-2 text-red-500">
                  Email is required
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input mt-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="Enter Password"
                {...register("password", { required: true })}
              />
              {errors.password?.type === "required" && (
                <p role="alert" className="mt-2 text-red-500">
                  Password is required
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary hover:bg-primary-dark mt-4 w-full rounded-md bg-primary py-2 px-4 text-white transition duration-300"
            >
              {isLoading && (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
              )}
              Login
            </button>
            {Number(settings?.social_login_github_status) === ACTIVE && (
              <GitHubLogin />
            )}
            {Number(settings?.social_login_google_status) === ACTIVE && (
              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse: any) => {
                    handleGoogleLogin(
                      credentialResponse?.credential,
                      credentialResponse?.clientId
                    );
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  useOneTap
                />
              </div>
            )}
          </form>
          <div className="mt-4 flex justify-center">
            <table className="table-auto border-none">
              <tbody>
                {demoUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer border"
                    onClick={() => selectDemoUser(user.email, user.password)}
                  >
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.password}</td>
                    <td className="px-4 py-2">
                      <button
                        className="btn border text-black shadow-none"
                        onClick={() => {
                          selectDemoUser(user.email, user.password);
                          handleLogin(user.email, user.password);
                        }}
                      >
                        Use
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginCover.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export default LoginCover;
