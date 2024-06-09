import OpenAI from "openai";



export async function POST(request) {
  try {

    const res = await request.json();
    const emails = res.selectedEmails;
    const apiKey = res.apiKey
    // Assuming the JSON payload contains an "emails" array
    console.log(emails);
    const openai = new OpenAI({ apiKey: apiKey });

    if (!Array.isArray(emails)) {
      throw new Error('Emails should be an array');
    }

    const formattedEmails = formatEmails(emails);
    const responseString = await classifyEmails(formattedEmails,openai);
    console.log(responseString);

    const responseArray = responseString.split(' ');
    console.log(responseArray);

    return new Response(JSON.stringify({ result: responseArray }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

function formatEmails(emails) {
  return emails.map((email, index) => {
    const { title, content } = email;
    return `${index + 1}. title: ${title}\ncontent: ${content}`;
  }).join('\n\n');
}

async function classifyEmails(formattedEmails,openai) {
  const responseChunks = [];
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `You need to classify a list of emails into one of the following categories: Important, Social, Marketing, or Spam.
      Important: Emails that are personal or work-related and require immediate attention.
Promotions: Emails related to sales, discounts, and marketing campaigns.
Social: Emails from social networks, friends, and family.
Marketing: Emails related to marketing, newsletters, and notifications.
Spam: Unwanted or unsolicited emails.
General: If none of the above are matched, use General
Please return the classification result as a single line of space-separated category names corresponding to each email's order.

Example:
number of emails: 4
emails:
1. title: Email content 1
content: Content of email 1
2. title: Email content 2
content: Content of email 2
3. title: Email content 3
content: Content of email 3
4. title: Email content 4
content: Content of email 4

Expected output format:
Important Promotional Social Marketing

Here's the list of emails to classify:
number of emails: ${formattedEmails.split('\n\n').length}
emails:
${formattedEmails}`
    }],
    stream: true,
  });

  for await (const chunk of stream) {
    responseChunks.push(chunk.choices[0]?.delta?.content || "");
  }

  const completeResponse = responseChunks.join("");
  return completeResponse;
}
