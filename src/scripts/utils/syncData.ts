import { updateUserInfo } from '../controllers/deviceInfo'
import { ServiceApi } from './api'
import { sortArray } from './arrayUtil'
import { getUserId } from './gameInfoData'
import {
  getLevelsCompleted,
  getSkillItemPurchased,
  getSkillItemsUsed,
  updateLevelsCompleted,
  updateSkillItemPurchased,
  updateSkillItemsUsed,
} from './gameProgressData'

export interface SyncDataOnProgress {
  stepText: Array<string>
  gems?: number
  done: boolean
}

interface onProgressFunction {
  (onProgressConfig: SyncDataOnProgress): Promise<void>
}

export default class SyncData {
  api: ServiceApi
  constructor() {
    this.api = new ServiceApi()
  }

  sync = async (onProgress: onProgressFunction): Promise<void> => {
    let userId = getUserId()
    if (!userId) {
      await this.handleProgress({ stepText: ['Syncing user info'], done: false }, onProgress)
      await updateUserInfo()
      userId = getUserId()
    }

    await this.syncLevels(userId, onProgress)
    await this.syncSkillItemsPurchased(userId, onProgress)
    await this.syncSkillItemsUsed(userId, onProgress)


    const syncDataProgress: SyncDataOnProgress = {
      stepText: ['Syncing gems'],
      done: false,
    }
    await this.handleProgress(syncDataProgress, onProgress)
    await this.syncGems(
      userId,
      syncDataProgress,
      onProgress
    )

    await this.handleProgress({ stepText: ['Syncing completed'], done: true }, onProgress)
  }

  private handleProgress = async (
    onProgressConfig: SyncDataOnProgress,
    onProgress: onProgressFunction
  ): Promise<void> => {
    await onProgress(onProgressConfig)
  }

  private syncLevels = async (userId: string, onProgress: onProgressFunction): Promise<void> => {
    const syncDataProgress: SyncDataOnProgress = {
      stepText: ['Syncing levels'],
      done: false,
    }
    await this.handleProgress(syncDataProgress, onProgress)
    const levelsCompleted = sortArray<LevelCompleted>(
      (await getLevelsCompleted()).filter((item) => !item.sync),
      'time'
    )
    const hasSomethingToUpdate = levelsCompleted.length > 0

    while (levelsCompleted.length) {
      const levelCompleted = levelsCompleted.splice(0, 1)[0]
      if (levelCompleted) {
        await this.api.levelCompleted(userId, levelCompleted)
        await updateLevelsCompleted([...levelsCompleted])
      } else {
        await updateLevelsCompleted([])
      }
    }

    if (!hasSomethingToUpdate) return Promise.resolve()
    await this.syncGems(userId, syncDataProgress, onProgress)
  }

  private syncSkillItemsPurchased = async (userId: string, onProgress: onProgressFunction): Promise<void> => {
    const syncDataProgress: SyncDataOnProgress = {
      stepText: ['Syncing boosters', 'purchased'],
      done: false,
    }
    await this.handleProgress(syncDataProgress, onProgress)
    const skillItemsPurchased: Array<SkillItemPurchased> = sortArray<SkillItemPurchasedWithSync>(
      (await getSkillItemPurchased()).filter((item) => !item.sync),
      'time'
    ).map((item) => {
      if (item.sync !== undefined) delete item.sync
      return item
    })
    const hasSomethingToUpdate = skillItemsPurchased.length > 0

    while (skillItemsPurchased.length) {
      const skillItemPurchased = skillItemsPurchased.splice(0, 1)[0]
      if (skillItemPurchased) {
        await this.api.skillItemPurchased(userId, skillItemPurchased)
        await updateSkillItemPurchased([...skillItemsPurchased])
      } else {
        await updateSkillItemPurchased([])
      }
    }

    if (!hasSomethingToUpdate) return Promise.resolve()
    await this.syncGems(userId, syncDataProgress, onProgress)
  }

  private syncSkillItemsUsed = async (userId: string, onProgress: onProgressFunction): Promise<void> => {
    const syncDataProgress: SyncDataOnProgress = {
      stepText: ['Syncing boosters', 'used'],
      done: false,
    }
    await this.handleProgress(syncDataProgress, onProgress)
    const skillItemsUsed = sortArray<SkillItemUsed>(
      (await getSkillItemsUsed()).filter((item) => !item.sync),
      'time'
    )
    const hasSomethingToUpdate = skillItemsUsed.length > 0

    while (skillItemsUsed.length) {
      const skillItemUsed = skillItemsUsed.splice(0, 1)[0]
      if (skillItemUsed) {
        const { quantity, skin, time } = skillItemUsed
        await this.api.skillItemUsed(userId, [{ quantity, skin }], time)
        await updateSkillItemsUsed([...skillItemsUsed])
      } else {
        await updateSkillItemsUsed([])
      }
    }

    if (!hasSomethingToUpdate) return Promise.resolve()
    await this.syncGems(userId, syncDataProgress, onProgress)
  }

  private syncGems = async (
    userId: string,
    progressConfig: SyncDataOnProgress,
    onProgress: onProgressFunction
  ): Promise<void> => {
    const { gems } = await this.api.getUser(userId)
    await onProgress({ ...progressConfig, gems })
  }
}
