export default {
  Message: {
    isMine: ({ userId }, _, { loggedInUser }) => {
      return userId === loggedInUser.id;
    },
  },
};
