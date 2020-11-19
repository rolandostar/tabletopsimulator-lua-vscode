export default class BBCode {
  private codes: any[] = [];

  public constructor(codes: { [key: string]: string }) {
    this.codes = Object.keys(codes).map((regex: string) => ({
      regexp: new RegExp(regex, 'igm'),
      replacement: codes[regex],
    }));
  }

  public parse(text: string) {
    return this.codes.reduce((t, code) => t.replace(code.regexp, code.replacement), text);
  }
}
