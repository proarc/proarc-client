import { Page } from './page.model';

describe('Page validation', () => {
  function page(model: string, type: string | null): Page {
    const page = new Page();
    page.model = model;
    page.index = '1';
    page.number = '[1]';
    page.type = type;
    return page;
  }

  it('allows a generic page without a page type', () => {
    expect(page('model:page', null).isValid()).toBeTrue();
  });

  it('requires a page type for NDK and STT pages', () => {
    expect(page('model:ndkpage', null).isValid()).toBeFalse();
    expect(page('model:oldprintpage', null).isValid()).toBeFalse();
    expect(page('model:ndkpage', 'normalPage').isValid()).toBeTrue();
    expect(page('model:oldprintpage', 'normalPage').isValid()).toBeTrue();
  });

  it('allows a missing page type while validating an import batch', () => {
    expect(page('model:ndkpage', null).isValid(false)).toBeTrue();
    expect(page('model:oldprintpage', null).isValid(false)).toBeTrue();
  });
});
