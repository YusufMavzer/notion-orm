import * as N from "../src/";
import "reflect-metadata";
import { NotionDatabase, Title, Id } from "../src/decorators";
import { customEnv } from "../src/env";
const options = {
  secrets: customEnv.NOTION_SECRETS!.split(",").map(i => i.trim()),
  version: customEnv.NOTION_VERSION!,
  root: customEnv.NOTION_ROOT_PAGE_ID!
}

class SampleEntity extends N.NotionEntity {
  constructor() {
    super()
  }

  public name?: N.TitleProperty;
  public description?: N.RichTextProperty;
  public email?: N.EmailProperty;
  public url?: N.UrlProperty;
  public phone?: N.PhoneNumberProperty;
  public checkbox?: N.CheckboxProperty;
  public birthday?: N.DateProperty;
  public age?: N.NumberProperty;
}

class SampleContext extends N.BaseNotionContext<SampleEntity>{
  constructor() {
    super("f2f102dbb01e42a2a8e267c6f58d768b");
  }
}

describe("Insert To Notion", () => {

  it.skip('Insert 1 record to notion database and wait', async () => {
    N.RegisterNotionPoolManager(options.secrets, options.version, options.root);

    const record = new SampleEntity();
    record.name = new N.TitleProperty("A sample record");
    record.description = new N.RichTextProperty("Some description");
    record.email = new N.EmailProperty("sample@mail.com");
    record.url = new N.UrlProperty("www.google.com");
    record.phone = new N.PhoneNumberProperty("0483399420");
    record.checkbox = new N.CheckboxProperty(true);
    record.birthday = new N.DateProperty(new Date(1996, 3, 4), new Date(1998, 3, 4));
    record.age = new N.NumberProperty(10);

    const ctx = new SampleContext();
    //const results = await ctx.insert(record);
    console.log(JSON.stringify(record, null, 2));
    //expect(results.IdProperty).toBeTruthy();

  });

  it.skip('Insert 1 record to notion database and wait', async () => {
    N.RegisterNotionPoolManager(options.secrets, options.version, options.root);

    const record = new SampleEntity();
    record.name = new N.TitleProperty("A sample record");
    record.description = new N.RichTextProperty("Some description");
    record.email = new N.EmailProperty("sample@mail.com");
    record.url = new N.UrlProperty("www.google.com");
    record.phone = new N.PhoneNumberProperty("0483399420");
    record.checkbox = new N.CheckboxProperty(true);

    const ctx = new SampleContext();
    const results = ctx.insert(record);
    console.log(JSON.stringify(results));
    expect(results).toBeTruthy();
  });

});