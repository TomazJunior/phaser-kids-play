import * as dynogels from 'dynogels'
import * as joi from 'joi'
import { DynamoDBService } from './dynamodb.service'

const DeviceSchema = {
  id: dynogels.types.uuid(),
  serial: joi.string().allow(null),
  uuid: joi.string().allow(null),
  version: joi.string().allow(null),
}

export const Device = dynogels.define(process.env.devicesTableName!, {
  hashKey: 'id',
  timestamps: true,
  schema: DeviceSchema,
  tableName: process.env.devicesTableName,
})
Device.config({ dynamodb: DynamoDBService.getInstance().dynamoDB })


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
