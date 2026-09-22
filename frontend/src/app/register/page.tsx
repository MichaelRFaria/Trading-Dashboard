'use client';

import { registerAccount } from '@/src/helper/api';
import React from 'react';
import { useRouter } from 'next/navigation';
import { RegisterRequest, RegisterResponse } from '@/src/types/account';
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

    if (response.success) {
      //console.log("account successfully registered")
      const params = new URLSearchParams();
      params.set('status', 'registration-successf ul');
      router.push(`/home/?${params.toString()}`);
    } else if (response.message) {
      //console.log("error on account registration")
      showNotification(
        Array.isArray(response.message) // AccountDto class validators will produce an array of messages on validation fail
          ? response.message.join(', ')
          : response.message,
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-xl underline">Register</h1>

      <form
        className="flex flex-col items-center gap-3"
        onSubmit={handleFormSubmission}
      >
        <FormInput label="E-mail" id="email" name="email" type="email" />
        <FormInput
          label="Password"
          id="password"
          name="password"
          type="password"
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
