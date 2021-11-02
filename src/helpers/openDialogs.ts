import { v2 } from '@tiledb-inc/tiledb-cloud';
import { showDialog, showErrorMessage } from '@jupyterlab/apputils';
import { Dialog } from '@jupyterlab/apputils';
import {
  CredentialsDialog,
  CredentialsDialogValue,
} from '../dialogs/CredentialsDialog';
import {
  Options,
  PromptDialogValue,
  TileDBPromptOptionsWidget,
} from '../dialogs/TileDBPromptOptionsWidget';
import getTileDBAPI, { Versions } from './tiledbAPI';
import getDefaultS3DataFromNamespace from './getDefaultS3DataFromNamespace';

const { UserApi } = v2;

export const showMainDialog = (data: Options): void => {
  showDialog<PromptDialogValue>({
    body: new TileDBPromptOptionsWidget(data),
    buttons: [
      Dialog.cancelButton(),
      Dialog.okButton({ label: 'GO', className: 'TDB-Prompt-Dialog__btn' }),
    ],
    title: 'TileDB Notebook Options',
  });
};

export function openCredentialsDialog(options: Options): void {
  showDialog<CredentialsDialogValue>({
    body: new CredentialsDialog(options.owners),
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Add' })],
    title: 'Add AWS credentials',
  }).then(async (result) => {
    if (result.button.label === 'Cancel') {
      return;
    } else if (result.button.label === 'Add') {
      const {
        credentialName,
        credentialKey,
        credentialSecretOrAccountName,
        owner,
        provider,
      } = result.value;
      const tileDBAPI = await getTileDBAPI(UserApi, Versions.v2);
      try {
        let credential = {};
        if (provider === v2.CloudProvider.Aws) {
          credential = {
            aws: {
              access_key_id: credentialKey,
              secret_access_key: credentialSecretOrAccountName,
            },
          };
        } else if (provider === v2.CloudProvider.Azure) {
          credential = {
            azure: {
              account_name: credentialSecretOrAccountName,
              account_key: credentialKey,
            },
          };
        }
        await tileDBAPI.addCredential(owner, {
          name: credentialName,
          credential,
        });
        const credentialsResponse = await tileDBAPI.listCredentials(owner);
        const user = options.owners[0];
        const {
          default_s3_path_credentials_name: defaultS3CredentialName,
        } = await getDefaultS3DataFromNamespace(user, owner);

        showMainDialog({
          ...options,
          credentials: credentialsResponse.data?.credentials || [],
          selectedOwner: owner,
          defaultS3CredentialName,
        });
      } catch (err) {
        showErrorMessage('Error registering credentials', err);
      }
    }
  });
}
