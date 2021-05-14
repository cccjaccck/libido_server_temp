import client from "../../client";

export default {
  Room: {
    watchingCount: async ({ id }): Promise<number> =>
      client.user.count({ where: { watchingRoomId: id } }),
  },
};
