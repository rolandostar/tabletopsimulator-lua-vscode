const os = require('os')
const path = require('path')

exports.TTSLuaDir = path.join(os.tmpdir(), 'TabletopSimulator', 'Scripts')
