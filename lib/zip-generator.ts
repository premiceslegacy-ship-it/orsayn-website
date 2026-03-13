import JSZip from 'jszip';

export async function createZipFromPDFs(
    pdfs: { filename: string; buffer: Buffer }[]
): Promise<Buffer> {
    const zip = new JSZip();

    for (const { filename, buffer } of pdfs) {
        zip.file(filename, buffer);
    }

    const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
    });

    return zipBuffer;
}
