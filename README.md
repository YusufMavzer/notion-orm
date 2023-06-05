# Multi threaded Notion ORM

This is a layer build on top of the @notionhq/client.
It improves the client and implimentation of the Notion API.

## It provides following. 
  - Scheme builder for creating your Notion Database
  - ORM (Object Relational Mapping)
  - Multi threaded api calls thanks to Worker(s)
  - Supports multiple secrets to increase 3 requests/second rate and prevent HTTP 429 Error ---> !!! Don't abuse this feature !!!

## TODO:
  - support remaining Notion properties
  - Finish Notion database scheme builder
  - Block support
  - Users support

## Done features:
  - ORM
  - Multi threaded
  - Increase rate limit



## Example 

Create a `sample.ts` file with `SampleEntity` & `SampleContext`
``` typescript
import * as N from "@yusufmavzer/notion-orm";

export class SampleEntity extends N.NotionEntity {
  
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

export class SampleContext extends N.BaseNotionContext<SampleEntity>{
  constructor() {
    super("f2f102dbb01e42a2a8e267c6f58d768b"); //DATABASE_ID
  }
}
```

main.ts

``` typescript
import { SampleEntity, SampleContext } from "sample"
import { RegisterNotionPoolManager } from "@yusufmavzer/notion-orm";


const options = {
  secrets: ["NOTION_SECRET_1", "NOTION_SECRET_2"],
  version: "API_VERION",
  root: "ROOT_PAGE_ID" // Create a page in the Notion UI and pass the ID
}

//Register pool manager
RegisterNotionPoolManager(options.secrets, options.version, options.root);


// Create a record
const record = new SampleEntity();
record.name = new N.TitleProperty("A sample record");
record.description = new N.RichTextProperty("Some description");
record.email = new N.EmailProperty("sample@mail.com");
record.url = new N.UrlProperty("www.google.com");
record.phone = new N.PhoneNumberProperty("0483399420");
record.checkbox = new N.CheckboxProperty(true);
record.birthday = new N.DateProperty(new Date(1996, 3, 4),new Date(1998, 3, 4));
record.age = new N.NumberProperty(10);

//Insert to Notion Database
const ctx = new SampleContext();
const results = await ctx.insert(record); 
/*
with `await` your main thread will wait for the worker to finish. This will make it run slower. Without an await it's going to perform it faster
*/

```
