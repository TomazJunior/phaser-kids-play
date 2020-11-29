import * as dynogels from 'dynogels'
import * as joi from 'joi'
import { DynamoDBService } from './dynamodb.service'

const DeviceSchema = {
  id: dynogels.types.uuid(),
  userId: joi.string().required(),
  serial: joi.string().allow(null),
  uuid: joi.string().allow(null),
  version: joi.string().allow(null),
  platform: joi.string().allow(null),
}

export const Device = dynogels.define(process.env.devicesTableName!, {
  hashKey: 'userId',
  rangeKey: 'id',
  timestamps: true,
  schema: DeviceSchema,
  tableName: process.env.devicesTableName,
})
Device.config({ dynamodb: DynamoDBService.getInstance().dynamoDB })

const RoundSchema = {
  seconds: joi.number().required(),
  inTutorialMode: joi.bool().required(),
}

const LevelSchema = {
  id: dynogels.types.uuid(),
  userId: joi.string().required(),
  worldId: joi.string().required(),
  level: joi.number().required(),
  gems: joi.number().required(),
  stars: joi.number().required(),
  time: joi.date().required(),
  rounds: joi.array().items(RoundSchema)
}

export const Level = dynogels.define(process.env.levelsTableName!, {
  hashKey: 'userId',
  rangeKey: 'id',
  timestamps: true,
  schema: LevelSchema,
  tableName: process.env.levelsTableName,
})
Level.config({ dynamodb: DynamoDBService.getInstance().dynamoDB })

const UserSchema = {
  id: dynogels.types.uuid(),
  active: joi.bool().default(true),
}

export const User = dynogels.define(process.env.usersTableName!, {
  hashKey: 'id',
  timestamps: true,
  schema: UserSchema,
  tableName: process.env.usersTableName,
})
User.config({ dynamodb: DynamoDBService.getInstance().dynamoDB })
