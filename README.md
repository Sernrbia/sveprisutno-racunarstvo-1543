# Sveprisutno računarstvo projekti

Ispitni zadaci iz predmeta Sveprisutno računarstvo na Master studijama Elektronskog fakulteta.

# Projekat 1

## Opis

Istraživanje na temu ThinEdge servisa.

# Projekat 2

## Opis

Prepoznavanje komandi korišćenjem Arduino Nano BLE 33 uredjaja i čitanje sa senzora blizine.

# Projekat 3

## Opis

Proširenje projekta 2, podaci sa senzora akcelerometra, magnetometra, temperature i pritiska se šalju Bluetooth servisu.

## bluetooth-node

Prima podatke preko bluetooth konekcije i šalje ih dalje preko Mqtt protokola.

## data-reader

Čita podatke preko MQTT protokola i upisuje ih u Infux bazu. Preko web socketa šalje podatke Arduino klijent aplikaciji.

## Arduino-client

Čita podatke preko Websocketa i ispisuje rezultate.
