import {Tab} from '../read-tab';

describe('read', () => {
    it('add', async () => {
        let tab = await Tab.read('./Hard Rock.gp');
        expect(tab).toBeDefined();
        expect(tab.$GPIF.length).toBeGreaterThan(0);
    });
});
