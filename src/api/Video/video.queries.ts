import { prisma } from "../../server";
export default {
  Query: {
    getMyVideos: async (_, __, { req, isAuthenticated }) => {
      isAuthenticated(req);
      const { user } = req;
      try {
        const videos = await prisma.video.findMany({
          where: { rooms: { every: { host: { id: user.id } } } },
        });
        return videos;
      } catch (e) {
        console.log("getMyVideos 에러: ", e);
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
