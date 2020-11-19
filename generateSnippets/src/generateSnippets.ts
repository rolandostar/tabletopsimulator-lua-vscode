/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as decaffeinate from 'decaffeinate';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';

const url = 'https://raw.githubusercontent.com/Berserk-Games/atom-tabletopsimulator-lua/master/lib/provider.coffee';
const searchPrefix = '// Section:';
const searchEnd = '// End of sections';
const outputPath = path.join(__dirname, '..', '..', 'src', 'language', 'suggestions.ts');
const sectionNickname = {
  'Global object': 'GlobalObj',
  'dynamic Class': 'Dynamic',
  'bit32 Class': 'Bit32',
  'math Class': 'Math',
  'string Class': 'String',
  'table Class': 'Table',
  'turns Class': 'Turns',
  'ui Class': 'Ui',
  'coroutine Class': 'Coroutine',
  'os Class': 'Os',
  'Clock Class': 'Clock',
  'Counter Class': 'Counter',
  Lighting: 'Lighting',
  Notes: 'Notes',
  Physics: 'Physics',
  'Player Colors': 'PlayerColors',
  'Player Class': 'Player',
  'JSON Class': 'Json',
  Time: 'Time',
  'WebRequest Class': 'WebRequest',
  'RPGFigurine Class': 'RpgFigurine',
  'TextTool Class': 'TextTool',
  Wait: 'Wait',
  Object: 'Object',
  'Default Events': 'DefaultEvents',
  'Globally accessible constants & functions': 'GlobalConstFunc',
  'Color Class': 'Color',
  'Music Player Class': 'MusicPlayer',
  'Vector Class': 'Vector',
};

function writeSuggestionInterface(fd: number) {
  console.log('Writing Suggestion interface');

  fs.writeSync(fd, 'export interface Suggestion {\n');
  fs.writeSync(fd, '    snippet: string;\n');
  fs.writeSync(fd, '    displayText: string;\n');
  fs.writeSync(fd, '    type: string;\n');
  fs.writeSync(fd, '    leftLabel?: string;\n');
  fs.writeSync(fd, '    description: string;\n');
  fs.writeSync(fd, '    descriptionMoreURL: string;\n');
  fs.writeSync(fd, '}\n\n');
}

function writeSnippets(fd: number, code: string) {
  const start = code.indexOf(searchPrefix);
  const end = code.indexOf(searchEnd);
  const lines = code.substring(start, end).split('\n');

  const pattern = new RegExp(`\\s*${searchPrefix} ([\\S ]*)`);

  const generator = (function* gen() {
    // eslint-disable-next-line no-restricted-syntax
    for (const [i, v] of lines.entries()) {
      if (v.includes(searchPrefix)) {
        yield i;
      }
    }
  }());

  console.log('Writing snippets...');
  let current: any = generator.next();
  while (!current.done) {
    const next = generator.next();

    const sectionName = lines[current.value].match(pattern)[1];

    // Ignore section Control blocks, it will be handled manually
    if (sectionName === 'Control blocks') {
      console.warn('Skipping Section "Control blocks"');
      current = next;
      // eslint-disable-next-line no-continue
      continue;
    }

    console.log(`Writing Section "${sectionName}"`);
    if (!sectionNickname[sectionName]) {
      console.log(`=> Missing section nickname for "${sectionName}"`);
    }

    let insideIf = false;
    const section = lines.slice(current.value + 2, (next.value) ? next.value : 0)
      .filter((v) => v.trim().length > 0)
      .reduce((acc: string, line: string, i: number, array: string[]) => {
        let val = line.trim();
        let indent = 0;

        if (val.length === 0) {
          return acc;
        }

        if (i === 0) {
          if (val.startsWith('suggestions = [')) {
            indent = 4;
          } else {
            throw Error(`The first line of section ${sectionName} does not contain suggestions array init`);
          }
        } else if (val.startsWith('if')) {
          insideIf = true;
          indent = 4;
          val = val.replace('global_script', 'globalScript');
        } else if (val === '}' && i !== (array.length - 1)) {
          // Find out what was last added (formatted correctly compared to original array), skip last newline
          const lastLine = acc.substring(acc.lastIndexOf('\n', acc.length - 2) + 1);
          if (!insideIf) {
            if (/^(\s{16}|\s{12}|\s{8}).*/.test(lastLine)) {
              indent = 8;
              val = '},';
            }
          } else if (/^(\s{20}|\s{16}|\s{12}).*/.test(lastLine)) {
            indent = 8;
            val = '},';
          } else {
            insideIf = false;
            indent = 4;
          }
        } else if (val.startsWith('suggestions = suggestions.concat([')) {
          if (!insideIf) {
            indent = 4;
          } else {
            indent = 8;
          }
        } else if (val === '];' || val === ']);') {
          if (!insideIf) {
            indent = 4;
          } else {
            indent = 8;
          }
        } else if (val === '{' || val === '},') {
          if (!insideIf) {
            indent = 8;
          } else {
            indent = 12;
          }
        } else if (/^'.*'( \+|,)/.test(val)) {
          // Handle multiline snippet value
          if (!insideIf) {
            indent = 16;
          } else {
            indent = 20;
          }
        } else {
          // Find out what was last added (formatted correctly compared to original array), skip last newline
          const lastLine = acc.substring(acc.lastIndexOf('\n', acc.length - 2) + 1);

          if (!insideIf) {
            // Indent the content of a suggestion if start is detected (8 space + {)
            // or previous was also an element (12 spaces) or multiline string (16 spaces)
            if (/^(\s{16}|\s{12}|\s{8}\{)/.test(lastLine)) {
              indent = 12;
            }
            // Indent the content of a suggestion if start is detected (12 space + {)
            // or previous was also an element (16 spaces) or multiline string (20 spaces)
          } else if (/^(\s{20}|\s{16}|\s{12}\{)/.test(lastLine)) {
            indent = 16;
          }
        }

        if (indent !== 0) {
          return `${acc}${' '.repeat(indent)}${val}\n`;
        }
        return acc;
      }, '');

    if (sectionName === 'Default Events') {
      fs.writeSync(fd, `export function get${sectionNickname[sectionName]}Suggestions(globalScript: boolean): Suggestion[] {\n`);
    } else {
      fs.writeSync(fd, `export function get${sectionNickname[sectionName]}Suggestions(): Suggestion[] {\n`);
    }

    fs.writeSync(fd, `${' '.repeat(4)}let suggestions: Suggestion[] = [];\n\n`);
    fs.writeSync(fd, section);
    fs.writeSync(fd, `\n${' '.repeat(4)}return suggestions;\n}\n\n`);

    current = next;
  }
}

request.get(url, (error: any, response: request.Response, atomFileContent: string) => {
  console.log(`Status code: ${response.statusCode}`);

  if (response.statusCode !== 200 && error) {
    console.error(error);
    return;
  }

  console.log('Decaffeinating code, it may take a while...');
  const { code } = decaffeinate.convert(atomFileContent, { useJSModules: true, loose: true });
  console.log('Done decaffeinating');

  console.log(`Opening file ${outputPath}`);
  const fd = fs.openSync(outputPath, 'w');

  try {
    writeSuggestionInterface(fd);
    writeSnippets(fd, code);
  } catch (e) {
    console.error(e);
  } finally {
    fs.closeSync(fd);
  }

  console.log('Done!');
});
