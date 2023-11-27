import { Sequelize } from "sequelize";

(Sequelize as any).postgres.DECIMAL.parse = parseFloat;

export const sequelize = new Sequelize(
  "postgres://user:password@localhost:5489/weather"
);
