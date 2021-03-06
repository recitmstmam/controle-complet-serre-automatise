input.onButtonPressed(Button.A, function () {
    adjust = heure
    time = "" + adjust
    time = "" + time + ":"
    time = "" + time + Math.trunc(minutes / 10)
    time = "" + time + Math.trunc(minutes % 10)
    basic.showString(time)
})
input.onButtonPressed(Button.B, function () {
    pins.digitalWritePin(DigitalPin.P7, 1)
    basic.pause(100)
    sol = pins.analogReadPin(AnalogPin.P3)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P7, 0)
    // Ajuster cette valeur dans tous ce calcul avec la valeur de la variable « sol » lorsque la sonde n'est pas dans le sol.
    pourcentage = Math.round((sol - 600) * 100 / (1023 - 600))
    basic.showString("T=" + Température + "C")
    basic.pause(1000)
    basic.showString("H=" + pourcentage + "%")
    basic.pause(1000)
})
let range2: neopixel.Strip = null
let range: neopixel.Strip = null
let pourcentage = 0
let sol = 0
let Température = 0
let minutes = 0
let heure = 0
let adjust = 0
let time = ""
radio.setGroup(1)
led.setBrightness(255)
time = ""
adjust = 0
// Ajuster l'heure lorsque vous démarrerez le micro:bit
heure = 10
// Ajuster les minutes lorsque vous démarrerez le micro:bit
minutes = 45
Température = smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, AnalogPin.P0)
let Angle_fenetre = 160
let strip = neopixel.create(DigitalPin.P12, 40, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
servos.P1.setAngle(Angle_fenetre)
servos.P2.setAngle(10)
basic.pause(2000)
servos.P1.stop()
servos.P2.stop()
basic.forever(function () {
    pins.digitalWritePin(DigitalPin.P7, 1)
    basic.pause(100)
    sol = pins.analogReadPin(AnalogPin.P3)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P7, 0)
    // Ajuster cette valeur dans tous ce calcul avec la valeur de la variable « sol » lorsque la sonde n'est pas dans le sol.
    pourcentage = Math.round((sol - 600) * 100 / (1023 - 600))
    // Si l'humidité du sol est inférieure à 95 % arroser jusqu'à ce que l'humidité soit supérieure à 98%.
    // Lorsque l'humidité du sol est supérieure à 98% arrêter d'arroser jusqu'à ce que l'humidité soit inférieure à 95 %.
    if (pourcentage < 90) {
        servos.P2.setAngle(160)
    } else if (pourcentage >= 90 && pourcentage <= 97) {
        servos.P2.stop()
    } else if (pourcentage > 97) {
        servos.P2.setAngle(10)
    }
    radio.sendValue("H ", pourcentage)
    basic.pause(1000)
    servos.P2.stop()
    // 1 minute avant la prochaine mesure
    basic.pause(60000)
})
basic.forever(function () {
    // Calibrer votre sonde avec un autre thermomètre et ajuster le calcul en conséquence.
    Température = smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, AnalogPin.P0) + 2
    basic.pause(100)
    radio.sendValue("T ", Température)
    // Ajuster cette valeur en fonction de vos paramètres expérimentaux
    if (Température >= 25) {
        // Auster cette valeur de l'angle d'ouverture pour que la fenêtre reste ouverte sans courant.
        while (Angle_fenetre > 51) {
            Angle_fenetre += -1
            servos.P1.setAngle(Angle_fenetre)
            basic.pause(10)
        }
        servos.P1.stop()
    } else {
        // Auster cette valeur de l'angle de fermeture pour que la fenêtre ferme correctement.
        while (Angle_fenetre < 160) {
            Angle_fenetre += 1
            servos.P1.setAngle(Angle_fenetre)
            basic.pause(10)
        }
        servos.P1.stop()
    }
    // 60 secondes avant la prochaine mesure
    basic.pause(60000)
})
// Ne pas toucher à cette partie du programme car elle gère votre horloge.
basic.forever(function () {
    basic.pause(60000)
    if (minutes < 59) {
        minutes += 1
    } else {
        minutes = 0
        if (heure < 23) {
            heure += 1
        } else {
            heure = 0
        }
    }
})
basic.forever(function () {
    // Permet d'ajuster l'intensité lumineuse des DEL
    strip.setBrightness(255)
    // Ajuster l'heure à laquelle vous désirez ouvrir les lumières.
    if (heure == 18 && minutes == 0) {
        // Permet de sélectionner des couleurs d'éclairage.  Ici les DEL 0 à 19 sont bleues et les DEL 20 à 40 sont rouges.  Si on veut ajouter d'autres couleurs, il faut créer un nouvelle variable (ex : range3).SI on veut une seule couleur, on retire les blocs en lien avec "range2".
        range = strip.range(0, 20)
        range2 = strip.range(20, 20)
        range.showColor(neopixel.colors(NeoPixelColors.Blue))
        range2.showColor(neopixel.colors(NeoPixelColors.Red))
    }
    // Ajuster l'heure à laquelle vous désirez fermer les lumières.
    if (heure == 7 && minutes == 30) {
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
})
