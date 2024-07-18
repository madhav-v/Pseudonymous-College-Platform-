import express from "express";
import { createConnection } from "typeorm";
import http from "http";
import { User } from "./models/User.model";
import routes from "./routes";
import { Org } from "./models/Org.model";
import { Materials } from "./models/Material.model";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", routes);

const PORT = 3005;

const server = http.createServer(app);

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "madhav2058",
  database: "College Forum",
  entities: [User, Org, Materials],
  synchronize: true,
  // logging: true,
})
  .then(() => {
    console.log("Database connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.log("Error connecting database", err);
  });
