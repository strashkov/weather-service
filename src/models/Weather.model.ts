import { DataTypes, Model } from "sequelize";

import { sequelize } from "../app/sequelize.js";

export interface WeatherAttributes {
  id: number;
  city: string;
  datetime: string;
  temperature: number;
  windSpeed: number;
  pressureSurfaceLevel: number;
}

export type WeatherAttributesNew = Omit<WeatherAttributes, "id">;

export class Weather extends Model<WeatherAttributes, WeatherAttributesNew> {
  static modelName = "Weather";

  readonly id!: number;

  city!: string;
  datetime!: string;
  temperature!: number;
  windSpeed!: number;
  pressureSurfaceLevel!: number;
}

Weather.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    windSpeed: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    pressureSurfaceLevel: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "weather",
    name: { singular: "weather" },
    paranoid: false,
    timestamps: false,
    indexes: [
      {
        fields: ["city"],
      },
      {
        fields: ["city", "datetime"],
        unique: true,
      },
    ],
  },
);
