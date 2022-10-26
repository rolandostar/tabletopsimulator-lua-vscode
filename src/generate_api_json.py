# This script will download the latest version of api.json and embed it into TTSApi.ts, to use as the default
# API for completion provider suggestions.  It should be run before each release of this extension, if the API
# has been updated.

import urllib.request, re, sys

print('Downloading...')
try:
  api_json_url = 'https://raw.githubusercontent.com/Berserk-Games/atom-tabletopsimulator-lua/master/lib/api.json'
  response = urllib.request.urlopen(api_json_url)
  data = response.read()
  json = data.decode('utf-8')
except (Exception, e):
  print('Failed to download api.json')
  print(e)
  sys.exit(1)

version = re.search('"version":\s*"([0-9.]*)"', json)
if not version:
  print('Could not find version in downloaded file.')
  sys.exit(2)
print(f'Downloaded version: {version.group(1)}')

backticked_json = json.replace('\\', '\\\\').replace('`', '\\`')

print('Writing TTSApi.ts')
with open('TTSApi.ts', 'w') as f:
    f.write(f'''\
const apiJSON = `
{backticked_json}
`

export default apiJSON;
''')

print('Done!')
