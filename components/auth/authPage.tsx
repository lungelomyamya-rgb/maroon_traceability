'use client';

import React, { useState } from 'react';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Maroon Traceability</h1>
          <p className="mt-2 text-gray-600">Blockchain-based Supply Chain Management</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {isLogin ? (
          <LoginForm
            onRegisterClick={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onLoginClick={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}
