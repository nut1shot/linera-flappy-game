export class Pipe {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = canvas.width;
    this.width = 52;
    this.gap = 160;
    this.top = Math.random() * (canvas.height - this.gap - 100);
    this.bottom = this.top + this.gap;
    this.speed = 1.5;
    this.passed = false;

    this.topImage = new Image();
    this.topImage.src = "/assets/pipe-top.png";

    this.bottomImage = new Image();
    this.bottomImage.src = "/assets/pipe-bottom.png";
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    // Only draw if images are loaded to avoid errors
    if (this.topImage.complete && this.topImage.naturalWidth !== 0) {
      this.ctx.drawImage(
        this.topImage,
        this.x,
        this.top - this.topImage.height,
        this.width,
        this.topImage.height
      );
    }

    if (this.bottomImage.complete && this.bottomImage.naturalWidth !== 0) {
      this.ctx.drawImage(
        this.bottomImage,
        this.x,
        this.bottom,
        this.width,
        this.canvas.height - this.bottom
      );
    }
  }

  collides(bird) {
    // Use circular collision detection for the bird
    const birdCenterX = bird.x + bird.width / 2;
    const birdCenterY = bird.y + bird.height / 2;
    const birdRadius = bird.width / 2.5; // Assume bird is roughly circular

    // Check if bird's center is horizontally aligned with the pipe
    const inPipeX =
      birdCenterX + birdRadius > this.x &&
      birdCenterX - birdRadius < this.x + this.width;

    if (!inPipeX) return false;

    // Check collision with top pipe using circle-to-rectangle collision
    const hitTop = this.circleRectCollision(
      birdCenterX,
      birdCenterY,
      birdRadius,
      this.x,
      0,
      this.width,
      this.top
    );

    // Check collision with bottom pipe using circle-to-rectangle collision
    const hitBottom = this.circleRectCollision(
      birdCenterX,
      birdCenterY,
      birdRadius,
      this.x,
      this.bottom,
      this.width,
      this.canvas.height - this.bottom
    );

    return hitTop || hitBottom;
  }

  // Helper function for circle-to-rectangle collision detection
  circleRectCollision(
    circleX,
    circleY,
    radius,
    rectX,
    rectY,
    rectWidth,
    rectHeight
  ) {
    // Find the closest point on the rectangle to the circle's center
    const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
    const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

    // Calculate the distance between the circle's center and the closest point
    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    // Collision occurs if the distance is less than the circle's radius
    return distanceSquared < radius * radius;
  }
}
