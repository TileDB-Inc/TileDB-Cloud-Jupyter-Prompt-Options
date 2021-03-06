import { NamespaceActions, OrganizationUser } from '@tiledb-inc/tiledb-cloud';

export default function getOrgNamesWithWritePermissions(
  orgs: OrganizationUser[]
): string[] {
  const orgNames: string[] = [];

  orgs.forEach((org) => {
    const orgName = org.organization_name;
    if (
      orgName !== 'public' &&
      !!~org.allowed_actions.indexOf('write' as NamespaceActions.Write)
    ) {
      orgNames.push(orgName);
    }
  });

  return orgNames;
}
