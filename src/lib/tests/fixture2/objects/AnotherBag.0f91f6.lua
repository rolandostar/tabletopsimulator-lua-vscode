require("core/something")

function onLoad()
    ---@type Cat | Dog
    local pet

    if isCat(pet) then
        ---@cast pet Cat
        print("Cat")
        -- pet is Cat in this scope
    elseif isDog(pet) then
        ---@cast pet Dog
        print("Dog!" .. pet)
        -- pet is dog in this scope
    end
end