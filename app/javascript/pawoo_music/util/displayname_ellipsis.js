
export function displayNameEllipsis(account) {
  const displayName = account.get('display_name').length === 0 ? account.get('username') : account.get('display_name');

  if(displayName.length > 10) {
    return displayName.substring(0, 10) + '…';
  }

  return displayName;
}
