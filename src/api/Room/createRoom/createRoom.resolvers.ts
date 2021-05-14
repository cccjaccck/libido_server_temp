import client from "../../../client";
import { protectedResolver } from "../../User/users.utils";
import { CreateRoomResult } from "./createRoom.typeDefs";

interface VideoInput {
  channelTitle: string;
  url: string;
  type: "YOUTUBE" | "NETFLIX";
  title: string;
  thumbnail: string;
}
const DEFAULT_TYPE = "YOUTUBE";
export default {
  Mutation: {
    createRoom: protectedResolver(
      async (_, args, { loggedInUser }): Promise<CreateRoomResult> => {
        const { title, videos, isLocked, password } = args;
        const uri = `/player/${loggedInUser.id}`;
        await Promise.all(
          videos.map(async (video: VideoInput) => {
            try {
              await client.video.create({
                data: {
                  ...video,
                  type: video.type ?? DEFAULT_TYPE,
                  userId: loggedInUser.id,
                },
              });
            } catch (PrismaClientKnownRequestError) {}
            // 이미 있는건 그냥 넘어가게 트라이 캐치
          })
        );

        const isExist =
          (
            await client.user
              .findUnique({ where: { id: loggedInUser.id } })
              .hosting({ where: { isLive: true } })
          ).length !== 0;

        if (isExist) {
          return {
            ok: false,
            error: "이미 방송을 실행중입니다.",
          };
        }

        try {
          await client.room.create({
            data: {
              host: { connect: { id: loggedInUser.id } },
              users: { connect: { id: loggedInUser.id } },
              title,
              url: process.env.DOMAIN + uri,
              isLocked: isLocked ?? false,
              password,
              videos: {
                connect: videos.map(({ url }) => ({
                  url_userId: { url, userId: loggedInUser.id },
                })),
              },
              isLive: true,
            },
            include: {
              videos: true,
            },
          });
          return {
            ok: true,
            uri,
          };
        } catch (e) {
          console.log("createRoom 에러: ", e);
          return {
            ok: false,
            error: e.message,
          };
        }
      }
    ),
  },
};
