import { PLAYER_CHAR_REACHED_TARGET, PLAYER_TOUCHED_TARGET } from '../events/events'
import { deepCopy } from '../utils/arrayUtil'
import { TILES } from '../utils/constants'
import { findPath, findNeighbors } from '../utils/findPath'
import {
  getCollidableTiles,
  getPlayerTile,
  getPreviousLevel,
  getTargetTiles,
  getTileGameWorldByTile,
  getTilesOfType,
} from '../utils/worldUtil'

export class GameMap {
  playerTile: TILES
  targetTiles: TILES[]
  imageTiles: { [key: string]: {tile: string, images: Array<Phaser.GameObjects.Image>} }
  currentMap: any[][]

  constructor(private scene: Phaser.Scene, private x: number, private y: number, private gameWorld: GameWorld) {
    this.playerTile = getPlayerTile(gameWorld.tiles)
    this.targetTiles = getTargetTiles(gameWorld.tiles)
    this.imageTiles = {}
    this.currentMap = []
    this.createTiles([...getTilesOfType(this.gameWorld.tiles), this.playerTile])
  }

  public getPlayerPosition = (): ObjectPosition => {
    return this.getTilesPosition([this.playerTile])[0]
  }

  public getPlayerInitPosition = (): ObjectPosition => {
    return this.getTilesPosition([TILES.INIT_POSITION])[0]
  }

  public getPlayerFinalPosition = (): ObjectPosition => {
    return this.getTilesPosition([TILES.FINAL_POSITION])[0]
  }

  public getIntermediatePosition = (): ObjectPosition => {
    return this.getTilesPosition([TILES.INTERMEDIATE_POSITION])[0]
  }

  public getTargetTilePositions = (): Array<ObjectPosition> => {
    return this.getTilesPosition(this.targetTiles)
  }

  public getDoorMidPosition = (): ObjectPosition => {
    return this.getTilesPosition([TILES.DOOR_MID])[0]
  }

  public getDoorTopPosition = (): ObjectPosition => {
    return this.getTilesPosition([TILES.DOOR_TOP])[0]
  }

  public getPathTo = (
    origin: ObjectPosition,
    target: ObjectPosition,
    findNearestTarget: boolean = false
  ): Array<ObjectPosition> => {
    const collidableTiles = getCollidableTiles(this.gameWorld.tiles)
    const possibleCollidables: Array<Phaser.Math.Vector2> = this.getTilesPosition(collidableTiles).map((pos) => {
      return new Phaser.Math.Vector2(pos.col, pos.row)
    })

    const collidable = findNearestTarget
      ? possibleCollidables
      : possibleCollidables.filter((vector) => {
          const found = vector.x === target.col && vector.y === target.row
          return !found
        })

    let vectorTarget = { ...target }
    if (findNearestTarget) {
      const neighbor = this.findNeighbor(target, collidable, findNearestTarget)
      if (neighbor) {
        vectorTarget.col = neighbor.col
        vectorTarget.row = neighbor.row
      }
    }

    const path = findPath(
      new Phaser.Math.Vector2(origin.col, origin.row),
      new Phaser.Math.Vector2(vectorTarget.col, vectorTarget.row),
      collidable,
      this.currentMap
    )

    return path.map((pos) => {
      return this.getTilePosition(pos.y, pos.x)
    })
  }

  public createPlayer = (onReachedTarget?: (target: TargetInterface) => void): PlayerInterface => {
    const player = new this.gameWorld.playerClazz(this.scene, this.getPlayerPosition(), this)
    if (onReachedTarget) {
      player.on(PLAYER_CHAR_REACHED_TARGET, onReachedTarget)
    }
    return player
  }

  public createTargets = (
    targetGroup: Phaser.Physics.Arcade.StaticGroup,
    onTouchTarget?: (target: TargetInterface) => void
  ): Array<TargetInterface> => {
    const targetsPosition = this.getTargetTilePositions()
    return targetsPosition.map((pos, index) => {
      const tileGameWorld = this.getTileByPosition(pos)
      const target = new this.gameWorld.targetClazz(
        this.scene,
        pos,
        targetGroup,
        this.gameWorld.tileConfig,
        tileGameWorld,
        index
      )
      if (onTouchTarget) {
        target.on(PLAYER_TOUCHED_TARGET, onTouchTarget)
      }
      return target
    })
  }

  public getTilePosition = (row: number, col: number): ObjectPosition => {
    let { width, height } = this.gameWorld.tileConfig
    const { scale } = this.gameWorld.tileConfig
    width *= scale
    height *= scale

    const objectPosition: ObjectPosition = {
      x: !col ? this.x : this.x + width * col,
      y: !row ? this.y : this.y + height * row,
      row,
      col,
    }

    const tileGameWorld = this.getTileByPosition(objectPosition)
    return {
      ...objectPosition,
      tile: tileGameWorld?.tile,
    }
  }

