import GoogleProvider from 'next-auth/providers/google';
const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        authorization: {
          // scope to access mails from user
          params: {
            scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email'
          }
        }
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token; // Store refresh token
          token.accessTokenExpires = Date.now() + account.expires_in * 1000; // Calculate token expiry
        }
  
        // Return previous token if the access token has not expired yet
        if (Date.now() < token.accessTokenExpires) {
          return token;
        }
  
        // Access token has expired, try to refresh it
        return refreshAccessToken(token);
      },
      async session({ session, token }) {
        session.accessToken = token.accessToken;
        return session;
      },
      async redirect({ url, baseUrl }) {
        return baseUrl + '/emails';
      }
    }
  };
  
  async function refreshAccessToken(token) {
    try {
      const url = 'https://oauth2.googleapis.com/token';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_ID,
          client_secret: process.env.GOOGLE_SECRET,
          refresh_token: token.refreshToken,
          grant_type: 'refresh_token'
        })
      });
  
      const refreshedTokens = await response.json();
  
      if (!response.ok) {
        throw refreshedTokens;
      }
  
      return {
        ...token,
        accessToken: refreshedTokens.access_token,
        accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
      };
    } catch (error) {
      console.error('Error refreshing access token', error);
      return {
        ...token,
        error: 'RefreshAccessTokenError'
      };
    }
  }
  export  default authOptions