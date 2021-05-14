import { Room } from ".prisma/client";
import client from "../../../client";
import { protectedResolver } from "../../User/users.utils";

const includeFilter = {
  host: true,
  watching: true,
  videos: true,
  messages: {
    include: { user: true },
  },
};

export default {
  Query: {
    seeRoom: protectedResolver(
      async (_, { hostId, password }, { loggedInUser }) => {
        const isHost = hostId === loggedInUser.id;
        const room = await client.room.findUnique({
          where: { hostId_isLive: { hostId, isLive: true } },
          include: includeFilter,
        });

        if (isHost) {
          return room;
        }
        // if (room.isLocked && room.password !== password) {
        //   throw new Error("비밀번호가 맞지 않습니다.");
        // }
        return await client.room.update({
          where: { hostId_isLive: { hostId, isLive: true } },
          data: { watching: { connect: { id: loggedInUser.id } } },
          include: includeFilter,
          // select: {
          //   id: true,
          //   title: true,
          //   host: true,
          //   watching: true,
          //   videos: true,
          //   messages: {
          //     select: {
          //       id: true,
          //       text: true,
          //       createdAt: true,
          //       user: {
          //         select: { username: true, avatar: true },
          //       },
          //     },
          //   },
          // },
        });
      }
    ),
  },
};
