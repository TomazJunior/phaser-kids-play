'use strict'
import * as dynogels from 'dynogels'

export class DynamoDBService {
  private static instance: DynamoDBService
  public dynamoDB: dynogels.AWS.DynamoDB
  private constructor() {
    const driver = {
      region: process.env.region,
      endpoint: process.env.dynamoDBEndpoint,
      accessKeyId: process.env.dynamoDBaccessKey,
      secretAccessKey: process.env.dynamoDBaccessSecret,
    }
    dynogels.dynamoDriver(new dynogels.AWS.DynamoDB(driver))
    dynogels.AWS.config.update(driver)
    this.dynamoDB = new dynogels.AWS.DynamoDB({ apiVersion: '2012-08-10' })
  }
  public static getInstance(): DynamoDBService {
    if (!DynamoDBService.instance) {
      DynamoDBService.instance = new DynamoDBService()
    }

    return DynamoDBService.instance
  }

  async createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      dynogels.createTables((error: string) => {
        if (error) {
          console.error(error)
          reject(new Error('DynamoDB: Error creating tables. ' + error))
        } else {
          resolve()
        }
      })
    })
  }
}
