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
