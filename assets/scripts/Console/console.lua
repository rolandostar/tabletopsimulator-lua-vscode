if not console then
    console = {}

    -- Change these values as you wish
    console.command_char = '>'
    console.option       = '-'
    console.prompt_color  = {r = 0.8,  g = 1.0,  b = 0.8 }
    console.command_color = {r = 0.8,  g = 0.6,  b = 0.8 }
    console.output_color  = {r = 0.88, g = 0.88, b = 0.88}
    console.invalid_color = {r = 1.0,  g = 0.2,  b = 0.2 }
    console.header_bb       = '[EECCAA]'
    console.error_bb        = '[FF9999]'
    console.inbuilt_help_bb = '[E0E0E0]'
    console.client_help_bb  = '[C0C0FF]'

    -- Exposed methods:

    function console.add_validation_function(validation_function)
        -- Adds a validation function all chat will be checked against:
        -- function(string message) which returns (boolean valid, string response)
        -- If all validation functions return <valid> as true the message will be displayed.
        -- If one returns <valid> as false then its <response> will be displayed to that player instead.
        table.insert(console.validation_functions, validation_function)
    end

    function console.add_player_command(command, parameter_text, help_text, command_function, default_parameters)
        -- Adds a command anyone can use, see below for details
        console.add_command(command, false, parameter_text, help_text, command_function, default_parameters)
    end

    function console.add_admin_command(command, parameter_text, help_text, command_function, default_parameters)
        -- Adds a command only admins can use, see below for details
        console.add_command(command, true, parameter_text, help_text, command_function, default_parameters)
    end

    function console.add_command(command, requires_admin, parameter_text, help_text, command_function, default_parameters)
        -- Adds a command to the console.
        -- command_function must take <player> as its first argument, and then any
        --   subsequent arguments you wish which will be provided by the player.
        -- You may alias an already-present command by calling this with command_function set to
        --   the command string instead of a function.  default_parameters can be set for the alias.
        -- See basic built-in commands at the bottom of this file for examples.
        local commands = console.commands
        local command_function = command_function
        local help_text = help_text
        local parameter_text = parameter_text
        if type(command_function) == 'string' then --alias
            if help_text == nil then
                help_text = commands[command_function].help_text
            end
            if parameter_text == nil then
                parameter_text = commands[command_function].parameter_text
            end
            command_function = commands[command_function].command_function
        end
        console.commands[command] = {
            command_function   = command_function,
            requires_admin     = requires_admin,
            parameter_text     = parameter_text,
            help_text          = help_text,
            help_bb            = console.command_help_bb,
            default_parameters = default_parameters,
        }
    end

    function console.set_command_listing_bb(bb)
        -- Tags commands added after with a bb color for when they are displayed (i.e. with 'help')
        console.command_help_bb = bb
    end

    function console.disable()
        -- Disables console for command purposes, but leaves validation functions running
        console.active = false
    end

    function console.enable()
        -- Enables console commands (console commands are on by default)
        console.active = true
    end

    -- End of exposed methods.  You shouldn't need to interact with anything below (under normal circumstances)


    console.active = true
    console.in_command_mode = {}
    console.commands = {}
    console.validation_functions = {}
    console.set_command_listing_bb(console.inbuilt_help_bb)

    function onChat(message, player)
        if message ~= '' then
            local command = ''
            local command_function = nil
            local parameters = {player}
            local requires_admin = false
            local command_mode = console.in_command_mode[player.steam_id]
            if command_mode and console.active then
                command, command_function, parameters, requires_admin = console.get_command(message, player)
            elseif message:sub(1, 1) == console.command_char and console.active then
                if message:len() > 1 then
                    command, command_function, parameters, requires_admin = console.get_command(message:sub(2), player)
                else
                    command, command_function, parameters, requires_admin = console.get_command(console.command_char, player)
                end
            else
                for i, f in ipairs(console.validation_functions) do
                    local valid, response = f(message)
                    if response == nil then response = '' end
                    if not valid then
                        printToColor(response, player.color, console.invalid_color)
                        return false
                    end
                end
                return true
            end
            if console.active then
                if command_function and (player.admin or not requires_admin) then
                    if command_mode then
                        message = console.command_char .. console.command_char .. message
                    end
                    local response, mute = command_function(unpack(parameters))
                    if response ~= nil or mute ~= nil then
                        if not mute then
                            printToColor('\n'..message, player.color, console.command_color)
                        end
                        if response then
                            printToColor(response, player.color, console.output_color)
                        end
                    end
                    if console.in_command_mode[player.steam_id] then console.display_prompt(player) end
                    return false
                else
                    printToColor('\n'..message, player.color, console.command_color)
                    printToColor(console.error_bb .. "<command '" .. command .. "' not found>[-]", player.color, console.output_color)
                    return false
                end
            end
        end
    end

    function console.get_command(message, player)
        local command_name = ''
        local command_function = nil
        local requires_admin = false
        local parameters = {player}
        for i, part in ipairs(console.split(message)) do
            if i == 1 then
                command_name = part
                local command = console.commands[command_name]
                if command then
                    command_function = command.command_function
                    requires_admin = command.requires_admin
                    if command.default_parameters then
                        for _, parameter in ipairs(command.default_parameters) do
                            table.insert(parameters, parameter)
                        end
                    end
                end
            else
                table.insert(parameters, part)
            end
        end
        return command_name, command_function, parameters, requires_admin
    end

    function console.display_prompt(player)
        printToColor(console.command_char..console.command_char, player.color, console.prompt_color)
    end

    function console.split(text, split_on)
        local split_on = split_on or ' '
        if type(split_on) == 'string' then
            local s = {}
            for c = 1, split_on:len() do
                s[split_on:sub(c,c)] = true
            end
            split_on = s
        end
        local parts = {}
        if text ~= '' then
            local make_table = function(s)
                local entries = console.split(s, ' ,')
                local t = {}
                for _, entry in ipairs(entries) do
                    if type(entry) == 'string' and entry:find('=') then
                        e = console.split(entry, '=')
                        t[e[1]] = e[2]
                    else
                        table.insert(t, entry)
                    end
                end
                return t
            end
            local current_split_on = split_on
            local adding = false
            local part = ""
            local totype = tonumber
            for c = 1, text:len() do
                local char = text:sub(c, c)
                if adding then
                    if current_split_on[char] then -- ended current part
                        if totype(part) ~= nil then
                            table.insert(parts, totype(part))
                        else
                            table.insert(parts, part)
                        end
                        adding = false
                        current_split_on = split_on
                        totype = tonumber
                    else
                        part = part .. char
                    end
                else
                    if not current_split_on[char] then -- found start of part
                        if char == "'" then
                            current_split_on = {["'"] = true}
                            totype = tostring
                            part = ''
                        elseif char == '"' then
                            current_split_on = {['"'] = true}
                            totype = tostring
                            part = ''
                        elseif char == '{' then
                            current_split_on = {['}'] = true}
                            totype = make_table
                            part = ''
                        else
                            part = char
                        end
                        adding = true
                    end
                end
            end
            if adding then
                if totype(part) ~= nil then
                    table.insert(parts, totype(part))
                else
                    table.insert(parts, part)
                end
            end
        end
        return parts
    end


    -- Add basic built-in console commands

    console.add_player_command('help', '[' .. console.option .. 'all|<command>]',
        'Display available commands or help on all commands or help on a specific command.',
        function (player, command)
            if command ~= nil then
                command = tostring(command)
            end
            local make_help = function (command)
                return console.header_bb .. command .. ' ' .. console.commands[command].parameter_text ..
                        '[-]\n' .. console.commands[command].help_text
            end
            local info_mode = false
            if command == console.option..'all' then
                info_mode = true
            end
            if command and console.commands[command] then
                return make_help(command)
            elseif command and not info_mode then
                return console.error_bb .. "<command '" .. command .. "' not found>[-]"
            else
                local msg = console.header_bb .. 'Available commands:[-]'
                local command_list = {}
                for c, _ in pairs(console.commands) do
                    if player.admin or not console.commands[c].requires_admin then
                        if info_mode then
                            table.insert(command_list, make_help(c))
                        else
                            table.insert(command_list, c)
                        end
                    end
                end
                table.sort(command_list)
                local sep
                if info_mode then
                    sep = '\n\n'
                else
                    sep = '\n'
                end
                for _, c in ipairs(command_list) do
                    local cmd = console.commands[c]
                    if cmd then
                        msg = msg .. sep .. cmd.help_bb .. c .. '[-]'
                    else
                        msg = msg .. sep .. c
                    end
                    if not info_mode then sep = ', ' end
                end
                return msg
            end
        end
    )
    console.add_player_command('?', nil, nil, 'help')
    console.add_player_command('info', '', 'Display help on all available commands.', 'help', {console.option..'all'})

    console.add_player_command('exit', '',
        "Leave <command mode> ('" .. console.command_char .. "' does the same).",
        function (player)
            console.in_command_mode[player.steam_id] = nil
            return console.header_bb .. '<command mode: off>[-]'
        end
    )

    console.add_player_command('cmd', '',
        "Enter <command mode> ('" .. console.command_char .. "' does the same).",
        function (player)
            console.in_command_mode[player.steam_id] = true
            return console.header_bb .. '<command mode: on>[-]'
        end
    )

    console.add_player_command(console.command_char, '',
        'Toggle <command mode>',
        function (player)
            console.in_command_mode[player.steam_id] = not console.in_command_mode[player.steam_id]
            if console.in_command_mode[player.steam_id] then
                return console.header_bb .. '<command mode: on>[-]', true
            else
                return console.header_bb .. '<command mode: off>[-]', true
            end
        end
    )

    console.add_player_command('=', '<expression>',
        'Evaluate an expression',
        function (player, ...)
            local expression = ''
            for _, arg in ipairs({...}) do
                expression = expression .. ' ' .. tostring(arg)
            end
            if not player.admin then
                expression = expression:gasub('[a-zA-Z~]', '')
            end
            console.returned_value = dynamic.eval(expression)
            return console.returned_value
        end
    )

    console.add_player_command('echo', '<text>',
        'Display text on screen',
        function (player, ...)
            local text = ''
            for _, arg in ipairs({...}) do
                text = text .. ' ' .. tostring(arg)
            end
            printToColor(text, player.color, console.output_color)
            return false
        end
    )

    console.add_player_command('cls', '',
        'Clear console text',
        function (player)
            return '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' ..
                   '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'
        end
    )

    console.add_player_command('alias', '<alias> <command> [<parameter>...]',
        'Create a command alias.',
        function (player, ...)
            local alias
            local command
            local parameters = {}
            for i, arg in ipairs({...}) do
                if i == 1 then
                    alias = tostring(arg)
                elseif i == 2 then
                    command = tostring(arg)
                else
                    table.insert(parameters, arg)
                end
            end
            if not alias then
                return console.error_bb .. '<must provide an alias>[-]'
            --elseif console.commands[alias] ~= nil then
            --    return console.error_bb .. "<command '" .. alias .. "' already exists!>[-]"
            elseif command == nil then
                return console.error_bb .. "<must provide a command>[-]"
            elseif console.commands[command] == nil then
                return console.error_bb .. "<command '" .. command .. "' does not exist>[-]"
            else
                local text = console.header_bb .. alias .. '[-] = ' .. command
                local help_text = console.commands[command].help_text
                if not help_text:find('\nAliased to: ') then
                    help_text = help_text .. '\nAliased to: ' .. command
                end
                local combined_parameters = {}
                if console.commands[command].default_parameters then
                    for _, parameter in ipairs(console.commands[command].default_parameters) do
                        table.insert(combined_parameters, parameter)
                    end
                end
                for _, parameter in ipairs(parameters) do
                    table.insert(combined_parameters, parameter)
                    text = text .. ' ' .. parameter
                    help_text = help_text .. ' ' .. parameter
                end
                console.add_command(alias, console.commands[command].requires_admin, console.commands[command].parameter_text, help_text, command, combined_parameters)
                return text
            end
        end
    )

    -- change the command help color so client added commands appear different to in-built
    console.set_command_listing_bb(console.client_help_bb)
end
