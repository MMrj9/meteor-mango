import { Meteor } from 'meteor/meteor'

interface BaseAction {
  name: string
  label: string
  bgColor: string
  effect?: (...args: any[]) => void
}

interface Action extends BaseAction {
  effect: (...args: any[]) => void
}

const BaseActionEffect = (
  method: string,
  collection: string,
  id: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    Meteor.call(method, collection, id, (error: Meteor.Error, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

const DisableActionEffect = async (
  collection: string,
  id: string,
): Promise<void> => {
  try {
    await BaseActionEffect('disable', collection, id)
  } catch (error) {
    throw error // Re-throw the error to be caught in the higher-level catch block
  }
}

const BaseDisableAction: BaseAction = {
  name: 'disable',
  label: 'Disable',
  bgColor: 'red.500',
}

export { Action, BaseDisableAction, DisableActionEffect }
