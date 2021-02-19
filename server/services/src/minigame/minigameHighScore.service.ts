import { Item } from 'dynogels'
import { MiniGameHighScore } from '../shared/models'

export default class MiniGameHighScoreService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async get(userId, minigameId): Promise<any> {
    this.logger.debug('MiniGameHighScoreService.get', 'process started ')
    return new Promise((resolve, reject) => {
      return MiniGameHighScore.get(userId, minigameId, (err, data) => {
        if (err) {
          this.logger.debug('MiniGameHighScoreService.get', 'process failed');
          return reject(err);
        };
        resolve(data && data.get());
        this.logger.debug('MiniGameHighScoreService.get', 'process completed');
      });
    });
  }

  async add(miniGameHighScore: Item): Promise<any> {
    this.logger.debug('MiniGameHighScoreService.add', 'process started')
    return new Promise((resolve, reject) => {
      return miniGameHighScore.save((err: Error, data: Item) => {
        if (err) {
          this.logger.debug('MiniGameHighScoreService.add', 'process failed')
          return reject(err)
        }
        resolve(data.toJSON())
        this.logger.debug('MiniGameHighScoreService.add', 'process completed')
      })
    })
  }

  async update(userId, miniGameId, properties) {
    this.logger.debug('MiniGameHighScoreService.update', 'process started')
    return new Promise((resolve, reject) => {
      return MiniGameHighScore.update({ ...properties, userId, miniGameId }, (err, data) => {
        if (err) {
          this.logger.debug('MiniGameHighScoreService.update', 'process failed')
          return reject(err)
        }
        resolve(data)
        this.logger.debug('MiniGameHighScoreService.update', 'process completed')
      })
    })
  }

  async getTopRankedByMiniGameId(miniGameId: number, limit: number): Promise<Array<any>> {
    this.logger.debug('MiniGameHighScoreService.getTopRankedByMiniGameId', 'process started');
    return new Promise((resolve, reject) => {
      MiniGameHighScore
        .query(miniGameId)
        .usingIndex('miniGameIdIndex')
        .loadAll()
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                this.logger.debug('MiniGameHighScoreService.getTopRankedByMiniGameId', 'process failed');
                return reject(err);
            };
            resolve(data.Items.map((i) => i.get()))
            this.logger.debug('MiniGameHighScoreService.getTopRankedByMiniGameId', 'process completed');
        });
    });        
  }
}
