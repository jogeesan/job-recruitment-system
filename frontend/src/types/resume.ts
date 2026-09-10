export interface Resume {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string | null;
  fileSize: number | null;
  isDefault: boolean;
  uploadedAt: string;
}
