import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';

const extension: JupyterFrontEndPlugin<void> = {
  activate,
  autoStart: true,
  id: 'tiledb-prompt-notebook-options',
  optional: [ILauncher],
  requires: [IMainMenu],
};

function activate(
  app: JupyterFrontEnd,
  menu: IMainMenu,
  launcher: ILauncher | null
): void {
  const OPEN_COMMAND = 'tiledb-prompt-notebook-options:open';

  app.commands.addCommand(OPEN_COMMAND, {
    caption: 'Prompt the user for TileDB notebook options',
    execute: async () => {
      window.parent.postMessage({ action: 'TILEDB_CREATE_NOTEBOOK' }, '*');
    },
    isEnabled: () => true,
    label: 'TileDB Notebook',
  });

  // Add a launcher item.
  if (launcher) {
    launcher.add({
      args: { isLauncher: true, kernelName: 'tiledb-prompt-notebook-options' },
      category: 'Notebook',
      command: OPEN_COMMAND,
      kernelIconUrl:
        'https://cloud.tiledb.com/static/img/tiledb-logo-jupyterlab.svg',
      rank: 1,
    });
  }

  // Add to the file menu.
  if (menu) {
    menu.fileMenu.newMenu.addGroup([{ command: OPEN_COMMAND }], 40);
  }

  console.log(
    'JupyterLab extension @tiledb/tiledb_prompt_options is activated.'
  );
}

export default extension;
