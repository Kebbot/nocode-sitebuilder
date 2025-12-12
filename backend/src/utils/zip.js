import archiver from 'archiver';

export const streamZip = async (res, files) => {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="export.zip"');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => { throw err; });
    archive.pipe(res);

    for (const f of files) {
        if (f.buffer) {
            archive.append(f.buffer, { name: f.name });
        } else if (f.content) {
            archive.append(f.content, { name: f.name });
        }
    }
    await archive.finalize();
};