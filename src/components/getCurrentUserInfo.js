import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

export const getCurrentUserInfo = async () => {
  const { username, userId: id } = await getCurrentUser();
  console.log("ID", id);
  console.log(await getCurrentUser());

  const attributes = fetchUserAttributes();

  return {
    id,
    username,
    attributes,
  };
};
