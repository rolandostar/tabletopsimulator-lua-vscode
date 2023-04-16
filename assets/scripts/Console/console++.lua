require("Console/console")

if not console.plusplus then
    console.plusplus = true

    -- Change these values as you wish
    console.seperator         = '/'
    console.wildcard          = '*'
    console.literal           = '`'  -- string parameters will be treated as paths where apt unless prefixed with this
    console.result            = '~'  -- refers to the most recently returned result from a call
    console.command_seperator = ';'  -- used in batch files to seperate commands
    console.indent            = '  '
    console.crop_string_at = 20
    console.builtin_path = 'sys'
    console.table_bb    = '[EEDD88]'
    console.hidden_bb   = '[DDAAAA]'
    console.function_bb = '[AADDAA]'
    console.value_bb    = '[88EE88]'
    console.boolean_bb  = '[CCCCFF]'
    console.object_bb   = '[CCBBCC]'
    console.guid_bb     = '[BBBBBB]'

    console.autoexec         = ''
    console.autoexec_options = '-s'

    -- Exposed methods:

    function console.hide_globals(label)
        -- all globals present when you call this will be hidden under <label> (unless built-in or already hidden)
        local hidden = {}
        for global, _ in pairs(_G) do
            local found = false
            for _, globals in pairs(console.hidden_globals) do
                if globals[global] then
                    found = true
                    break
                end
            end
            if not found then
                table.insert(hidden, global)
            end
        end
        if console.hidden_globals[label] == nil then
            console.hidden_globals[label] = {}
        end
        for _, global in ipairs(hidden) do
            console.hidden_globals[label][global] = true
        end
    end

    function console.load()
        -- call this function in an onLoad event to enable the autoexec
        console.cd = console.seperator
        for _, player in pairs(getSeatedPlayers()) do
            if Player[player].admin then
                console.commands['exec'].command_function(Player[player], console.seperator..'console'..console.seperator..'autoexec', console.autoexec_options)
                break
            end
        end
    end

    function console.update()
        -- call this function in an onUpdate event to enable the watch list
        if console.watch_list and not console.watch_list_paused then
            for variable, watch in pairs(console.watch_list) do
                if watch.throttle == 0 or watch.last_check + watch.throttle < os.clock() then
                    watch.last_check = os.clock()
                    local node, id, parent, found
                    if watch.is_guid then
                        node = getObjectFromGUID(variable)
                        found = tostring(node) ~= 'null'
                    else
                        node, id, parent, found = console.node_from_path(variable)
                    end
                    if node ~= nil and found then
                        if type(node) == 'userdata' then
                            if tostring(node) ~= 'null' then
                                local p = function (x) return math.floor(x * 100) * 0.01 end
                                local r = function (x) return math.floor(x + 0.5) end
                                local position = node.getPosition()
                                local rotation = node.getRotation()
                                if p(position.x) ~= p(watch.position.x) or r(rotation.x) ~= r(watch.rotation.x) or
                                   p(position.y) ~= p(watch.position.y) or r(rotation.y) ~= r(watch.rotation.y) or
                                   p(position.z) ~= p(watch.position.z) or r(rotation.z) ~= r(watch.rotation.z) then
                                   watch.position = position
                                   watch.rotation = rotation
                                   node = ' ∡ '..r(rotation.x)..' '..r(rotation.y)..' '..r(rotation.z) ..
                                        console.boolean_bb..'   ⊞  '..p(position.x)..'   '..p(position.y)..'   '..p(position.z)
                                   if watch.is_guid then
                                       variable = console.format_guid(variable)
                                   else
                                       variable = console.object_bb .. variable .. '[-]'
                                   end
                                   printToColor(variable .. console.value_bb .. node .. '[-]', watch.player, console.output_color)
                                end
                            end
                        elseif type(node) == 'function' then
                            local result = node(unpack(watch.parameters))
                            if watch.property and (type(result) == 'table' or type(result) == 'userdata') then
                                result = result[watch.property]
                                if type(result) == 'function' then
                                    result = result()
                                end
                            end
                            if result ~= watch.value then
                                watch.value = result
                                result = tostring(result)
                                if result:len() > console.crop_string_at then result = result:sub(1, console.crop_string_at) .. '...' end
                                if result:len() == 6 and watch.label:lower():find('guid') then result = console.format_guid(result) end
                                printToColor(watch.label .. console.value_bb .. result .. '[-]', watch.player, console.output_color)
                            end
                        else
                            if node ~= watch.value then
                                watch.value = node
                                if type(node) == 'boolean' then
                                    if node then
                                        node = 'true'
                                    else
                                        node = 'false'
                                    end
                                elseif type(node) == 'string' then
                                    if node:len() > console.crop_string_at then node = node:sub(1, console.crop_string_at):gsub('\n', ' ') .. '...' end
                                end
                                printToColor(variable .. ': ' .. console.value_bb .. node .. '[-]', watch.player, console.output_color)
                            end
                        end
                    end
                end
            end
        end
    end

    -- simple swear-blocking validation
    console.add_validation_function(
        function (message)
            local message = message:lower()
            for i, bad_word in pairs({'fuck', 'cunt'}) do
                if message:find(bad_word) then
                    return false, "No swearing!"
                end
            end
            return true
        end
    )

    -- End of exposed methods.  You shouldn't need to interact with anything below (under normal circumstances)


    -- override default prompt with one which displays current table
    function console.display_prompt(player)
        printToColor(console.cd .. ' ' .. console.command_char..console.command_char, player.color, console.prompt_color)
    end


    -- console++ follows

    console.cd = console.seperator
    console.hidden_globals = {}
    console.hide_globals(console.builtin_path)

    function console.is_hidden(label)
        for _, globals in pairs(console.hidden_globals) do
            if globals[label] then
                return true
            end
        end
        return false
    end

    function console.escape_bb(s)
        local s = tostring(s)
        if s == '' then
            return ''
        else
            local r = ''
            for c = 1, s:len() do
                local char = s:sub(c, c)
                if char == '[' then
                    r = r .. '[\u{200B}'
                elseif char == ']' then
                    r = r .. '\u{200B}]'
                else
                    r = r .. char
                end
            end
            return r
        end
    end

    function console.format_guid(guid)
        return console.guid_bb .. '⁅' .. guid .. '⁆[-]'
    end

    function console.fill_path(path)
        local path = path
        local filter = nil
        if path == nil then
            return console.cd, filter
        end
        local c = path:len()
        if path:sub(c) ~= console.seperator then
            local found = false
            while c > 0 do
                local char = path:sub(c, c)
                if char == console.wildcard then
                    found = true
                elseif char == console.seperator then
                    break
                end
                c = c - 1
            end
            if found then
                filter = '^'
                for i = c + 1, path:len() do
                    local char = path:sub(i, i)
                    if char == console.wildcard then
                        filter = filter .. '.*'
                    else
                        filter = filter .. char
                    end
                end
                filter = filter .. '$'
                path = path:sub(1, c)
            end
        end
        if path:sub(1,1) == console.seperator then
            return path, filter
        else
            return console.cd .. path, filter
        end
    end

    function console.node_from_path(path)
        local node = _G
        local id = {''}
        local parent = {nil}
        local found = true
        local depth = 0
        local stack = {}
        local hidden = nil
        local ends_with_table = {true}
        if path == 'true' then
            node = true
        elseif path == 'false' then
            node = false
        elseif path ~= console.seperator then
            for i, part in ipairs(console.split(path, console.seperator)) do
                if part == '..' then
                    if depth > 0 then
                        node = table.remove(parent)
                        table.remove(id)
                        table.remove(stack)
                        table.remove(ends_with_table)
                        depth = depth - 1
                    end
                elseif part == '.' then
                    ; -- do nothing, . = where we are
                elseif part == console.result then
                    table.insert(parent, node)
                    table.insert(id, part)
                    table.insert(stack, part)
                    node = console.returned_value
                    table.insert(ends_with_table, type(node) == 'table')
                    depth = depth + 1
                elseif node[part] ~= nil then
                    table.insert(parent, node)
                    table.insert(id, part)
                    table.insert(stack, part)
                    node = node[part]
                    table.insert(ends_with_table, type(node) == 'table')
                    depth = depth + 1
                elseif node == _G and console.hidden_globals[part] then
                    hidden = console.hidden_globals[part]
                else
                    table.insert(id, part)
                    found = false
                    break
                end
            end
        end
        path = ''
        for i, part in ipairs(stack) do
            path = path .. console.seperator .. part
        end
        if table.remove(ends_with_table) then
            path = path .. console.seperator
        end
        return node, table.remove(id), table.remove(parent), found, path, hidden
    end


    -- commands

    console.add_admin_command('cd', '[<table>]',
        'Display current table or change current table',
        function (player, path)
            if path == nil then
                return console.cd
            else
                path = tostring(path)
            end
            local location = console.fill_path(path)
            local node, id, parent, found, location = console.node_from_path(location)
            local text = nil
            if node ~= nil and found and type(node) == 'table' then
                console.cd = location
                if not console.in_command_mode[player.steam_id] then text = console.cd end
            else
                text = console.error_bb .. '<not found>[-]'
            end
            return text, false
        end
    )
    console.add_admin_command('cd..', '', 'Change current table to parent table.', 'cd', {'..'})

    console.add_admin_command('ls', '[' .. console.option .. '?afotv] [' .. console.option .. 'r[#]] [<table>]',
        'Display variables in current table or specified table',
        function (player, ...)
            local help_details = console.header_bb .. 'Options[-]\n' ..
                'Show:\n '..console.option..'f functions\n '..console.option..'o objects\n '..
                console.option..'v variables (defaults to on)\n '..console.option..'t tables (defaults to on)\n '..
                console.option..'a all\n\n' ..console.option..'r[#] recurse [# layers if specified]'
            local path = console.cd
            local display_functions = false
            local display_objects = false
            local display_variables = false
            local display_tables = false
            local display_all = false
            local recursions_left = 0
            for i, arg in ipairs({...}) do
                arg = tostring(arg)
                if arg:len() > 1 and arg:sub(1,1) == console.option then
                    local c = 2
                    while c <= arg:len() do
                        local option = arg:sub(c,c)
                        if option == 'f' then
                            display_functions = not display_functions
                        elseif option == 'o' then
                            display_objects = not display_objects
                        elseif option == 'v' then
                            display_variables = not display_variables
                        elseif option == 't' then
                            display_tables = not display_tables
                        elseif option == 'a' then
                            display_all = not display_all
                        elseif option == 'r' then
                            local n = ''
                            local j = c + 1
                            while j <= arg:len() do
                                local char = arg:sub(j, j)
                                if char:match('%d') then
                                    n = n .. char
                                else
                                    break
                                end
                                j = j + 1
                            end
                            c = j - 1
                            if n == '' then
                                recursions_left = 20
                            else
                                recursions_left = tonumber(n)
                            end
                        elseif option == '?' or option == 'h' then
                            return help_details
                        else
                            return console.error_bb .. "<option '" .. console.option .. option .. "' not recognized>[-]\n"
                        end
                        c = c + 1
                    end
                else
                    path = arg
                end
            end
            local default_variables = not (display_tables or display_objects or display_functions or display_variables)
            if display_functions or display_objects or display_variables then
                display_tables = not display_tables
            end
            if display_all then
                display_functions = true
                display_objects = true
                display_variables = true
                display_tables = true
            elseif default_variables then
                display_functions = false
                display_objects = false
                display_variables = true
                display_tables = true
            end
            local location, filter = console.fill_path(path)
            return console.ls(player, location, filter, display_functions, display_objects, display_variables, display_tables, recursions_left)
        end
    )
    console.add_admin_command('dir', nil, nil, 'ls')
    console.add_admin_command(console.result, '', "Calls 'ls "..console.option.."a "..console.result.."'", 'ls', {console.option..'a', console.result})

    function console.ls(player, path, filter, display_functions, display_objects, display_variables, display_tables, recursions_left, indent)
        local text = ''
        local indent = indent or ''
        local node, id, parent, found, location, hidden = console.node_from_path(path)
        local paths = {}
        if node ~= nil and (found or hidden) then
            if type(node) == 'table' then
                local tables = {}
                local entries = {}
                for k, v in pairs(node) do
                    if (node ~= _G or (not hidden and not console.is_hidden(k)) or (hidden and hidden[k])) and (filter == nil or k:match(filter)) then
                        if type(v) == 'table' then
                            local t = console.table_bb .. k .. '[-]'
                            table.insert(tables, t)
                            paths[t] = path .. console.seperator .. k
                        else
                            if type(v) == 'function' then
                                if display_functions then
                                    table.insert(entries, console.function_bb .. k .. '[-]()')
                                end
                            elseif type(v) == 'userdata' then
                                if display_objects then
                                    local tag = tostring(v)
                                    if tag:find('(LuaGameObjectScript)') and not tag:gsub('(LuaGameObjectScript)',''):find('Script ') then
                                        tag = v.tag .. ' ' .. console.format_guid(v.getGUID())
                                    end
                                    if type(k) == 'number' and math.floor(k) == k then k = string.format('%04d', k) end
                                    table.insert(entries, console.object_bb .. k .. '[-]: '  .. tag)
                                end
                            elseif display_variables then
                                if type(v) == 'boolean' then
                                    if v then
                                        v = 'true'
                                    else
                                        v = 'false'
                                    end
                                    table.insert(entries, k .. ': ' .. console.boolean_bb .. v .. '[-]')
                                else
                                    local is_guid = false
                                    if type(v) == 'string' then
                                        if v:len()> console.crop_string_at then v = v:sub(1, console.crop_string_at):gsub('\n', ' ') .. '...' end
                                        if type(k) == 'string' and k:lower():find('guid') and v:len() == 6 then
                                            is_guid = true
                                        end
                                    end
                                    if is_guid then
                                        table.insert(entries, k .. ': ' .. console.format_guid(v) .. '[-]')
                                    else
                                        table.insert(entries, k .. ': ' .. console.value_bb .. console.escape_bb(v) .. '[-]')
                                    end
                                end
                            end
                        end
                    end
                end
                local cmp = function (a, b)
                    if not a then
                        return true
                    elseif not b then
                        return false
                    else
                        local la = a:len()
                        local lb = b:len()
                        local c = 1
                        repeat
                            if c > la and c <= lb then
                                return true
                            elseif c > lb and c <= la then
                                return false
                            elseif c > la then
                                return false
                            else
                                local ba = a:sub(c, c):byte()
                                local bb = b:sub(c, c):byte()
                                if ba < bb then
                                    return true
                                elseif bb < ba then
                                    return false
                                end
                            end
                            c = c + 1
                        until false
                    end
                end
                table.sort(tables, cmp)
                table.sort(entries, cmp)
                local cr = ''
                if display_tables then
                    for i, t in ipairs(tables) do
                        text = text .. cr .. indent .. t .. console.seperator
                        if recursions_left ~= 0 then
                            text = text .. '\n' .. console.ls(player, paths[t], filter,
                                display_functions, display_objects, display_variables, display_tables,
                                recursions_left-1, indent..console.indent)
                        end
                        cr = '\n'
                    end
                    if node == _G and not hidden then
                        for label, _ in pairs(console.hidden_globals) do
                            if (filter == nil or label:match(filter)) then -- and label ~= console.builtin_path
                                text = text .. cr .. indent .. console.hidden_bb .. label .. console.seperator .. '[-]'
                                cr = '\n'
                            end
                        end
                    end
                end
                for _, entry in ipairs(entries) do
                    text = text .. cr .. indent .. entry
                    cr = '\n'
                end
            elseif type(node) == 'userdata' then
                local tag = tostring(node)
                if tag ~= 'null' and tag:find('(LuaGameObjectScript)') and not tag:gsub('(LuaGameObjectScript)',''):find('Script ') then
                    tag = node.tag .. ' ' .. console.format_guid(node.getGUID())
                end
                text = indent .. console.object_bb .. id .. '[-]: ' .. tag
            elseif type(node) == 'function' then
                text = indent .. console.function_bb .. id .. '[-]()'
            elseif type(node) == 'boolean' then
                if node then
                    text = indent .. id .. ': ' .. console.boolean_bb .. 'true[-]'
                else
                    text = indent .. id .. ': ' .. console.boolean_bb .. 'false[-]'
                end
            else
                if type(id) == 'string' and id:lower():find('guid') and type(node) == 'string' and node:len() == 6 then
                    text = indent .. id .. ': ' .. console.format_guid(node) .. '[-]'
                else
                    text = indent .. id .. ': ' .. console.value_bb .. console.escape_bb(node) .. '[-]'
                end
            end
        else
            text = indent .. console.error_bb .. '<not found>[-]'
        end
        return text
    end

    console.add_admin_command('call', '<function> [<parameter>...]',
        'Call function with parameters and display result.',
        function (player, ...)
            local path = nil
            local parameters = {}
            for i, arg in ipairs({...}) do
                if i == 1 then
                    path = tostring(arg)
                else
                    if type(arg) == 'string' then
                        if arg:len() > 2 and arg:sub(1,1) == console.literal then
                            arg = arg:sub(2)
                        else
                            local node, id, parent, found = console.node_from_path(console.fill_path(arg))
                            if node ~= nil and found then
                                arg = node
                            end
                        end
                    end
                    table.insert(parameters, arg)
                end
            end
            if path == nil then
                return console.error_bb .. '<you must supply a function>[-]'
            end
            local location = console.fill_path(path)
            local node, id, parent, found, location = console.node_from_path(location)
            local text = nil
            if node ~= nil and found and type(node) == 'function' then
                console.returned_value = node(unpack(parameters))
                text = tostring(console.returned_value)
                if console.deferred_assignment then
                    local da = console.deferred_assignment
                    if da.command == 'set' then
                        if da.parent[da.id] ~= nil then
                            if da.force or type(console.returned_value) == type(da.parent[da.id]) then
                                da.parent[da.id] = console.returned_value
                                text = text .. '\n' .. console.header_bb .. "<set '" .. da.id .. "'>[-]"
                            else
                                text = text .. '\n' .. console.error_bb .. "<cannot set '" .. da.id .. "': it is of type '" .. type(da.parent[da.id]) .. "'>[-]"
                            end
                        else
                            text = text .. '\n' .. console.error_bb .. "<cannot set '" .. da.id .. "': it does not exist>[-]"
                        end
                    elseif da.command == 'add' then
                        if da.parent[da.id] == nil then
                            da.parent[da.id] = console.returned_value
                            text = text .. '\n' .. console.header_bb .. "<added '" .. da.id .. "'>[-]"
                        else
                            text = text .. '\n' .. "<cannot add '" .. da.id .. "': it already exists>[-]"
                        end
                    end
                    console.deferred_assignment = nil
                end
            else
                text = console.error_bb .. '<not found>[-]'
            end
            return text, false
        end
    )

    console.add_admin_command('set', '['..console.option..'f] <variable> [<value>]',
        "Set variable to value.  If no value specified then the next value returned from 'call' is used.\n" ..
            console.option ..'f  force overwrite ignoring type',
        function (player, ...)
            local variable = nil
            local value = nil
            local force = false
            for _, arg in ipairs({...}) do
                if type(arg) == 'string' and arg:len() > 1 and arg:sub(1, 1) == console.option then
                    local c = 2
                    while c <= arg:len() do
                        local option = arg:sub(c, c)
                        if option == "f" then
                            force = not force
                        else
                            return console.error_bb .. "<option '" .. option .. "' not recognized>[-]"
                        end
                        c = c + 1
                    end
                elseif variable == nil then
                    variable = tostring(arg)
                else
                    value = arg
                end
            end
            if variable == nil then
                return console.error_bb .. '<you must supply a variable>[-]'
            end
            variable = console.fill_path(variable)
            local node, id, parent, found = console.node_from_path(variable)
            local text = ''
            if node ~= nil and found then
                if value == nil then
                    console.deferred_assignment = {command = 'set', parent = parent, id = id, force = force}
                    text = id .. ': ' .. console.header_bb .. "<awaiting 'call'>[-]"
                else
                    console.deferred_assignment = nil
                    if type(value) == 'string' and value:len() > 0  then
                        if value:sub(1, 1) == console.literal then
                            value = value:sub(2)
                        else
                            local value_node, value_id, value_parent, value_found = console.node_from_path(value)
                            if value_node ~= nil and value_found then
                                value = value_node
                            else
                                return console.error_bb .. '<not found>[-]'
                            end
                        end
                    end
                    if type(node) == 'boolean' then
                        if not value or tostring(value):lower() == 'false' then
                            value = false
                        else
                            value = true
                        end
                    end
                    if type(node) == type(value) or force then
                        parent[id] = value
                        text = id .. ': ' .. console.value_bb .. tostring(parent[id]) .. '[-]'
                    else
                        return console.error_bb .. "<cannot set '" .. id .. "': it is of type '" .. type(node) .. "'>[-]"
                    end
                end
            else
                text = console.error_bb .. '<not found>[-]'
            end
            return text
        end
    )

    console.add_admin_command('toggle', '<boolean>',
        'Toggle specified boolean variable',
        function (player, variable)
            if variable == nil then
                return console.error_bb .. '<you must supply variable>'
            else
                variable = tostring(variable)
            end
            local variable = console.fill_path(variable)
            local node, id, parent, found = console.node_from_path(variable)
            local text = ''
            if node ~= nil and found then
                if type(node) == 'boolean' then
                    if node then
                        parent[id] = false
                        text = id .. ': ' .. console.value_bb .. 'false[-]'
                    else
                        parent[id] = true
                        text = id .. ': ' .. console.value_bb .. 'true[-]'
                    end
                else
                    text = console.error_bb .. '<can only toggle a boolean>[-]'
                end
            else
                text = console.error_bb .. '<not found>[-]'
            end
            return text
        end
    )
    console.add_admin_command('tgl', nil, nil, 'toggle')

    console.add_admin_command('rm', '<variable>',
        'Remove specified variable',
        function (player, variable)
            if variable == nil then
                return console.error_bb .. '<you must supply variable>'
            else
                variable = tostring(variable)
            end
            local variable = console.fill_path(variable)
            local node, id, parent, found = console.node_from_path(variable)
            local text = ''
            if node ~= nil and found then
                parent[id] = nil
                text = id .. " removed!"
            else
                text = console.error_bb .. '<not found>[-]'
            end
            return text
        end
    )
    console.add_admin_command('del', nil, nil, 'rm')

    console.add_admin_command('add', '<variable> [<value>]',
        "Create a variable set to value.   If no value specified then the next value returned from 'call' is used.",
        function (player, variable, value)
            if variable == nil then
                return console.error_bb .. '<you must supply variable>[-]'
            else
                variable = tostring(variable)
            end
            local variable = console.fill_path(variable)
            local node, id, parent, found = console.node_from_path(variable)
            local text = ''
            if found then
                return console.error_bb .. '<already exists>[-]'
            elseif node == nil or id == '' then
                return console.error_bb .. '<not found>[-]'
            else
                if value == nil then
                    console.deferred_assignment = {command = 'add', parent = node, id = id}
                    text = id .. ': ' .. console.header_bb .. "<awaiting 'call'>[-]"
                else
                    console.deferred_assignment = nil
                    if type(value) == 'string' and value:len() > 0  then
                        if value:sub(1, 1) == console.literal then
                            value = value:sub(2)
                        else
                            local value_node, value_id, value_parent, value_found = console.node_from_path(value)
                            if value_node ~= nil and value_found then
                                value = value_node
                            else
                                return console.error_bb .. '<not found>[-]'
                            end
                        end
                    end
                    node[id] = value
                    text = id .. ': ' .. console.value_bb .. tostring(value) .. '[-]'
                end
            end
            return text
        end
    )

    console.add_admin_command('exec', '['..console.option..'?qsv] <commands>',
        'Execute a series of commands held in a string: commands are seperated by a new line or '..console.command_seperator,
        function (player, ...)
            local help_details = console.option..'q    quiet: will not output anything except final output\n' ..
                                 console.option..'s    silent: will not output anything at all\n'..
                                 console.option..'v    verbose: will output commands as they execute\n'
            local commands = nil
            local verbose = false
            local quiet = false
            local silent = false
            for _, arg in ipairs({...}) do
                if type(arg) == 'string' and arg:len() > 1 and arg:sub(1,1) == console.option then
                    local c = 2
                    while c <= arg:len() do
                        local option = arg:sub(c,c)
                        if option == '?' then
                            return help_details
                        elseif option == 'q' then
                            quiet = not quiet
                        elseif option == 's' then
                            silent = not silent
                        elseif option == 'v' then
                            verbose = not verbose
                        else
                            return console.error_bb .. "<option '" .. option .. "' not recognized>"
                        end
                        c = c + 1
                    end
                elseif commands == nil then
                    commands = tostring(arg)
                end
            end
            if silent then quiet = true end
            if commands:len() > 1 and commands:sub(1, 1) == console.literal then
                commands = commands:sub(2)
            else
                local variable = console.fill_path(commands)
                local node, id, parent, found = console.node_from_path(variable)
                if node ~= nil and found then
                    commands = node
                else
                    return console.error_bb .. '<not found>[-]'
                end
            end
            if commands:find('\n') then
                commands = console.split(commands, '\n')
            else
                commands = console.split(commands, console.command_seperator)
            end
            local end_result = nil
            for _, command_text in ipairs(commands) do
                local command = ''
                local command_function = nil
                local parameters = {player}
                local requires_admin = false
                command, command_function, parameters, requires_admin = console.get_command(command_text, player)
                if command ~= '' then
                    if command_function and (player.admin or not requires_admin) then
                        local response, mute = command_function(unpack(parameters))
                        if response ~= nil or mute ~= nil then
                            if not mute and verbose and not quiet then
                                printToColor('\n'..command_text, player.color, console.command_color)
                            end
                            if response then
                                end_result = response
                                if not quiet then
                                    printToColor(response, player.color, console.output_color)
                                end
                            end
                        end
                    elseif not quiet then
                        if verbose then printToColor('\n'..command_text, player.color, console.command_color) end
                        printToColor(console.error_bb .. "<command '" .. command .. "' not found>[-]", player.color, console.output_color)
                    end
                end
            end
            if end_result and not silent then
                printToColor(end_result, player.color, console.output_color)
            end
        end
    )

    console.add_admin_command('watch', '['..console.option..'?cgp] ['..console.option..'t#] ['..console.option..console.seperator..'<property>] [<variable>]',
        'Watch a variable or object and display it whenever it changes.\n' .. console.hidden_bb ..
        'Requires you to add a '..console.function_bb..'console.update()[-] call to an ' ..
        console.function_bb .. 'onUpdate[-] event in your code.[-]\n',
        function (player, ...)
            local help_details = 'Call without a parameter to display watched items, or with a variable to add it to watch list.\n' ..
                                console.option..'c will clear variable if specified, or all.\n' ..
                                console.option..'g will let you specify an object by its GUID.\n' ..
                                console.option..'t# will throttle output to # seconds.\n' ..
                                console.option..console.seperator..'<property> will watch the property of the variable.\n' ..
                                console.option..'p will pause or unpause watching.\n'
            local path = nil
            local clearing = false
            local throttle = nil
            local pause_changed = false
            local by_guid = false
            local parameters = {}
            local labels = {}
            local property = nil
            for _, arg in ipairs({...}) do
                if type(arg) == 'string' and arg:len() > 1 and arg:sub(1,1) == console.option then
                    local c = 2
                    while c <= arg:len() do
                        local option = arg:sub(c,c)
                        if option == '?' then
                            return help_details
                        elseif option == 'c' then
                            clearing = not clearing
                        elseif option == 'p' then
                            pause_changed = not pause_changed
                        elseif option == 'g' then
                            by_guid = not by_guid
                        elseif option == console.seperator then
                            if arg:len() > c then
                                property = arg:sub(c + 1)
                                c = arg:len() + 1
                            end
                        elseif option == 't' then
                            local n = ''
                            local j = c + 1
                            while j <= arg:len() do
                                local char = arg:sub(j, j)
                                if char:match('[0-9.]') then
                                    n = n .. char
                                else
                                    break
                                end
                                j = j + 1
                            end
                            c = j - 1
                            if n == '' then
                                return console.error_bb .. '<you must provide a throttle duration (in seconds)>[-]'
                            else
                                throttle = tonumber(n)
                            end
                        else
                            return console.error_bb .. "<option '" .. option .. "' not recognized>"
                        end
                        c = c + 1
                    end
                else
                    if path == nil then
                        path = tostring(arg)
                    else
                        local label = tostring(arg)
                        if type(arg) == 'string' then
                            if arg:len() > 2 and arg:sub(1,1) == console.literal then
                                arg = arg:sub(2)
                                label = arg
                            else
                                local node, id, parent, found = console.node_from_path(console.fill_path(arg))
                                if node ~= nil and found then
                                    arg = node
                                end
                            end
                        end
                        table.insert(labels, label)
                        table.insert(parameters, arg)
                    end
                end
            end
            local text = ''
            if pause_changed then
                if console.watch_list_paused then
                    console.watch_list_paused = nil
                    text = text .. console.header_bb .. '<unpaused>[-]'
                else
                    console.watch_list_paused = true
                    text = text .. console.header_bb .. '<paused>[-]'
                end
            end
            if path == nil then
                if throttle ~= nil then
                    text = text .. '\n' .. console.error_bb .. '<you must provide a variable or object>[-]'
                elseif by_guid then
                    text = text .. '\n' .. console.error_bb .. '<you must provide a GUID>[-]'
                elseif clearing then
                    console.watch_list = nil
                    console.watch_list_paused = nil
                    text = text .. '\nWatch list cleared!'
                elseif not pause_changed then
                    if console.watch_list then
                        local watched = {}
                        for label, watch in pairs(console.watch_list) do
                            if watch.player == player.color then
                                table.insert(watched, label)
                            end
                        end
                        table.sort(watched)
                        text = text .. '\n'..console.header_bb..'Watching:[-]'
                        for _, label in ipairs(watched) do
                            local watch = console.watch_list[label]
                            local is_guid = (label:len() == 6 and label:sub(1,1) ~= console.seperator)
                            local node, id, parent, found
                            local prefix
                            text = text .. '\n'
                            if is_guid then
                                prefix =  console.format_guid(label)
                                node = getObjectFromGUID(label)
                                found = tostring(node) ~= 'null'
                            else
                                prefix = label
                                node, id, parent, found = console.node_from_path(label)
                            end
                            if node ~= nil and found then
                                if type(node) == 'userdata' then
                                    prefix = console.object_bb .. prefix .. '[-]'
                                    local position = node.getPosition()
                                    local rotation = node.getRotation()
                                    local p = function (x) return math.floor(x * 100) * 0.01 end
                                    local r = function (x) return math.floor(x + 0.5) end
                                    text = text .. prefix .. console.value_bb .. ' ∡ '..r(rotation.x)..' '..r(rotation.y)..' '..r(rotation.z) .. '[-]'..
                                            console.boolean_bb..'   ⊞  '..p(position.x)..'   '..p(position.y)..'   '..p(position.z)
                                elseif type(node) == 'function' then
                                    local result = node(unpack(console.watch_list[label].parameters))
                                    if watch.property and (type(result) == 'table' or type(result) == 'userdata') then
                                        result = result[watch.property]
                                        if type(result) == 'function' then
                                            result = result()
                                        end
                                    end
                                    result = tostring(result)
                                    if watch.propery and watch.property:lower():find('guid') then
                                        result = console.format_guid(result)
                                    end
                                    if result:len() > console.crop_string_at then result = result:sub(1, console.crop_string_at) .. '...' end
                                    text = text .. watch.label .. console.value_bb .. result .. '[-]'
                                else
                                    if type(node) == 'boolean' then
                                        if node then
                                            node = 'true'
                                        else
                                            node = 'false'
                                        end
                                    elseif type(node) == 'string' then
                                        if node:len() > console.crop_string_at then node = node:sub(1, console.crop_string_at):gsub('\n', ' ') .. '...' end
                                    end
                                    text = text .. prefix .. ': ' .. console.value_bb .. node .. '[-]'
                                end
                            end
                        end
                    else
                        text = text .. "\nWatch list is empty."
                    end
                end
            else
                if not by_guid then
                    path = console.fill_path(path)
                end
                if clearing then
                    local node, id, parent, found
                    if not by_guid then
                        node, id, parent, found, path = console.node_from_path(path)
                    end
                    if console.watch_list[path] then
                        console.watch_list[path] = nil
                        if next(console.watch_list) == nil then
                            console.watch_list = nil
                        end
                        text = text .. '\n' .. console.header_bb.. 'No longer watching:[-] ' .. path
                    else
                        text = text .. '\n' .. console.error_bb .. '<not found>[-]'
                    end
                else
                    local node, id, parent, found
                    if by_guid then
                        node = getObjectFromGUID(path)
                        found = tostring(node) ~= 'null'
                    else
                        node, id, parent, found, path = console.node_from_path(path)
                    end
                    if node ~= nil and found then
                        if console.watch_list == nil then console.watch_list = {} end
                        if throttle == nil then throttle = 0 end
                        console.watch_list[path] = {player=player.color, throttle=throttle, last_check=0, property=property}
                        if type(node) == 'userdata' then
                            console.watch_list[path].position = node.getPosition()
                            console.watch_list[path].rotation = node.getRotation()
                            console.watch_list[path].is_guid  = by_guid
                        elseif type(node) == 'function' then
                            console.watch_list[path].parameters = parameters
                            console.watch_list[path].value = node
                            console.watch_list[path].label = console.function_bb .. path .. '[-]'
                            if property then
                                console.watch_list[path].label = console.watch_list[path].label .. console.seperator .. property
                            end
                            for _, label in ipairs(labels) do
                                console.watch_list[path].label = console.watch_list[path].label .. ' ' .. console.hidden_bb .. label .. '[-]'
                            end
                            console.watch_list[path].label = console.watch_list[path].label .. ': '
                        else
                            console.watch_list[path].value = node
                        end
                        if by_guid then
                            path = console.format_guid(path)
                        end
                        text = text .. '\n' .. console.header_bb .. 'Watching:[-] ' .. path
                    else
                        text = text .. '\n' .. console.error_bb .. '<not found>[-]'
                    end
                end
            end
            if text:len() > 1 and text:sub(1, 1) == '\n' then
                text = text:sub(2)
            end
            return text
        end
    )

    console.add_player_command('shout', '<text>',
        'Broadcast <text> to all players. Colour a section with {RRGGBB}section{-}.',
        function (player, ...)
            local text = player.steam_name .. ': '
            local space = ''
            for _, word in ipairs({...}) do
                text = text .. space .. tostring(word)
                space = ' '
            end
            text = text:gsub('{','[')
            text = text:gsub('}',']')
            broadcastToAll(text, stringColorToRGB(player.color))
            return nil, false
        end
    )

    -- change the command help color so client added commands appear different to console++
    console.set_command_listing_bb('[A0F0C0]')
end
