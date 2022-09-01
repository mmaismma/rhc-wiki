const $ = (x, all) => {
    if (all) return document.querySelectorAll(x);
    return document.querySelector(x)
}
const canvas = $('canvas');
const ctx = canvas.getContext('2d');

const canvasBorderOffset = 0.025 * canvas.width;
const canvasBorderRadius = 0.03 * canvas.width;

const hitboxes = {
    cardTypeCircle: {
        path: new Path2D(),
        draw() {
            
        }
    }
}

function updateCanvas() {
    // white fill
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // yellow fill with rounded border
    ctx.fillStyle = "#f3d992";
    ctx.beginPath();
    ctx.moveTo(canvasBorderOffset, canvasBorderOffset);
    ctx.arcTo(canvas.width - canvasBorderOffset, canvasBorderOffset, canvas.width - canvasBorderOffset, canvas.height - canvasBorderOffset, canvasBorderRadius)
    ctx.arcTo(canvas.width - canvasBorderOffset, canvas.height - canvasBorderOffset, canvasBorderOffset, canvas.height - canvasBorderOffset, canvasBorderRadius)
    ctx.arcTo(canvasBorderOffset, canvas.height - canvasBorderOffset, canvasBorderOffset, canvasBorderOffset, canvasBorderRadius)
    ctx.arcTo(canvasBorderOffset, canvasBorderOffset, canvas.width - canvasBorderOffset, canvasBorderOffset, canvasBorderRadius);
    ctx.closePath();
    ctx.fill();

    // white rectangle for picture
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0.11 * canvas.width, 0.13 * canvas.height, 0.78 * canvas.width, 0.52 * canvas.height);

    // white move-seperator line
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0.045 * canvas.width, 0.80 * canvas.height, 0.91 * canvas.width, 0.022 * canvas.height);

    // white circle for card type
    ctx.fillStyle = "#ffffff"
    ctx.beginPath();
    ctx.arc(0.9 * canvas.width, 0.1 * canvas.height, 0.1 * canvas.width, 0, Math.PI * 2);
    ctx.fill();

    // card name
    let cardName = "Impulse"
    ctx.fillStyle = "#000000";
    cardName = cardName.split('').join(' ');
    ctx.font = `${0.1 * canvas.width}px BadaBoom`;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(cardName, 0.11 * canvas.width, 0.03 * canvas.height)

    // hp
    let hp = "280"
    ctx.fillStyle = "#ff0000";
    hp = hp.split('').join(' ');
    ctx.font = `${0.1 * canvas.width}px BadaBoom`;
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillText(hp, 0.79 * canvas.width, 0.03 * canvas.height)

    // attack 1 name
    let attack1Name = "afk";
    ctx.fillStyle = "#000000";
    attack1Name = attack1Name.split('').join(' ');
    ctx.font = `${0.1 * canvas.width}px BadaBoom`;
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText(attack1Name, 0.5 * canvas.width, 0.68 * canvas.height)

    // attack 1 ap
    let attack1Ap = "40"
    ctx.fillStyle = "#ff0000";
    attack1Ap = attack1Ap.split('').join(' ');
    ctx.font = `${0.1 * canvas.width}px BadaBoom`;
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillText(attack1Ap, 0.94 * canvas.width, 0.68 * canvas.height)

    // attack 2 name
    let attack2Name = "entity cram";
    ctx.fillStyle = "#000000";
    attack2Name = attack2Name.split('').join(' ');
    ctx.font = `${0.1 * canvas.width}px BadaBoom`;
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText(attack2Name, 0.5 * canvas.width, 0.85 * canvas.height)

    // attack 2 ap
    let attack2Ap = "90"
    ctx.fillStyle = "#ff0000";
    attack2Ap = attack2Ap.split('').join(' ');
    ctx.font = `${0.1 * canvas.width}px BadaBoom`;
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillText(attack2Ap, 0.94 * canvas.width, 0.85 * canvas.height)

    for (object in hitboxes) {
        hitboxes[object].draw();
    }
}

updateCanvas()