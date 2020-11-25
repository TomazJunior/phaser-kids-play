import { GAME_WORLDS, TILES, TileGameWorldType } from './constants'
import { getFileStorageConfig } from './gameInfoData'

export const isLevelExist = (gameWorld: GameWorld, level: number): boolean => {
  return !!gameWorld.levels.find((levelConfig) => level === levelConfig.level)
}

export const getNextLevel = (gameWorld: GameWorld, level: number): NextLevel | undefined => {
  let nextLevelExists = isLevelExist(gameWorld, level + 1)
  if (nextLevelExists) {
    return {
      gameWorld,
      level: level + 1,
    }
  }
  const nextWorld = getNextWorld(gameWorld)
  if (!nextWorld) return undefined
  return {
    gameWorld: nextWorld,
    level: 1,
  }
}

export const getLevel = (levels: Array<Level>, level: number): Level => {
  const levelFound = levels.find((levelConfig) => level === levelConfig.level)
  if (!levelFound) throw new Error(`level ${level} not found`)
  return levelFound
}

export const getPreviousLevel = (gameWorld: GameWorld, level: number): Level | undefined => {
  const index = gameWorld.levels.findIndex((value) => value.level === level)
  if (index <= 0) return undefined
  return gameWorld.levels[index - 1]
}

export const getGameWorld = (key?: string): GameWorld => {
  if (!key) return GAME_WORLDS[0]

  const gameWorldFound = GAME_WORLDS.find((gameWorld) => key === gameWorld.key)
  if (!gameWorldFound) throw new Error(`Game World ${key} not found`)
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
  const index = GAME_WORLDS.findIndex((value) => value.key === gameWorld.key)
  if (index === -1) return undefined
  if (index >= GAME_WORLDS.length - 1) return undefined
  return GAME_WORLDS[index + 1]
}

export const getPreviousWorld = (gameWorld: GameWorld): GameWorld | undefined => {
  const index = GAME_WORLDS.findIndex((value) => value.key === gameWorld.key)
  if (index <= 0) return undefined
  return GAME_WORLDS[index - 1]
}

export const allLevelsCompleted = (gameWorld: GameWorld): boolean => {
  const fileStorageData: FileStorageConfig = getFileStorageConfig()

  return gameWorld.levels.every(
    (level) =>
      !!fileStorageData.levels.find((lvl) => lvl.key === gameWorld.key && lvl.level === level.level && lvl.stars >= 1)
  )
}
