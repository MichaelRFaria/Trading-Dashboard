'use client';

import Link from 'next/link';
import { getCurrentUser, loginAccount } from '@/src/helper/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { LoginRequest, LoginResponse } from '@/src/types/user';
import { useNotification } from '@/src/components/common/NotificationProvider';
import FormInput from '@/src/components/common/FormInput';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { showNotification } = useNotification();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user && 'sub' in user) {
        router.push('/dashboard');
      }
    });

    if (searchParams.get('status') === 'registration-successful') {
      showNotification('Successfully registered an account');
    }
  }, [router, searchParams, showNotification]);

  const handleFormSubmission = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // prevent page refresh

    const formData = new FormData(event.target);

    const request: LoginRequest = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    console.log(request.email);

    const response: LoginResponse | null = await loginAccount(request);

    if (response === null) {
      showNotification('Error encountered during login, please try again.');
      return;
    }

    console.log(response);

    if ('access_token' in response) {
      router.push('/dashboard');
    } else if ('message' in response) {
      showNotification(response.message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-12 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,64,175,0.16),transparent_55%)]"
      />
      <section className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur sm:p-10">
        <div className="mb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
            Trading Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign in to view your portfolio and manage your account.
          </p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleFormSubmission}>
          <FormInput label="E-mail" id="email" name="email" type="email" />
          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
          />
          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Sign in
          </button>
        </form>
        <p className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          New here?{' '}
          <Link
            className="font-medium text-sky-400 transition hover:text-sky-300"
            href="/register"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
