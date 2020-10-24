import { BOX, MAP, TILES } from '../utils/constants'
import findPath from '../utils/findPath'

export class GameMap {
  grid: any

  constructor(private scene: Phaser.Scene, private x: number, private y: number) {
    this.createTiles([TILES.DIRT, TILES.GRASS])
  }

  public getTilesPosition = (tiles: Array<TILES>): Array<ObjectPosition> => {
    const positions: Array<ObjectPosition> = []

    for (let i = 0; i < MAP.length; ++i) {
      const row = MAP[i]
      for (let j = 0; j < row.length; ++j) {
        const cell = row[j]
        if (tiles.includes(cell)) {
          positions.push({
            x: BOX.width / 2 + BOX.width * j,
            y: !i ? this.y : this.y + (BOX.height / 2) * i,
            col: j,
            row: i,
          })
        }
      }
    }
    return positions
  }

  public getPathTo = (origin: ObjectPosition, target: ObjectPosition): Array<ObjectPosition> => {
    const collidable: Array<Phaser.Math.Vector2> = this.getTilesPosition([TILES.BOX]).map((pos) => {
      return new Phaser.Math.Vector2(pos.col, pos.row)
    })
    
    // move target y position to nearest position of the box
    let targetCol = target.col
    if (MAP[target.row][target.col] === TILES.BOX) {
      targetCol = (target.col > origin.col) ? targetCol + 1 : targetCol - 1
    }
    
    const path = findPath(
      new Phaser.Math.Vector2(origin.col, origin.row),
      new Phaser.Math.Vector2(targetCol, target.row),
      collidable,
      MAP
    )
    
    return path.map((pos) => {
      return this.getTilePosition(pos.y, pos.x)
    })
  }

  private getTilePosition = (row: number, col: number): ObjectPosition => {
    return {
      x: BOX.width / 2 + BOX.width * col,
      y: !row ? this.y : this.y + (BOX.height / 2) * row,
      row,
      col,
    }
  }

  private createTiles = (tiles: Array<TILES>) => {
    for (let y = 0; y < MAP.length; ++y) {
      const row = MAP[y]
      for (let x = 0; x < row.length; ++x) {
        const cell = row[x]
        if (tiles.includes(TILES.DIRT) && cell === TILES.DIRT) {
          this.scene.add.image(BOX.width / 2 + BOX.width * x, !y ? this.y : this.y + (BOX.height / 2) * y, 'dirt-block')
        }
        if (tiles.includes(TILES.GRASS) && (cell === TILES.GRASS || cell === TILES.PLAYER)) {
          this.scene.add.image(
            BOX.width / 2 + BOX.width * x,
            !y ? this.y : this.y + (BOX.height / 2) * y,
            'grass-block'
          )
        }
      }
    }
  }
}
