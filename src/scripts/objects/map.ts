import { PLAYER_CHAR_REACHED_TARGET, PLAYER_TOUCHED_TARGET } from '../events/events'
import { TILES } from '../utils/constants'
import { findPath, findNeighbors } from '../utils/findPath'
import {
  getCollidableTiles,
  getPlayerTile,
  getTargetTiles,
  getTileGameWorldByTile,
  getTilesOfType,
} from '../utils/worldUtil'

export class GameMap {
  playerTile: TILES
  targetTiles: TILES[]

  constructor(private scene: Phaser.Scene, private x: number, private y: number, private gameWorld: GameWorld) {
    this.playerTile = getPlayerTile(gameWorld.tiles)
    this.targetTiles = getTargetTiles(gameWorld.tiles)

    this.createTiles([...getTilesOfType(gameWorld.tiles), this.playerTile])
  }

  public getPlayerPosition = (): ObjectPosition => {
    return this.getTilesPosition([this.playerTile])[0]
  }

  public getTargetTilePositions = (): Array<ObjectPosition> => {
    return this.getTilesPosition(this.targetTiles)
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
      const neighbors = findNeighbors(new Phaser.Math.Vector2(target.col, target.row), collidable, this.gameWorld.map)
      if (neighbors.length) {
        vectorTarget.col = neighbors[0].x
        vectorTarget.row = neighbors[0].y
      }
    }

    const path = findPath(
      new Phaser.Math.Vector2(origin.col, origin.row),
      new Phaser.Math.Vector2(vectorTarget.col, vectorTarget.row),
      collidable,
      this.gameWorld.map
    )

    return path.map((pos) => {
      return this.getTilePosition(pos.y, pos.x)
    })
  }

  public createPlayer = (onReachedTarget?: (target: TargetInterface) => void): PlayerInterface => {
    const player = new this.gameWorld.playerClazz(this.scene, this.getPlayerPosition())
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

    return {
      x: !col ? this.x : this.x + width * col,
      y: !row ? this.y : this.y + height * row,
      row,
      col,
    }
  }

  private getTileByPosition = (objectPosition: ObjectPosition): TileGameWorld | undefined => {
    const value: any = this.gameWorld.map[objectPosition.row][objectPosition.col]
    const tileKey = Object.keys(TILES).find((key: string) => {
      TILES[key] === value
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

    for (let i = 0; i < this.gameWorld.map.length; ++i) {
      const row = this.gameWorld.map[i]
      for (let j = 0; j < row.length; ++j) {
        const cell = row[j]
        if (tiles.includes(cell)) {
          positions.push({
            x: !j ? this.x : this.x + width * j,
            y: !i ? this.y : this.y + height * i,
            col: j,
            row: i,
          })
        }
      }
    }
    return positions
  }

  private createTiles = (tiles: Array<TILES>) => {
    let { width, height } = this.gameWorld.tileConfig
    const { scale } = this.gameWorld.tileConfig
    width *= scale
    height *= scale

    for (let y = 0; y < this.gameWorld.map.length; ++y) {
      const row = this.gameWorld.map[y]
      for (let x = 0; x < row.length; ++x) {
        const cell = row[x]
        if (tiles.includes(cell)) {
          const tileGameWorld = getTileGameWorldByTile(this.gameWorld.tiles, cell)
          tileGameWorld?.textures?.forEach(({ texture, frame}) => {
            this.createImage(x, y, width, height, texture, scale, tileGameWorld.rotation, frame)
          })
        }
      }
    }
  }

  private createImage(
    x: number,
    y: number,
    width: number,
    height: number,
    texture: string,
    scale: number,
    rotation?: number,
    frame?: string
  ) {
    const image = this.scene.add.image(
      !x ? this.x : this.x + width * x,
      !y ? this.y : this.y + height * y,
      texture,
      frame
    )
    image.setScale(scale, scale)

    if (rotation) {
      image.setRotation(rotation)
    }
  }
}
