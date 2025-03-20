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

const applyActionToItems = async (
  method: string,
  collection: string,
  items: any[],
  fieldName: string,
  value: any,
  toast: any,
  isApplicable: (item: any) => boolean,
) => {
  try {
    for (const item of items) {
      if (isApplicable(item)) {
        await BaseActionEffect(method, collection, item._id, fieldName, value)
      }
    }
    if (toast) toast(ActionSuccessToastData)
  } catch (error) {
    if (toast) toast(ActionFailedToastData)
  }
}

export const BaseDisableAction: Action = {
  name: 'disable',
  label: 'Disable',
  bgColor: 'red.500',
  isApplicable: (item: any) => !item.disabled,
  effect: async (collection: string, items: any | any[], toast = null) => {
    const itemsArray = Array.isArray(items) ? items : [items]
    await applyActionToItems(
      'setField',
      collection,
      itemsArray,
      'disabled',
      true,
      toast,
      BaseDisableAction.isApplicable!,
    )
  },
}

export const BaseEnableAction: Action = {
  name: 'enable',
  label: 'Enable',
  bgColor: 'green.500',
  isApplicable: (item: any) => item.disabled,
  effect: async (collection: string, items: any | any[], toast = null) => {
    const itemsArray = Array.isArray(items) ? items : [items]
    await applyActionToItems(
      'setField',
      collection,
      itemsArray,
      'disabled',
      false,
      toast,
      BaseEnableAction.isApplicable!,
    )
  },
}
