import { Request, Response } from "express";

export interface RequestWithUser extends Request {
  user: {
    email: string;
    username: string;
    id: string;
  };
}
export interface ResponseWithUser extends Response {
  user: {
    email: string;
    username: string;
    id: string;
  };
}
