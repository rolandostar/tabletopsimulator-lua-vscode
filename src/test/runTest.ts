import * as path from 'path';
import * as cp from 'child_process';
import {
  runTests,
  resolveCliArgsFromVSCodeExecutablePath,
  downloadAndUnzipVSCode,
} from '@vscode/test-electron';

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, './suite/');

    // Workspace Fixture
    const testWorkspace = path.resolve(__dirname, './fixture/');

    // Install Extension on latest stable VSCode
    const vscodeExecutablePath = await downloadAndUnzipVSCode();
    const [cli, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);
    cp.spawnSync(path.basename(cli), [...args, '--install-extension', 'draivin.hscopes'], {
      encoding: 'utf-8',
      stdio: 'inherit',
      cwd: path.dirname(cli),
    });

    // Download VS Code, unzip it and run the integration test
    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      // launchArgs: [testWorkspace],
    });
  } catch (err) {
    console.error('Failed to run tests');
    throw err;
  }
}

main();
