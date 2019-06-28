"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getGlobalObjSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            //text: 'script_code' # OR
            snippet: 'script_code',
            displayText: 'script_code',
            type: 'property',
            leftLabel: 'string',
            description: 'Returns the Global Lua script.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#script_code' // (optional)
            //replacementPrefix: 'so' # (optional)
            //leftLabelHTML: '' # (optional)
            //rightLabel: '' # (optional)
            //rightLabelHTML: '' # (optional)
            //className: '' # (optional)
            //iconHTML: '' # (optional)
        },
        {
            snippet: 'script_state',
            displayText: 'script_state',
            type: 'property',
            leftLabel: 'string',
            description: 'Returns the Global saved Lua script state.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#script_state'
        },
        {
            snippet: 'addDecal(${1:Table|parameters})',
            displayText: 'addDecal(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Add a Decal onto the game world.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#adddecal'
        },
        {
            snippet: 'addDecal({\n\t' +
                'name             = ${1:-- string},\n\t' +
                'url              = ${2:-- string},\n\t' +
                'position         = ${3:-- Vector},\n\t' +
                'rotation         = ${4:-- Vector},\n\t' +
                'scale            = ${5:-- float},\n' +
                '})',
            displayText: 'addDecal({string name, string url, Vector position, Vector rotation, float scale})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Add a Decal onto the game world.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#adddecal'
        },
        {
            snippet: 'call(${1:string|function_name}, ${2:Table|parameters})',
            displayText: 'call(string function_name, Table parameters)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Calls a Lua function owned by the Global Script and passes an optional Table as parameters to the function.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#call'
        },
        {
            snippet: 'getDecals()',
            displayText: 'getDecals()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a table of sub-tables, each sub-table representing one decal.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getdecals'
        },
        {
            snippet: 'getDecals() -- returns table of tables:\n\t' +
                '-- name                   string  (Name of decal)\n\t' +
                '-- url                    string  (Filepath or URL of image)\n\t' +
                '-- position               Vector  (Position in world)\n\t' +
                '-- rotation               Vector  (Rotation in world)\n\t' +
                '-- scale                  float   (1 is normal scale)',
            displayText: 'getDecals() -- returns {{...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a table of sub-tables, each sub-table representing one decal.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getdecals'
        },
        {
            snippet: 'getTable(${1:string|table_name})',
            displayText: 'getTable(string table_name)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets a Lua Table for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#gettable'
        },
        {
            snippet: 'getVar(${1:string|variable_name})',
            displayText: 'getVar(string variable_name)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Gets a Lua variable for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getvar'
        },
        {
            snippet: 'setDecals(${1:Table|parameters})',
            displayText: 'setDecals(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets which decals are on an object. This removes other decals already present; use an empty table to remove all decals.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setdecals'
        },
        {
            snippet: 'setDecals({\n\t{\n\t\t' +
                'name             = ${1:-- string},\n\t\t' +
                'url              = ${2:-- string},\n\t\t' +
                'position         = ${3:-- Vector},\n\t\t' +
                'rotation         = ${4:-- Vector},\n\t\t' +
                'scale            = ${5:-- float},\n\t' +
                '}\n})',
            displayText: 'setDecals({{string name, string url, Vector position, Vector rotation, float scale}})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets which decals are on an object. This removes other decals already present; use an empty table to remove all decals.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setdecals'
        },
        {
            snippet: 'setHideFaceDown(${1:bool|hide})',
            displayText: 'setHideFaceDown(bool hide)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets whether face-down objects (which have the relevant property set) will be hidden.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#sethidefacedown'
        },
        {
            snippet: 'setLookingForPlayers(${1:bool|looking_for_players})',
            displayText: 'setLookingForPlayers(bool looking_for_players)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets whether server will be listed as looking for players in server browser.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setlookingforplayers'
        },
        {
            snippet: 'setTable(${1:string|table_name}, ${2:Table|table})',
            displayText: 'setTable(string table_name, Table table)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets a Lua Table for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#settable'
        },
        {
            snippet: 'setVar(${1:string|variable_name}, ${2:variable|value})',
            displayText: 'setVar(string variable_name, variable value)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets a Lua variable for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setvar'
        },
    ];
    return suggestions;
}
exports.getGlobalObjSuggestions = getGlobalObjSuggestions;
function getDynamicSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'eval(${1:string|s})',
            displayText: 'eval(string s)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Returns the evaluation of s.',
            descriptionMoreURL: 'http://www.moonsharp.org/additions.html'
        },
        {
            snippet: 'prepare(${1:string|s})',
            displayText: 'prepare(string s)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Returns a prepared expression object which can be passed to dynamic.eval for faster execution.',
            descriptionMoreURL: 'http://www.moonsharp.org/additions.html'
        },
    ];
    return suggestions;
}
exports.getDynamicSuggestions = getDynamicSuggestions;
function getBit32Suggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'arshift(${1:int|x}, ${2:int|disp})',
            displayText: 'arshift(int x, int disp)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the number x shifted disp bits to the right.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.arshift'
        },
        {
            snippet: 'band(${1:...})',
            displayText: 'band(...)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the bitwise and of its operands.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.band'
        },
        {
            snippet: 'bnot(${1:int|x})',
            displayText: 'bnot(int x)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the bitwise not of x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.bnot'
        },
        {
            snippet: 'bor(${1:...})',
            displayText: 'bor(...)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the bitwise or of its operands.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.bor'
        },
        {
            snippet: 'btest(${1:...})',
            displayText: 'btest(...)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Returns a boolean signaling whether the bitwise and of its operands is different from zero.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.btest'
        },
        {
            snippet: 'bxor(${1:...})',
            displayText: 'bxor(...)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the bitwise xor of its operands.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.bxor'
        },
        {
            snippet: 'extract(${1:int|n, ${2:int|field}, ${3:int width})',
            displayText: 'extract(int n, int field, int width = 1)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the unsigned number formed by the bits field to field + width - 1 from n.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.extract'
        },
        {
            snippet: 'lrotate(${1:int|x, ${2:int|disp})',
            displayText: 'lrotate(int x, int disp)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the number x rotated disp bits to the left.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.lrotate'
        },
        {
            snippet: 'lshift(${1:int|x, ${2:int|disp})',
            displayText: 'lshift(int x, int disp)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the number x shifted disp bits to the left.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.lshift'
        },
        {
            snippet: 'replace(${1:int|n, ${2:int|v}, ${3:int|field}, ${4:int width})',
            displayText: 'replace(int n, int v, int field, int width = 1)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns a copy of n with the bits field to field + width - 1 replaced by the value v.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.replace'
        },
        {
            snippet: 'rrotate(${1:int|x, ${2:int|disp})',
            displayText: 'rrotate(int x, int disp)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the number x rotated disp bits to the right.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.rrotate'
        },
        {
            snippet: 'rshift(${1:int|x, ${2:int|disp})',
            displayText: 'rshift(int x, int disp)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the number x shifted disp bits to the right.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-bit32.rshift'
        },
    ];
    return suggestions;
}
exports.getBit32Suggestions = getBit32Suggestions;
function getMathSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'huge',
            displayText: 'huge',
            type: 'constant',
            leftLabel: 'float',
            description: 'The value HUGE_VAL, a value larger than or equal to any other numerical value.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.huge'
        },
        {
            snippet: 'pi',
            displayText: 'pi',
            type: 'constant',
            leftLabel: 'float',
            description: 'The value of p.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.pi'
        },
        {
            snippet: 'abs(${1:float|x})',
            displayText: 'abs(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the absolute value of x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.abs'
        },
        {
            snippet: 'acos(${1:float|x})',
            displayText: 'acos(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the arc cosine of x (in radians).',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.acos'
        },
        {
            snippet: 'asin(${1:float|x})',
            displayText: 'asin(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the arc sine of x (in radians).',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.asin'
        },
        {
            snippet: 'atan(${1:float|x})',
            displayText: 'atan(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the arc tangent of x (in radians).',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.atan'
        },
        {
            snippet: 'atan2(${1:float|y}, ${2:float|x})',
            displayText: 'atan2(float y, float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the arc tangent of y/x (in radians), but uses the signs of both parameters to find the quadrant of the result.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.atan2'
        },
        {
            snippet: 'ceil(${1:float|x})',
            displayText: 'ceil(float x)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the smallest integer larger than or equal to x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.ceil'
        },
        {
            snippet: 'cos(${1:float|x})',
            displayText: 'cos(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the cosine of x (assumed to be in radians).',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.cos'
        },
        {
            snippet: 'cosh(${1:float|x})',
            displayText: 'cosh(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the hyperbolic cosine of x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.cosh'
        },
        {
            snippet: 'deg(${1:float|x})',
            displayText: 'deg(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the angle x (given in radians) in degrees.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.deg'
        },
        {
            snippet: 'exp(${1:float|x})',
            displayText: 'exp(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the value e^x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.exp'
        },
        {
            snippet: 'floor(${1:float|x})',
            displayText: 'floor(float x)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the largest integer smaller than or equal to x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.floor'
        },
        {
            snippet: 'fmod(${1:float|x}, ${2:float|y})',
            displayText: 'fmod(float x, float y)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the remainder of the division of x by y that rounds the quotient towards zero.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.fmod'
        },
        {
            snippet: 'frexp(${1:float|x})',
            displayText: 'frexp(float x)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns m and e such that x = m2^e, e is an integer and the absolute value of m is in the range [0.5, 1) (or zero when x is zero).',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.frexp'
        },
        {
            snippet: 'ldexp(${1:float|m}, ${2:int|e})',
            displayText: 'ldexp(float m, int e)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns m2^e (e should be an integer).',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.ldexp'
        },
        {
            snippet: 'log(${1:float|x})',
            displayText: 'log(float x [, base])',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the logarithm of x in the given base.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.log'
        },
        {
            snippet: 'max(${1:float|x}, ${2:...})',
            displayText: 'max(float x, ...)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the maximum value among its arguments.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.max'
        },
        {
            snippet: 'min(${1:float|x}, ${2:...})',
            displayText: 'min(float x, ...)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the minimum value among its arguments.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.min'
        },
        {
            snippet: 'modf(${1:float|x})',
            displayText: 'modf(float x)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns two numbers, the integral part of x and the fractional part of x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.modf'
        },
        {
            snippet: 'pow(${1:float|x}, ${2:float|y})',
            displayText: 'pow(float x, float y)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns x^y. (You can also use the expression x^y to compute this value.)',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.pow'
        },
        {
            snippet: 'rad(${1:float|x})',
            displayText: 'rad(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the angle x (given in degrees) in radians.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.rad'
        },
        {
            snippet: 'random()',
            displayText: 'random([m [, n]])',
            type: 'function',
            leftLabel: 'float',
            description: 'This function is an interface to the simple pseudo-random generator function rand provided by Standard C.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.random'
        },
        {
            snippet: 'randomseed(${1:int|x})',
            displayText: 'randomseed(int x)',
            type: 'function',
            description: 'Sets x as the "seed" for the pseudo-random generator: equal seeds produce equal sequences of numbers.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.randomseed'
        },
        {
            snippet: 'sin(${1:float|x})',
            displayText: 'sin(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the sine of x (assumed to be in radians).',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.sin'
        },
        {
            snippet: 'sinh(${1:float|x})',
            displayText: 'sinh(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the hyperbolic sine of x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.sinh'
        },
        {
            snippet: 'sqrt(${1:float|x})',
            displayText: 'sqrt(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the square root of x. (You can also use the expression x^0.5 to compute this value.)',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.sqrt'
        },
        {
            snippet: 'tan(${1:float|x})',
            displayText: 'tan(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the tangent of x (assumed to be in radians).',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.tan'
        },
        {
            snippet: 'tanh(${1:float|x})',
            displayText: 'tanh(float x)',
            type: 'function',
            leftLabel: 'float',
            description: 'Returns the hyperbolic tangent of x.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-math.tanh'
        },
    ];
    return suggestions;
}
exports.getMathSuggestions = getMathSuggestions;
function getStringSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'byte(${1:string|s}, ${2:int|i}, ${3:int|j})',
            displayText: 'byte(string s, int i = 1, int j = i)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the internal numerical codes of the characters s[i], s[i+1], ..., s[j].',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.byte'
        },
        {
            snippet: 'char(${1:int|c})',
            displayText: 'char(int c, [int c...])',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns a string comprised of the integer char codes converted to chars and concatenated.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.char'
        },
        {
            snippet: 'dump(${1:function|f})',
            displayText: 'dump(function f)',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns a string containing a binary representation of the given function.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.dump'
        },
        {
            snippet: 'find(${1:string|s}, ${2:string|pattern}, ${3:int|init}, ${4:bool|plain})',
            displayText: 'find(string s, string pattern, int init = 1, bool plain = false)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the start and end indices of pattern in string, or nil.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.find'
        },
        {
            snippet: 'format(${1:string|formatstring}, ${2:...})',
            displayText: 'format(string formatstring, ...)',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns a formatted version of its variable number of arguments following the description given in its first argument.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.format'
        },
        {
            snippet: 'gmatch(${1:string|s}, ${2:string|pattern})',
            displayText: 'gmatch(string s, string pattern)',
            type: 'function',
            leftLabel: 'function',
            description: 'Returns an iterator function that returns the next captures from pattern over the string s.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.gmatch'
        },
        {
            snippet: 'gsub(${1:string|s}, ${2:string|pattern}, ${3:string|repl}, ${4:int|n})',
            displayText: 'gsub(string s, string pattern, string repl, [int n])',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns a string from pattern matched to s replaced with repl for n occurences.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.gsub'
        },
        {
            snippet: 'len(${1:string|s})',
            displayText: 'len(string s)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the length of the string.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.len'
        },
        {
            snippet: 'lower(${1:string|s})',
            displayText: 'lower(string s)',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the string converted to lower case.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.lower'
        },
        {
            snippet: 'match(${1:string|s}, ${2:string|pattern}, ${3:int|init})',
            displayText: 'match(string s, string pattern, int init = 1)',
            type: 'function',
            leftLabel: 'captures',
            description: 'Returns the captures from pattern matched to s.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.match'
        },
        {
            snippet: 'rep(${1:string|s}, ${2:int|n}, ${3:string|sep})',
            displayText: "rep(string s, int n, string sep = '')",
            type: 'function',
            leftLabel: 'captures',
            description: 'Returns a string that is the concatenation of n copies of the string s separated by the string sep.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.rep'
        },
        {
            snippet: 'reverse(${1:string|s})',
            displayText: 'reverse(string s)',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the reverse of string.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.reverse'
        },
        {
            snippet: 'sub(${1:string|s}, ${2:int|i}, ${3:int|j})',
            displayText: 'sub(string s, int i, [int j])',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the substring of s that starts at i and continues until j.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.sub'
        },
        {
            snippet: 'unicode(${1:string|s}, ${2:int|i}, ${3:int|j})',
            displayText: 'unicode(string s, int i = 1, int j = i)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the unicode numerical codes of the characters s[i], s[i+1], ..., s[j].',
            descriptionMoreURL: 'http://www.moonsharp.org/additions.html'
        },
        {
            snippet: 'upper(${1:string|s})',
            displayText: 'upper(string s)',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the string converted to upper case.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-string.upper'
        },
    ];
    return suggestions;
}
exports.getStringSuggestions = getStringSuggestions;
function getTableSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'concat(${1:table|list}, ${2:string|sep}, ${3:int|i}, ${4:int|j})',
            displayText: "concat(table list, string sep = '', int i = 1, int j = #list)",
            type: 'function',
            leftLabel: 'string',
            description: 'Returns a string of items i to j in list joined by sep.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-table.concat'
        },
        {
            snippet: 'insert(${1:table|list}, ${2:int|pos}, ${3:variable|value})',
            displayText: "insert(table list, int pos = #list+1, variable value)",
            type: 'function',
            leftLabel: 'variable',
            description: 'Inserts element value at position pos in list.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-table.insert'
        },
        {
            snippet: 'pack(${1:...})',
            displayText: "pack(...)",
            type: 'function',
            leftLabel: 'table',
            description: 'Returns a new table with all parameters stored into keys 1, 2, etc. and with a field "n" with the total number of parameters.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-table.pack'
        },
        {
            snippet: 'remove(${1:table|list}, ${2:int|pos})',
            displayText: "remove(table list, int pos = #list)",
            type: 'function',
            leftLabel: 'variable',
            description: 'Removes (and returns) item pos from list.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-table.remove'
        },
        {
            snippet: 'sort(${1:table|list}, ${2:function|comp})',
            displayText: "sort(table list, [function comp])",
            type: 'function',
            leftLabel: 'bool',
            description: 'Sorts list in place. Uses compare function comp if specified.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-table.sort'
        },
        {
            snippet: 'unpack(${1:table|list}, ${2:int|i}, ${3:int|j})',
            displayText: "unpack(table list, int i = 1, int j = #list)",
            type: 'function',
            leftLabel: 'string',
            description: 'Returns elemeents i to j from list.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-table.unpack'
        },
    ];
    return suggestions;
}
exports.getTableSuggestions = getTableSuggestions;
function getTurnsSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'enable',
            displayText: 'enable',
            type: 'property',
            leftLabel: 'bool',
            description: 'Enable/disable the turns system.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#member-variables'
        },
        {
            snippet: 'type',
            displayText: 'type',
            type: 'property',
            leftLabel: 'int',
            description: 'If the turn order is automatic or custom. 1=auto, 2=custom.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#member-variables'
        },
        {
            snippet: 'order',
            displayText: 'order',
            type: 'property',
            leftLabel: 'table',
            description: 'A table of strings, representing the player turn order.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#member-variables'
        },
        {
            snippet: 'reverse_order',
            displayText: 'reverse_order',
            type: 'property',
            leftLabel: 'bool',
            description: 'Enable/disable reversing turn rotation direction.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#member-variables'
        },
        {
            snippet: 'skip_empty_hands',
            displayText: 'skip_empty_hands',
            type: 'property',
            leftLabel: 'bool',
            description: 'Enable/disable skipping empty hands.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#member-variables'
        },
        {
            snippet: 'disable_interactations',
            displayText: 'disable_interactations',
            type: 'property',
            leftLabel: 'bool',
            description: 'Enable/disable the blocking of players ability to interact with Objects when it is not their turn.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#member-variables'
        },
        {
            snippet: 'pass_turns',
            displayText: 'pass_turns',
            type: 'property',
            leftLabel: 'bool',
            description: 'Enable/disable a player\'s ability to pass their turn to another.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#member-variables'
        },
        {
            snippet: 'turn_color',
            displayText: 'turn_color',
            type: 'property',
            leftLabel: 'string',
            description: 'The color of the Player who\'s turn it is.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#member-variables'
        },
        {
            snippet: 'getNextTurnColor()',
            displayText: "getNextTurnColor()",
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the Player Color string of the next player in the turn order.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#functions'
        },
        {
            snippet: 'getPreviousTurnColor()',
            displayText: "getPreviousTurnColor()",
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the Player Color string of the previous player in the turn order.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/#functions'
        },
    ];
    return suggestions;
}
exports.getTurnsSuggestions = getTurnsSuggestions;
function getUiSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'getAttribute(${1:string|id}, ${2:string|attribute})',
            displayText: "getAttribute(string id, string attribute)",
            type: 'function',
            leftLabel: 'variable',
            description: 'Obtains the value of a specified attribute of a UI element. Returns typically a string or number.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#getattribute'
        },
        {
            snippet: 'getAttributes(${1:string|id})',
            displayText: "getAttributes(string id)",
            type: 'function',
            leftLabel: 'table',
            description: 'Returns the attributes and their values of a UI element that have been set by the user.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#getattributes'
        },
        {
            snippet: 'getValue(${1:string|id})',
            displayText: "getAttributes(string id)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Gets the value of a UI element.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#getvalue'
        },
        {
            snippet: 'hide(${1:string|id})',
            displayText: "hide(string id)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Hides the given UI element.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#hide'
        },
        {
            snippet: 'setAttribute(${1:string|id}, ${2:string|attribute}, ${3:variable|value})',
            displayText: "setAttribute(string id, string attribute, variable value)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the value of a specified attribute of a UI element.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#setattribute'
        },
        {
            snippet: 'setAttributes(${1:string|id}, ${2:table|data})',
            displayText: "setAttributes(string id, table data)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Updates the value of the supplied attributes of a UI element.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#setattributes'
        },
        {
            snippet: 'setValue(${1:string|id}, ${2:string|value})',
            displayText: "setAttributes(string id, string value)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Updates the value of a UI element.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#setvalue'
        },
        {
            snippet: 'show(${1:string|id})',
            displayText: "show(string id)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Shows the given UI element.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#show'
        },
        {
            snippet: 'setXml(${1:string|xml})',
            displayText: "setXml(string xml)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Replaces the run-time UI with the XML string.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#setxml'
        },
        {
            snippet: 'setXmlTable(${1:table|xmlTable})',
            displayText: "setXmlTable(table xmlTable)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Replaces the run-time UI with an XML string which is generated from a table of data.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#setxmltable'
        },
        {
            snippet: 'setCustomAssets(${1:table|assets})',
            displayText: "setCustomAssets(table assets)",
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the UI ASSETS (like custom images) for global or an Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#setcustomassets'
        },
        {
            snippet: 'getXml()',
            displayText: "getXml()",
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the run-time UI\'s XML in string format.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#getxml'
        },
        {
            snippet: 'getXmlTable()',
            displayText: "getXmlTable()",
            type: 'function',
            leftLabel: 'table',
            description: 'Returns the run-time UI\'s XML formatted as a Lua table.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#getxmltable'
        },
        {
            snippet: 'getCustomAssets()',
            displayText: "getCustomAssets()",
            type: 'function',
            leftLabel: 'table',
            description: 'Returns information on all custom assets uploaded to the UI ASSETS pane.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/#getcustomassets'
        },
    ];
    return suggestions;
}
exports.getUiSuggestions = getUiSuggestions;
function getCoroutineSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'create(${1:function|f})',
            displayText: 'create(function f)',
            type: 'function',
            leftLabel: 'thread',
            description: 'Creates a new coroutine, with body f.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-coroutine.create'
        },
        {
            snippet: 'resume(${1:coroutine|co})',
            displayText: 'resume(coroutine co [, val1, ···])',
            type: 'function',
            leftLabel: 'Table',
            description: 'Starts or continues the execution of coroutine co.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-coroutine.resume'
        },
        {
            snippet: 'running()',
            displayText: 'running()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the running coroutine plus a boolean, true when the running coroutine is the main one.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-coroutine.running'
        },
        {
            snippet: 'status(${1:coroutine|co})',
            displayText: 'status(coroutine co)',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the status of coroutine co, as a string.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-coroutine.status'
        },
        {
            snippet: 'wrap(${1:function|f})',
            displayText: 'wrap(function f)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Creates a new coroutine, with body f.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-coroutine.wrap'
        },
        {
            snippet: 'yield(${1:int|value})',
            displayText: 'yield(int value)',
            type: 'function',
            description: 'Suspends the execution of the calling coroutine.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-coroutine.yield'
        },
    ];
    return suggestions;
}
exports.getCoroutineSuggestions = getCoroutineSuggestions;
function getOsSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'clock()',
            displayText: 'clock()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns an approximation of the amount in seconds of CPU time used by the program.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-os.clock'
        },
        {
            snippet: 'date()',
            displayText: 'date([format [, time]])',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a string or a table containing date and time.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-os.date'
        },
        {
            snippet: 'difftime(${1:time|t2}, ${2:time|t1})',
            displayText: 'difftime(t2, t1)',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the number of seconds from time t1 to time t2.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-os.difftime'
        },
        {
            snippet: 'time()',
            displayText: 'time([table])',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the current time when called without arguments, or a time representing the date and time specified by the given table.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-os.time'
        },
    ];
    return suggestions;
}
exports.getOsSuggestions = getOsSuggestions;
function getClockSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'paused',
            displayText: 'paused',
            type: 'property',
            leftLabel: 'bool',
            description: 'If the Clock’s timer is paused. Setting this value will pause or resume the timer.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/clock/#paused'
        },
        {
            snippet: 'getValue()',
            displayText: 'getValue()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the current value in stopwatch or timer mode as the number of seconds.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/clock/#getvalue'
        },
        {
            snippet: 'pauseStart()',
            displayText: 'pauseStart()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Toggle function for pausing and resuming a stopwatch or timer on the Clock.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/clock/#pausestart'
        },
        {
            snippet: 'setValue(${1:int|seconds})',
            displayText: 'setValue(int seconds)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Switches the clock to timer mode and sets the timer to the given value in seconds.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/clock/#setvalue'
        },
        {
            snippet: 'startStopwatch()',
            displayText: 'startStopwatch()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Switches the Clock to stopwatch mode and begins the stopwatch from 0.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/clock/#startstopwatch'
        },
        {
            snippet: 'showCurrentTime()',
            displayText: 'showCurrentTime()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Switches the Clock back to displaying the current time.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/clock/#showcurrenttime'
        },
    ];
    return suggestions;
}
exports.getClockSuggestions = getClockSuggestions;
function getCounterSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'clear()',
            displayText: 'clear()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Resets the Counter value back to 0.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/counter/#clear'
        },
        {
            snippet: 'decrement()',
            displayText: 'decrement()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Decrements the Counter’s value by 1.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/counter/#decrement'
        },
        {
            snippet: 'getValue()',
            displayText: 'getValue()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the current value of the Counter.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/counter/#getvalue'
        },
        {
            snippet: 'increment()',
            displayText: 'increment()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Increments the Counter’s value by 1.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/counter/#increment'
        },
        {
            snippet: 'setValue(${1:int|seconds})',
            displayText: 'setValue(int seconds)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the current value of the Counter.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/counter/#setvalue'
        },
    ];
    return suggestions;
}
exports.getCounterSuggestions = getCounterSuggestions;
function getLightingSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'ambient_type',
            displayText: 'ambient_type',
            type: 'property',
            leftLabel: 'int',
            description: 'The source of the ambient light. 1 = Background, 2 = Gradient.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#ambient_type'
        },
        {
            snippet: 'ambient_intensity',
            displayText: 'ambient_intensity',
            type: 'property',
            leftLabel: 'float',
            description: 'The strength of the ambient light either from the background or gradient. Range is 0-4.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#ambient_intensity'
        },
        {
            snippet: 'light_intensity',
            displayText: 'light_intensity',
            type: 'property',
            leftLabel: 'float',
            description: 'The strength of the directional light shining down in the scene. Range is 0-4.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#light_intensity'
        },
        {
            snippet: 'reflection_intensity',
            displayText: 'reflection_intensity',
            type: 'property',
            leftLabel: 'float',
            description: 'The strength of the reflections from the background. Range is 0-1.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#reflection_intensity'
        },
        {
            snippet: 'apply()',
            displayText: 'apply()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Applies all changed made to the Lighting class. This must be called for these changes to take affect.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#apply'
        },
        {
            snippet: 'getAmbientEquatorColor()',
            displayText: 'getAmbientEquatorColor()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the Color of the gradient equator.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#getambientequatorcolor'
        },
        {
            snippet: 'getAmbientGroundColor()',
            displayText: 'getAmbientGroundColor()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the Color of the gradient ground.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#getambientgroundcolor'
        },
        {
            snippet: 'getAmbientSkyColor()',
            displayText: 'getAmbientSkyColor()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the Color of the gradient sky.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#getambientskycolor'
        },
        {
            snippet: 'getLightColor()',
            displayText: 'getLightColor()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the Color of the directional light.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#getlightcolor'
        },
        {
            snippet: 'setAmbientEquatorColor(${1:Table|color})',
            displayText: 'setAmbientEquatorColor(Table color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the Color of the gradient equator.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#setambientequatorcolor'
        },
        {
            snippet: 'setAmbientGroundColor(${1:Table|color})',
            displayText: 'setAmbientGroundColor(Table color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the Color of the ambient ground.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#setambientgroundcolor'
        },
        {
            snippet: 'setAmbientSkyColor(${1:Table|color})',
            displayText: 'setAmbientSkyColor(Table color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the Color of the gradient sky.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#setambientskycolor'
        },
        {
            snippet: 'setLightColor(${1:Table|color})',
            displayText: 'setLightColor(Table color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the Color of the directional light.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/#setlightcolor'
        },
    ];
    return suggestions;
}
exports.getLightingSuggestions = getLightingSuggestions;
function getNotesSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'addNotebookTab(${1:Table|parameters})',
            displayText: 'addNotebookTab(Table parameters)',
            type: 'function',
            leftLabel: 'int',
            description: 'Adds a new Tab to the Notebook and returns the index of the newly added Tab.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#addnotebooktab'
        },
        {
            snippet: 'addNotebookTab({\n\t' +
                'title = ${1:-- string},\n\t' +
                'body  = ${2:-- string (BBcode is allowed)},\n\t' +
                'color = ${3:-- string [Grey]},\n' +
                '})',
            displayText: 'addNotebookTab({string title, string body, string color})',
            type: 'function',
            leftLabel: 'int',
            description: 'Adds a new Tab to the Notebook and returns the index of the newly added Tab.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#addnotebooktab'
        },
        {
            snippet: 'editNotebookTab(${1:Table|parameters})',
            displayText: 'editNotebookTab(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Edits an existing Tab on the Notebook.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#editnotebooktab'
        },
        {
            snippet: 'editNotebookTab({\n\t' +
                'index = ${1:-- int},\n\t' +
                'title = ${2:-- string},\n\t' +
                'body  = ${3:-- string (BBcode is allowed)},\n\t' +
                'color = ${4:-- string [Grey]},\n' +
                '})',
            displayText: 'editNotebookTab({int index, string title, string body, string color})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Edits an existing Tab on the Notebook.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#editnotebooktab'
        },
        {
            snippet: 'getNotebookTabs()',
            displayText: 'getNotebookTabs()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table of Tables of all of the Tabs in the Notebook.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#getnotebooktabs'
        },
        {
            snippet: 'getNotebookTabs()$1\n\t-- getNotebookTabs returns:\n\t-- {{int index, string title, string body, string color}, ...}',
            displayText: 'getNotebookTabs() -- returns {{int index, string title, string body, string color}, ...}',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table of Tables of all of the Tabs in the Notebook.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#getnotebooktabs'
        },
        {
            snippet: 'getNotes()',
            displayText: 'getNotes()',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the current on-screen notes as a string.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#getnotes'
        },
        {
            snippet: 'removeNotebookTab(${1:int|index})',
            displayText: 'removeNotebookTab(int index)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Removes a Tab from the Notebook at a given index.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#removenotebooktab'
        },
        {
            snippet: 'setNotes(${1:string|notes})',
            displayText: 'setNotes(string notes)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the current on-screen notes. BBCOde is allowed for styling.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#setnotes'
        },
    ];
    return suggestions;
}
exports.getNotesSuggestions = getNotesSuggestions;
function getPhysicsSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'play_area',
            displayText: 'play_area',
            type: 'property',
            leftLabel: 'float',
            description: 'The size of the play area (0.0 - 1.0).',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/physics/#play_area'
        },
        {
            snippet: 'cast(${1:Table|info})',
            displayText: 'cast(Table info)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Casts a shape based on Info and returns a table of multiple Hit.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/physics/#cast'
        },
        {
            snippet: 'cast({\n\t' +
                'origin       = ${1:-- Vector},\n\t' +
                'direction    = ${2:-- Vector},\n\t' +
                'type         = ${3:-- int (1: Ray, 2: Sphere, 3: Box)},\n\t' +
                'size         = ${4:-- Vector},\n\t' +
                'orientation  = ${5:-- Vector},\n\t' +
                'max_distance = ${6:-- float},\n\t' +
                'debug        = ${7:-- bool (true = visualize cast)},\n' +
                '}) -- returns {{Vector point, Vector normal, float distance, Object hit_object}, ...}',
            displayText: 'cast({Vector origin, Vector direction, int type, Vector size, Vector orientation, float max_distanc, bool debug})',
            type: 'function',
            leftLabel: 'Table',
            description: 'Casts a shape based on Info and returns a table of multiple Hit.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/physics/#cast'
        },
        {
            snippet: 'getGravity()',
            displayText: 'getGravity()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the gravity Vector.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/physics/#getgravity'
        },
        {
            snippet: 'setGravity(${1:Table|vector})',
            displayText: 'setGravity(Table vector)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the gravity Vector.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/physics/#setgravity'
        },
    ];
    return suggestions;
}
exports.getPhysicsSuggestions = getPhysicsSuggestions;
function getPlayerColorsSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'Black',
            displayText: 'Black',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Black player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Blue',
            displayText: 'Blue',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Blue player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Brown',
            displayText: 'Brown',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Brown player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Green',
            displayText: 'Green',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Green player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Orange',
            displayText: 'Orange',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Orange player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Pink',
            displayText: 'Pink',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Pink player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Purple',
            displayText: 'Purple',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Purple player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Red',
            displayText: 'Red',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Red player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Teal',
            displayText: 'Teal',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Teal player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'White',
            displayText: 'White',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The White player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'Yellow',
            displayText: 'Yellow',
            type: 'constant',
            leftLabel: 'Player',
            description: 'The Yellow player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/'
        },
        {
            snippet: 'getAvailableColors()',
            displayText: 'getAvailableColors()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns valid seats colors at current table.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#getavailablecolors'
        },
        {
            snippet: 'getColors()',
            displayText: 'getColors()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns all possible seats colors.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#getavailablecolors'
        },
        {
            snippet: 'getPlayers()',
            displayText: 'getPlayers()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table of all Players.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#getplayers'
        },
        {
            snippet: 'getSpectators()',
            displayText: 'getSpectators()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table of spectator Players.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#getspectators'
        },
    ];
    return suggestions;
}
exports.getPlayerColorsSuggestions = getPlayerColorsSuggestions;
function getPlayerSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'admin',
            displayText: 'admin',
            type: 'property',
            leftLabel: 'bool',
            description: 'Is the player currently promoted or hosting the game? Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#admin'
        },
        {
            snippet: 'blindfolded',
            displayText: 'blindfolded',
            type: 'property',
            leftLabel: 'bool',
            description: 'Is the player blindfolded?',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#blindfolded'
        },
        {
            snippet: 'color',
            displayText: 'color',
            type: 'property',
            leftLabel: 'string',
            description: 'The player\'s color. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#color'
        },
        {
            snippet: 'host',
            displayText: 'host',
            type: 'property',
            leftLabel: 'bool',
            description: 'Is the player the host?.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#host'
        },
        {
            snippet: 'lift_height',
            displayText: 'lift_height',
            type: 'property',
            leftLabel: 'float',
            description: 'The player\'s lift height from 0 to 1.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#lift_height'
        },
        {
            snippet: 'promoted',
            displayText: 'promoted',
            type: 'property',
            leftLabel: 'bool',
            description: 'Is the player currently promoted? Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#promoted'
        },
        {
            snippet: 'seated',
            displayText: 'seated',
            type: 'property',
            leftLabel: 'float',
            description: 'Is the player currently seated at the table? Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#seated'
        },
        {
            snippet: 'steam_id',
            displayText: 'steam_id',
            type: 'property',
            leftLabel: 'float',
            description: 'The player\'s Steam ID. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#steam_id'
        },
        {
            snippet: 'steam_name',
            displayText: 'steam_name',
            type: 'property',
            leftLabel: 'string',
            description: 'The player\'s Steam name. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#steam_name'
        },
        {
            snippet: 'team',
            displayText: 'team',
            type: 'property',
            leftLabel: 'string',
            description: 'The player\'s team. Team names: "None", "Clubs", "Diamonds", "Hearts", "Spades". Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#team'
        },
        {
            snippet: 'attachCameraToObject(${1:Table|parameters})',
            displayText: 'attachCameraToObject(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Makes a player\'s camera follow an Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#attachcameratoobject'
        },
        {
            snippet: 'attachCameraToObject({\n\t' +
                'object = ${1:-- Object},\n\t' +
                'offset = ${2:-- Vector [x=0, y=0, z=0]},\n' +
                '})',
            displayText: 'attachCameraToObject({Object object, Vector offset})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Makes a player\'s camera follow an Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#attachcameratoobject'
        },
        {
            snippet: 'broadcast(${1:string|message})',
            displayText: 'broadcast(string message)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Broadcasts a message to the player. This also sends a message to the top center of the screen.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#broadcast'
        },
        {
            snippet: 'broadcast(${1:string|message}, ${2:string|color})',
            displayText: 'broadcast(string message, string color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Broadcasts a message to the player with Color. This also sends a message to the top center of the screen.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#broadcast'
        },
        {
            snippet: 'changeColor(${1:string|new_color})',
            displayText: 'changeColor(string new_color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Changes the player\'s color.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#changecolor'
        },
        {
            snippet: 'getHandCount()',
            displayText: 'getHandCount()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the number of hands that exist for this player color.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#gethandcount'
        },
        {
            snippet: 'getHandObjects(${1:int|index})',
            displayText: 'getHandObjects(int index = 1)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a list of all the Cards and Mahjong Tiles in the player\'s hand. Specify index for additional hands.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#gethandobjects'
        },
        {
            snippet: 'getHandTransform(${1:int|hand_index})',
            displayText: 'getHandTransform(int hand_index = 1)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the Transform of the player’s hand.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#gethandtransform'
        },
        {
            snippet: 'getHandTransform(${1:int|hand_index}) -- returns table:\n\t' +
                '-- position     Vector    (World position)\n\t' +
                '-- rotation     Vector    (World rotation)\n\t' +
                '-- scale        Vector    (Local scale)\n\t' +
                '-- forward      Vector    (Forward direction)\n\t' +
                '-- right        Vector    (Right direction)\n\t' +
                '-- up           Vector    (Up direction)',
            displayText: 'getHandTransform(int hand_index = 1) -- returns {...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the Transform of the player’s hand.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#gethandtransform'
        },
        {
            snippet: 'getPointerPosition()',
            displayText: 'getPointerPosition()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the position of the given player color\'s pointer.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#getpointerposition'
        },
        {
            snippet: 'getPointerRotation()',
            displayText: 'getPointerRotation()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the y-axis rotation of the given player color\'s pointer in degrees.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#getpointerrotation'
        },
        {
            snippet: 'getHoldingObjects()',
            displayText: 'getHoldingObjects()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Lua Table representing a list of all the Objects currently held by the player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#getholdingobjects'
        },
        {
            snippet: 'getHoverObject()',
            displayText: 'getHoverObject()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the object that this player is hovering their pointer over.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#gethoverobject'
        },
        {
            snippet: 'getSelectedObjects()',
            displayText: 'getSelectedObjects()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Lua Table representing a list of all the Objects currently selected by the player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#getpointerrotation'
        },
        {
            snippet: 'kick()',
            displayText: 'kick()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Kicks the player from the game.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#kick'
        },
        {
            snippet: 'lookAt(${1:Table|parameters})',
            displayText: 'lookAt(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Moves the Player\'s camera to look at a specific point.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#lookat'
        },
        {
            snippet: 'lookAt({\n\t' +
                'position = ${1:-- Vector (required)},\n\t' +
                'pitch    = ${2:-- float},\n\t' +
                'yaw      = ${3:-- float},\n\t' +
                'distance = ${4:-- float},\n' +
                '})',
            displayText: 'lookAt({Vector position, float pitch, float yaw, float distance})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Moves the Player\'s camera to look at a specific point.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#lookat'
        },
        {
            snippet: 'mute()',
            displayText: 'mute()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Mutes or unmutes the player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#mute'
        },
        {
            snippet: 'pingTable(${1:Vector|position]})',
            displayText: 'pingTable(Vector position)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Emulates the player using the ping tool at the given position.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#pingtable'
        },
        {
            snippet: 'print(${1:string|message})',
            displayText: 'print(string message)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Prints a message to the player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#print'
        },
        {
            snippet: 'print(${1:string|message}, ${2:string|color})',
            displayText: 'print(string message, string color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Prints a message to the player with Color.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#print'
        },
        {
            snippet: 'promote()',
            displayText: 'promote()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Promotes or demotes the player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#promote'
        },
        {
            snippet: 'setHandTransform(${1:Table|transform}, ${2:int|hand_index})',
            displayText: 'setHandTransform(Table transform, int hand_index = 1)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the Transform of the player’s hand.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#sethandtransform'
        },
        {
            snippet: 'setHandTransform({\n\t' +
                'position = ${1:-- Vector},\n\t' +
                'rotation = ${2:-- Vector},\n\t' +
                'scale    = ${3:-- Vector},\n\t' +
                'forward  = ${4:-- Vector},\n\t' +
                'right    = ${5:-- Vector},\n\t' +
                'up       = ${6:-- Vector},\n' +
                '})',
            displayText: 'setHandTransform({Vector position, Vector rotation, Vector scale, Vector forward, Vector right, Vector up})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the Transform of the player’s hand.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player/#sethandtransform'
        },
    ];
    return suggestions;
}
exports.getPlayerSuggestions = getPlayerSuggestions;
function getJsonSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'decode(${1:string|json_string})',
            displayText: 'decode(string json_string)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Decodes a valid JSON string into a Lua string, number, or Table.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/json/#decode'
        },
        {
            snippet: 'encode(${1:variable})',
            displayText: 'encode(variable)',
            type: 'function',
            leftLabel: 'string',
            description: 'Encodes a Lua string, number, or Table into a valid JSON string. This will not work with Object references.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/json/#encode'
        },
        {
            snippet: 'encode_pretty(${1:variable})',
            displayText: 'encode_pretty(variable)',
            type: 'function',
            leftLabel: 'string',
            description: 'Encodes a Lua string, number, or Table into a valid JSON string formatted with indents (Human readable). This will not work with Object references.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/json/#encode_pretty'
        },
    ];
    return suggestions;
}
exports.getJsonSuggestions = getJsonSuggestions;
function getTimeSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'time',
            displayText: 'time',
            type: 'property',
            leftLabel: 'float',
            description: 'The current game time in seconds.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/time/#time'
        },
        {
            snippet: 'delta_time',
            displayText: 'delta_time',
            type: 'property',
            leftLabel: 'float',
            description: 'Time in seconds since the last frame.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/time/#deltatime'
        },
        {
            snippet: 'fixed_time',
            displayText: 'fixed_time',
            type: 'property',
            leftLabel: 'float',
            description: 'The game time of the last fixedUpdate.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/time/#fixedtime'
        },
        {
            snippet: 'fixed_delta_time',
            displayText: 'time',
            type: 'property',
            leftLabel: 'float',
            description: 'Duration of fixed update in seconds.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/time/#fixeddeltatime'
        },
        {
            snippet: 'frame_count',
            displayText: 'frame_count',
            type: 'property',
            leftLabel: 'int',
            description: 'Total number of frames since the scene began.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/time/#framecount'
        },
    ];
    return suggestions;
}
exports.getTimeSuggestions = getTimeSuggestions;
function getWebRequestSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'get(${1:string|url}, ${2:function|callback_function})',
            displayText: 'get(string url, function callback_function)',
            type: 'function',
            leftLabel: 'WebRequest',
            description: 'Get data in text from the url. Callback function is supplied the WebRequest.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/webrequest/#get'
        },
        {
            snippet: 'get(${1:string|url}, ${2:function|callback_function}) -- returns and passes to callback:\n\t' +
                '-- download_progress    bool      (0.0 - 1.0)\n\t' +
                '-- error                string\n\t' +
                '-- is_error             bool\n\t' +
                '-- is_done              bool\n\t' +
                '-- text                 string\n\t' +
                '-- upload_progress      bool      (0.0 - 1.0)\n\t' +
                '-- url                  string',
            displayText: 'get(string url, function callback_function) -- returns ...',
            type: 'function',
            leftLabel: 'WebRequest',
            description: 'Get data in text from the url. Callback function is supplied the WebRequest.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/webrequest/#get'
        },
        {
            snippet: 'post(${1:string|url}, ${2:Table|form}, ${3:function|callback_function})',
            displayText: 'post(string url, Table form, function callback_function)',
            type: 'function',
            leftLabel: 'WebRequest',
            description: 'Post the form to the url. Callback function is supplied the WebRequest.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/webrequest/#post'
        },
        {
            snippet: 'post(${1:string|url}, ${2:Table|form}, ${3:function|callback_function}) -- returns and passes to callback:\n\t' +
                '-- download_progress    bool      (0.0 - 1.0)\n\t' +
                '-- error                string\n\t' +
                '-- is_error             bool\n\t' +
                '-- is_done              bool\n\t' +
                '-- text                 string\n\t' +
                '-- upload_progress      bool      (0.0 - 1.0)\n\t' +
                '-- url                  string',
            displayText: 'post(string url, Table form, function callback_function) -- returns ...',
            type: 'function',
            leftLabel: 'WebRequest',
            description: 'Post the form to the url. Callback function is supplied the WebRequest.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/webrequest/#post'
        },
        {
            snippet: 'put(${1:string|url}, ${2:string|data}, ${3:function|callback_function})',
            displayText: 'put(string url, string data, function callback_function)',
            type: 'function',
            leftLabel: 'WebRequest',
            description: 'Put the data to the url. Callback function is supplied the WebRequest.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/webrequest/#put'
        },
        {
            snippet: 'put(${1:string|url}, ${2:string|data}, ${3:function|callback_function}) -- returns and passes to callback:\n\t' +
                '-- download_progress    bool      (0.0 - 1.0)\n\t' +
                '-- error                string\n\t' +
                '-- is_error             bool\n\t' +
                '-- is_done              bool\n\t' +
                '-- text                 string\n\t' +
                '-- upload_progress      bool      (0.0 - 1.0)\n\t' +
                '-- url                  string',
            displayText: 'put(string url, string data, function callback_function) -- returns ...',
            type: 'function',
            leftLabel: 'WebRequest',
            description: 'Put the data to the url. Callback function is supplied the WebRequest.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/webrequest/#put'
        },
    ];
    return suggestions;
}
exports.getWebRequestSuggestions = getWebRequestSuggestions;
function getRpgFigurineSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'attack()',
            displayText: 'attack()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Plays a random attack animation.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/rpgfigurine/#attack'
        },
        {
            snippet: 'changeMode()',
            displayText: 'changeMode()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Changes the RPG Figurine\'s current mode.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/rpgfigurine/#changemode'
        },
        {
            snippet: 'die()',
            displayText: 'die()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Plays the death animation. Call die() again to reset the RPG Figurine.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/rpgfigurine/#die'
        },
        {
            snippet: 'onAttack(hit_list)\n\t${0:-- body...}\nend',
            displayText: 'onAttack(Table hit_list)',
            type: 'function',
            description: 'This function is called, if it exists in your script, when this RPGFigurine attacks another RPGFigurine.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/rpgfigurine/#onattack'
        },
        {
            snippet: 'onHit(attacker)\n\t${0:-- body...}\nend',
            displayText: 'onHit(Object attacker)',
            type: 'function',
            description: 'This function is called, if it exists in your script, when this RPGFigurine is attacked by another RPGFigurine.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/rpgfigurine/#onhit'
        },
    ];
    return suggestions;
}
exports.getRpgFigurineSuggestions = getRpgFigurineSuggestions;
function getTextToolSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'getFontColor()',
            displayText: 'getFontColor()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the current font color as a Lua Table keyed as Table[\'r\'], Table[\'g\'], and Table[\'b\'].',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/texttool/#getfontcolor'
        },
        {
            snippet: 'getFontSize()',
            displayText: 'getFontSize()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the current font size.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/texttool/#getfontsize'
        },
        {
            snippet: 'getValue()',
            displayText: 'getValue()',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the current text.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/texttool/#getvalue'
        },
        {
            snippet: 'setFontColor(${1:Table|color})',
            displayText: 'setFontColor(Table color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the current font color. The Lua Table parameter should be keyed as Table[\'r\'], Table[\'g\'], and Table[\'b\'].',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/texttool/#setfontcolor'
        },
        {
            snippet: 'setFontSize(${1:int|font_size})',
            displayText: 'setFontSize(int font_size)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the current font size.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/texttool/#setfontsize'
        },
        {
            snippet: 'setValue(${1:string|text})',
            displayText: 'setValue(string text)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the current text.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/texttool/#setvalue'
        },
    ];
    return suggestions;
}
exports.getTextToolSuggestions = getTextToolSuggestions;
function getWaitSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'condition(${1:function|func}, ${2:function|condition}, ${3:float|timeout}, ${4:function|timeout_func})',
            displayText: 'condition(function func, function condition, float timeout, function timeout_func)',
            type: 'function',
            leftLabel: 'int',
            description: 'Activates a function when a given function returns true or activates a different function if a timeout occurs.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#condition'
        },
        {
            snippet: 'frames(${1:function|func}, ${2:int|frame_count})',
            displayText: 'frames(function func, int frame_count)',
            type: 'function',
            leftLabel: 'int',
            description: 'Activates a function after a set number of frames.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#frames'
        },
        {
            snippet: 'stop(${1:int|id})',
            displayText: 'stop(int id)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Stops a currently running Wait function.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#stop'
        },
        {
            snippet: 'time(${1:function|func}, ${2:float|time}, ${3:int|repetitions})',
            displayText: 'time(function func, float time, int repetitions)',
            type: 'function',
            leftLabel: 'int',
            description: 'Activates a function after a set amount of time has passed, repeats given amount of times.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#time'
        },
    ];
    return suggestions;
}
exports.getWaitSuggestions = getWaitSuggestions;
function getObjectSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'angular_drag',
            displayText: 'angular_drag',
            type: 'property',
            leftLabel: 'float',
            description: 'The Object\'s angular drag.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#angular_drag'
        },
        {
            snippet: 'AssetBundle',
            displayText: 'AssetBundle',
            type: 'property',
            leftLabel: 'AssetBundle',
            description: 'A reference to the AssetBundle class attached to this Object, or nil. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#assetbundle'
        },
        {
            snippet: 'auto_raise',
            displayText: 'auto_raise',
            type: 'property',
            leftLabel: 'bool',
            description: 'Should this Object automatically raise above other Objects when held?',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#auto_raise'
        },
        {
            snippet: 'bounciness',
            displayText: 'bounciness',
            type: 'property',
            leftLabel: 'float',
            description: 'The Object\'s bounciness.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#bounciness'
        },
        {
            snippet: 'Clock',
            displayText: 'Clock',
            type: 'property',
            leftLabel: 'Clock',
            description: 'A reference to the Clock class attached to this Object. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#clock'
        },
        {
            snippet: 'Counter',
            displayText: 'Counter',
            type: 'property',
            leftLabel: 'Counter',
            description: 'A reference to the Counter class attached to this Object. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#counter'
        },
        {
            snippet: 'drag',
            displayText: 'drag',
            type: 'property',
            leftLabel: 'float',
            description: 'The Object\'s drag.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#drag'
        },
        {
            snippet: 'dynamic_friction',
            displayText: 'dynamic_friction',
            type: 'property',
            leftLabel: 'float',
            description: 'The Object\'s dynamic friction.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#dynamic_friction'
        },
        {
            snippet: 'grid_projection',
            displayText: 'grid_projection',
            type: 'property',
            leftLabel: 'bool',
            description: 'Should the grid project onto this object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#grid_projection'
        },
        {
            snippet: 'guid',
            displayText: 'guid',
            type: 'property',
            leftLabel: 'string',
            description: 'The Object’s guid. This is the same as the getGUID function. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#guid'
        },
        {
            snippet: 'held_by_color',
            displayText: 'held_by_color',
            type: 'property',
            leftLabel: 'string',
            description: 'The color of the Player currently holding the Object. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#held_by_color'
        },
        {
            snippet: 'hide_when_face_down',
            displayText: 'hide_when_face_down',
            type: 'property',
            leftLabel: 'bool',
            description: "Hides the face of the object if it is face-down.",
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#hide_when_face_down'
        },
        {
            snippet: 'ignore_fog_of_war',
            displayText: 'ignore_fog_of_war',
            type: 'property',
            leftLabel: 'bool',
            description: 'If true then the object is always visible inside fog-of-war.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#ignore_fog_of_war'
        },
        {
            snippet: 'interactable',
            displayText: 'interactable',
            type: 'property',
            leftLabel: 'bool',
            description: 'Can players interact with this Object? If false, only Lua Scripts can interact with this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#interactable'
        },
        {
            snippet: 'is_face_down',
            displayText: 'is_face_down',
            type: 'property',
            leftLabel: 'bool',
            description: 'True if the object is roughly face-down.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#is_face_down'
        },
        {
            snippet: 'loading_custom',
            displayText: 'loading_custom',
            type: 'property',
            leftLabel: 'bool',
            description: 'Indicates if the assets of a custom element are being loaded.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#loading_custom'
        },
        {
            snippet: 'mass',
            displayText: 'mass',
            type: 'property',
            leftLabel: 'float',
            description: 'The Object\'s mass.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#mass'
        },
        {
            snippet: 'name',
            displayText: 'name',
            type: 'property',
            leftLabel: 'string',
            description: 'The Object’s formated name or nickname if applicable. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#name'
        },
        {
            snippet: 'resting',
            displayText: 'resting',
            type: 'property',
            leftLabel: 'bool',
            description: 'Returns true if this Object is not moving. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#resting'
        },
        {
            snippet: 'RPGFigurine',
            displayText: 'RPGFigurine',
            type: 'property',
            leftLabel: 'RPGFigurine',
            description: 'A reference to the RPGFigurine class attached to this Object. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#rpgfigurine'
        },
        {
            snippet: 'script_code',
            displayText: 'script_code',
            type: 'property',
            leftLabel: 'string',
            description: 'Returns the Lua script on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#script_code'
        },
        {
            snippet: 'script_state',
            displayText: 'script_state',
            type: 'property',
            leftLabel: 'string',
            description: 'Returns the saved Lua script state on the Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#script_state'
        },
        {
            snippet: 'spawning',
            displayText: 'spawning',
            type: 'property',
            leftLabel: 'bool',
            description: 'Indicates if any object is currently in the process of spawning.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#spawning'
        },
        {
            snippet: 'static_friction',
            displayText: 'static_friction',
            type: 'property',
            leftLabel: 'float',
            description: 'The Object\'s static friction.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#static_friction'
        },
        {
            snippet: 'sticky',
            displayText: 'sticky',
            type: 'property',
            leftLabel: 'bool',
            description: 'Should Objects on top of this Object stick to this Object when this Object is picked up?',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#sticky'
        },
        {
            snippet: 'tag',
            displayText: 'tag',
            type: 'property',
            leftLabel: 'string',
            description: 'The tag of the Object representing its type. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#tag'
        },
        {
            snippet: 'tooltip',
            displayText: 'tooltip',
            type: 'property',
            leftLabel: 'bool',
            description: 'Should Object show tooltips when hovering over it.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#tooltip'
        },
        {
            snippet: 'TextTool',
            displayText: 'TextTool',
            type: 'property',
            leftLabel: 'TextTool',
            description: 'A reference to the TextTool class attached to this Object. Read only.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#texttool'
        },
        {
            snippet: 'use_gravity',
            displayText: 'use_gravity',
            type: 'property',
            leftLabel: 'bool',
            description: 'Does gravity affect this Object?',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#use_gravity'
        },
        {
            snippet: 'use_grid',
            displayText: 'use_grid',
            type: 'property',
            leftLabel: 'bool',
            description: 'Should this Object snap to grid points?',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#use_grid'
        },
        {
            snippet: 'use_hands',
            displayText: 'use_hands',
            type: 'property',
            leftLabel: 'bool',
            description: 'Should this Object go into player hands?',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#use_hands'
        },
        {
            snippet: 'use_rotation_value_flip',
            displayText: 'use_rotation_value_flip',
            type: 'property',
            leftLabel: 'bool',
            description: 'When true the object will flip between its rotation values on a flip action.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#use_rotation_value_flip'
        },
        {
            snippet: 'use_snap_points',
            displayText: 'use_snap_points',
            type: 'property',
            leftLabel: 'bool',
            description: 'Should this Object snap to snap points?',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#use_snap_points'
        },
        {
            snippet: 'addDecal(${1:Table|parameters})',
            displayText: 'addDecal(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Add a Decal onto the object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#adddecal'
        },
        {
            snippet: 'addDecal({\n\t' +
                'name             = ${1:-- string},\n\t' +
                'url              = ${2:-- string},\n\t' +
                'position         = ${3:-- Vector},\n\t' +
                'rotation         = ${4:-- Vector},\n\t' +
                'scale            = ${5:-- float},\n' +
                '})',
            displayText: 'addDecal({string name, string url, Vector position, Vector rotation, float scale})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Add a Decal onto the object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#adddecal'
        },
        {
            snippet: 'addForce(${1:Table|force_vector}, ${2:int|force_type})',
            displayText: 'addForce(Table force_vector, int force_type)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Adds a force vector to the Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#addforce'
        },
        {
            snippet: 'addTorque(${1:Table|torque_vector}, ${2:int|force_type})',
            displayText: 'addTorque(Table torque_vector, int force_type)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Adds a torque vector to the Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#addtorque'
        },
        {
            snippet: 'attachHider(${1:string|hider}, ${2:bool|enabled}, ${3:Table|players})',
            displayText: 'attachHider(string hider, bool enabled, Table players)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Attaches a hider to the object (or removes it if enabled is false).',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#attachhider'
        },
        {
            snippet: 'attachInvisibleHider(${1:string|hider}, ${2:bool|enabled}, ${3:Table|players})',
            displayText: 'attachHider(string hider, bool enabled, Table players)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Attaches an invisible hider to the object (or removes it if enabled is false).',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#attachhider'
        },
        {
            snippet: 'call(${1:string|function_name}, ${2:Table|parameters})',
            displayText: 'call(string function_name, Table parameters)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Calls a Lua function owned by this Object and passes an optional Table as parameters to the function.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#call'
        },
        {
            snippet: 'clearButtons()',
            displayText: 'clearButtons()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Clears all 3D UI buttons on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#clearbuttons'
        },
        {
            snippet: 'clearInputs()',
            displayText: 'clearInputs()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Clears all 3D UI text inputs on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#clearinputs'
        },
        {
            snippet: 'clone(${1:Table|parameters})',
            displayText: 'clone(Table parameters)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Copies and pastes this Object. Returns a reference to the newly spawned Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#clone'
        },
        {
            snippet: 'clone({\n\t' +
                'position     = ${1:-- Vector  [x=0, y=3, z=0]},\n\t' +
                'snap_to_grid = ${2:-- boolean [false]},\n' +
                '})',
            displayText: 'clone({Vector position, bool snap_to_grid})',
            type: 'function',
            leftLabel: 'Object',
            description: 'Copies and pastes this Object. Returns a reference to the newly spawned Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#clone'
        },
        {
            snippet: 'createButton(${1:Table|parameters})',
            displayText: 'createButton(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Creates a 3D UI button on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#createbutton'
        },
        {
            snippet: 'createButton({\n\t' +
                'click_function = ${1:-- string (required)},\n\t' +
                'function_owner = ${2:-- Object (required)},\n\t' +
                'label          = ${3:-- string},\n\t' +
                'position       = ${4:-- Vector},\n\t' +
                'rotation       = ${5:-- Vector},\n\t' +
                'scale          = ${6:-- Vector},\n\t' +
                'width          = ${7:-- int},\n\t' +
                'height         = ${8:-- int},\n\t' +
                'font_size      = ${9:-- int},\n\t' +
                'color          = ${10:-- Color},\n\t' +
                'font_color     = ${11:-- Color},\n\t' +
                'hover_color    = $(12:-- Color},\n\t' +
                'press_color    = $(13:-- Color},\n\t' +
                'tooltip        = ${14:-- string},\n' +
                '})',
            displayText: 'createButton({string click_function, Object function_owner, string label, Vector position, Vector rotation, Vector scale, int width, int height, int font_size, Color color, Color font_color, Color hover_color, Color press_color, string tooltip})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Creates a 3D UI button on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#createbutton'
        },
        {
            snippet: 'createInput(${1:Table|parameters})',
            displayText: 'createInput(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Creates a 3D UI text input on this Object. If input_function returns a string it overrides the input contents.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#createinput'
        },
        {
            snippet: 'createInput({\n\t' +
                'input_function = ${1:-- string (required)},\n\t' +
                'function_owner = ${2:-- Object (required)},\n\t' +
                'label          = ${3:-- string},\n\t' +
                'alignment      = ${4:-- int (1 = Automatic, 2 = Left, 3 = Center, 4 = Right, 5 = Justified)},\n\t' +
                'position       = ${5:-- Vector},\n\t' +
                'rotation       = ${6:-- Vector},\n\t' +
                'scale          = ${7:-- Vector},\n\t' +
                'width          = ${8:-- int},\n\t' +
                'height         = ${9:-- int},\n\t' +
                'font_size      = ${10:-- int},\n\t' +
                'color          = ${11:-- Color},\n\t' +
                'font_color     = ${12:-- Color},\n\t' +
                'tooltip        = ${13:-- Color},\n\t' +
                'value          = ${14:-- string},\n\t' +
                'validation     = ${15:-- int (1 = None, 2 = Integer, 3 = Float, 4 = Alphanumeric, 5 = Username, 6 = Name)},\n\t' +
                'tab            = ${16:-- int (1 = None, 2 = Select Next, 3 = Indent)},\n\t' +
                '})',
            displayText: 'createInput({string input_function, Object function_owner, string label, Vector position, Vector rotation, Vector scale, int width, int height, int font_size, Color color, Color font_color, string tooltip, string value, int validation, int tab})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Creates a 3D UI text input on this Object. If input_function returns a string it overrides the input contents.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#createinput'
        },
        {
            snippet: 'cut(${1:int|index})',
            displayText: 'cut(int index)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Cuts a deck at the given card index and returns created objects.  If no index provided cuts deck in half.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#cut'
        },
        {
            snippet: 'deal(${1:int|number}, ${2:string|player_color}, ${3:int|hand_index})',
            displayText: 'deal(int number, [string player], [int hand_index])',
            type: 'function',
            leftLabel: 'bool',
            description: 'Deals to player’s hand. If no player_color supplied it will deal to all seated players.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#deal'
        },
        {
            snippet: 'dealToColorWithOffset(${1:Vector|offset}, ${2:bool|flip}, ${3:string|player_color})',
            displayText: 'dealToColorWithOffset(Vector offset, bool flip, string player_color)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Deals a Card to a player with an offset from their hand.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#dealtocolorwithoffset'
        },
        {
            snippet: 'destruct()',
            displayText: 'destruct()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Destroys this Object. Mainly so you can call self.destruct().',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#destruct'
        },
        {
            snippet: 'drop()',
            displayText: 'drop()',
            type: 'function',
            leftLabel: 'bool',
            description: 'If held the object will be dropped.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#drop'
        },
        {
            snippet: 'editButton(${1:Table|parameters})',
            displayText: 'editButton(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Edits a 3D UI button on this Object based on its index.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#editbutton'
        },
        {
            snippet: 'editButton({\n\t' +
                'index          = ${1:-- int    (required)},\n\t' +
                'click_function = ${2:-- string},\n\t' +
                'function_owner = ${3:-- Object},\n\t' +
                'label          = ${4:-- string},\n\t' +
                'position       = ${5:-- Vector},\n\t' +
                'rotation       = ${6:-- Vector},\n\t' +
                'scale          = ${7:-- Vector},\n\t' +
                'width          = ${8:-- int},\n\t' +
                'height         = ${9:-- int},\n\t' +
                'font_size      = ${10:-- int},\n\t' +
                'color          = ${11:-- Color},\n\t' +
                'font_color     = ${12:-- Color},\n' +
                '})',
            displayText: 'editButton({int index, string click_function, Object function_owner, string label, Vector position, Vector rotation, Vector scale, int width, int height, int font_size, Color color, Color font_color})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Edits a 3D UI button on this Object based on its index.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#editbutton'
        },
        {
            snippet: 'editInput(${1:Table|parameters})',
            displayText: 'editInput(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Edits a 3D UI input on this Object based on its index.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#editinput'
        },
        {
            snippet: 'editInput({\n\t' +
                'index          = ${1:-- int (required)},\n\t' +
                'input_function = ${2:-- string},\n\t' +
                'function_owner = ${3:-- Object},\n\t' +
                'label          = ${4:-- string},\n\t' +
                'alignment      = ${5:-- int (1 = Automatic, 2 = Left, 3 = Center, 4 = Right, 5 = Justified)},\n\t' +
                'position       = ${6:-- Vector},\n\t' +
                'rotation       = ${7:-- Vector},\n\t' +
                'scale          = ${8:-- Vector},\n\t' +
                'width          = ${9:-- int},\n\t' +
                'height         = ${10:-- int},\n\t' +
                'font_size      = ${11:-- int},\n\t' +
                'color          = ${12:-- Color},\n\t' +
                'font_color     = ${13:-- Color},\n\t' +
                'tooltip        = ${14:-- Color},\n\t' +
                'value          = ${15:-- string},\n\t' +
                'validation     = ${16:-- int (1 = None, 2 = Integer, 3 = Float, 4 = Alphanumeric, 5 = Username, 6 = Name)},\n\t' +
                'tab            = ${17:-- int (1 = None, 2 = Select Next, 3 = Indent)},\n' +
                '})',
            displayText: 'editInput({int index, string input_function, Object function_owner, string label, Vector position, Vector rotation, Vector scale, int width, int height, int font_size, Color color, Color font_color, string tooltip, string value, int validation, int tab})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Edits a 3D UI input on this Object based on its index.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#editinput'
        },
        {
            snippet: 'flip()',
            displayText: 'flip()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Flips this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#flip'
        },
        {
            snippet: 'getAngularVelocity()',
            displayText: 'getAngularVelocity()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the current angular velocity vector of the Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getangularvelocity'
        },
        {
            snippet: 'getBounds()',
            displayText: 'getBounds()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the world space axis aligned Bounds of the Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getbounds'
        },
        {
            snippet: 'getBoundsNormalized()',
            displayText: 'getBoundsNormalized()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the world space axis aligned Bounds of the Object at zero rotation.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getboundsnormalized'
        },
        {
            snippet: 'getButtons()',
            displayText: 'getButtons()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets a list of all the 3D UI buttons on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getbuttons'
        },
        {
            snippet: 'getButtons() -- returns table:\n\t' +
                '-- {{int index, string click_function, Object function_owner, string label\n\t' +
                '--   Vector position, Vector rotation, Vector scale, int width, int height\n\t' +
                '--   int font_size, Color color, Color font_color}, ...}',
            displayText: 'getButtons() -- returns {{...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets a list of all the 3D UI buttons on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getbuttons'
        },
        {
            snippet: 'getColorTint()',
            displayText: 'getColorTint()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the color tint for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getcolortint'
        },
        {
            snippet: 'getComponentVar(${1:string|component_name}, ${2:string|variable_name})',
            displayText: 'getComponentVar(string component_name, string variable_name)',
            type: 'function',
            leftLabel: 'var',
            description: 'Get the current value of a component of an object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getcomponentvar'
        },
        {
            snippet: 'getCustomObject()',
            displayText: 'getCustomObject()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the custom parameters on a Custom Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getcustomobject'
        },
        {
            snippet: 'getCustomObject() -- returns table:\n\t' +
                '-- image                  string  (Image URL for Custom Board, Custom Dice, Custom Figurine, Custom Tile, and Custom Token.)\n\t' +
                '-- image_secondary        string  (Secondary / Back Image URL for Custom Figurine or Custom Tile.)\n\t' +
                '-- type                   int     (The number of sides of the Custom Dice, the shape of the Custom Tile, the type of Custom Mesh, or the type of Custom AssetBundle.)\n\t' +
                '-- thickness              float   (Thickness of the Custom Tile or Custom Token.)\n\t' +
                '-- stackable              bool    (Is this Custom Tile or Custom Token stackable?)\n\t' +
                '-- merge_distance         float   (The accuracy of the Custom Tile to it’s base image.)\n\t' +
                '-- mesh                   string  (Mesh URL for the Custom Mesh.)\n\t' +
                '-- diffuse                string  (Diffuse image URL for the Custom Mesh.)\n\t' +
                '-- normal                 string  (Normal image URL for the Custom Mesh.)\n\t' +
                '-- collider               string  (Collider URL for the Custom Mesh.)\n\t' +
                '-- convex                 bool    (Is this Custom Mesh concave?)\n\t' +
                '-- material               int     (The material for the Custom Mesh or Custom AssetBundle.)\n\t' +
                '-- specular_intensity     float   (The specular intensity for the Custom Mesh.)\n\t' +
                '-- specular_color         Color   (The specular color for the Custom Mesh.)\n\t' +
                '-- specular_sharpness     float   (The specular sharpness for the Custom Mesh.)\n\t' +
                '-- fresnel_strength       float   (The fresnel strength for the Custom Mesh.)\n\t' +
                '-- cast_shadows           bool    (Does this Custom Mesh cast shadows?)\n\t' +
                '-- assetbundle            string  (AssetBundle URL for this Custom AssetBundle.)\n\t' +
                '-- assetbundle_secondary  string  (Secondary AssetBundle URL for this Custom AssetBundle.)',
            displayText: 'getCustomObject() -- returns {...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the custom parameters on a Custom Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getcustomobject'
        },
        {
            snippet: 'getDecals()',
            displayText: 'getDecals()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a table of sub-tables, each sub-table representing one decal.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getdecals'
        },
        {
            snippet: 'getDecals() -- returns table of tables:\n\t' +
                '-- name                   string  (Name of decal)\n\t' +
                '-- url                    string  (Filepath or URL of image)\n\t' +
                '-- position               Vector  (Position on Object)\n\t' +
                '-- rotation               Vector  (Rotation relative to Object)\n\t' +
                '-- scale                  float   (1 is normal scale)',
            displayText: 'getDecals() -- returns {{...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a table of sub-tables, each sub-table representing one decal.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getdecals'
        },
        {
            snippet: 'getDescription()',
            displayText: 'getDescription()',
            type: 'function',
            leftLabel: 'string',
            description: 'Gets the description for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getdescription'
        },
        {
            snippet: 'getFogOfWarReveal()',
            displayText: 'getFogOfWarReveal()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the fog-of-war reveal settings for this Object: {bool reveal, Player color, float range}.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getfogofwarreveal'
        },
        {
            snippet: 'getFogOfWarReveal()$1\n\t-- getFogOfWarReveal returns:\n\t-- {bool reveal, Player color, float range}',
            displayText: 'getFogOfWarReveal() -- returns {bool reveal, Player color, float range}',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the fog-of-war reveal settings for this Object: {bool reveal, Player color, float range}.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getfogofwarreveal'
        },
        {
            snippet: 'getJoints()',
            displayText: 'getJoints()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns information on any joints attached from this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getjoints'
        },
        {
            snippet: 'getJoints() -- returns table of tables:\n\t' +
                '-- type                   string  (One of: "Fixed", "Hinge" [H], "Spring" [S])\n\t' +
                '-- joint_object_guid      string  (GUID of attached object)\n\t' +
                '-- collision              bool    (Is collision enabled?)\n\t' +
                '-- break_force            float   (Force required to break joint)\n\t' +
                '-- break_torque           float   (Torque required to break joint)\n\t' +
                '-- axis                   Vector  ([H] Axis of rotation)\n\t' +
                '-- anchor                 Vector  ([H] Position of anchor)\n\t' +
                '-- connector_anchor       Vector  ([H] Position on connected Object)\n\t' +
                '-- motor_force            float   ([H] Option A: Force of rotation)\n\t' +
                '-- motor_velocity         float   ([H] Option B: Velocity of rotaton)\n\t' +
                '-- motor_free_spin        bool    (If enabled the motor will only accelerate but never slow down)\n\t' +
                '-- spring                 float   (Force used to keep objects together)\n\t' +
                '-- damper                 float   (Force used to dampen spring)\n\t' +
                '-- max_distance           float   (Maximum distance objects may be apart)\n\t' +
                '-- min_distance           float   (Minimum distance objects may be apart)',
            displayText: 'getJoints() -- returns {{...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns information on any joints attached from this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getjoints'
        },
        {
            snippet: 'getGUID()',
            displayText: 'getGUID()',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the GUID that belongs to this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getguid'
        },
        {
            snippet: 'getInputs()',
            displayText: 'getInputs()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets a list of all the 3D UI inputs on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getinputs'
        },
        {
            snippet: 'getInputs() -- returns table of tables:\n\t' +
                '-- index               int       \n\t' +
                '-- click_function      string    \n\t' +
                '-- function_owner      Object    \n\t' +
                '-- label               string    \n\t' +
                '-- position            Table     \n\t' +
                '-- rotation            Table     \n\t' +
                '-- scale               Table     \n\t' +
                '-- width               int       \n\t' +
                '-- height              int       \n\t' +
                '-- font_size           int       \n\t' +
                '-- color               Color     \n\t' +
                '-- font_color          Color     \n\t' +
                '-- tooltip             string    \n\t' +
                '-- alignment           int       (1 = Automatic, 2 = Left, 3 = Center, 4 = Right, 5 = Justified)\n\t' +
                '-- value               string    \n\t' +
                '-- validation          int       (1 = None, 2 = Integer, 3 = Float, 4 = Alphanumeric, 5 = Username, 6 = Name)\n\t' +
                '-- tab                 int       (1 = None, 2 = Select Next, 3 = Indent)',
            displayText: 'getInputs() -- returns {{...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets a list of all the 3D UI inputs on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getinputs'
        },
        {
            snippet: 'getJSON()',
            displayText: 'getJSON()',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns a serialization of the JSON string which represents this item.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#get-functions'
        },
        {
            snippet: 'getLoopingEffectIndex()',
            displayText: 'getLoopingEffectIndex()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the index of the currently looping effect.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/assetbundle/#getloopingeffectindex'
        },
        {
            snippet: 'getLoopingEffects()',
            displayText: 'getLoopingEffects()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table with the keys “index” and “name” for each looping effect.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/assetbundle/#getloopingeffects'
        },
        {
            snippet: 'getLock()',
            displayText: 'getLock()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Get the lock status of this object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getlock'
        },
        {
            snippet: 'getLuaScript()',
            displayText: 'getLuaScript()',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the Lua script for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getluascript'
        },
        {
            snippet: 'getName()',
            displayText: 'getName()',
            type: 'function',
            leftLabel: 'string',
            description: 'Returns the nickname for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getname'
        },
        {
            snippet: 'getObjects()',
            displayText: 'getObjects()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns all the Objects inside of this container.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getobjects'
        },
        {
            snippet: 'getObjects()$1\n\t-- Bag or Deck returns {{string name, string description, string guid, int index, string lua_script, string lust_script_state}, ...}',
            displayText: 'getObjects() -- Bag returns {{string name, string description, string guid, int index, string lua_script, string lust_script_state}, ...}',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns all the Objects inside of this container.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getobjects'
        },
        {
            snippet: 'getObjects()$1\n\t-- Zone.getObjects() returns {Object, ...}',
            displayText: 'getObjects() -- Zone returns {Object, ...}',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns all the Objects inside of this container.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getobjects'
        },
        {
            snippet: 'getPosition()',
            displayText: 'getPosition()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets the position for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getposition'
        },
        {
            snippet: 'getQuantity()',
            displayText: 'getQuantity()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the number of Objects in a stack.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getquantity'
        },
        {
            snippet: 'getRotation()',
            displayText: 'getRotation()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets the rotation of this Object in degrees.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getrotation'
        },
        {
            snippet: 'getRotationValue()',
            displayText: 'getRotationValue()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the rotation value for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getrotationvalue'
        },
        {
            snippet: 'getRotationValues()',
            displayText: 'getRotationValues()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the rotation values for this Object. List of Tables with Keys: “value” and “rotation”.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getrotationvalues'
        },
        {
            snippet: 'getRotationValues()$1\n\t-- getRotationValues returns:\n\t-- {{int value, Vector rotation}, ...}',
            displayText: 'getRotationValues() -- returns {{int value, Vector rotation}, ...}',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the rotation values for this Object. List of Tables with Keys: “value” and “rotation”.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getrotationvalues'
        },
        {
            snippet: 'getScale()',
            displayText: 'getScale()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets the scale for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getscale'
        },
        {
            snippet: 'getSnapPoints()',
            displayText: 'getSnapPoints()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the snap points attached to the Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getsnappoints'
        },
        {
            snippet: 'getSnapPoints() -- returns:\n\t-- {{Vector position, Vector rotation, bool rotation_snap}, ...}',
            displayText: 'getSnapPoints() -- returns {{...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the snap points attached to the Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getsnappoints'
        },
        {
            snippet: 'getStateId()',
            displayText: 'getStateId()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns id of the active state for this object. Will return -1 if the object has no states.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getstateid'
        },
        {
            snippet: 'getStates()',
            displayText: 'getStates()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table with the keys “name”, “guid”, and “id”.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getstates'
        },
        {
            snippet: 'getStates() -- returns:\n\t-- {{string name, string description, string guid, int id, string lua_script, string lua_script_state}, ...}',
            displayText: 'getStates() -- returns {{...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table with the keys “name”, “guid”, and “id”.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getstates'
        },
        {
            snippet: 'getTable(${1:string|table_name})',
            displayText: 'getTable(string table_name)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets a Lua Table for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#gettable'
        },
        {
            snippet: 'getTransformForward()',
            displayText: 'getTransformForward()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets the forward direction of this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#gettransformforward'
        },
        {
            snippet: 'getTransformRight()',
            displayText: 'getTransformRight()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets the right direction of this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#gettransformright'
        },
        {
            snippet: 'getTransformUp()',
            displayText: 'getTransformUp()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Gets the up direction of this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#gettransformup'
        },
        {
            snippet: 'getTriggerEffects()',
            displayText: 'getTriggerEffects()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table with the keys “index” and “name” for each trigger effect.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/assetbundle/#gettriggereffects'
        },
        {
            snippet: 'getValue()',
            displayText: 'getValue()',
            type: 'function',
            leftLabel: 'int',
            description: 'Returns the value for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getvalue'
        },
        {
            snippet: 'getVar(${1:string|variable_name})',
            displayText: 'getVar(string variable_name)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Gets a Lua variable for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getvar'
        },
        {
            snippet: 'getVectorLines()',
            displayText: 'getVectorLines()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the vector lines on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getvectorlines'
        },
        {
            snippet: 'getVectorLines() -- returns:\n\t-- {{Table points, Color color, float thickness, Vector rotation}, ...}',
            displayText: 'getVectorLines() -- returns {{...',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the vector lines on this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getvectorlines'
        },
        {
            snippet: 'getVelocity()',
            displayText: 'getVelocity()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns the current velocity vector of the Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#getvelocity'
        },
        {
            snippet: 'highlightOff()',
            displayText: 'highlightOff()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Stop highlighting this object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#highlightoff'
        },
        {
            snippet: 'highlightOn(${1:Table|color}, ${2:float|duration})',
            displayText: 'highlightOn(Table color, float duration)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Highlight this object with color for an optional duration. Color values are between 0 and 1.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#highlighton'
        },
        {
            snippet: 'isSmoothMoving()',
            displayText: 'isSmoothMoving()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Is the object smoothly moving from our smooth functions.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#issmoothmoving'
        },
        {
            snippet: 'jointTo(${1:Table|parameters})',
            displayText: 'jointTo(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Joints objects together.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#jointto'
        },
        {
            snippet: 'jointTo({\n\t' +
                'type             = ${1:-- string (required - "Fixed", "Hinge", or "Spring")},\n\t' +
                'collision        = ${2:-- bool},\n\t' +
                'break_force      = ${3:-- float},\n\t' +
                'break_torque     = ${4:-- float},\n\t' +
                'axis             = ${5:-- Vector},\n\t' +
                'anchor           = ${6:-- Vector},\n\t' +
                'connected_anchor = ${7:-- Vector},\n\t' +
                'motor_force      = ${8:-- float},\n\t' +
                'motor_velocity   = ${9:-- float},\n\t' +
                'motor_free_spin  = ${10:-- bool},\n\t' +
                'spring           = ${11:-- float [10]},\n\t' +
                'damper           = ${12:-- float [0.2]},\n\t' +
                'max_distance     = ${13:-- float},\n\t' +
                'min_distance     = ${14:-- float},\n' +
                '})',
            displayText: 'jointTo({string type, bool collision, float break_force, float break_torque, Vector axis, Vector anchor, Vector connected_anchor, float motor_force, float motor_velocity, bool motor_free_spin, float spring, float damper, float max_distance, float min_distance})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Joints objects together.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#jointTo'
        },
        {
            snippet: 'playLoopingEffect(${1:int|index})',
            displayText: 'playLoopingEffect(int index)',
            type: 'function',
            leftLabel: 'void',
            description: 'Starts playing a looping effect. Index starts at 0.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/assetbundle/#playloopingeffect'
        },
        {
            snippet: 'playTriggerEffect(${1:int|index})',
            displayText: 'playTriggerEffect(int index)',
            type: 'function',
            leftLabel: 'void',
            description: 'Starts playing a trigger effect. Index starts at 0.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/assetbundle/#playtriggereffect'
        },
        {
            snippet: 'positionToLocal(${1:Table|vector})',
            displayText: 'positionToLocal(Table vector)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Converts the world position to a local position of this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#positiontolocal'
        },
        {
            snippet: 'positionToWorld(${1:Table|vector})',
            displayText: 'positionToWorld(Table vector)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Converts the local position of this Object to a world position.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#positiontoworld'
        },
        {
            snippet: 'putObject(${1:Object|object})',
            displayText: 'putObject(Object object)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Add this object to the current object. Works for stacking chips, decks, and bags.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#putobject'
        },
        {
            snippet: 'randomize()',
            displayText: 'randomize()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Same as pressing the ‘R’ key on an Object. Shuffles deck/bag, rolls dice/coin, lifts any other object up in the air.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#randomize'
        },
        {
            snippet: 'randomize(${1:string|player})',
            displayText: 'randomize(string player)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Same as pressing the ‘R’ key on an Object. Triggers onObjectRandomize as if specified player hit it.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#randomize'
        },
        {
            snippet: 'reload()',
            displayText: 'reload()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Reloads this object by destroying and spawning it place. Returns the newly spawned object. Very useful if using setCustomObject().',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#reload'
        },
        {
            snippet: 'removeButton(${1:int|index})',
            displayText: 'removeButton(int index)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Removes a 3D UI button from this Object by its index.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#removebutton'
        },
        {
            snippet: 'removeInput(${1:int|index})',
            displayText: 'removeInput(int index)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Removes a 3D UI text input from this Object by its index.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#removeinput'
        },
        {
            snippet: 'reset()',
            displayText: 'reset()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Resets this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#reset'
        },
        {
            snippet: 'roll()',
            displayText: 'roll()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Rolls this Object. Works on Dice and Coins.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#roll'
        },
        {
            snippet: 'rotate(${1:Table|rotation})',
            displayText: 'rotate(Table rotation)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Smoothly rotates this Object with the given offset in degrees.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#rotate'
        },
        {
            snippet: 'scale(${1:Table|scale})',
            displayText: 'scale(Table scale)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Scales this Object by the given amount.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#scale'
        },
        {
            snippet: 'scale(${1:float|scale})',
            displayText: 'scale(float scale)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Scales this Object in all axes by the given amount.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#scale'
        },
        {
            snippet: 'setAngularVelocity(${1:Table|vector})',
            displayText: 'setAngularVelocity(Table vector)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the angular velocity of the object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setangularvelocity'
        },
        {
            snippet: 'setColorTint(${1:Table|color})',
            displayText: 'setColorTint(Table color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the color tint for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setcolortint'
        },
        {
            snippet: 'setComponentVar(${1:string|component_name}, ${2:string|variable_name}, ${3:value})',
            displayText: 'setComponentVar(string component_name, string variable_name, var value)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Set the current value of a component of an object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setcomponentvar'
        },
        {
            snippet: 'setCustomObject(${1:Table|parameters})',
            displayText: 'setCustomObject(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Used to create a Custom Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setcustomobject'
        },
        {
            snippet: 'setDecals(${1:Table|parameters})',
            displayText: 'setDecals(Table parameters)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets which decals are on an object. This removes other decals already present; use an empty table to remove all decals.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setdecals'
        },
        {
            snippet: 'setDecals({\n\t{\n\t\t' +
                'name             = ${1:-- string},\n\t\t' +
                'url              = ${2:-- string},\n\t\t' +
                'position         = ${3:-- Vector},\n\t\t' +
                'rotation         = ${4:-- Vector},\n\t\t' +
                'scale            = ${5:-- float},\n\t' +
                '}\n})',
            displayText: 'setDecals({{string name, string url, Vector position, Vector rotation, float scale}})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets which decals are on an object. This removes other decals already present; use an empty table to remove all decals.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setdecals'
        },
        {
            snippet: 'setDescription(${1:string|description})',
            displayText: 'setDescription(string description)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the description for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setdescription'
        },
        {
            snippet: 'setFogOfWarReveal(${1:Table|fog_setting})',
            displayText: 'setFogOfWarReveal(Table fog_setting)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets whether the object reveals fog-of-war: {bool reveal, Player color, float range}',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setfogofwarreveal'
        },
        {
            snippet: 'setFogOfWarReveal({\n\t' +
                'reveal   = ${1:-- bool},\n\t' +
                'color    = ${2:-- Player},\n\t' +
                'range    = ${3:-- float},\n' +
                '})',
            displayText: 'setFogOfWarReveal({bool reveal, Player color, float range})',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets whether the object reveals fog-of-war: {bool reveal, Player color, float range}',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setfogofwarreveal'
        },
        {
            snippet: 'setHiddenFrom(${1:Table|players})',
            displayText: 'setHiddenFrom(Table players)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Hides the object from the specified players as if it were in a hand zone.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#sethiddenfrom'
        },
        {
            snippet: 'setInvisibleTo(${1:Table|players})',
            displayText: 'setInvisibleTo(Table players)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Makes the object invisible to the specified players.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#seinvisibleto'
        },
        {
            snippet: 'setLock(${1:bool|lock})',
            displayText: 'setLock(bool lock)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Set the lock status of an object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setlock'
        },
        {
            snippet: 'setLuaScript(${1:string|script})',
            displayText: 'setLuaScript(string script)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the Lua script for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setluascript'
        },
        {
            snippet: 'setName(${1:string|nickname})',
            displayText: 'setName(string nickname)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the nickname for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setname'
        },
        {
            snippet: 'setPosition(${1:Table|position})',
            displayText: 'setPosition(Table position)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the world space position for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setposition'
        },
        {
            snippet: 'setPositionSmooth(${1:Table|position}, ${2:bool|collide}, ${3:bool|fast})',
            displayText: 'setPositionSmooth(Table position, bool collide, bool fast)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Smoothly moves this Object from its current position to a given world space position.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setpositionsmooth'
        },
        {
            snippet: 'setRotation(${1:Table|rotation})',
            displayText: 'setRotation(Table rotation)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the rotation of this Object in degrees.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setrotation'
        },
        {
            snippet: 'setRotationSmooth(${1:Table|rotation}, ${2:bool|collide}, ${3:bool|fast})',
            displayText: 'setRotationSmooth(Table rotation, bool collide, bool fast)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Smoothly rotates this Object to the given orientation in degrees.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setrotationsmooth'
        },
        {
            snippet: 'setRotationValues(${1:Table|rotation_values})',
            displayText: 'setRotationValues(Table rotation_values)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the rotation values of this Object: {{int value, Vector rotation}, ...}',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setrotationvalues'
        },
        {
            snippet: 'setRotationValues({\n\t{\n\t\t' +
                'value    = ${1:-- int},\n\t\t' +
                'rotation = ${2:-- Vector},\n\t' +
                '},\n})',
            displayText: 'setRotationValues({{int value, Vector rotation}, })',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the rotation values of this Object: {{int value, Vector rotation}, ...}',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setrotationvalues'
        },
        {
            snippet: 'setScale(${1:Table|scale})',
            displayText: 'setScale(Table scale)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the scale for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setscale'
        },
        {
            snippet: 'setSnapPoints(${1:Table|snap_points})',
            displayText: 'setSnapPoints(Table snap_points)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the snap points attached to this Object: {{Vector position, Vector rotation, bool rotation_snap}, ...}',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setsnappoints'
        },
        {
            snippet: 'setSnapPoints({\n\t{\n\t\t' +
                'position         = ${1:-- Vector},\n\t\t' +
                'rotation         = ${2:-- Vector},\n\t\t' +
                'rotation_snap    = ${3:-- bool},\n\t' +
                '},\n})',
            displayText: 'setSnapPoints({{Vector position, Vector rotation, bool rotation_snap}, })',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the snap points attached to this Object: {{Vector position, Vector rotation, bool rotation_snap}, ...}',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setsnappoints'
        },
        {
            snippet: 'setState(${1:int|state})',
            displayText: 'setState(int state)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Sets the State on this Object and returns reference to the new State.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setstate'
        },
        {
            snippet: 'setTable(${1:string|table_name}, ${2:Table|table})',
            displayText: 'setTable(string table_name, Table table)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets a Lua Table for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#settable'
        },
        {
            snippet: 'setValue(${1:variable|value})',
            displayText: 'setValue(variable value)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the value for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setvalue'
        },
        {
            snippet: 'setVar(${1:string|variable_name}, ${2:variable|value})',
            displayText: 'setVar(string variable_name, variable value)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets a Lua variable for this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setvar'
        },
        {
            snippet: 'setVectorLines(${1:Table|vector_lines})',
            displayText: 'setVectorLines(Table vector_lines)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the vector lines attached to this Object: {{Table points, Color color, float thickness, Vector rotation}, ...}',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setvectorlines'
        },
        {
            snippet: 'setVectorLines({\n\t{\n\t\t' +
                'points         = ${1:-- Table},\n\t\t' +
                'color          = ${2:-- Color},\n\t\t' +
                'thickness      = ${3:-- float},\n\t\t' +
                'rotation       = ${4:-- Vector},\n\t' +
                '},\n})',
            displayText: 'setVectorLines({{Table points, Color color, float thickness, Vector rotation}, })',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the vector lines attached to this Object: {{Table points, Color color, float thickness, Vector rotation}, ...}',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setvectorlines'
        },
        {
            snippet: 'setVelocity(${1:Table|vector})',
            displayText: 'setVelocity(Table vector)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the velocity of the object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#setvelocity'
        },
        {
            snippet: 'shuffle()',
            displayText: 'shuffle()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Shuffles this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#shuffle'
        },
        {
            snippet: 'shuffleStates()',
            displayText: 'shuffleStates()',
            type: 'function',
            leftLabel: 'Object',
            description: 'Shuffles the States on this Object and returns reference to the new State.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#shufflestates'
        },
        {
            snippet: 'split(${1:int|stacks})',
            displayText: 'split(int stacks)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Splits a deck into the chosen number of stacks and returns created objects.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#split'
        },
        {
            snippet: 'takeObject(${1:Table|parameters})',
            displayText: 'takeObject(Table parameters)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Takes an Object from this container.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#takeobject'
        },
        {
            snippet: 'takeObject({\n\t' +
                'position          = ${1:-- Vector [container position, x+2]},\n\t' +
                'rotation          = ${2:-- Vector [container rotation]},\n\t' +
                'callback_function = ${3:-- function},\n\t' +
                'params            = ${4:-- Table},\n\t' +
                'smooth            = ${5:-- bool},\n\t' +
                'flip              = ${6:-- bool},\n\t' +
                'guid              = ${7:-- string},\n\t' +
                'index             = ${8:-- int},\n\t' +
                'top               = ${9:-- bool [true]},\n' +
                '})',
            displayText: 'takeObject({Vector position, Vector rotation, function callback_function, Table params, bool smooth, bool flip, string guid, int index, bool top})',
            type: 'function',
            leftLabel: 'Object',
            description: 'Takes an Object from this container.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#takeobject'
        },
        {
            snippet: 'translate(${1:Table|position})',
            displayText: 'translate(Table position)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Smoothly moves this Object from its current position to a given offset.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#translate'
        },
    ];
    return suggestions;
}
exports.getObjectSuggestions = getObjectSuggestions;
function getDefaultEventsSuggestions(globalScript) {
    let suggestions = [];
    suggestions = [];
    if (!globalScript) {
        suggestions = suggestions.concat([
            {
                snippet: 'onCollisionEnter(collision_info)\n\t' +
                    '-- collision_info table:\n\t' +
                    '--   collision_object    Object\n\t' +
                    '--   contact_points      Table     {Vector, ...}\n\t' +
                    '--   relative_velocity   Vector\n\t' +
                    '$1\nend',
                displayText: 'onCollisionEnter(Table collision_info)',
                type: 'function',
                description: 'Automatically called when this Object collides with another Object.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#oncollisionenter'
            },
            {
                snippet: 'onCollisionExit(collision_info)\n\t' +
                    '-- collision_info table:\n\t' +
                    '--   collision_object    Object\n\t' +
                    '--   contact_points      Table     {Vector, ...}\n\t' +
                    '--   relative_velocity   Vector\n\t' +
                    '$1\nend',
                displayText: 'onCollisionExit(Table collision_info)',
                type: 'function',
                description: 'Automatically called when this Object stops touching another Object.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#oncollisionexit'
            },
            {
                snippet: 'onCollisionStay(collision_info)\n\t' +
                    '-- collision_info table:\n\t' +
                    '--   collision_object    Object\n\t' +
                    '--   contact_points      Table     {Vector, ...}\n\t' +
                    '--   relative_velocity   Vector\n\t' +
                    '$1\nend',
                displayText: 'onCollisionStay(Table collision_info)',
                type: 'function',
                description: 'Automatically called when this Object is touching another Object.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#oncollisionstay'
            },
            {
                snippet: 'onDestroy()\n\t${0:-- body...}\nend',
                displayText: 'onDestroy()',
                type: 'function',
                description: 'Automatically called when this Object is destroyed.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#ondestroy'
            },
            {
                snippet: 'onDrop(player_color)\n\t${0:-- body...}\nend',
                displayText: 'onDrop(string player_color)',
                type: 'function',
                description: 'Automatically called when this Object is dropped.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#ondrop'
            },
            {
                snippet: 'onPeek(player_color)\n\t${0:-- body...}\nend',
                displayText: 'onPeek(string player_color)',
                type: 'function',
                description: 'Automatically called when this Object is peeked.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onpeek'
            },
            {
                snippet: 'onPickUp(player_color)\n\t${0:-- body...}\nend',
                displayText: 'onPickUp(string player_color)',
                type: 'function',
                description: 'Automatically called when this Object is picked up.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onpickup'
            },
            {
                snippet: 'onRandomize(player_color)\n\t${0:-- body...}\nend',
                displayText: 'onRandomze(string player_color)',
                type: 'function',
                description: 'Automatically called when this Object is randomized.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onrandomze'
            },
            {
                snippet: 'onSearchStart(player_color)\n\t${0:-- body...}\nend',
                displayText: 'onSearchStart(string player_color)',
                type: 'function',
                description: 'Automatically called when player_color starts to search this object.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onsearchstart'
            },
            {
                snippet: 'onSearchEnd(player_color)\n\t${0:-- body...}\nend',
                displayText: 'onSearchEnd(string player_color)',
                type: 'function',
                description: 'Automatically called when player_color stops searching this object.',
                descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onsearchend'
            },
        ]);
    }
    suggestions = suggestions.concat([
        {
            snippet: 'onChat(message, player)\n\t${0:-- body...}\nend',
            displayText: 'onChat(string message, Player player)',
            type: 'function',
            description: 'This function is called every time a player sends a chat message.  Return false to cancel that message.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onchat'
        },
        {
            snippet: 'onExternalMessage(table)\n\t${0:-- body...}\nend',
            displayText: 'onExternalMessage(Table table)',
            type: 'function',
            leftLabel: 'bool',
            description: 'This function called when a message is received from the External Editor API.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/externaleditorapi/'
        },
        {
            snippet: 'onFixedUpdate()\n\t${0:-- body...}\nend',
            displayText: 'onFixedUpdate()',
            type: 'function',
            description: 'This function is called, if it exists in your script, every physics tick which happens 90 times a second.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onfixedupdate'
        },
        {
            snippet: 'onLoad(save_state)\n\t${0:-- body...}\nend',
            displayText: 'onLoad(string save_state)',
            type: 'function',
            description: 'Automatically called when a game save is finished loading every Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onload'
        },
        {
            snippet: 'onObjectDestroy(dying_object)\n\t${0:-- body...}\nend',
            displayText: 'onObjectDestroy(Object dying_object)',
            type: 'function',
            description: 'Automatically called when an Object is destroyed.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectdestroy'
        },
        {
            snippet: 'onObjectDrop(dropped_object, player_color)\n\t${0:-- body...}\nend',
            displayText: 'onObjectDrop(Object dropped_object, string player_color)',
            type: 'function',
            description: 'Automatically called when an Object is dropped.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectdrop'
        },
        {
            snippet: 'onObjectEnterContainer(container, enter_object)\n\t${0:-- body...}\nend',
            displayText: 'onObjectEnterContainer(Object container, Object enter_object)',
            type: 'function',
            description: 'Automatically called when an Object enters any container(Deck, Bag, Chip Stack, etc).',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectentercontainer'
        },
        {
            snippet: 'onObjectEnterScriptingZone(zone, enter_object)\n\t${0:-- body...}\nend',
            displayText: 'onObjectEnterScriptingZone(Object zone, Object enter_object)',
            type: 'function',
            description: 'Automatically called when an Object enters a Scripting Zone.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectenterscriptingzone'
        },
        {
            snippet: 'onObjectLeaveContainer(container, leave_object)\n\t${0:-- body...}\nend',
            displayText: 'onObjectLeaveContainer(Object container, Object leave_object)',
            type: 'function',
            description: 'Automatically called when an Object leaves any container(Deck, Bag, Chip Stack, etc).',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectleavecontainer'
        },
        {
            snippet: 'onObjectLeaveScriptingZone(zone, leave_object)\n\t${0:-- body...}\nend',
            displayText: 'onObjectLeaveScriptingZone(Object zone, Object leave_object)',
            type: 'function',
            description: 'Automatically called when an Object leaves a Scripting Zone.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectleavescriptingzone'
        },
        {
            snippet: 'onObjectLoopingEffect(object, index)\n\t${0:-- body...}\nend',
            displayText: 'onObjectLoopingEffect(Object object, int index)',
            type: 'function',
            description: "Automatically called when an asset Object's loop is started.",
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectloopingeffect'
        },
        {
            snippet: 'onObjectPeek(object, player_color)\n\t${0:-- body...}\nend',
            displayText: 'onObjectPeek(Object object, string player_color)',
            type: 'function',
            description: 'Automatically called when an Object is peeked.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectpeek'
        },
        {
            snippet: 'onObjectPickUp(picked_up_object, player_color)\n\t${0:-- body...}\nend',
            displayText: 'onObjectPickUp(Object picked_up_object, string player_color)',
            type: 'function',
            description: 'Automatically called when an Object is picked up.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectpickup'
        },
        {
            snippet: 'onObjectRandomize(object, player_color)\n\t${0:-- body...}\nend',
            displayText: 'onObjectRandomize(Object object, string player_color)',
            type: 'function',
            description: 'Automatically called when an asset Object is randomized by player_color.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectrandomize'
        },
        {
            snippet: 'onObjectSearchStart(object, player_color)\n\t${0:-- body...}\nend',
            displayText: 'onObjectSearchStart(Object object, string player_color)',
            type: 'function',
            description: 'Automatically called when player_color starts searching asset object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectsearchstart'
        },
        {
            snippet: 'onObjectSearchEnd(object, player_color)\n\t${0:-- body...}\nend',
            displayText: 'onObjectSearchEnd(Object object, string player_color)',
            type: 'function',
            description: 'Automatically called when player_color stops searching asset object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectsearchend'
        },
        {
            snippet: 'onObjectSpawn(object)\n\t${0:-- body...}\nend',
            displayText: 'onObjectSpawn(Object object)',
            type: 'function',
            description: 'Automatically called when an Object is spawned.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjectspawn'
        },
        {
            snippet: 'onObjectTriggerEffect(object, index)\n\t${0:-- body...}\nend',
            displayText: 'onObjectTriggerEffect(Object object, int index)',
            type: 'function',
            description: 'Automatically called when an asset Object is triggered.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onobjecttriggereffect'
        },
        {
            snippet: 'onPlayerChangeColor(player_color)\n\t${0:-- body...}\nend',
            displayText: 'onPlayerChangeColor(string player_color)',
            type: 'function',
            description: 'Automatically called when a Player changes color.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onplayerchangecolor'
        },
        {
            snippet: 'onPlayerConnect(player_id)\n\t${0:-- body...}\nend',
            displayText: 'onPlayerConnect(int player_id)',
            type: 'function',
            description: 'Automatically called when a Player connects.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onplayerconnect'
        },
        {
            snippet: 'onPlayerDisconnect(player_id)\n\t${0:-- body...}\nend',
            displayText: 'onPlayerDisconnect(int player_id)',
            type: 'function',
            description: 'Automatically called when a Player disconnects.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onplayerdisconnect'
        },
        {
            snippet: 'onPlayerTurnEnd(player_color_end, player_color_next)\n\t${0:-- body...}\nend',
            displayText: 'onPlayerTurnEnd(string player_color_end, string player_color_next)',
            type: 'function',
            description: 'Automatically called at the end of a Player\'s turn.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onplayerturnend'
        },
        {
            snippet: 'onPlayerTurnStart(player_color_start, player_color_previous)\n\t${0:-- body...}\nend',
            displayText: 'onPlayerTurnStart(string player_color_start, string player_color_previous)',
            type: 'function',
            description: 'Automatically called at the start of a Player\'s turn.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onplayerturnstart'
        },
        {
            snippet: 'onSave()\n\t${0:-- body...}\nend',
            displayText: 'onSave()',
            type: 'function',
            description: 'Automatically called when the game saves (including auto-save for Rewinding).',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onsave'
        },
        {
            snippet: 'onScriptingButtonDown(index, player_color)\n\t${0:-- body...}\nend',
            displayText: 'onScriptingButtonDown(int index, string player_color)',
            type: 'function',
            description: 'Automatically called when a player presses down one of the scripting button hotkeys.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onscriptingbuttondown'
        },
        {
            snippet: 'onScriptingButtonUp(index, player_color)\n\t${0:-- body...}\nend',
            displayText: 'onScriptingButtonUp(int index, string player_color)',
            type: 'function',
            description: 'Automatically called when a player releases one of the scripting button hotkeys.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onscriptingbuttonup'
        },
        {
            snippet: 'onUpdate()\n\t${0:-- body...}\nend',
            displayText: 'onUpdate()',
            type: 'function',
            description: 'Automatically called once every frame.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/event/#onupdate'
        },
    ]);
    return suggestions;
}
exports.getDefaultEventsSuggestions = getDefaultEventsSuggestions;
function getGlobalConstFuncSuggestions() {
    let suggestions = [];
    suggestions = [
        {
            snippet: 'bit32',
            displayText: 'bit32',
            type: 'constant',
            description: 'The bit32 class.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#6.7'
        },
        {
            snippet: 'coroutine',
            displayText: 'coroutine',
            type: 'constant',
            description: 'The coroutine class.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#6.2'
        },
        {
            snippet: 'dynamic',
            displayText: 'dynamic',
            type: 'constant',
            description: 'The dynamic class.',
            descriptionMoreURL: 'http://www.moonsharp.org/additions.html'
        },
        {
            snippet: 'Global',
            displayText: 'Global',
            type: 'constant',
            description: 'A reference to the Global Script.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object'
        },
        {
            snippet: 'JSON',
            displayText: 'JSON',
            type: 'constant',
            description: 'The JSON class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/json'
        },
        {
            snippet: 'Lighting',
            displayText: 'Lighting',
            type: 'constant',
            description: 'The Lighting class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/lighting/'
        },
        {
            snippet: 'math',
            displayText: 'math',
            type: 'constant',
            description: 'The math class.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#6.6'
        },
        {
            snippet: 'Notes',
            displayText: 'Notes',
            type: 'constant',
            description: 'The Notes class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/notes/'
        },
        {
            snippet: 'os',
            displayText: 'os',
            type: 'constant',
            description: 'The os class.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#6.9'
        },
        {
            snippet: 'Physics',
            displayText: 'Physics',
            type: 'constant',
            description: 'The Physics class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/physics/'
        },
        {
            snippet: 'Player',
            displayText: 'Player',
            type: 'constant',
            description: 'The Player class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/player'
        },
        {
            snippet: 'self',
            displayText: 'self',
            type: 'constant',
            description: 'A reference to this Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object'
        },
        {
            snippet: 'string',
            displayText: 'string',
            type: 'constant',
            description: 'The string class.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#6.4'
        },
        {
            snippet: 'table',
            displayText: 'table',
            type: 'constant',
            description: 'The table class.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#6.5'
        },
        {
            snippet: 'Time',
            displayText: 'Time',
            type: 'constant',
            description: 'The Time class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/time/'
        },
        {
            snippet: 'Turns',
            displayText: 'Turns',
            type: 'constant',
            description: 'The Turns class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/turns/'
        },
        {
            snippet: 'UI',
            displayText: 'UI',
            type: 'constant',
            description: 'The UI class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/ui/'
        },
        {
            snippet: 'Wait',
            displayText: 'Wait',
            type: 'constant',
            description: 'The Wait class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/wait/'
        },
        {
            snippet: 'WebRequest',
            displayText: 'WebRequest',
            type: 'constant',
            description: 'The WebRequest class.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/webrequest/'
        },
        {
            snippet: 'broadcastToAll(${1:string|message}, ${2:Table|text_color})',
            displayText: 'broadcastToAll(string message, Table text_color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Prints a message to the screen and chat window on all connected clients.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#broadcasttoall'
        },
        {
            snippet: 'broadcastToColor(${1:string|message}, ${2:string|player_color}, ${3:Table|text_color})',
            displayText: 'broadcastToColor(string message, string player_color, Table text_color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Prints a private message to the screen and chat window to the player matching the player color.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#broadcasttocolor'
        },
        {
            snippet: 'clearPixelPaint()',
            displayText: 'clearPixelPaint()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Clears all pixel paint.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#clearpixelpaint'
        },
        {
            snippet: 'clearVectorPaint()',
            displayText: 'clearVectorPaint()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Clears all vector paint.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#clearvectorpaint'
        },
        {
            snippet: 'color(${1:float|red}, ${2:float|green}, ${3:float|blue}, ${4:float|alpha})',
            displayText: 'color(float red, float green, float blue, float alpha)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Creates a Color table from rgb[a] values (alpha is optional).',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#color'
        },
        {
            snippet: 'copy(${1:Table|objects})',
            displayText: 'copy(Table objects)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Copies a list of Objects.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#copy'
        },
        {
            snippet: 'destroyObject(${1:Object|obj})',
            displayText: 'destroyObject(Object obj)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Destroys an Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#destroyobject'
        },
        {
            snippet: 'flipTable()',
            displayText: 'flipTable()',
            type: 'function',
            leftLabel: 'bool',
            description: 'Flip the table in a fit of rage.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#fliptable'
        },
        {
            snippet: 'getAllObjects()',
            displayText: 'getAllObjects()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns a Table of all the spawned Objects in the game.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#getallobjects'
        },
        {
            snippet: 'getObjectFromGUID(${1:string|guid})',
            displayText: 'getObjectFromGUID(string guid)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Gets a reference to an Object from a GUID. Will return nil if the Object doesn’t exist.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#getobjectfromguid'
        },
        {
            snippet: 'getSeatedPlayers()',
            displayText: 'getSeatedPlayers()',
            type: 'function',
            leftLabel: 'Table',
            description: 'Returns an indexed Lua Table of all the seated Player colors.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#getseatedplayers'
        },
        {
            snippet: 'log(${1:Var|message}, ${2:string|tag}, ${3:string|label})',
            displayText: 'log(Var message, string tag = "", string label = "")',
            type: 'function',
            leftLabel: 'bool',
            description: 'Outputs a message to the system console. Specify a tag to identify it by class or subject, and label to prefix the value.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#log'
        },
        {
            snippet: 'logStyle(${1:string|tag}, ${2:Color|color}, ${3:string|prefix}, ${4:string|postfix})',
            displayText: 'logStyle(string tag, Color color, string prefix = "", string postfix = "")',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sets the style options for the specified tag: the color it is displayed in and any prefix or postfix text.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#logstyle'
        },
        {
            snippet: 'group(${1:Table|objects})',
            displayText: 'group(Table objects)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Groups objects together into returned Object.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#group'
        },
        {
            snippet: 'paste(${1:Table|parameters})',
            displayText: 'paste(Table parameters)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Pastes copied Objects and returns a Table of references to the new Objects.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#paste'
        },
        {
            snippet: 'paste({\n\t' +
                'position     = ${1:-- Vector  [x=0, y=3, z=0]},\n\t' +
                'snap_to_grid = ${2:-- boolean [false]},\n' +
                '})',
            displayText: 'paste({Vector position, bool snap_to_grid})',
            type: 'function',
            leftLabel: 'Table',
            description: 'Pastes copied Objects and returns a Table of references to the new Objects.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#paste'
        },
        {
            snippet: 'print(${1:string|message})',
            displayText: 'print(string message)',
            type: 'function',
            description: 'Prints a message to the chat window only on the host.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#print'
        },
        {
            snippet: 'printToAll(${1:string|message}, ${2:Table|text_color})',
            displayText: 'printToAll(string message, Table text_color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Prints a message to the chat window on all connected clients.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#printtoall'
        },
        {
            snippet: 'printToColor(${1:string|message}, ${2:string|player_color}, ${3:Table|text_color})',
            displayText: 'printToColor(string message, string player_color, Table text_color)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Prints a message to the chat window of a specific Player.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#printtocolor'
        },
        {
            snippet: 'sendExternalMessage(${1:Table|table})',
            displayText: 'sendExternalMessage(Table table)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Sends table to whatever is connected to the External Editor API.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/externaleditorapi/'
        },
        {
            snippet: 'spawnObject(${1:Table|paremeters})',
            displayText: 'spawnObject(Table parameters)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Spawns an Object and returns a reference to it.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#spawnobject'
        },
        {
            snippet: 'spawnObject({\n\t' +
                'type              = ${1:-- string},\n\t' +
                'position          = ${2:-- Vector [x=0, y=3, z=0]},\n\t' +
                'rotation          = ${3:-- Vector [x=0, y=0, z=0]},\n\t' +
                'scale             = ${4:-- Vector [x=1, y=1, z=1]},\n\t' +
                'callback_fucntion = ${5:-- function},\n\t' +
                'sound             = ${6:-- bool},\n\t' +
                'params            = ${7:-- Table},\n\t' +
                'snap_to_grid      = ${8:-- bool},\n' +
                '})',
            displayText: 'spawnObject({string type, Vector position, Vector rotation, Vector scale, function callback_function, bool sound, Table params, bool snap_to_grid})',
            type: 'function',
            leftLabel: 'Object',
            description: 'Spawns an Object and returns a reference to it.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#spawnobject'
        },
        {
            snippet: 'spawnObjectJSON(${1:Table|paremeters})',
            displayText: 'spawnObjectJSON(Table parameters)',
            type: 'function',
            leftLabel: 'Object',
            description: 'Spawns an Object using a JSON string and returns a reference to it.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#spawnobjectjson'
        },
        {
            snippet: 'spawnObjectJSON({\n\t' +
                'json              = ${1:-- string},\n\t' +
                'position          = ${2:-- Vector [x=0, y=3, z=0]},\n\t' +
                'rotation          = ${3:-- Vector [x=0, y=0, z=0]},\n\t' +
                'scale             = ${4:-- Vector [x=1, y=1, z=1]},\n\t' +
                'callback_function = ${5:-- string},\n\t' +
                'sound             = ${6:-- bool},\n\t' +
                'params            = ${7:-- Table},\n\t' +
                'snap_to_grid      = ${8:-- bool},\n' +
                '})',
            displayText: 'spawnObjectJSON({string json, Vector position, Vector rotation, Vector scale, function callback_function, bool sound, Table params, bool snap_to_grid})',
            type: 'function',
            leftLabel: 'Object',
            description: 'Spawns an Object using a JSON string and returns a reference to it.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#spawnobjectjson'
        },
        {
            snippet: 'startLuaCoroutine(${1:Object|func_owner}, ${2:string|func_name})',
            displayText: 'startLuaCoroutine(Object func_owner, string func_name)',
            type: 'function',
            leftLabel: 'bool',
            description: 'Starts a Lua function as a coroutine.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#startluacoroutine'
        },
        {
            snippet: 'stringColorToRGB(${1:string|player_color})',
            displayText: 'stringColorToRGB(string player_color)',
            type: 'function',
            leftLabel: 'Table',
            description: 'Converts a color string (player colors) to its RGB values.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#stringcolortorgb'
        },
        {
            snippet: 'tonumber(${1:e})',
            displayText: 'tonumber(e [, base])',
            type: 'function',
            leftLabel: 'number',
            description: 'When called with no base, tonumber tries to convert its argument to a number.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-tonumber'
        },
        {
            snippet: 'tostring(${1:v})',
            displayText: 'tostring(v)',
            type: 'function',
            leftLabel: 'number',
            description: 'Receives a value of any type and converts it to a string in a reasonable format.',
            descriptionMoreURL: 'https://www.lua.org/manual/5.2/manual.html#pdf-tostring'
        },
        {
            snippet: 'vector(${1:float|x}, ${2:float|y}, ${3:float|z})',
            displayText: 'vector(float x, float y, float z)',
            type: 'function',
            leftLabel: 'variable',
            description: 'Creates a Vector table from x, y, z values.',
            descriptionMoreURL: 'https://api.tabletopsimulator.com/object/#vector'
        },
    ];
    return suggestions;
}
exports.getGlobalConstFuncSuggestions = getGlobalConstFuncSuggestions;
//# sourceMappingURL=suggestions.js.map