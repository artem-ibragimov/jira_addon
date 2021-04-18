export function parse(text: string): ISubs {
   return text
      .split('\n')
      .map((line) => /begin="(\d+).*end="(\d+).*>(.*)<\/span|p>/.exec(line) as string[] | null)
      .filter((result): result is string[] => result !== null)
      .filter((result) => result.length === 4)
      .map(([_, start, end, txt]) => [Number(start), Number(end), txt]);
}

type Timestamp = number;
type Sub = string;
export type ISubs = [Timestamp, Timestamp, Sub][];