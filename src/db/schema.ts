import {
  Sequelize,
  Model,
  DataTypes,
  ModelAttributes,
  InitOptions,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association,
  Order,
  WhereOperators,
  Op,
} from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, dbOptions } from "./config";
import { offsetTime } from "../lib";

//-------------------------
//    Initialize Sequelize
//-------------------------

export const sequelize: Sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  dbOptions
);

//-------------------------
//    Schemas
//-------------------------

export class User extends Model {
  public id!: number;

  public vendor!: number;
  public uniqueId!: string;
  public userStatus!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // associations
  public getSeats!: HasManyGetAssociationsMixin<Seat>;
  public addSeat!: HasManyAddAssociationMixin<Seat, number>;
  public hasSeat!: HasManyHasAssociationMixin<Seat, number>;
  public countSeats!: HasManyCountAssociationsMixin;
  public createSeat!: HasManyCreateAssociationMixin<Seat>;

  public readonly seats?: Seat[];
  public static associations: {
    seats: Association<User, Seat>;
  };

  public static initialize(sequelize: Sequelize) {
    const modelAttributes: ModelAttributes = {
      vendor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      uniqueId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userStatus: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "1",
      },
    };
    const initOptions: InitOptions<User> = {
      sequelize,
      tableName: "User",
      paranoid: true,
    };
    this.init(modelAttributes, initOptions);
  }
}

export class Seat extends Model {
  public id!: number;

  // about giver
  public giverId!: number;
  public leaveAt!: Date;
  public descriptionGiver!: string | null;
  public seatStatus!: number;

  // about cafe
  public cafeName!: string;
  public spaceKakaoMapId!: string;
  public address!: string;
  public lat!: number | null;
  public lng!: number | null;
  public havePlug!: boolean;
  public thumbnailUrl!: string | null;
  public descriptionSeat!: string;
  public descriptionCloseTime!: Date | null;

  public takerId!: number | null;
  public takenAt!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    const modelAttributes: ModelAttributes = {
      giverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      leaveAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      descriptionGiver: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      seatStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      cafeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      spaceKakaoMapId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT(10, 4),
        allowNull: false,
      },
      lng: {
        type: DataTypes.FLOAT(10, 4),
        allowNull: false,
      },
      havePlug: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      descriptionSeat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descriptionCloseTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      takerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      takenAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    };
    const initOptions: InitOptions<Seat> = {
      sequelize,
      tableName: "Seat",
      paranoid: true,
    };
    this.init(modelAttributes, initOptions);
  }

  //
  // custom methods
  //
  public static orderByDistance(lat: string, lng: string): Order {
    return [
      [
        Sequelize.literal(`
          ACOS(SIN(${lat ?? 0})*SIN(lat) +
          COS(${lat ?? 0})*COS(lat)*COS((${lng ?? 0}-lng)))
        `),
        "ASC",
      ],
    ];
  }

  public static whereLaterThan(minute: number): WhereOperators {
    return { [Op.gte]: offsetTime(minute) };
  }

  public isTakenBy(id: string | number | null): boolean {
    return id ? this.takerId === Number(id) : this.takerId === null;
  }

  public isGivenBy(id: string | number | null): boolean {
    return id ? this.giverId === Number(id) : this.giverId === null;
  }

  public leftMinuteToLeave(): number {
    const currentDate = offsetTime(0);
    return Math.floor(
      (currentDate.getTime() - this.leaveAt.getTime()) / (1000 * 60)
    );
  }
}

//-------------------------
//    Set Relations
//-------------------------

const models: Array<any> = [User, Seat];
models.forEach((model) => model.initialize(sequelize));

User.hasMany(Seat, {
  sourceKey: "id",
  foreignKey: "giverId",
  as: "seats",
});
