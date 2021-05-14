import { gql } from "apollo-server";

export default gql`
  type Message {
    id: Int!
    room: Room!
    user: User!
    text: String!
    createdAt: String!
    isMine: Boolean
  }
`;
