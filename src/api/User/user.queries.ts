import { User } from ".prisma/client";
import { prisma } from "../../server";

export default {
  Query: {
    seeMe: async (_, __, { req, isAuthenticated }): Promise<User> => {
      isAuthenticated(req);
      const { user } = req;
      try {
        const me = await prisma.user.findUnique({
          where: { id: user.id },
        });

        return me;
      } catch (e) {
        console.log("seeMe 에러: ", e);
      }
    },
    getMyFriends: async (_, __, { req, isAuthenticated }): Promise<User[]> => {
      isAuthenticated(req);
      const { user } = req;
      try {
        const friends = await prisma.user
          .findUnique({ where: { id: user.id } })
          .following();
        return friends;
      } catch (e) {
        console.log("getMyFriends 에러: ", e);
      }
    },
    searchUsers: async (_, args, { req, isAuthenticated }): Promise<User[]> => {
      isAuthenticated(req);
      const { term } = args;
      try {
        const result = await prisma.user.findMany({
          where: {
            username: { contains: term },
          },
        });
        return result;
      } catch (e) {
        console.log("searchFriends 에러: ", e);
      }
    },
  },
  // Video: {
  // title: ({ title }) => entities.decode(title),
  // isFollowing: async (parent, _, { request }) => {
  //   const { id } = parent;
  //   const { user } = request;
  //   if (user) {
  //     const existing = await prisma.videoLike.findUnique({
  //       where: { userId_videoId: { userId: user.id, videoId: id } },
  //     });
  //     return existing ? true : false;
  //   } else {
  //     return false;
  //   }
  // },
  // likeCount: async (parent) => {
  //   const { id } = parent;
  //   const count = await prisma.videoLike.count({ where: { videoId: id } });
  //   return count;
  // },
  // postCount: async (parent) => {
  //   const { id } = parent;
  //   const count = await prisma.post.count({ where: { videoId: id } });
  //   return count;
  // },
  // },
};
