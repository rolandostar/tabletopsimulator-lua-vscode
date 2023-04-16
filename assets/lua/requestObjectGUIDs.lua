objs = {}
for k, v in pairs(getObjects()) do
    objs[v.guid] = {
      name=v.getName(),
      iname=v.name,
      type=v.type,
    }
end
result = {type="guids", content=JSON.encode(objs)}
sendExternalMessage(result)