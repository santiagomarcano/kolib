self.addEventListener('message', (event) => {
  const objectURL = URL.createObjectURL(event.data.file)
  const message = event.data.file
    ? {
       index: event.data.index, objectURL, file: event.data.file, length: event.data.length , trimmed: event.data.trimmed
    }
    : {
      objectURL
    }
  self.postMessage(message)
})