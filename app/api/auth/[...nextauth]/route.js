import NextAuth from 'next-auth/next';
import authOptions from '../../../../utils/authOptions.js'

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
