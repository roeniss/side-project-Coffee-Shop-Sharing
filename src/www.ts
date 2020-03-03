import "source-map-support/register"; // for source-map
import App from "./App";
import * as express from "express";

const port: number = Number(process.env.PORT) || 8080;
const app: express.Application = new App().app;

app.listen(port, () => console.log(`Express server listening at ${port}`)).on("error", (err) => console.error(err));
