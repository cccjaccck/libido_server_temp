import { Room } from ".prisma/client";
import { prisma } from "../../server";

const DEFAULT_TYPE = "YOUTUBE";

interface VideoInput {
  url: string;
  type: "YOUTUBE" | "NETFLIX";
  title: string;
  thumbnail: string;
}

export default {
  Mutation: {
    createRoom: async (_, args, { req, isAuthenticated }): Promise<Room> => {
      isAuthenticated(req);
      const { user } = req;
      const { title, videos, url, isLocked, password } = args;

      await Promise.all(
        videos.map(async (video: VideoInput) => {
          try {
            await prisma.video.create({
              data: { ...video, type: video.type ?? DEFAULT_TYPE },
            });
          } catch (PrismaClientKnownRequestError) {}
          // 이미 있는건 그냥 넘어가게 트라이 캐치
        })
      );

      try {
        const newRoom = await prisma.room.create({
          data: {
            host: { connect: { id: user.id } },
            title,
            url,
            isLocked: isLocked ?? false,
            password,
            videos: {
              connect: videos.map(({ url }) => ({ url })),
            },
          },
          include: {
            videos: true,
          },
        });
        return newRoom;
      } catch (e) {
        console.log("createRoom 에러: ", e);
      }
    },

    joinRoom: async (_, args, { req, isAuthenticated }): Promise<Boolean> => {
      isAuthenticated(req);
      const { user } = req;
      const { id, password } = args;

      const room = await prisma.room.findUnique({ where: { id } });
      if (!room) {
        throw Error("존재하지 않는 방입니다.");
      } else if (!room.isLive) {
        throw Error("방 준비중입니다.");
      } else if (
        room.password &&
        room.password !== "" &&
        room.password !== password
      ) {
        throw Error("방 비밀번호가 일치하지 않습니다.");
      }

      try {
        await prisma.room.update({
          where: { id },
          data: { users: { connect: { id: user.id } } },
        });
        return true;
      } catch (e) {
        console.log("joinRoom 에러: ", e);
        return false;
      }
    },

    startLive: async (_, args, { req, isAuthenticated }): Promise<Boolean> => {
      isAuthenticated(req);
      const { user } = req;
      const { id } = args;
      const room = await prisma.room.findUnique({ where: { id } });
      if (room.hostId !== user.id) {
        throw Error("권한이 없습니다.");
      }
      try {
        await prisma.room.update({ where: { id }, data: { isLive: true } });
        return true;
      } catch (e) {
        console.log("startLive 에러: ", e);
        return false;
      }
    },
    endLive: async (_, args, { req, isAuthenticated }): Promise<Boolean> => {
      isAuthenticated(req);
      const { user } = req;
      const { id } = args;
      const room = await prisma.room.findUnique({ where: { id } });
      if (room.hostId !== user.id) {
        throw Error("권한이 없습니다.");
      }
      try {
        await prisma.room.update({ where: { id }, data: { isLive: false } });
        return true;
      } catch (e) {
        console.log("startLive 에러: ", e);
        return false;
      }
    },
  },
};
