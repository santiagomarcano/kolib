import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: false });

export async function ffmpegTrim({ file, type, threshold }) {
  try {
    const { name } = file;
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    ffmpeg.FS("writeFile", name, await fetchFile(file));
    const filter = type === 'edges'
      ? `silenceremove=start_periods=1:start_silence=0.1:start_threshold=${threshold}dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=${threshold}dB,areverse`
      : "silenceremove=1:0:-10dB"
    await ffmpeg.run(
      "-i",
      name,
      "-af",
      filter,
      "output.wav"
    );
    const data = ffmpeg.FS("readFile", "output.wav");
    const trimmedFile = new File([data.buffer], name, { type: "audio/wav" });
    ffmpeg.FS("unlink", "output.wav");
    return trimmedFile;
  } catch (err) {
    console.log(err)
  }
}

export async function ffmpegCompressMP3({ file }) {
  try {
    const { name } = file;
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    ffmpeg.FS("writeFile", name, await fetchFile(file));
    await ffmpeg.run(
      "-i",
      name,
      "-acodec",
      "libmp3lame",
      "output.mp3"
    );
    const data = ffmpeg.FS("readFile", "output.mp3");
    const processedFile = new File([data.buffer], name, { type: "audio/mp3" });
    ffmpeg.FS("unlink", "output.mp3");
    return processedFile;
  } catch (err) {
    console.log(err)
  }
}