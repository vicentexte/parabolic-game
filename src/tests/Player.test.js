import Player from '.modules/Player'
import Phaser from 'phaser'

// Mocks
const mockSetVelocity = jest.fn()
const mockSetCollideWorldBounds = jest.fn()
const mockSetBounce = jest.fn()

const mockSprite = {
  setVelocity: mockSetVelocity,
  setCollideWorldBounds: mockSetCollideWorldBounds,
  setBounce: mockSetBounce,
  body: {
    velocity: { x: 0, y: 0 },
    blocked: { down: false }
  }
}

const mockScene = {
  physics: {
    add: {
      sprite: jest.fn(() => mockSprite)
    }
  },
  PIXELS_PER_METER: 10
}

describe('Player', () => {
  let player

  beforeEach(() => {
    jest.clearAllMocks()
    player = new Player(mockScene, 0, 0)
  })

  test('should initialize player sprite correctly', () => {
    expect(mockScene.physics.add.sprite).toHaveBeenCalledWith(0, 0, 'player')
    expect(mockSetCollideWorldBounds).toHaveBeenCalledWith(true)
    expect(mockSetBounce).toHaveBeenCalledWith(0.3)
    expect(player.canFire).toBe(false)
    expect(player.jumpCount).toBe(0)
  })

  test('should fire with correct velocity when canFire is true', () => {
    player.canFire = true
    const angle = 45
    const velocity = 10 // m/s

    // Fórmulas de conversión
    const rad = Phaser.Math.DegToRad(angle)
    const expectedVx = Math.cos(rad) * velocity * mockScene.PIXELS_PER_METER
    const expectedVy = -Math.sin(rad) * velocity * mockScene.PIXELS_PER_METER

    player.fire(angle, velocity)

    expect(mockSetVelocity).toHaveBeenCalledWith(expectedVx, expectedVy)
    expect(player.canFire).toBe(false)
    expect(player.jumpCount).toBe(1)
  })

  test('should not fire if canFire is false', () => {
    player.canFire = false
    player.fire(60, 15)
    expect(mockSetVelocity).not.toHaveBeenCalled()
  })

  test('should allow firing again when velocity is near 0', () => {
    player.canFire = false
    mockSprite.body.velocity = { x: 0.3, y: 1.5 }
    player.update()
    expect(player.canFire).toBe(true)
  })

  test('should reduce X velocity when touching ground', () => {
    mockSprite.body.velocity = { x: 10, y: 0 }
    mockSprite.body.blocked.down = true
    player.update()
    expect(mockSprite.setVelocityX).toBeDefined()
  })
})
