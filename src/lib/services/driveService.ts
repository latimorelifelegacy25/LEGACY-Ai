
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export const listDriveFiles = async (accessToken: string): Promise<DriveFile[]> => {
  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,modifiedTime)&pageSize=10', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch files from Google Drive');
  }

  const data = await response.json();
  return data.files || [];
};
