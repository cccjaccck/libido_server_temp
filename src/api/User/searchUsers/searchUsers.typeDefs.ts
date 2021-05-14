import { User } from ".prisma/client";
import { gql } from "apollo-server";

export default gql`
  type SearchUsersResult {
    ok: Boolean!
    error: String
    users: [User!]
    totalPages: Int
  }

  type Query {
    searchUsers(term: String, page: Int): SearchUsersResult!
  }
`;

export interface SearchUserResult {
  ok: boolean;
  error?: string;
  users?: User[];
  totalPages?: number;
}
