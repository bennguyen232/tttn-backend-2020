import * as ejs from 'ejs';

export class HtmlParserService {
  public async render(template: string, context: object): Promise<string> {
    return ejs.render(template, context, {async: true});
  }
}
