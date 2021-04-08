import { Room } from ".prisma/client";
import { prisma } from "../../server";

export default {
  Query: {
    getMyRooms: async (_, __, { req, isAuthenticated }): Promise<Room[]> => {
      isAuthenticated(req);
      const { user } = req;
      try {
        const rooms = await prisma.room.findMany({
          where: { hostId: user.id },
          include: { videos: true },
        });

        return rooms;
      } catch (e) {
        console.log("getMyRooms 에러: ", e);
      }
    },

    getLives: async (): Promise<Room[]> => {
      return await prisma.room.findMany({
        orderBy: { users: { count: "desc" } },
        take: 10,
      });
    },

    searchRooms: async (_, args): Promise<Room[]> => {
      const { term } = args;
      return await prisma.room.findMany({
        where: {
          OR: [
            { title: { contains: term } },
            { host: { username: { contains: term } } },
          ],
        },
        orderBy: { users: { count: "desc" } },
      });
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
