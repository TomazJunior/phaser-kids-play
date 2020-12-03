import * as dynogels from 'dynogels'
import * as joi from 'joi'
import { DynamoDBService } from './dynamodb.service'

//TODO: move to a shared place
export enum GEM_AUDIT_TYPE {
  LEVEL_COMPLETED = 'level_completed',
  ITEM_PURCHASED = 'item_purchased',
  ITEM_USED = 'item_used',
}

export enum SKILL_ITEM_SKINS {
  KEY = 'skill-item-key',
  STAR = 'skill-item-star',
  BOX = 'skill-item-box',
}

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

const GemAuditSchema = {
  id: dynogels.types.uuid(),
  userId: joi.string().required(),
  recordType: joi.string().valid(...Object.values(GEM_AUDIT_TYPE)),
  gems: joi.number().required(),
  originId: joi.string().allow(null),
}

export const GemAudit = dynogels.define(process.env.gemAuditTableName!, {
  hashKey: 'userId',
  rangeKey: 'id',
  timestamps: true,
  schema: GemAuditSchema,
  tableName: process.env.gemAuditTableName
})
GemAudit.config({ dynamodb: DynamoDBService.getInstance().dynamoDB })

const SkillItemAuditSchema = {
  id: dynogels.types.uuid(),
  userId: joi.string().required(),
  skin: joi.string().valid(...Object.values(SKILL_ITEM_SKINS)),
  quantity: joi.number().required(),
  gems: joi.number().required(),
  time: joi.date().required(),
}

export const SkillItemAudit = dynogels.define(process.env.skillItemAuditTableName!, {
  hashKey: 'userId',
  rangeKey: 'id',
  timestamps: true,
  schema: SkillItemAuditSchema,
  tableName: process.env.skillItemAuditTableName,
})
SkillItemAudit.config({ dynamodb: DynamoDBService.getInstance().dynamoDB })

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
  rounds: joi.array().items(RoundSchema),
}

export const Level = dynogels.define(process.env.levelsTableName!, {
  hashKey: 'userId',
  rangeKey: 'id',
  timestamps: true,
  schema: LevelSchema,
  tableName: process.env.levelsTableName,
})
Level.config({ dynamodb: DynamoDBService.getInstance().dynamoDB })

export const UserSkillItemSchema = {
  skin: joi.string().valid(...Object.values(SKILL_ITEM_SKINS)),
  quantity: joi.number().required(),
}

export const UserLevelSchema = {
  worldId: joi.string().required(),
  level: joi.number().required(),
  attempts: joi.number().default(0),
  stars: joi.number().default(0),
}

export const UserSchema = {
  id: dynogels.types.uuid(),
  gems: joi.number().default(0),
  skillItems: joi.array().items(UserSkillItemSchema).default([]),
  levels: joi.array().items(UserLevelSchema).default([]),
  active: joi.bool().default(true),
}

export const User = dynogels.define(process.env.usersTableName!, {
  hashKey: 'id',
  timestamps: true,
  schema: UserSchema,
  tableName: process.env.usersTableName,
})
User.config({ dynamodb: DynamoDBService.getInstance().dynamoDB })
