"use client";

import React, { useState } from "react";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DialogBox from "../_components/dialogue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const AuthForm = ({ login }: { login: boolean }) => {
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [authError, setAuthError] = useState({
    msg: "",
    title: "",
  });
  const router = useRouter();

  const choice = login ? userLoginSchema : userRegistrationSchema;
  const form = useForm<z.infer<typeof choice>>({
    resolver: zodResolver(choice),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phNo: "",
      name: "",
      nickname: "",
    },
  });

  const handleSubmit = async (body: z.infer<typeof choice>, e: any) => {
    e.preventDefault();
    const d = JSON.stringify(body);

    if (login) {
      let res;
      try {
        res = await signIn("credentials", {
          ...body,
          redirect: false,
        });

        if (!res || res === undefined) {
          setShowAlert(true);
          setAuthError({
            title: "Login error",
            msg: "No response received from server!",
          });
        }

        if (res?.ok) {
          router.replace("/dashboard");
          router.refresh();
        } else {
          setShowAlert(true);
          setAuthError({
            title: "Login Error",
            msg: res.error as string,
          });
        }
      } catch (e) {
        setShowAlert(true);
        setAuthError({
          title: res.message,
          msg: e.message,
        });
      }
    } else {
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: d,
      });

      if (res.status === 200) {
        let res;
        try {
          res = await signIn("credentials", {
            ...body,
            redirect: false,
          });

          if (!res || res === undefined) {
            setShowAlert(true);
            setAuthError({
              title: "Login error",
              msg: "No response received from server!",
            });
          }

          if (res?.ok) {
            router.replace("/dashboard");
            router.refresh();
          } else {
            setShowAlert(true);
            setAuthError({
              title: "Login Error",
              msg: res.error as string,
            });
          }
        } catch (e) {
          setShowAlert(true);
          setAuthError({
            title: res.message,
            msg: e.message,
          });
        }
      } else {
        setShowAlert(true);
        setAuthError({
          title: "Registration Error!",
          msg: (await res.json()).msg,
        });
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-3 bg-black relative">
      {showAlert && (
        <DialogBox
          title={authError.title}
          onClose={() => {
            setShowAlert(false);
          }}
        >
          <p>{authError.msg}</p>
        </DialogBox>
      )}

      <div className="border-x-neutral-300 drop-shadow-lg border-2 !p-8 rounded-lg">
        <h1 className="text-4xl mb-3 text-amber-200 w-full text-center">
          {login ? "Login" : "Register"}
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-3 w-96"
          >
            {!login && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                    <FormLabel className="text-white">User Name</FormLabel>
                    {/* Form Control allows to share the context to display errors */}
                    <FormControl>
                      <Input placeholder="User Name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!login && (
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                    <FormLabel className="text-white">Nickname</FormLabel>
                    {/* Form Control allows to share the context to display errors */}
                    <FormControl>
                      <Input placeholder="Nickname" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                  <FormLabel className="text-white">Email Address</FormLabel>
                  {/* Form Control allows to share the context to display errors */}
                  <FormControl>
                    <Input placeholder="Email" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!login && (
              <FormField
                control={form.control}
                name="phNo"
                render={({ field }) => (
                  <FormItem>
                    {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                    <FormLabel className="text-white">Phone Number</FormLabel>
                    {/* Form Control allows to share the context to display errors */}
                    <FormControl>
                      <Input
                        placeholder="Phone Number"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                  <FormLabel className="text-white">Password</FormLabel>
                  {/* Form Control allows to share the context to display errors */}
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={eye1 ? "text" : "password"}
                        {...field}
                      />
                      {eye1 ? (
                        <EyeOff
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:scale-90 transition-all duration-150 active:scale-75"
                          onClick={() => setEye1((prev) => !prev)}
                        />
                      ) : (
                        <Eye
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:scale-90 transition-all duration-150 active:scale-75"
                          onClick={() => setEye1((prev) => !prev)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!login && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    {/* Render allows for an error message to be shown everytime there's an error on this particular input field */}
                    <FormLabel className="text-white">
                      Confirm Password
                    </FormLabel>
                    {/* Form Control allows to share the context to display errors */}
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm Password"
                          type={eye2 ? "text" : "password"}
                          {...field}
                        />
                        {eye2 ? (
                          <EyeOff
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:scale-90 transition-all duration-150 active:scale-75"
                            onClick={() => setEye2((prev) => !prev)}
                          />
                        ) : (
                          <Eye
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer hover:scale-90 transition-all duration-150 active:scale-75"
                            onClick={() => setEye2((prev) => !prev)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Link
              href={login ? "/register" : "/login"}
              className="text-white text-xs text-right"
            >
              {login
                ? "Don't have an account? Register now"
                : "Already have an acount? Login now"}
            </Link>
            <Button type="submit">{login ? "Login" : "Register"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;
