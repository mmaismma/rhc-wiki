const $ = (x, all) => {
    if (all) return document.querySelectorAll(x);
    return document.querySelector(x)
}

const average = (array) => array.reduce((a, b) => a + b) / array.length;

[...$('input', true)].forEach(elm => {
    elm.oninput = updatePI;
    elm.onfocus = elm.select;
});

function updatePI() {
    const hp = $('#hitpoints').value * 1;
    const gapples = $('#gapples').value * 1;
    const health1pots = $('#health-1-pots').value * 1;
    const health2pots = $('#health-2-pots').value * 1;

    const sword = $('[name=sword]:checked').value * 1;
    const sharpness = $('#sharpness').value * 1;
    const knockback = $('#knockback').value * 1;
    const fireAspect = $('#fire-aspect').value * 1;
    
    const hasBow = $('#has-bow').checked;
    const arrowCount = $('#arrow-count').value * 1;
    let power = $('#power').value * 1
    power = power == 1 ? 8.3 : (power == 2 ? 9.7 : (power == 3 ? 10.7 : (power == 4 ? 12.3 : (power == 5 ? 13.7 : (hasBow ? 5.3 : 0)))));
    const punch = $('#punch').value * 1;
    const flame = $('#flame').checked ? 1 : 0;
    
    const lava = $('#lava').checked;
    const water = $('#water').checked ? 1 - 1/12 : 1;
    const dogs = $('#dogs').value * 1;
    
    const armour = $('#armour').value * 0.04;
    
    let headProtection = $('#head-protection').value * 1;
    headProtection = headProtection == 4 ? 5 : headProtection
    let headProjectile = $('#head-projectile').value * 1;
    headProjectile = headProjectile ? headProjectile == 1 ? 3 : headProjectile == 2 ? 5 : headProjectile == 3 ? 7 : 11 : 0
    let headFireprotec = $('#head-fireprotec').value * 1;
    headFireprotec = headFireprotec == 4 ? 9 : headFireprotec * 2
    let headFeatherfall = $('#head-featherfall').value * 1;
    headFeatherfall = headFeatherfall ? headFeatherfall == 1 ? 5 : headFeatherfall == 2 ? 8 : headFeatherfall == 3 ? 12 : 18 : 0
    
    let torsoProtection = $('#torso-protection').value * 1;
    torsoProtection = torsoProtection == 4 ? 5 : torsoProtection
    let torsoProjectile = $('#torso-projectile').value * 1;
    torsoProjectile = torsoProjectile ? torsoProjectile == 1 ? 3 : torsoProjectile == 2 ? 5 : torsoProjectile == 3 ? 7 : 11 : 0
    let torsoFireprotec = $('#torso-fireprotec').value * 1;
    torsoFireprotec = torsoFireprotec == 4 ? 9 : torsoFireprotec * 2
    let torsoFeatherfall = $('#torso-featherfall').value * 1;
    torsoFeatherfall = torsoFeatherfall ? torsoFeatherfall == 1 ? 5 : torsoFeatherfall == 2 ? 8 : torsoFeatherfall == 3 ? 12 : 18 : 0
    
    let legsProtection = $('#legs-protection').value * 1;
    legsProtection = legsProtection == 4 ? 5 : legsProtection
    let legsProjectile = $('#legs-projectile').value * 1;
    legsProjectile = legsProjectile ? legsProjectile == 1 ? 3 : legsProjectile == 2 ? 5 : legsProjectile == 3 ? 7 : 11 : 0
    let legsFireprotec = $('#legs-fireprotec').value * 1;
    legsFireprotec = legsFireprotec == 4 ? 9 : legsFireprotec * 2
    let legsFeatherfall = $('#legs-featherfall').value * 1;
    legsFeatherfall = legsFeatherfall ? legsFeatherfall == 1 ? 5 : legsFeatherfall == 2 ? 8 : legsFeatherfall == 3 ? 12 : 18 : 0
    
    let feetProtection = $('#feet-protection').value * 1;
    feetProtection = feetProtection == 4 ? 5 : feetProtection
    let feetProjectile = $('#feet-projectile').value * 1;
    feetProjectile = feetProjectile ? feetProjectile == 1 ? 3 : feetProjectile == 2 ? 5 : feetProjectile == 3 ? 7 : 11 : 0
    let feetFireprotec = $('#feet-fireprotec').value * 1;
    feetFireprotec = feetFireprotec == 4 ? 9 : feetFireprotec * 2
    let feetFeatherfall = $('#feet-featherfall').value * 1;
    feetFeatherfall = feetFeatherfall ? feetFeatherfall == 1 ? 5 : feetFeatherfall == 2 ? 8 : feetFeatherfall == 3 ? 12 : 18 : 0
    
    const thorns = $('#thorns').value * 1;

    const notchApple = $('#notch-apple').checked ? 54 : 0;
    const speed = $('#speed').checked ? 1/1.1 : 1;
    const speed2 = $('#speed2').checked ? 1/1.2 : 1;
    const fireRes = $('#fire-res').checked ? 1 - 1/6 : 1;
    const nightVis = $('#night-vis').checked ? 0.97 : 1;
    const strength = $('#strength').checked ? 1.3 : 1;
    const strength2 = $('#strength2').checked ? 2.6 : 1;
    const invis = $('#invis').checked ? 0.9 : 1;
    const poison = $('#poison').checked ? 2.25 : 0;
    const poisonEx = $('#poison-ex').checked ? 6 :0;
    const poison2 = $('#poison2').checked ? 4.75 : 0;
    const weak = $('#weak').checked ? 0.875 : 1;
    const slow = $('#slow').checked ? 1/1.075 : 1;
    const harming = $('#harming').checked ? 3 : 0;
    const harming2 = $('#harming2').checked ? 6 : 0;
    
    const health = (hp
        + (((4 * gapples) + (4 * health1pots) + (8 * health2pots)) / ((gapples + health1pots + health2pots) ** (1 / 3)) || 0)
        + (notchApple));
    
    const swordDamage = (sword + (sharpness * 1.25) + (knockback * 0.5) + (fireAspect ? (fireAspect == 1 ? 3 : 7) : 0)/2) * (strength) * (strength2);
    const bowDamage = ((arrowCount < 64 ? (power / 8) * (arrowCount ** (1 / 2)) : power) + (arrowCount < 64 ? (punch * 0.5 / 8) * (arrowCount ** (1 / 2)) : punch * 0.5) + (arrowCount < 64 ? (flame * 2.5 / 8) * (arrowCount ** (1 / 2)) : flame * 2.5));
    const potDamage = ((lava ? 2 : 0) + (dogs ** (1/4)) * 4) + thorns * 0.375 + (poison + poisonEx + poison2) + (harming + harming2);
    const damage = (swordDamage
        + bowDamage
        + potDamage);

    const protection = Math.min(headProtection + torsoProtection + legsProtection + feetProtection, 19)
    const edv = (armour + ((1 - armour) * (((average([protection, Math.min(headProjectile + torsoProjectile + legsProjectile + feetProjectile + protection, 19)/2, Math.min(headFireprotec + torsoFireprotec + legsFireprotec + feetFireprotec + protection, 19)/4, Math.min(headFeatherfall + torsoFeatherfall + legsFeatherfall + feetFeatherfall + protection, 19)/8]) * 2.13) / 100) * 4)));
    const multiplier = 1/(1-edv)/(water*speed*speed2*fireRes*nightVis*invis*weak*slow*(notchApple ? 1-1/6 : 1)*(notchApple ? 0.8 : 1))
    
    $('#damage-pi').textContent = damage.toFixed(3);
    $('#health-pi').textContent = health.toFixed(3);
    $('#multiplier-pi').textContent = multiplier.toFixed(3);
    
    const PI = (health * damage * multiplier) / 20
    
    $('#pi').textContent = PI.toFixed(3);
}
