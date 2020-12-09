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
    sol = pins.analogReadPin(AnalogPin.P4)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P7, 0)
    // Ajuster cette valeur dans tous ce calcul avec la valeur de la variable « sol » lorsque la sonde n'est pas dans le sol.
    pourcentage = Math.round((sol - 600) * 100 / (1023 - 600))
    basic.showString("T=" + Température + "C")
    basic.pause(1000)
    basic.showString("H=" + pourcentage + "%")
    basic.pause(1000)
})
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
heure = 17
minutes = 10
Température = smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, AnalogPin.P0)
let Angle_fenetre = 160
let strip = neopixel.create(DigitalPin.P12, 40, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
servos.P1.setAngle(Angle_fenetre)
servos.P2.setAngle(0)
basic.pause(2000)
servos.P1.stop()
servos.P2.stop()
basic.forever(function () {
    pins.digitalWritePin(DigitalPin.P7, 1)
    basic.pause(100)
    sol = pins.analogReadPin(AnalogPin.P4)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P7, 0)
    // Ajuster cette valeur dans tous ce calcul avec la valeur de la variable « sol » lorsque la sonde n'est pas dans le sol.
    pourcentage = Math.round((sol - 600) * 100 / (1023 - 600))
    // Si l'humidité du sol est inférieure à 95 % arroser jusqu'à ce que l'humidité soit supérieure à 98%.
    // Lorsque l'humidité du sol est supérieure à 98% arrêter d'arroser jusqu'à ce que l'humidité soit inférieure à 95 %.
    if (pourcentage < 95) {
        servos.P2.setAngle(180)
    } else if (pourcentage >= 95 && pourcentage <= 98) {
        servos.P2.stop()
    } else if (pourcentage > 98) {
        servos.P2.setAngle(0)
    }
    radio.sendValue("H ", pourcentage)
    basic.pause(1000)
    servos.P2.stop()
    // 60 secondes avant la prochaine mesure
    basic.pause(5000)
})
basic.forever(function () {
    // Calibrer votre sonde avec un autre thermomètre et ajuster le calcul en conséquence.
    Température = smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, AnalogPin.P0) + 4
    basic.pause(100)
    radio.sendValue("T ", Température)
    // Ajuster cette valeur en fonction de vos paramètres expérimentaux
    if (Température >= 27) {
        // Auster cette valeur de l'angle d'ouverture pour que la fenêtre reste ouverte sans courant.
        while (Angle_fenetre > 35) {
            Angle_fenetre += -1
            servos.P1.setAngle(Angle_fenetre)
            basic.pause(15)
        }
        servos.P1.stop()
    } else {
        // Auster cette valeur de l'angle de fermeture pour que la fenêtre ferme correctement.
        while (Angle_fenetre < 160) {
            Angle_fenetre += 1
            servos.P1.setAngle(Angle_fenetre)
            basic.pause(15)
        }
        servos.P1.stop()
    }
    // 60 secondes avant la prochaine mesure
    basic.pause(5000)
})
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
    if (heure == 17 && minutes == 11) {
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
    }
    if (heure == 17 && minutes == 12) {
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
})
