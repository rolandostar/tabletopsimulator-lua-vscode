import importFolder from "Utilities/importFolder";
import {
  CustomMessage,
  ErrorMessage,
  GameSaved,
  LoadingANewGame,
  ObjectCreated,
  PrintDebugMessage,
  PushingNewObject,
  ReturnMessage
} from "@matanlurey/tts-editor";

/**
 *  This file exports all other files in this directory making use of the importFolder function.
 */

export default importFolder(require.context("./", false, /\.ts$/), (name: string) => name !== "./index.ts") as {
  eventname: "pushingNewObject" | "loadingANewGame" | "printDebugMessage" | "errorMessage" | "customMessage" | "returnMessage" | "gameSaved" | "objectCreated";
  callback: (e: PushingNewObject | LoadingANewGame | PrintDebugMessage | ErrorMessage | CustomMessage | ReturnMessage | GameSaved | ObjectCreated) => void;
}[];