import Player from '../modules/Player';

describe('Player class', () => {
  let mockSprite;
  let mockScene;
  let player;

  beforeEach(() => {
    mockSprite = {
      setVelocity: jest.fn(),
      setVelocityX: jest.fn(),
      setBounce: jest.fn(),
      setCollideWorldBounds: jest.fn(),
      body: {
        velocity: { x: 100 },
        blocked: { down: false },
      },
    };

    mockScene = {
      physics: {
        add: {
          sprite: jest.fn().mockReturnValue(mockSprite),
        },
      },
    };

    player = new Player(mockScene, 0, 0, 50, 45); // velocity=50, angle=45°
  });

  test('fire() should set velocity based on angle and velocity', () => {
    player.fire();

    // Valores esperados
    const rad = 45 / 360 * 2 * Math.PI;
    const expectedVx = 50 * Math.cos(rad);
    const expectedVy = -50 * Math.sin(rad);

    expect(mockSprite.setVelocity).toHaveBeenCalledWith(expectedVx, expectedVy);
  });

  test('update() should reduce X velocity when sprite is on the ground', () => {
    mockSprite.body.blocked.down = true;
    mockSprite.body.velocity.x = 100;

    player.update();

    expect(mockSprite.setVelocityX).toHaveBeenCalledWith(90); // 100 * 0.9
  });

  test('update() should do nothing when sprite is not on the ground', () => {
    mockSprite.body.blocked.down = false;

    player.update();

    expect(mockSprite.setVelocityX).not.toHaveBeenCalled();
  });
});
