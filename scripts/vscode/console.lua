require("Console/console++")

-- function prototype
function onExternalCommand(command) end

-- Overwrite onChat function if you rather be handled by onExternalMessage
-- function onChat(message, player) end

function onExternalMessage(data)
  if data.input ~= nil then onExternalCommand(data.input) end
  if data.command ~= nil then
    local hostPlayer
    local players = getSeatedPlayers()
    for key, value in pairs(players) do
      if Player[value].host then
        hostPlayer = Player[value]
      end
    end
    if data.command ~= '' then
      local command = ''
      local command_function = nil
      local parameters = {hostPlayer}
      local requires_admin = false
      local command_mode = console.in_command_mode[hostPlayer.steam_id]
      if command_mode and console.active then
          command, command_function, parameters, requires_admin = console.get_command(data.command, hostPlayer)
      elseif data.command:sub(1, 1) == console.command_char and console.active then
          if data.command:len() > 1 then
              command, command_function, parameters, requires_admin = console.get_command(data.command:sub(2), hostPlayer)
          else
              command, command_function, parameters, requires_admin = console.get_command(console.command_char, hostPlayer)
          end
      else
          for i, f in ipairs(console.validation_functions) do
              local valid, response = f(data.command)
              if response == nil then response = '' end
              if not valid then
                  printToColor(response, hostPlayer.color, console.invalid_color)
                  return false
              end
          end
          return true
      end
      if console.active then
          if command_function and (hostPlayer.admin or not requires_admin) then
              if command_mode then
                  data.command = console.command_char .. console.command_char .. data.command
              end
              local response, mute = command_function(unpack(parameters))
              if response ~= nil or mute ~= nil then
                  if not mute then
                      printToColor('\n'..data.command, hostPlayer.color, console.command_color)
                  end
                  if response then
                      printToColor(response, hostPlayer.color, console.output_color)
                  end
              end
              if console.in_command_mode[hostPlayer.steam_id] then console.display_prompt(hostPlayer) end
              return false
          else
              printToColor('\n'..data.command, hostPlayer.color, console.command_color)
              printToColor(console.error_bb .. "<command '" .. command .. "' not found>[-]", hostPlayer.color, console.output_color)
              return false
          end
      end
    end
  end
end
