declare module "mammoth/mammoth.browser" {
  type MammothInput = { arrayBuffer: ArrayBuffer };
  type MammothResult = { value: string; messages: unknown[] };

  export function extractRawText(input: MammothInput): Promise<MammothResult>;
  export function convertToHtml(input: MammothInput): Promise<MammothResult>;
}
