/**
 * Shape of data received from TTS
 */
export interface GenericTTSMessage {
  messageID: RxMsgType;
}

export interface ObjectPushedMessage {
  messageID: RxMsgType.ObjectPushed;
  scriptStates: ScriptState[];
}

export interface NewGameMessage {
  messageID: RxMsgType.NewGame;
  savePath: string; // Undocumented
  scriptStates: ScriptState[];
}

export interface PrintDebugMessage {
  messageID: RxMsgType.PrintDebug;
  message: string;
}

export interface ErrorMessage {
  messageID: RxMsgType.Error;
  error: string;
  guid: '-1';
  errorMessagePrefix: string;
}

export interface CustomMessage {
  messageID: RxMsgType.CustomMessage;
  // Custom Message as defined by me ✌️
  customMessage: {
    type: string;
    content: string;
  };
}

export interface ReturnMessage {
  messageID: RxMsgType.Return;
  returnID: number; // Undocumented
  returnValue: string;
}

export interface GameSavedMessaged {
  messageID: RxMsgType.GameSaved;
  savePath: string; // Undocumented
}

export interface ObjectCreatedMessage {
  messageID: RxMsgType.ObjectCreated;
  guid: string;
}

/**
 * Shape of every object received
 */
export interface ScriptState {
  name: string;
  guid: string;
  script: string;
  ui?: string;
}

/**
 * Types of messages that can be received
 */
export enum RxMsgType {
  ObjectPushed,
  NewGame,
  PrintDebug,
  Error,
  CustomMessage,
  Return,
  GameSaved,
  ObjectCreated,
}

/**
 * Types of messages that can be sent
 */
export enum TxMsgType {
  GetScripts,
  SaveAndPlay,
  CustomMessage,
  ExecuteLua,
}

export interface BundleSyntaxError {
  line: number;
  index: number;
  column: number;
}
