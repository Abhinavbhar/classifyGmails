import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react';

function SignUpBar() {
    const { data: session } = useSession();

  return (
    <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
    {session ? (
      <div>
        <span className="mr-2">Logged in as:</span>
        <span className="font-semibold">{session.user.email}</span>
      </div>
    ) : (
      <button
        onClick={() => signIn()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign in
      </button>
    )}
    {session && (
      <button
        onClick={() => signOut()}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign out
      </button>
    )}
  </div>  )
}

export default SignUpBar