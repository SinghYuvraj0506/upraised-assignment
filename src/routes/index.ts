import express from "express";
import authRouter from "./auth.routes";
import gadgetRouter from "./gadget.routes";

const router = express.Router();

export default () => {
  authRouter(router);
  gadgetRouter(router);
  return router;
};
