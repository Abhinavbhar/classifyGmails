Project Setup
Getting Started

Follow these steps to set up the project on your local machine.
Prerequisites

    Node.js
    npm

Installation

    Clone the repository:
    git clone https://github.com/Abhinavbhar/classifyGmails
    cd <repository-directory>


Rename the example environment file: to .env



    mv example.env .env

Add your secrets in the .env file:

  Configure your Google client ID and redirect URL.
  Set the URL for your local development environment

  

Update the API call URL:

  Locate the POST API call in email/page.js.
  const response = await axios.post('https://classify-gmails-sfgh.vercel.app/api/email'
  Replace the current deployment URL with http://localhost:3000

Install the dependencies:



    npm install

Run the development server:



    npm run dev

Access the application:

Open your browser and navigate to http://localhost:300




# App Functionality

The `app` folder contains the main components of the application, including the landing page, API routes, and email routes.

## Email Route

- The email route handles fetching emails from Gmail APIs and sending them to the backend API (`api/emails`) for classification.
- Emails are fetched every 10 minutes to prevent fetching emails every time the user refreshes a page or visits another page.
- Once an email is classified, the classification persists until new emails arrive to save on OpenAI API usage.
- There is a "Details" option that allows the user to view the entire email, including images and links, as they would see in their Gmail inbox.

## API Route

- The API route contains two main components: the `nextAuth` folder and the `emails` API.

### `nextAuth` Folder

- Handles all the NextAuth logic for managing user permissions to view emails.
- Manages access tokens and refresh tokens.

### `emails` API

- Receives emails from the frontend.
- Sends the emails to OpenAI with a prompt for classification.
- Receives the classification from OpenAI and sends it back to the frontend.

This is the main functioning of the app, providing a seamless integration between Gmail, classification of emails, and user authentication.
