import express from "express";
import { jwtOperator } from "../lib";

const isValidLoginBody = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void => {
  const { uniqueId, vender } = req.body;
  if (!isAllDefined([uniqueId, vender])) {
    return res.sendStatus(422);
  }
  return next();
};

const isValidUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void => {
  const { authorization } = req.headers;
  if (!isAllDefined(authorization)) {
    res.sendStatus(401);
  }

  try {
    const payload = jwtOperator.decryptBearerToken(<string>authorization);
    const { userStatus } = payload;
    // 토큰은 정상이나 사용자 상태가 권한 부족
    if (userStatus !== 1) {
      return res.sendStatus(403);
    }

    // 유저 데이터 전달
    res.locals = payload;
  } catch (error) {
    // 불량 토큰
    return res.sendStatus(401);
  }

  return next();
};

export default { isValidLoginBody, isValidUser };

const isAllDefined = (values: any[] | string | undefined) => {
  if (values === undefined) return undefined;
  if (typeof values === "string") return values !== undefined;
  return values.every((a) => a !== undefined);
};