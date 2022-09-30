-- Setup the Player's Meeples.
function Setup()
    local something
    for color, objects in pairs(SetupData) do
        if Player.getPlayers(). then
            for name, info in pairs(objects) do
                self.takeObject(
                {
                    position = info.pos,
                    smooth = false,
                    guid = info.guid
                })
            end
        end
    end
end
