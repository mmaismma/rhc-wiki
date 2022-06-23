const $ = (x, all) => {
    if (all) return document.querySelectorAll(x);
    return document.querySelector(x)
}

const average = (array) => array.reduce((a, b) => a + b) / array.length;

[...$('input', true)].forEach(elm => {
    elm.addEventListener('input', updatePI)
    elm.addEventListener('click', updatePI)
    elm.addEventListener('focus', elm.select)
});

function updatePI() {
    const hp = $('#hitpoints').value * 1;
    const gapples = $('#gapples').value * 1;
    const sussyStews = $('#sussy-stews').value * 1;
    const health1pots = $('#health-1-pots').value * 1;
    const health2pots = $('#health-2-pots').value * 1;
    
    const sharpness = { 0: 0, 1: 1, 2: 1.5, 3: 2, 4: 2.5, 5: 3 }[$('#sharpness').value * 1];
    const knockback = $('#knockback').value * 0.5;
    let fireAspect = { 0: 0, 1: 3, 2: 7 }[$('#fire-aspect').value * 1] / 2;
    
    const regularArrows = $('#regular-arrow-count').value * 1;
    const spectralArrows = Math.max(1 - (($('#spectral-arrow-count').value * 1) ** (1/2)) / ((2**(1/2)) * 20), 0.9);
    const poisonArrows = Math.min(($('#poison-arrow-count').value * 1) ** (1/2) / 4, 2);
    const harmingArrows = Math.min(($('#harming-arrow-count').value * 1) ** (1/2) * 6 / 8, 6);
    const weaknessArrows = Math.max(1 - (($('#weakness-arrow-count').value * 1) ** (1/2) / 7), 5/7);
    const slownessArrows = Math.max(1-((1-1/1.075)*((($('#slowness-arrow-count').value * 1) ** (1/2))/2)), 1/1.075);
    const totalArrowCount = Math.min($('#regular-arrow-count').value * 1 + $('#spectral-arrow-count').value * 1 + $('#poison-arrow-count').value * 1 + $('#harming-arrow-count').value * 1 + $('#weakness-arrow-count').value * 1 + $('#slowness-arrow-count').value * 1, 64);

    const power = (({ 0: 16 / 3, 1: 25 / 3, 2: 29 / 3, 3: 32 / 3, 4: 37 / 3, 5: 41 / 3 }[$('#power').value * 1]) / 8) * (totalArrowCount ** (1 / 2));
    let punch = $('#punch').value * 1;
    punch = Math.min(punch * 0.5 / 8 * (totalArrowCount ** (1 / 2)), punch * 0.5);
    let flame = $('#flame').checked ? 1 : 0;
    flame = Math.min((flame * 2.5 / 8) * (totalArrowCount ** (1 / 2)), flame * 2.5);

    const crossbow = $('#crossbow').checked ? 9 * ((totalArrowCount / 64) ** (1 / 2)) : 0;
    const fireworkCount = $('#firework-count').value * 1;
    const fireworkStars = $('#firework-stars').value * 1;
    const fireworks = $('#crossbow').checked ? (5.5 + Math.max(fireworkStars - 1, 0) * 1.5) * ((fireworkCount / 64) ** (1 / 2)) : 0;
    
    const lava = $('#lava').checked ? 2 : 0;
    const water = $('#water').checked ? 1 - 1 / 12 : 1;
    const dogs = ($('#dogs').value * 1) ** (1 / 3) * 4;
    const axe = $('#axe').checked ? 0.6 : 0;
    const shield = $('#shield').checked ? 1 / 2 : 1;
    
    const diamondPieces = $('#diamond-pieces').value * 2;
    const armour = Math.max(($('#armour').value * 1)/5, ($('#armour').value * 1) - 7/(2+diamondPieces/4))/25;
    
    const headProtection = $('#head-protection').value * 1;
    const headProjectile = $('#head-projectile').value * 2;
    const headFireprotec = $('#head-fireprotec').value * 2;
    
    const torsoProtection = $('#torso-protection').value * 1;
    const torsoProjectile = $('#torso-projectile').value * 2;
    const torsoFireprotec = $('#torso-fireprotec').value * 2;
    
    const legsProtection = $('#legs-protection').value * 1;
    const legsProjectile = $('#legs-projectile').value * 2;
    const legsFireprotec = $('#legs-fireprotec').value * 2;
    
    const feetProtection = $('#feet-protection').value * 1;
    const feetProjectile = $('#feet-projectile').value * 2;
    const feetFireprotec = $('#feet-fireprotec').value * 2;
    const feetFeatherfall = $('#feet-featherfall').value * 3;

    const protection = Math.min(headProtection + torsoProtection + legsProtection + feetProtection, 20) / 2.5;
    const projectile = Math.min(headProjectile + torsoProjectile + legsProjectile + feetProjectile + protection * 2.5, 20) / 2.5;
    const fireprotec = Math.min(headFireprotec + torsoFireprotec + legsFireprotec + feetFireprotec + protection * 2.5, 20) / 6.5;
    const featherfall = Math.min(feetFeatherfall + protection * 2.5, 20) / (65 / 3);

    const averageEdv = average([protection, projectile, fireprotec, featherfall]) * 4;
    const edv = armour + (1 - armour) * (averageEdv / 25);
    
    const thorns = $('#thorns').value * 0.1875;
    let frostWalker = $('#frost-walker').value * 1;
    frostWalker = { 0: 1, 1: 1 / 1.05, 2: 1 / 1.075 }[frostWalker];
    let depthStrider = $('#depth-strider').value * 1;
    depthStrider = { 0: 1, 1: 1 / 1.05, 2: 1 / 1.1, 3: 1 / 1.15 }[depthStrider];

    const notchApple = $('#notch-apple').checked;
    const totemOfUndying = $('#totem-of-undying').checked ? 36 / (6 ** (1 / 3)) : 0;
    const speed = {0: 1, speed1: 1/1.1, speed2: 1/1.2}[$('[name=speed]:checked').value];
    const strength = {0: 0, strength1: 3, strength2: 6}[$('[name=strength]:checked').value];
    const harming = {0: 0, harming1: 3, harming2: 6}[$('[name=harming]:checked').value];
    const poison = {0: 0, poison1: 2.25, poison2: 4.75,'poison-extended': 6}[$('[name=poison]:checked').value];
    const fireRes = $('#fire-res').checked ? 1 - 1/6 : 1;
    const nightVis = $('#night-vis').checked ? 0.97 : 1;
    const invis = $('#invis').checked ? 0.9 : 1;
    const weakness = $('#weak').checked ? 5/7 : 1;
    const slowness = $('#slow').checked ? 1/1.075 : 1;

    const weaponType = $('[name=weapon-type]:checked').value;
    const meleeWeapon = {
        axe: {
            wood: 2.8 + (sharpness + strength) * 0.4,
            gold: 3.5 + (sharpness + strength) * 0.5,
            stone: 3.6 + (sharpness + strength) * 0.4,
            iron: 4.05 + (sharpness + strength) * 0.45,
            diamond: 4.5 + (sharpness + strength) * 0.5
        }[weaponType],
        sword: {
            wood: 3.2 + (sharpness + strength) * 0.8,
            gold: 3.2 + (sharpness + strength) * 0.8,
            stone: 4 + (sharpness + strength) * 0.8,
            iron: 4.8 + (sharpness + strength) * 0.8,
            diamond: 5.6 + (sharpness + strength) * 0.8
        }[weaponType]
    }[$('[name=melee-weapon]:checked').value] || 0;
    
    const health = (hp
        + (((6 * gapples) + (3 * sussyStews) + (4 * health1pots) + (8 * health2pots)) / ((gapples + sussyStews + health1pots + health2pots) ** (1 / 3)) || 0)
        + (notchApple ? 24/(4 ** (1/3)) : 0))
        + (totemOfUndying ? 36/(6**(1/3)) : 0);

    const damage = (meleeWeapon ? meleeWeapon + knockback + fireAspect : 1) + Math.max(power + punch + flame, crossbow) + poisonArrows + harmingArrows + fireworks + lava + dogs + axe + thorns + poison + harming;

    const multiplier = 1/(1-edv)/(spectralArrows*weaknessArrows*slownessArrows*water*speed*fireRes*nightVis*invis*weakness*slowness*(notchApple ? 1-1/6 : 1)*(notchApple ? 0.8 : 1)*shield*frostWalker*depthStrider)
    
    $('#damage-pi').textContent = damage.toFixed(3);
    $('#health-pi').textContent = health.toFixed(3);
    $('#multiplier-pi').textContent = multiplier.toFixed(3);
    
    const PI = (health * damage * multiplier) / 20
    
    $('#pi').textContent = PI.toFixed(3);
}
