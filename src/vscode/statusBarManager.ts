/**
 * @file Status Bar Manager
 * This file contains functions to create and manage status bar items
 */

import { type StatusBarItem, StatusBarAlignment, window, MarkdownString, ThemeColor } from 'vscode'

/**
 * This function will create a status bar item with the given parameters
 * @returns A status bar item
 */
export function createStatusBarItem ({
  align = StatusBarAlignment.Left,
  priority = 1,
  command = '',
  tooltip = ''
}): StatusBarItem {
  const statusBarItem = window.createStatusBarItem(align, priority)
  statusBarItem.command = command
  statusBarItem.tooltip = new MarkdownString(tooltip)
  return statusBarItem
}

/**
 * Receives a status bar item and a theme and changes the item's background and foreground colors
 * @param item
 * @param theme 'default' | 'error' | 'warning'
 */
export function changeTheme (item: StatusBarItem, theme: 'default' | 'error' | 'warning'): void {
  item.backgroundColor = new ThemeColor(`statusBarItem.${theme}Background`)
  item.color = new ThemeColor(`statusBarItem.${theme}Foreground`)
  item.show()
}

export function quickStatus (message: string, timeout = 1500): void {
  const statusBar = window.setStatusBarMessage(message)
  setTimeout(() => statusBar.dispose(), timeout)
}
