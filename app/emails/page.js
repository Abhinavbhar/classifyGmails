'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaCheck } from 'react-icons/fa';
import axios from 'axios';
import SignUpBar from '../../components/SignUpBar.jsx';

const Email = () => {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailCount, setEmailCount] = useState(0);
  const [classifications, setClassifications] = useState([]);
  const [classifying, setClassifying] = useState(false);

  useEffect(() => {
    // refetced emails every 10 min so email api is not hit everytime when user refreshes or go to another page and comeback
   
    let interval;
    //user should be authenticated
    if (status === 'authenticated' && session?.accessToken) {

      // store it in localstorage
      const storedEmails = JSON.parse(localStorage.getItem('emails'));
      const storedClassifications = JSON.parse(localStorage.getItem('classifications'));

      if (storedEmails && storedClassifications) {
        setEmails(storedEmails);
        setClassifications(storedClassifications);
      } else {
        fetchEmails(session.accessToken);
      }

      interval = setInterval(() => {
        fetchEmails(session.accessToken);
      }, 10 * 60 * 1000); // 10 minutes in milliseconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, session]);

  //fetched email from the gmail api
  const fetchEmails = async (accessToken) => {
    setLoading(true);
    // this will fetch id of gmails in your inbox
    try {
      const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      const data = await response.json();
      const messages = await Promise.all(
        data.messages.map(async (message) => {
          // this will fetch the whole message
          const msgResponse = await fetch(
            `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (!msgResponse.ok) {
            throw new Error(`Failed to fetch message with ID ${message.id}`);
          }
          const msgData = await msgResponse.json();
          const title = msgData.payload.headers.find((header) => header.name === 'Subject')?.value || 'No Subject';
          const content = msgData.snippet || 'No Content';
          return { id: message.id, title, content };
        })
      );
      setEmails(messages);
      setSelectedEmails(messages.slice(0, emailCount));
      localStorage.setItem('emails', JSON.stringify(messages));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEmailSelect = (email) => {
    if (selectedEmails.some((e) => e.id === email.id)) {
      setSelectedEmails(selectedEmails.filter((e) => e.id !== email.id));
    } else {
      const newSelectedEmails = [...selectedEmails];
      if (newSelectedEmails.length >= emailCount) {
        newSelectedEmails.pop();
      }
      newSelectedEmails.unshift(email);
      setSelectedEmails(newSelectedEmails);
    }
  };
  // this sends the data to gmail route to classify emails
  const classifyEmails = async () => {
    setClassifying(true);
    try {
      const apiKey = localStorage.getItem('apiKey')
      const response = await axios.post('http://localhost:3000/api/email', {selectedEmails,apiKey});
      const newClassifications = response.data.result;
      setClassifications(newClassifications);
      localStorage.setItem('classifications', JSON.stringify(newClassifications));
    } catch (error) {
      console.error('Error classifying emails:', error);
    } finally {
      setClassifying(false);
    }
  };

  const handleEmailCountChange = (e) => {
    let newCount = parseInt(e.target.value, 10);

    if (e.nativeEvent.data === null && e.target.value.length === 1) {
      newCount = 0;
    } else if (e.target.value === '0' && e.nativeEvent.data !== null) {
      newCount = parseInt(e.nativeEvent.data, 10);
    }

    if (newCount >= 0 && newCount <= 100) {
      setEmailCount(newCount);
      setSelectedEmails(emails.slice(0, newCount));
    }
  };
  //just gives colour to classification text
  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Important':
        return 'text-green-500 font-bold';
      case 'Marketing':
        return 'text-yellow-500 font-bold';
      case 'Spam':
        return 'text-red-500 font-bold';
      case 'Social':
        return 'text-blue-500 font-bold';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SignUpBar></SignUpBar>
      <div className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-16 ml-96">Emails</h1>

        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center mr-4">
            <div className="flex items-center ml-4">
              <span className="mr-2 text-3xl font-semibold text-gray-800">Select:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={emailCount}
                onChange={handleEmailCountChange}
                className="border border-gray-400 rounded-md p-2 w-20 text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={classifyEmails}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl"
          >
            Classify
          </button>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {emails.length === 0 && !loading ? (
          <p className="text-center">No emails found.</p>
        ) : (
          <div className="flex justify-center">
            <div>
              {emails.map((email, index) => (
                <div
                  key={email.id}
                  className="border rounded-lg p-6 mb-4 bg-white w-full shadow-xl flex items-center"
                >
                  <div
                    className={`mr-4 rounded-full h-6 w-6 flex items-center justify-center ${
                      selectedEmails.some((e) => e.id === email.id) ? 'bg-green-500 text-white' : 'bg-gray-300'
                    }`}
                    onClick={() => handleEmailSelect(email)}
                  >
                    {selectedEmails.some((e) => e.id === email.id) && <FaCheck />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-4 text-lg">
                      {email.title}
                    </div>
                    <div className="text-base text-gray-600">{email.content}</div>
                  </div>
                  <div className={`ml-4 text-lg ${getClassificationColor(classifications[index])}`}>
                    {classifications[index] || (classifying && 'Classifying...')}
                  </div>
                  <Link href={`/emails/${email.id}`} className='ml-4 text-blue-500 hover:underline'>
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Email;
