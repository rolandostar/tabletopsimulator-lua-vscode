# Messages Out of Order

Due to the nature of the underlying transport, messages shown in Console++ panel can be received out of order. This is especially true when sending many messages in quick succession. This can be a problem if you have for example a loop which prints the contents of a large table.

Since this issue is independent of the extension, there is no way to fix it. However, there is a workaround which can be used to mitigate the issue.

That is to aggregate the messages and print them all at once. This can be done by using a table to store the messages, and then printing them all at once.

```lua
local messages = {}
for k,v in ipairs(sometable) do
    messages[#messages + 1] = v .. "some concat"
end

print(table.concat(messages,"\n"))
```