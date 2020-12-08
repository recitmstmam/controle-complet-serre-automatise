input.onButtonPressed(Button.AB, function () {
    basic.showString("T=" + Math.round(0) + "C")
    basic.pause(1000)
    basic.showString("H=" + Math.round(0) + "%")
    basic.pause(1000)
})
input.onButtonPressed(Button.B, function () {
    pins.digitalWritePin(DigitalPin.P7, 1)
    basic.pause(100)
    Température = smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, AnalogPin.P1)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P7, 0)
    pourcentage = Math.round((0 - 615) * 100 / (1023 - 615))
    basic.showString("" + pourcentage + "%")
})
let pourcentage = 0
let Température = 0
led.setBrightness(100)
Température = 0
let Angle_fenetre = 160
let fin = pins.digitalReadPin(DigitalPin.P5)
servos.P1.setAngle(Angle_fenetre)
servos.P2.setAngle(0)
basic.pause(2000)
servos.P1.stop()
servos.P2.stop()
basic.forever(function () {
    pins.digitalWritePin(DigitalPin.P7, 1)
    basic.pause(100)
    Température = smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, AnalogPin.P1)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P7, 0)
    pourcentage = Math.round((0 - 615) * 100 / (1023 - 615))
    // Si l'humidité du sol est inférieure à 90 % arroser jusqu'à ce que l'humidité soit supérieure à 95%.
    // Lorsque l'humidité du sol est supérieure à 95% arrêter d'arroser jusqu'à ce que l'humidité soit inférieure à 90 %.
    if (pourcentage < 95) {
        servos.P2.setAngle(180)
    } else if (pourcentage >= 95 && pourcentage <= 98) {
        servos.P2.stop()
    } else if (pourcentage > 98) {
        servos.P2.setAngle(0)
    }
    basic.pause(1000)
    servos.P2.stop()
    // 30 secondes avant la prochaine mesure
    basic.pause(30000)
})
basic.forever(function () {
    Température = smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, AnalogPin.P0)
    if (Température >= 25) {
        while (Angle_fenetre > 45) {
            Angle_fenetre += -1
            servos.P1.setAngle(Angle_fenetre)
            basic.pause(15)
        }
        servos.P1.stop()
    } else {
        while (Angle_fenetre < 160) {
            Angle_fenetre += 1
            servos.P1.setAngle(Angle_fenetre)
            basic.pause(15)
        }
        servos.P1.stop()
    }
    if (input.buttonIsPressed(Button.A)) {
        while (Angle_fenetre > 45) {
            Angle_fenetre += -1
            servos.P1.setAngle(Angle_fenetre)
            basic.pause(15)
        }
        servos.P1.stop()
        control.waitForEvent(fin, 0)
    }
})
