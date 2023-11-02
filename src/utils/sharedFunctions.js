export function unixTimestampToFormattedString(timestamp) {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so add 1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  const formattedString = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  return formattedString;
}

export function formatSeconds(seconds) {
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
  else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}hr ${minutes}m ${remainingSeconds}s`;
  }
}
