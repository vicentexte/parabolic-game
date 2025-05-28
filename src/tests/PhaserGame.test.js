import { mount } from '@vue/test-utils'
import PhaserGame from '@/components/PhaserGame.vue'
import Phaser from 'phaser'

// Mock de Phaser.Game
jest.mock('phaser', () => {
  return {
    __esModule: true,
    default: {
      AUTO: 'AUTO',
      Scale: {
        NONE: 'NONE',
        CENTER_BOTH: 'CENTER_BOTH'
      },
      Game: jest.fn().mockImplementation(() => ({
        destroy: jest.fn()
      }))
    }
  }
})

describe('PhaserGame.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PhaserGame)
  })

  it('monta el componente correctamente', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza el contenedor del juego', () => {
    const container = wrapper.find('#phaser-container')
    expect(container.exists()).toBe(true)
  })

  it('reinicia el juego correctamente', () => {
    const oldGame = wrapper.vm.game
    wrapper.vm.restartGame()
    expect(oldGame.destroy).toHaveBeenCalledWith(true)
  })

  it('destruye el juego en beforeUnmount()', () => {
    const destroySpy = wrapper.vm.game.destroy
    wrapper.unmount()
    expect(destroySpy).toHaveBeenCalledWith(true)
  })
})
