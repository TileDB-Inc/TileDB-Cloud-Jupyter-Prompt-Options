import { Widget } from '@lumino/widgets';
import { v2 } from '@tiledb-inc/tiledb-cloud';
import { CloudProvider } from '@tiledb-inc/tiledb-cloud/lib/v2';
import { addOptionsToSelectInput } from '../helpers/dom';

export interface CredentialsDialogValue {
  credentialName: string;
  credentialKey: string;
  credentialSecretOrAccountName: string;
  provider: v2.CloudProvider;
  owner: string;
}

export class CredentialsDialog extends Widget {
  public constructor(owners: string[]) {
    const body = document.createElement('div');

    super({ node: body });

    this.addClass('TDB-Credentials-Dialog');
    const form = document.createElement('div');
    form.classList.add('TDB-CredentialForm');

    this.createHeader(body, owners, form);
    body.appendChild(form);
    this.createAWSForm(form, owners);
  }

  private createHeader(
    body: HTMLDivElement,
    owners: string[],
    formWrapper: HTMLDivElement
  ): void {
    const ctx = this;
    const label = document.createElement('label');
    label.textContent = 'Select your cloud vendor:';
    body.appendChild(label);

    const hiddenInput = document.createElement('input');
    hiddenInput.hidden = true;
    hiddenInput.value = CloudProvider.Aws;
    body.appendChild(hiddenInput);

    const wrapper = document.createElement('div');
    wrapper.classList.add('TDB-CredentialSelector');
    wrapper.innerHTML = `
      <div data-provider="AWS" class="TDB-CloudProviderInput TDB-CloudProviderInput--aws TDB-CloudProviderInput--selected">
        Amazon Web services
      </div>
      <div data-provider="AZURE" class="TDB-CloudProviderInput TDB-CloudProviderInput--azure">
        Azure Cloud Storage
      </div>
    `;
    body.appendChild(wrapper);
    const cloudSelectorButtons = body.querySelectorAll(
      '.TDB-CloudProviderInput'
    );

    cloudSelectorButtons.forEach((button) => {
      button?.addEventListener('click', function (e) {
        const selectedButton = body.querySelector(
          '.TDB-CloudProviderInput--selected'
        );
        selectedButton?.classList.remove('TDB-CloudProviderInput--selected');
        button.classList.add('TDB-CloudProviderInput--selected');
        const formDiv = body.querySelector('.TDB-CredentialForm');

        if (this.dataset.provider === CloudProvider.Aws) {
          hiddenInput.value = CloudProvider.Aws;
          formDiv.innerHTML = '';
          ctx.createAWSForm(formWrapper, owners);
        } else if (this.dataset.provider === CloudProvider.Azure) {
          hiddenInput.value = CloudProvider.Azure;
          formDiv.innerHTML = '';
          ctx.createAzureForm(formWrapper, owners);
        }
      });
    });
  }

  private createSelectElement(
    parentDiv: HTMLDivElement,
    options: string[],
    name: string
  ): void {
    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('jp-select-wrapper');
    const span = document.createElement('span');
    span.classList.add('f1st5hdn');
    span.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 18 18" data-icon="ui-components:caret-down-empty" data-icon-id="9fd32760-2aee-47f0-b063-03d3c5e35578"><g class="jp-icon3" fill="#616161" shape-rendering="geometricPrecision"><path d="M5.2,5.9L9,9.7l3.8-3.8l1.2,1.2l-4.9,5l-4.9-5L5.2,5.9z"></path></g></svg>
    `;
    selectWrapper.appendChild(span);
    const selectInput = document.createElement('select');
    addOptionsToSelectInput(selectInput, options);
    selectInput.setAttribute('name', name);
    selectWrapper.appendChild(selectInput);
    parentDiv.appendChild(selectWrapper);
  }

  private createAWSForm(body: HTMLDivElement, owners: string[]): void {
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('value', '');

    const keyLabel = document.createElement('label');
    keyLabel.textContent = 'AWS access key id:';
    const keyInput = document.createElement('input');
    keyInput.setAttribute('type', 'text');
    keyInput.setAttribute('value', '');

    const secretLabel = document.createElement('label');
    secretLabel.textContent = 'AWS secret access key:';
    const secretInput = document.createElement('input');
    secretInput.setAttribute('type', 'text');
    secretInput.setAttribute('value', '');

    const ownerLabel = document.createElement('label');
    ownerLabel.textContent = 'Credential namespace:';

    body.appendChild(nameLabel);
    body.appendChild(nameInput);
    body.appendChild(keyLabel);
    body.appendChild(keyInput);
    body.appendChild(secretLabel);
    body.appendChild(secretInput);
    body.appendChild(ownerLabel);
    this.createSelectElement(body, owners, 'owner');
  }

  private createAzureForm(body: HTMLDivElement, owners: string[]): void {
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('value', '');

    const keyLabel = document.createElement('label');
    keyLabel.textContent = 'Account key:';
    const keyInput = document.createElement('input');
    keyInput.setAttribute('type', 'text');
    keyInput.setAttribute('value', '');

    const secretLabel = document.createElement('label');
    secretLabel.textContent = 'Account name:';
    const secretInput = document.createElement('input');
    secretInput.setAttribute('type', 'text');
    secretInput.setAttribute('value', '');

    const ownerLabel = document.createElement('label');
    ownerLabel.textContent = 'Credential namespace:';

    body.appendChild(nameLabel);
    body.appendChild(nameInput);
    body.appendChild(keyLabel);
    body.appendChild(keyInput);
    body.appendChild(secretLabel);
    body.appendChild(secretInput);
    body.appendChild(ownerLabel);
    this.createSelectElement(body, owners, 'owner');
  }

  public getValue(): CredentialsDialogValue {
    const [
      cloudProviderInput,
      credentialNameInput,
      credentialKeyInput,
      credentialSecretOrAccountNameInput,
    ] = this.node.getElementsByTagName('input');
    const ownerSelectInput = this.node.querySelector('select');
    console.log(cloudProviderInput.value);

    return {
      credentialName: credentialNameInput.value,
      credentialKey: credentialKeyInput.value,
      credentialSecretOrAccountName: credentialSecretOrAccountNameInput.value,
      owner: ownerSelectInput.value,
      provider: cloudProviderInput.value as any,
    };
  }
}
