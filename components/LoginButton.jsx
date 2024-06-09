'use client'
import React from 'react';
import { signIn } from 'next-auth/react';
const LoginGoogle=()=>{
    return (
        <button className="w-64 px-8 py-4 bg-blue-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"onClick={() => signIn('google')}>
                    Sign in with Google
                </button>
    )

}
export default LoginGoogle