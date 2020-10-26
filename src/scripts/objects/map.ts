import { PLAYER_CHAR_REACHED_TARGET, PLAYER_TOUCHED_TARGET } from '../events/events'
import { TILES } from '../utils/constants'
import findPath from '../utils/findPath'
import {
  getCollidableTiles,
  getNonCollidableTiles,
  getPlayerTile,
  getTargetTiles,
  getTileGameWorldByTile,
} from '../utils/worldUtil'

export class GameMap {
  nonCollidableTiles: TILES[]
  playerTile: TILES
  targetTiles: TILES[]

  constructor(private scene: Phaser.Scene, private x: number, private y: number, private gameWorld: GameWorld) {
    this.nonCollidableTiles = getNonCollidableTiles(gameWorld.tiles)
    this.playerTile = getPlayerTile(gameWorld.tiles)
    this.targetTiles = getTargetTiles(gameWorld.tiles)
    this.createTiles(this.nonCollidableTiles)
  }

  public getPlayerPosition = (): ObjectPosition => {
    return this.getTilesPosition([this.playerTile])[0]
  }

  public getTargetTilePositions = (): Array<ObjectPosition> => {
    return this.getTilesPosition(this.targetTiles)
  }

  public getPathTo = (origin: ObjectPosition, target: ObjectPosition): Array<ObjectPosition> => {
    const collidableTiles = getCollidableTiles(this.gameWorld.tiles)
    const collidable: Array<Phaser.Math.Vector2> = this.getTilesPosition(collidableTiles).map((pos) => {
      return new Phaser.Math.Vector2(pos.col, pos.row)
    })

    // move target y position to nearest position of the box
    let targetCol = target.col
    if (collidableTiles.includes(this.gameWorld.map[target.row][target.col])) {
      targetCol = target.col > origin.col ? targetCol + 1 : targetCol - 1
    }

    const path = findPath(
      new Phaser.Math.Vector2(origin.col, origin.row),
      new Phaser.Math.Vector2(targetCol, target.row),
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
    onPlayerGoToTarget?: (target: TargetInterface) => void
  ): Array<TargetInterface> => {
    const targetsPosition = this.getTargetTilePositions()
    return targetsPosition.map((pos) => {
      const target = new this.gameWorld.targetClazz(this.scene, pos, targetGroup, this.gameWorld.tileConfig)
      if (onPlayerGoToTarget) {
        target.on(PLAYER_TOUCHED_TARGET, onPlayerGoToTarget)
      }
      return target
    })
  }

  private getTilesPosition = (tiles: Array<TILES>): Array<ObjectPosition> => {
    const { width, height } = this.gameWorld.tileConfig
    const positions: Array<ObjectPosition> = []

    for (let i = 0; i < this.gameWorld.map.length; ++i) {
      const row = this.gameWorld.map[i]
      for (let j = 0; j < row.length; ++j) {
        const cell = row[j]
        if (tiles.includes(cell)) {
          positions.push({
            x: width / 2 + width * j,
            y: !i ? this.y : this.y + (height / 2) * i,
            col: j,
            row: i,
          })
        }
      }
    }
    return positions
  }

  private getTilePosition = (row: number, col: number): ObjectPosition => {
    const { width, height } = this.gameWorld.tileConfig
    return {
      x: width / 2 + width * col,
      y: !row ? this.y : this.y + (height / 2) * row,
      row,
      col,
    }
  }

  private createTiles = (tiles: Array<TILES>) => {
    const { width, height } = this.gameWorld.tileConfig
    for (let y = 0; y < this.gameWorld.map.length; ++y) {
      const row = this.gameWorld.map[y]
      for (let x = 0; x < row.length; ++x) {
        const cell = row[x]
        if (tiles.includes(cell)) {
          const tileGameWorld = getTileGameWorldByTile(this.gameWorld.tiles, cell)

          if (tileGameWorld) {
            this.scene.add.image(width / 2 + width * x, !y ? this.y : this.y + (height / 2) * y, tileGameWorld.texture)
          }
        }
      }
    }
  }
}
