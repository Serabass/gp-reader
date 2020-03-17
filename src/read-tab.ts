// @ts-ignore
import StreamZip from 'node-stream-zip';
import {EventEmitter} from 'events';
import PATHS from './Paths';
import cheerio from "cheerio";

export interface TabMeta {
  title: any;
  subtitle: any;
  artist: any;
  album: any;
  words: any;
  music: any;
  wordsAndMusic: any;
  copyright: any;
  tabber: any;
  instructions: any;
  notices: any;
  size: any;
  tempo: any;
  tracks: any;
  timecodes?: any;
}

export class Tab extends EventEmitter {
  private zip: StreamZip;
  private $!: CheerioStatic;
  public meta: TabMeta | null = null;

  public version!: string;

  public $GPIF!: Cheerio;

  public static read(filename: string): Promise<Tab> {
    return new Promise<Tab>((resolve => {
      let tab = new Tab(filename);
      tab.on('ready', () => {
        resolve(tab);
      });
    }));
  }

  constructor(public filename: string) {
    super();
    this.zip = new StreamZip({
      file: filename,
      storeEntries: true
    });

    this.zip.on('ready', async () => {
      this.version = this.zip.entryDataSync(PATHS.Version).toString('utf8');
      let part = this.zip.entryDataSync(PATHS.PartConfiguration);
      let score = this.zip.entryDataSync(PATHS.Score).toString('utf-8');

      this.$ = cheerio.load(score, {xmlMode: true});

      this.$GPIF = this.$('GPIF');

      this.zip.close();

      this.emit('ready');
    });
  }
}
