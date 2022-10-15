const base64ToFile = (base64: Base64, filename: string, type: string): Promise<File | null> => {
  return new Promise(resolve => {
    fetch(base64)
      .then(x => x.arrayBuffer())
      .then(x => resolve(new File([x], filename, { type })))
      .catch(() => resolve(null));
  });
}

const readFile = async (file: File | Blob): Promise<Base64 | null> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as Base64);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  })
}

const FileUtils = {
  base64ToFile,
  readFile
}

export default FileUtils;
