import { gql } from "apollo-server";

export default gql`
  type Query {
    searchRooms(term: String): [Room!]
  }
`;
