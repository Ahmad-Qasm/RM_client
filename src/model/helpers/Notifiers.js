import { store } from 'react-notifications-component'

/**
 * @param {string} message - the message to display
 * Displays a success message
 */
export function notifySuccess(message) {
  store.addNotification({
    title: 'Success',
    message: message,
    type: 'success',
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__backInRight", "animate__fast"],
    animationOut: ["animate__animated", "animate__fadeOutRight"],
    dismiss: {
      duration: 1500,
      onScreen: false
    }
  });
}

/**
 * @param {string} message - the message to display
 * Displays a warning message
 */
 export function notifyWarning(message) {
  store.addNotification({
    title: 'Warning',
    message: message,
    type: 'warning',
    insert: "top",
    container: "top-right",
    animationIn: ["animate__jackInTheBox", "animate__backInRight", "animate__fast"],
    animationOut: ["animate__animated", "animate__fadeOutRight"],
    dismiss: {
      duration: 4000,
      onScreen: false
    }
  })
}

/**
 * @param {string} message - the message to display
 * Displays an error message
 */
export function notifyFailed(message, duration = 1500) {
  store.addNotification({
    title: 'Error',
    message: message,
    type: 'danger',
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__shakeX", "animate__fast"],
    animationOut: ["animate__animated", "animate__fadeOutRight"],
    dismiss: {
      duration: duration,
      onScreen: false
    }
  })
}