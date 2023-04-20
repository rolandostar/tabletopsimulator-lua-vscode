export default function sanitizeFilename (filename: string): string {
  return filename.replace(/([":<>/\\|?*])/g, '')
}
