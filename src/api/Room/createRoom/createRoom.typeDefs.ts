import { gql } from "apollo-server";

export default gql`
  type CreateRoomResult {
    ok: Boolean!
    error: String
    uri: String
  }
  type Mutation {
    createRoom(
      title: String!
      videos: [VideoInput!]
      isLocked: Boolean
      password: String
    ): CreateRoomResult!
  }
`;

export type CreateRoomResult = {
  ok: boolean;
  error?: string;
  uri?: string;
};