  public findNeighbor = (
    target: ObjectPosition,
    collidable?: Array<Phaser.Math.Vector2>,
    findNearestTarget?: boolean
  ): ObjectPosition | undefined => {
    let collidables: Array<Phaser.Math.Vector2> = []
    if (!collidable) {
      const collidableTiles = getCollidableTiles(this.gameWorld.tiles)
      const possibleCollidables: Array<Phaser.Math.Vector2> = this.getTilesPosition(collidableTiles).map((pos) => {
        return new Phaser.Math.Vector2(pos.col, pos.row)
      })

      collidables = findNearestTarget
        ? possibleCollidables
        : possibleCollidables.filter((vector) => {
            const found = vector.x === target.col && vector.y === target.row
            return !found
          })
    } else {
      collidables = [...collidable]
    }

    const neighbors = findNeighbors(new Phaser.Math.Vector2(target.col, target.row), collidables, this.currentMap)
    const neighborKey = Object.keys(neighbors).find((key) => {
      return neighbors[key].x || neighbors[key].y
    })

    if (neighborKey) {
      return this.getTilePosition(neighbors[neighborKey].y, neighbors[neighborKey].x)
    }
  }

  public findNeighbors = (
    target: ObjectPosition,
    collidable?: Array<Phaser.Math.Vector2>,
    findNearestTarget?: boolean
  ): Neighbors => {
    let collidables: Array<Phaser.Math.Vector2> = []
    if (!collidable) {
      const collidableTiles = getCollidableTiles(this.gameWorld.tiles)
      const possibleCollidables: Array<Phaser.Math.Vector2> = this.getTilesPosition(collidableTiles).map((pos) => {
        return new Phaser.Math.Vector2(pos.col, pos.row)
      })

      collidables = findNearestTarget
        ? possibleCollidables
        : possibleCollidables.filter((vector) => {
            const found = vector.x === target.col && vector.y === target.row
            return !found
          })
    } else {
      collidables = [...collidable]
    }

    return findNeighbors(new Phaser.Math.Vector2(target.col, target.row), collidables, this.currentMap)
  }

  public overrideTiles = (level: Level) => {
    this.currentMap = deepCopy(this.gameWorld.map)

    // remove previous overrides
    const previousLevel = getPreviousLevel(this.gameWorld, level.level)
    
    previousLevel?.tileOverride?.forEach((tileOveride) => {
      const { row, col } = tileOveride.position
      const cell = this.currentMap[row][col]
      const tileGameWorld = getTileGameWorldByTile(this.gameWorld.tiles, cell)
      if (!tileGameWorld) throw new Error(`Tile of row: ${row} and column: ${col} not found`)
      this.createImages(col, row, tileGameWorld)
    })

    // add new overrides
    level?.tileOverride?.forEach((tileOveride) => {
      const tileGameWorld = this.gameWorld.tiles.find((tile) => tile.name === tileOveride.tileName)
      const { row, col } = tileOveride.position
      if (!tileGameWorld) throw new Error(`Tile of row: ${row} and column: ${col} not found`)
      this.createImages(col, row, tileGameWorld)
      this.currentMap[row][col] = tileGameWorld.tile
    })
  }

  private getTileByPosition = (objectPosition: ObjectPosition): TileGameWorld | undefined => {
    const value: any = this.currentMap[objectPosition.row][objectPosition.col]
    const tileKey = Object.keys(TILES).find((key: string) => {
      return TILES[key] === value
    })

    if (!tileKey) return undefined

    return this.gameWorld.tiles.find((tileGameWorld) => tileGameWorld.tile === TILES[tileKey])
  }

  private getTilesPosition = (tiles: Array<TILES>): Array<ObjectPosition> => {
    let { width, height } = this.gameWorld.tileConfig
    const { scale } = this.gameWorld.tileConfig
    width *= scale
    height *= scale

    const positions: Array<ObjectPosition> = []

    for (let i = 0; i < this.currentMap.length; ++i) {
      const row = this.currentMap[i]
      for (let j = 0; j < row.length; ++j) {
        const cell = row[j]
        if (tiles.includes(cell)) {
          positions.push({
            x: !j ? this.x : this.x + width * j,
            y: !i ? this.y : this.y + height * i,
            col: j,
            row: i,
            tile: cell,
          })
        }
      }
    }
    return positions
  }

  private createTiles = (tiles: Array<TILES>) => {
    // should use gameworld
    for (let y = 0; y < this.gameWorld.map.length; ++y) {
      const row = this.gameWorld.map[y]
      for (let x = 0; x < row.length; ++x) {
        const cell = row[x]
        if (tiles.includes(cell)) {
          const tile = getTileGameWorldByTile(this.gameWorld.tiles, cell)
          if (!tile) throw new Error(`Tile of row: ${y} and column: ${x} not found`)
          this.createImages(x, y, tile)
        }
      }
    }
  }

  private createImages = (col, row, tile: TileGameWorld) => {
    const key = `${col}x${row}`
    this.imageTiles[key]?.images.forEach((image) => image.destroy(true))
    if (!this.imageTiles[key]) this.imageTiles[key] = {tile: tile.name, images: []}
    tile.textures?.forEach(({ texture, frame }, index) => {
      const image = this.createImage(col, row, texture, !index ? undefined : tile.angle, frame)
      this.imageTiles[key].images.push(image)
    })
  }

  private createImage(x: number, y: number, texture: string, angle?: number, frame?: string): Phaser.GameObjects.Image {
    let { width, height } = this.gameWorld.tileConfig
    const { scale } = this.gameWorld.tileConfig
    width *= scale
    height *= scale

    const image = this.scene.add.image(
      !x ? this.x : this.x + width * x,
      !y ? this.y : this.y + height * y,
      texture,
      frame
    )
    image.setScale(scale, scale)

    if (angle) {
      image.setAngle(angle)
    }
    return image
  }
}
