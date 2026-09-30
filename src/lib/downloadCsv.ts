type CsvParamValue = string | number | boolean | undefined | null;

type DownloadCsvOptions = {
  path: string;
  filename: string;
  params?: Record<string, CsvParamValue>;
};

function buildApiUrl(path: string, params?: Record<string, CsvParamValue>) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizedBase);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function downloadCsv({ path, filename, params }: DownloadCsvOptions) {
  const response = await fetch(buildApiUrl(path, params), {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to download CSV export.');
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
