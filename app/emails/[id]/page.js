'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

async function fetchEmailDetails(accessToken, emailId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch email details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

function decodeBase64Url(base64Url) {
  return decodeURIComponent(
    atob(base64Url.replace(/-/g, '+').replace(/_/g, '/'))
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

export default function EmailDetailsPage({ params }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchEmailDetails(session.accessToken, id)
        .then((data) => {
          const subject = data.payload.headers.find(header => header.name === "Subject")?.value || "No Subject";
          const sender = data.payload.headers.find(header => header.name === "From")?.value || "Unknown Sender";
          const content = extractContent(data.payload);
          setEmail({ subject, sender, content });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching email details:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [status, session, id]);

  const extractContent = (payload) => {
    let content = "No Content";
    if (payload.parts) {
      payload.parts.forEach(part => {
        if (part.mimeType === 'text/html' || part.mimeType === 'text/plain') {
          content = decodeBase64Url(part.body.data);
        }
      });
    } else {
      content = decodeBase64Url(payload.body.data);
    }
    return content;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{email?.subject}</h1>
      <h2 className="text-xl text-gray-600 mb-6">From: {email?.sender}</h2>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: email?.content }} />
    </div>
  );
}
