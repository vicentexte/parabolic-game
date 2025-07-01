import PhaserGame from '@PhaserGame.vue'
import { mount } from '@vue/test-utils'

describe("PhaserGame.vue", () => {
    it("renders and mount properly", () => {
        const wrapper = mount(PhaserGame);
        expect(wrapper.exists()).toBe(true);
    })
})
