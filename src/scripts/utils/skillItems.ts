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
    type: SKILL_ITEM_TYPE.SELECT_BOX,
    maxPerLevel: 1,
    itemCost: 50,
    title: 'key',
    description: ['description'],
    skin: SKILL_ITEM_SKINS.KEY
  },
  [SKILL_ITEM_SKINS.STAR]: {
    type: SKILL_ITEM_TYPE.SELECT_NONE,
    maxPerLevel: 1,
    itemCost: 60,
    title: 'star',
    description: ['description'],
    skin: SKILL_ITEM_SKINS.STAR
  },
  [SKILL_ITEM_SKINS.BOX]: {
    type: SKILL_ITEM_TYPE.SELECT_BOX,
    maxPerLevel: 1,
    itemCost: 20,
    title: 'box',
    description: ['Close one box, ', 'and no animal can hide there.'],
    skin: SKILL_ITEM_SKINS.BOX
  },
}

export const getSkillItemDefinition = (skin: SKILL_ITEM_SKINS): SkillItemDefinition => {
  return SKILL_ITEMS[skin]
}
