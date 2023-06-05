import dotenv from "dotenv";

dotenv.config();

interface CustomEnv extends NodeJS.ProcessEnv {
  TEST?: string;
  NOTION_SECRETS?: string;
  NOTION_VERSION?: string;
  NOTION_ROOT_PAGE_ID?: string;
}

export const customEnv: CustomEnv = {
  ...process.env
}