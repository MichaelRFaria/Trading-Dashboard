'use client';

import { registerAccount } from '@/src/helper/api';
import React from 'react';
import { useRouter } from 'next/navigation';
import { RegisterRequest, RegisterResponse } from '@/src/types/user';
import { useNotification } from '@/src/components/common/NotificationProvider';
import FormInput from '@/src/components/common/FormInput';

export default function RegistrationPage() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleFormSubmission = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault(); // prevent page refresh

    const formData = new FormData(event.target);

    const request: RegisterRequest = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const response: RegisterResponse | null = await registerAccount(request);

    if (response === null) {
      showNotification(
        'Error encountered during registration, please try again.',
      );
      return;
    }

    if ('success' in response) {
      //console.log("account successfully registered")
      const params = new URLSearchParams();
      params.set('status', 'registration-successful');
      router.push(`/home/?${params.toString()}`);
    } else if (response.message) {
      //console.log("error on account registration")
      showNotification(
        Array.isArray(response.message) // UserDto class validators will produce an array of messages on validation fail
          ? response.message.join(', ')
          : response.message,
      );
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
            Let&#39;s get you started
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Register an account to start using the trading dashboard.
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
            Register
          </button>
        </form>
      </section>
    </main>
  );
}
