import { gql } from "apollo-server";

export default gql`
  type Query {
    seeRoom(hostId: String!, password: String): Room
  }
`;
