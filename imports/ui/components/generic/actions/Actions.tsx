import { Meteor } from 'meteor/meteor'

export interface Action {
  name: string
  label: string
  bgColor: string
  isApplicable?: (item: any) => boolean
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

export const BaseDisableAction: Action = {
  name: 'disable',
  label: 'Disable',
  bgColor: 'red.500',
  isApplicable: (item: any) => !item.disabled,
  effect: async (collection: string, id: string, toast=null) => {
    try {
      await BaseActionEffect('setField', collection, id, 'disabled', true)
      if (toast) toast(ActionSuccessToastData);
    } catch (error) {
      if (toast) toast(ActionFailedToastData);
    }
  }
}


export const BaseEnableAction: Action = {
  name: 'enable',
  label: 'Enable',
  bgColor: 'green.500',
  isApplicable: (item: any) => item.disabled,
  effect: async (collection: string, id: string, toast=null) => {
    try {
      await BaseActionEffect('setField', collection, id, 'disabled', false)
      if (toast) toast(ActionSuccessToastData);
    } catch (error) {
      if (toast) toast(ActionFailedToastData);
    }
  }
}
