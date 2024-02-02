import { Meteor } from 'meteor/meteor'

interface BaseAction {
  name: string
  label: string
  bgColor: string
  effect?: (...args: any[]) => void
  isApplicable?: (item: any) => boolean
}

export interface Action extends BaseAction {
  effect: (...args: any[]) => void
}

export const ActionFailedToastData: any = {
  title: 'Error while executing action. Please try again.',
  status: 'error',
  duration: 3000,
  isClosable: true,
}

export const ActionSuccessToastData: any = {
  title: 'Success',
  status: 'success',
  duration: 3000,
  isClosable: true,
}

const BaseActionEffect = (
  method: string,
  collection: string,
  id: string,
  fieldName: string,
  value: any,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    Meteor.call(
      method,
      collection,
      id,
      fieldName,
      value,
      (error: Meteor.Error, result: any) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      },
    )
  })
}

export const DisableActionEffect = async (
  collection: string,
  id: string,
): Promise<void> => {
  try {
    await BaseActionEffect('setField', collection, id, 'disabled', true)
  } catch (error) {
    throw error // Re-throw the error to be caught in the higher-level catch block
  }
}

export const BaseDisableAction: BaseAction = {
  name: 'disable',
  label: 'Disable',
  bgColor: 'red.500',
  isApplicable: (item: any) => !item.disabled,
}

export const EnableActionEffect = async (
  collection: string,
  id: string,
): Promise<void> => {
  try {
    await BaseActionEffect('setField', collection, id, 'disabled', false)
  } catch (error) {
    throw error // Re-throw the error to be caught in the higher-level catch block
  }
}

export const BaseEnableAction: BaseAction = {
  name: 'enable',
  label: 'Enable',
  bgColor: 'green.500',
  isApplicable: (item: any) => item.disabled,
}
