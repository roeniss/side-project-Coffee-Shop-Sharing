import express from "express";
import { User } from "../db";
import { jwtOperator } from "../lib";
import { FindOrCreateOptions, DestroyOptions } from "sequelize";

//
// (1) login || signup
// (2) add token to headers
// (3) return response to client
//
export const login = async (req: express.Request, res: express.Response) => {
  const { vender, uniqueId } = req.body;
  try {
    const condition: FindOrCreateOptions = {
      where: {
        vender,
        uniqueId,
      },
    };

    const [user, created] = await User.findOrCreate(condition);
    const JWT = jwtOperator.encryptBearerToken(user);
    res.setHeader("authorization", JWT);
    const statusCode = created ? 201 : 200;
    return res.sendStatus(statusCode);
  } catch (error) {
    return res.sendStatus(500);
  }
};

// ----------------- below: for debug

//
// Delete current user from database (for Debugging)
// 204: No content (well deleted)
// 404: Not found
//
export const deleteUser = async (
  _req: express.Request,
  res: express.Response
) => {
  const { id } = res.locals;
  const options: DestroyOptions = {
    where: { id },
  };

  // 토큰 내용을 저장
  try {
    const deletedNum = await User.destroy(options);
    if (deletedNum === 0) return res.sendStatus(404);
    return res.sendStatus(204);
  } catch (e) {
    return res.sendStatus(500);
  }
};
