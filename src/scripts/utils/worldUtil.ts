import { GAME_WORLDS, TILES, TileGameWorldType } from './constants'

export const isLevelExist = (levels: Array<Level>, level: number): boolean => {
  return levels.find((levelConfig) => level === levelConfig.level) !== undefined
}

export const getLevel = (levels: Array<Level>, level: number): Level => {
  const levelFound = levels.find((levelConfig) => level === levelConfig.level)
  if (!levelFound) throw new Error(`level ${level} not found`)
  return levelFound
}

export const getPreviousLevel = (gameWorld: GameWorld, level: number): Level | undefined => {
  const index = gameWorld.levels.findIndex(value => value.level === level)
  if (index <= 0) return undefined
  return gameWorld.levels[index - 1]
}

export const getGameWorld = (name?: string): GameWorld => {
  if (!name) return GAME_WORLDS[0]

  const gameWorldFound = GAME_WORLDS.find((gameWorld) => name === gameWorld.key)
  if (!gameWorldFound) throw new Error(`Game World ${name} not found`)
  return gameWorldFound
}

export const getCollidableTiles = (tiles: Array<TileGameWorld>): Array<TILES> => {
  return tiles.filter((tile) => !!tile.collidable).map((tile) => tile.tile)
}

export const getNonCollidableTiles = (tiles: Array<TileGameWorld>): Array<TILES> => {
  return tiles.filter((tile) => !tile.collidable).map((tile) => tile.tile)
}

export const getTilesOfType = (tiles: Array<TileGameWorld>, tileTypes?: Array<TileGameWorldType>): Array<TILES> => {
  return tiles.filter((tile) => !tileTypes || tileTypes.includes(tile.tileType)).map((tile) => tile.tile)
}

export const getPlayerTile = (tiles: Array<TileGameWorld>): TILES => {
  const playerTileFound = tiles.find((tile) => tile.tileType === TileGameWorldType.PLAYER)?.tile
  if (!playerTileFound) throw new Error(`player tile not found`)
  return playerTileFound
}

export const getTargetTiles = (tiles: Array<TileGameWorld>): Array<TILES> => {
  return tiles.filter((tile) => tile.tileType === TileGameWorldType.TARGET).map((tile) => tile.tile)
}

export const getTileGameWorldByTile = (
  tileGameWorlds: Array<TileGameWorld>,
  tile: TILES
): TileGameWorld | undefined => {
  return tileGameWorlds.find((tileGameWorld) => tileGameWorld.tile === tile)
}

export const getNextWorld = (gameWorld: GameWorld): GameWorld | undefined => {
  const index = GAME_WORLDS.findIndex(value => value.key === gameWorld.key)
  if (index === -1) return undefined
  if (index >= GAME_WORLDS.length - 1) return undefined
  return GAME_WORLDS[index + 1]
}

export const getPreviousWorld = (gameWorld: GameWorld): GameWorld | undefined => {
  const index = GAME_WORLDS.findIndex(value => value.key === gameWorld.key)
  if (index <= 0) return undefined
  return GAME_WORLDS[index - 1]
}