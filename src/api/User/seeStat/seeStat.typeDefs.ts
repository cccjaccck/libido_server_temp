import { User } from ".prisma/client";
import { gql } from "apollo-server";
export default gql`
  type SeeStaticResult {
    totalWatchingTime: Int!
    totalRooms: Int!
    totalComments: Int!
    totalVideos: Int!
  }

  type Query {
    seeStat(id: String, time: Time): SeeStaticResult!
  }

  enum Time {
    DAY
    MONTH
    YEAR
  }
`;

export interface SeeStaticResult {
  totalWatchingTime: number;
  totalRooms: number;
  totalComments: number;
  totalVideos: number;
}
