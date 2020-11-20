import { MAIN_SCENE_STATE } from "./constants"

export enum SKILL_ITEM_SKINS {
  KEY = 'skill-item-key',
  STAR = 'skill-item-star',
  BOX = 'skill-item-box',
}

export enum SKILL_ITEM_TYPE {
  SELECT_BOX = 'select-box',
  SELECT_PLAYER = 'select-player',
  SELECT_NONE = 'select-none',
}

const SKILL_ITEMS: Record<SKILL_ITEM_SKINS, SkillItemDefinition> = {
  [SKILL_ITEM_SKINS.KEY]: {
    state: MAIN_SCENE_STATE.PLAYER_READY,
    type: SKILL_ITEM_TYPE.SELECT_BOX,
    maxPerLevel: 3,
    itemCost: 5,
    title: 'key',
    description: ['Open one box.', 'and release an animal if exist'],
    skin: SKILL_ITEM_SKINS.KEY
  },
  [SKILL_ITEM_SKINS.STAR]: {
    state: MAIN_SCENE_STATE.PLAYER_READY,
    type: SKILL_ITEM_TYPE.SELECT_NONE,
    maxPerLevel: 3,
    itemCost: 5,
    title: 'star',
    description: ['description'],
    skin: SKILL_ITEM_SKINS.STAR
  },
  [SKILL_ITEM_SKINS.BOX]: {
    state: MAIN_SCENE_STATE.STARTED,
    type: SKILL_ITEM_TYPE.SELECT_BOX,
    maxPerLevel: 3,
    itemCost: 5,
    title: 'box',
    description: ['Close one box,', 'and no animal can hide there.'],
    skin: SKILL_ITEM_SKINS.BOX
  },
}

export const getSkillItemDefinition = (skin: SKILL_ITEM_SKINS): SkillItemDefinition => {
  return SKILL_ITEMS[skin]
}
