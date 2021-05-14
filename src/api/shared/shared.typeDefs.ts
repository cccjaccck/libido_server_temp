import { gql } from "apollo-server";

export default gql`
  type MutationResponse {
    ok: Boolean!
    id: Int
    error: String
  }
`;

export type MutationResponse = {
  ok: boolean;
  id?: number;
  error?: string;
  [x: string]: any;
};
