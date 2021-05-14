import client from "../../client";
import { protectedResolver } from "../User/users.utils";
export default {
  Query: {
    getMyVideos: protectedResolver(async (_, __, { loggedInUser }) => {
      try {
        const videos = await client.video.findMany({
          where: { rooms: { every: { host: { id: loggedInUser.id } } } },
        });
        return videos;
      } catch (e) {
        console.log("getMyVideos 에러: ", e);
      }
    }),
  },
};
