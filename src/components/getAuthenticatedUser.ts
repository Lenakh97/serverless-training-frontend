import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const getAuthenticatedUser = async (): Promise<{
  username: string;
  session: AuthTokens | undefined;
}> => {
  const { username } = await getCurrentUser();
  const { tokens: session } = await fetchAuthSession();

  // Note that session will no longer contain refreshToken and clockDrift
  return {
    username,
    session,
  };
};
