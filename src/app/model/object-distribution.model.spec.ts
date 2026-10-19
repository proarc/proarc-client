import { DocumentItem } from './documentItem.model';
import {
  buildObjectDistributionRequest,
  orderDistributionTargets,
  validateObjectDistribution
} from './object-distribution.model';

describe('object distribution with the source among targets', () => {
  function item(pid: string): DocumentItem {
    return Object.assign(new DocumentItem(), {pid});
  }

  it('keeps the source group in the request at its assigned position', () => {
    const source = item('source');
    const first = item('first');
    const last = item('last');
    const groups = [[item('page-1')], [item('page-2')], [item('page-3')]];
    const targets = [first, source, last];

    expect(validateObjectDistribution('source', groups.flat(), targets, groups)).toBeNull();
    expect(buildObjectDistributionRequest('source', true, targets, groups).targets).toEqual([
      {dstPid: 'first', pid: ['page-1']},
      {dstPid: 'source', pid: ['page-2']},
      {dstPid: 'last', pid: ['page-3']}
    ]);
  });

  it('orders sibling targets across separate selections', () => {
    const selected = [item('last'), item('source'), item('first')];

    expect(orderDistributionTargets(selected, ['first', 'source', 'last']).map(target => target.pid))
      .toEqual(['first', 'source', 'last']);
  });

  it('still rejects assigning two groups to the source', () => {
    const source = item('source');
    const groups = [[item('page-1')], [item('page-2')]];

    expect(validateObjectDistribution('source', groups.flat(), [source, source], groups))
      .toBe('duplicateTargets');
  });

  it('keeps manual ordering when targets are not all siblings', () => {
    const selected = [item('supplement'), item('source')];

    expect(orderDistributionTargets(selected, ['source', 'another'])).toEqual(selected);
  });
});
