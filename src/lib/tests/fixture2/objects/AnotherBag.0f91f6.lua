self.alt_view_angle={90,-90,0}

self.alt_view_angle={90,-90,0}


function addOneState()
    local currentState = self.getStateId()
    local newState = currentState + 1
    self.setState(newState)
end

function addTenStates()
    local currentState = self.getStateId()
    local newState = currentState + 10
    self.setState(newState)
end

function subtractOneState()
    local currentState = self.getStateId()
    local newState = currentState - 1
    self.setState(newState)
end

function subtractTenStates()
    local currentState = self.getStateId()
    local newState = currentState - 10
    self.setState(newState)
end

function showButtons(playerColor, value)
    if playerColor ~= nil and value == 1 then
        self.editButton({index=0, label="+1 State", click_function="addOneState"})
        self.editButton({index=1, label="+10 States", click_function="addTenStates"})
        self.editButton({index=2, label="-1 State", click_function="subtractOneState"})
        self.editButton({index=3, label="-10 States", click_function="subtractTenStates"})
    end
end

function hideButtons(playerColor, value)
    if playerColor ~= nil and value == 0 then
        self.editButton({index=0, label="", click_function=""})
        self.editButton({index=1, label="", click_function=""})
        self.editButton({index=2, label="", click_function=""})
        self.editButton({index=3, label="", click_function=""})
    end
end

function onLoad()
    self.createButton({
        click_function="addOneState",
        function_owner=self,
        label="+1",
        position={1,0,-1},
        rotation={0,0,0},
        scale={1,1,1},
        width=300,
        height=250,
        font_size=150
    })
    self.createButton({
        click_function="addTenStates",
        function_owner=self,
        label="+10",
        position={-1,0,-1},
        rotation={0,0,0},
        scale={1,1,1},
        width=300,
        height=250,
        font_size=150
    })
    self.createButton({
        click_function="subtractOneState",
        function_owner=self,
        label="-1",
        position={1,0,1},
        rotation={0,0,0},
        scale={1,1,1},
        width=300,
        height=250,
        font_size=150,
        color={1,0,0,1}
    })
    self.createButton({
        click_function="subtractTenStates",
        function_owner=self,
        label="-10",
        position={-1,0,1},
        rotation={0,0,0},
        scale={1,1,1},
        width=300,
        height=250,
        font_size=150,
        color={1,0,0,1}
    })

    self.setCustomObject({
        hover_function="showButtons",
        click_function="",
        label="",
        snap_to_grid=false
    })
end
