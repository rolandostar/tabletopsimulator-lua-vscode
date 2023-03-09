import importFolder from "../../utils/importFolder";
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

export default importFolder(require.context("./", false, /\.ts$/), name => name !== "./index.ts") as {
  eventname: "pushingNewObject" | "loadingANewGame" | "printDebugMessage" | "errorMessage" | "customMessage" | "returnMessage" | "gameSaved" | "objectCreated";
  callback: (e: PushingNewObject | LoadingANewGame | PrintDebugMessage | ErrorMessage | CustomMessage | ReturnMessage | GameSaved | ObjectCreated) => void;
}[];