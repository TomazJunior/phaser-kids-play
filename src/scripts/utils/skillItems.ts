export enum SKILL_ITEM_SKINS {
  KEY = 'skill-item-key',
  STAR = 'skill-item-star',
  BOX = 'skill-item-box',
}

const SKILL_ITEMS: Record<SKILL_ITEM_SKINS, SkillItemDefinition> = {
  [SKILL_ITEM_SKINS.KEY]: {
    maxPerLevel: 1,
    gems: 50,
    title: 'key',
    description: ['description'],
    skin: SKILL_ITEM_SKINS.KEY
  },
  [SKILL_ITEM_SKINS.STAR]: {
    maxPerLevel: 1,
    gems: 60,
    title: 'star',
    description: ['description'],
    skin: SKILL_ITEM_SKINS.STAR
  },
  [SKILL_ITEM_SKINS.BOX]: {
    maxPerLevel: 1,
    gems: 20,
    title: 'box',
    description: ['Close one box, ', 'and no animal can hide there.'],
    skin: SKILL_ITEM_SKINS.BOX
  },
}

export const getSkillItemDefinition = (skin: SKILL_ITEM_SKINS): SkillItemDefinition => {
  return SKILL_ITEMS[skin]
}
