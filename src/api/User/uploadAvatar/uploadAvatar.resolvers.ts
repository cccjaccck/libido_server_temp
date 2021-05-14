import { createWriteStream } from "fs";
import client from "../../../client";
import { MutationResponse } from "../../shared/shared.typeDefs";
import { protectedResolver } from "../users.utils";

// const URL = "http://localhost:4000/static/";
const URL = "http://192.168.123.105:4000/static/";

export default {
  Mutation: {
    uploadAvatar: protectedResolver(
      async (_, { file }, { loggedInUser }): Promise<MutationResponse> => {
        try {
          if (file) {
            const { filename, createReadStream } = await file;
            const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
            const readStream = createReadStream();
            const writeStream = createWriteStream(
              process.cwd() + "/uploads/" + newFilename
            );
            readStream.pipe(writeStream);
            await client.user.update({
              where: { id: loggedInUser.id },
              data: { avatar: URL + newFilename },
            });
            return {
              ok: true,
            };
          } else {
            return {
              ok: false,
              error: "파일이 존재하지 않습니다.",
            };
          }
        } catch (e) {
          return {
            ok: false,
            error: e.message,
          };
        }
      }
    ),
  },
};
