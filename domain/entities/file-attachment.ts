export class FileAttachment {
  name: string;
  uri: string;
  blob: Blob;

  constructor(params: { name: string; uri: string; blob: Blob }) {
    this.name = params.name;
    this.uri = params.uri;
    this.blob = params.blob;
  }
}
