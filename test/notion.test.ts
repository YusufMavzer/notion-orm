import { WorkerThread } from "@yusufmavzer/extended_worker_threads";
import * as N from "../src/";
import { customEnv } from "../src/env";

const options = {
  secrets: customEnv.NOTION_SECRETS!.split(",").map(i => i.trim()),
  version: customEnv.NOTION_VERSION!,
  root: customEnv.NOTION_ROOT_PAGE_ID!
}

class BondsContext extends N.BaseNotionContext<BondsEntity>{
  constructor() {
    super("2fcc2363169144ae916eeb2c4c49f618");
  }
}

class BondsEntity extends N.NotionEntity {
  constructor() {
    super()
  }

  public Name?: N.TitleProperty;
  public ISIN?: N.RichTextProperty;
  public Intrest?: N.NumberProperty;
  public Start?: N.NumberProperty;
  public End?: N.NumberProperty;
  public Lifespan?: N.NumberProperty;
  public LastPrice?: N.NumberProperty;
  public Url?: N.UrlProperty;
}



describe("Insert To Notion", () => {

  it('test', async () => {
    WorkerThread.registerHandlers("dist/events/eventHandlers");

    await N.RegisterNotionPoolManager(options.secrets, options.version, options.root);
    const ctx = new BondsContext();
    const cursor = await ctx.find(undefined, 1000);
    const res: BondsEntity[] = [];
    while(cursor.hasMore) {
      res.push(...cursor.results);
      await cursor.nextAsync(ctx);
    }
    console.log(res.length);
  });

  // it.skip('Insert 1 record to notion database and wait', async () => {
  //   N.RegisterNotionPoolManager(options.secrets, options.version, options.root);

  //   const record = new BondUsdEntity();
  //   record.Name = new N.TitleProperty("A sample record");
  //   record.ISIN = new N.RichTextProperty("Some description");
  //   record.Start = new N.DateProperty(new Date(Date.now()));
  //   record.End = new N.DateProperty(new Date(Date.now()));
  //   record.Url = new N.UrlProperty("www.exmaple.com");

  //   const ctx = new SampleContext();
  //   const results = await ctx.insert(record);
  //   // console.log(JSON.stringify(record, null, 2));
  //   //expect(results.IdProperty).toBeTruthy();

  // });

  // it.skip('Insert 1 record to notion database and wait', async () => {
  //   N.RegisterNotionPoolManager(options.secrets, options.version, options.root);

  //   const record = new SampleEntity();
  //   record.name = new N.TitleProperty("A sample record");
  //   record.description = new N.RichTextProperty("Some description");
  //   record.email = new N.EmailProperty("sample@mail.com");
  //   record.url = new N.UrlProperty("www.google.com");
  //   record.phone = new N.PhoneNumberProperty("0483399420");
  //   record.checkbox = new N.CheckboxProperty(true);
  //   record.birthday = new N.DateProperty(new Date(1996, 3, 4), new Date(1998, 3, 4));
  //   record.age = new N.NumberProperty(11);
  //   record.gender = new N.SelectProperty({ name: "Female" });
  //   record.tags = new N.MultiSelectProperty([{ name: "Housewife" }, {name: "6 Children"}]);

  //   const ctx = new SampleContext();
  //   const results = ctx.insert(record);
  //   console.log(JSON.stringify(results));
  //   expect(results).toBeTruthy();
  // });

});