import Phaser from 'phaser'

interface TilePosition {
  x: number
  y: number
}

const toKey = (x: number, y: number) => `${x}x${y}`

const isCollidable = (x: number, y: number, colideables: Array<Phaser.Math.Vector2>): boolean => {
  return !!colideables.find((pos) => pos.x === x && pos.y === y)
}
const findNeighbors = (
  position: Phaser.Math.Vector2,
  collidables: Array<Phaser.Math.Vector2>,
  map: number[][]
): Neighbors => {
  const { x, y } = position

  const possibleNeighbors: Neighbors = {
    top: { x, y: y - 1 },
    right: { x: x + 1, y },
    bottom: { x, y: y + 1 },
    left: { x: x - 1, y },
  }

  return Object.keys(possibleNeighbors).reduce((neighbors: Neighbors, key: string) => {
    let possibleNeighbor = possibleNeighbors[key]

    if (isCollidable(possibleNeighbor.x, possibleNeighbor.y, collidables)) {
      return neighbors
    }

    if (possibleNeighbor.x < 0 || possibleNeighbor.x > map[0].length - 1) {
      return neighbors
    }

    if (possibleNeighbor.y < 0 || possibleNeighbor.y > map.length - 1) {
      return neighbors
    }

    neighbors[key] = possibleNeighbor
    return neighbors
  }, {})
}

const findPath = (
  start: Phaser.Math.Vector2,
  target: Phaser.Math.Vector2,
  collidables: Array<Phaser.Math.Vector2>,
  map: number[][]
) => {
  const queue: TilePosition[] = []
  const parentForKey: { [key: string]: { key: string; position: TilePosition } } = {}

  const startKey = toKey(start.x, start.y)
  const targetKey = toKey(target.x, target.y)

  parentForKey[startKey] = {
    key: '',
    position: { x: -1, y: -1 },
  }

  queue.push(start)

  while (queue.length > 0) {
    const { x, y } = queue.shift()!
    const currentKey = toKey(x, y)

    if (currentKey === targetKey) {
      break
    }

    const neighbors = [
      { x, y: y - 1 }, // top
      { x: x + 1, y }, // right
      { x, y: y + 1 }, // bottom
      { x: x - 1, y }, // left
    ]

    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i]

      if (neighbor.x < 0 || neighbor.x > map[0].length - 1) {
        continue
      }

      if (neighbor.y < 0 || neighbor.y > map.length - 1) {
        continue
      }

      if (isCollidable(neighbor.x, neighbor.y, collidables)) {
        continue
      }

      const key = toKey(neighbor.x, neighbor.y)

      if (key in parentForKey) {
        continue
      }

      parentForKey[key] = {
        key: currentKey,
        position: { x, y },
      }
      queue.push(neighbor)
    }
  }

  const path: Phaser.Math.Vector2[] = []

  let currentKey = targetKey
  let currentPos = parentForKey[targetKey].position

  while (currentKey !== startKey) {
    path.push(new Phaser.Math.Vector2(currentPos.x, currentPos.y))

    const { key, position } = parentForKey[currentKey]
    currentKey = key
    currentPos = position
  }

  return path.reverse()
}

export { findPath, findNeighbors }
