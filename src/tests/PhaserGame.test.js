// src/tests/PhaserGame.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PhaserGame from '@/components/PhaserGame.vue'

// 🔧 Mock completo de Phaser para evitar que se cargue el motor real
vi.mock('phaser', () => ({
  default: {
    AUTO: 'AUTO',
    Scale: {
      NONE: 'NONE',
      CENTER_BOTH: 'CENTER_BOTH'
    },
    Game: vi.fn().mockImplementation(() => ({
      destroy: vi.fn()
    }))
  }
}))

describe('PhaserGame.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PhaserGame)
  })

  it('monta el componente correctamente', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza el contenedor del juego con el id correcto', () => {
    const container = wrapper.find('#phaser-container')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('game-container')
  })

  it('inicializa el juego Phaser en mounted()', () => {
    expect(wrapper.vm.game).toBeTruthy()
  })

  it('reinicia el juego correctamente', () => {
    const oldGame = wrapper.vm.game
    wrapper.vm.restartGame()
    expect(oldGame.destroy).toHaveBeenCalledWith(true)
    expect(wrapper.vm.game).not.toBe(oldGame)
  })

  it('destruye el juego en beforeUnmount()', () => {
    const destroySpy = wrapper.vm.game.destroy
    wrapper.unmount()
    expect(destroySpy).toHaveBeenCalledWith(true)
  })
})
