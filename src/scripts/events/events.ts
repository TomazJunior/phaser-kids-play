export const HIDDEN_CHAR_REACHED_TARGET = 'HIDDEN_CHAR_REACHED_TARGET'
export const HIDDEN_CHARS_ENQUEUED = 'HIDDEN_CHARS_ENQUEUED'
export const HIDDEN_CHAR_REACHED_ROAD_POS = 'HIDDEN_CHAR_REACHED_ROAD_POS'
export const HIDDEN_CHAR_REACHED_FINAL_POS = 'HIDDEN_CHAR_REACHED_FINAL_POS'
export const HIDDEN_CHAR_REACHED_DOOR = 'HIDDEN_CHAR_REACHED_DOOR'
export const HIDDEN_CHAR_GOT_OUT = 'HIDDEN_CHAR__REACHED_FINAL_POS'

export const PLAYER_CHAR_REACHED_TARGET = 'PLAYER_CHAR_REACHED_TARGET'
export const PLAYER_REACHED_INITIAL_POS = 'PLAYER_REACHED_INITIAL_POS'
export const PLAYER_REACHED_FINAL_POS = 'PLAYER_REACHED_FINAL_POS'
export const PLAYER_TOUCHED_TARGET = 'PLAYER_TOUCHED_TARGET'

export const SKILL_ITEM_SELECTED = 'SKILL_ITEM_SELECTED'
export const SKILL_ITEM_ACTION_DONE = 'SKILL_ITEM_ACTION_DONE'
export const FIREWORK_HAS_BEEN_RELEASE = 'FIREWORK_HAS_BEEN_RELEASE'

export const removeKnownEvents = (scene: Phaser.Scene) => {
  ;[
    HIDDEN_CHAR_REACHED_TARGET,
    HIDDEN_CHARS_ENQUEUED,
    HIDDEN_CHAR_REACHED_ROAD_POS,
    HIDDEN_CHAR_REACHED_FINAL_POS,
    HIDDEN_CHAR_REACHED_DOOR,
    HIDDEN_CHAR_GOT_OUT,
    PLAYER_CHAR_REACHED_TARGET,
    PLAYER_REACHED_INITIAL_POS,
    PLAYER_REACHED_FINAL_POS,
    PLAYER_TOUCHED_TARGET,
    SKILL_ITEM_SELECTED,
    SKILL_ITEM_ACTION_DONE,
    FIREWORK_HAS_BEEN_RELEASE,
  ].forEach((event) => scene.events.removeListener(event))
}
