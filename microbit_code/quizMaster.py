import microbit
import radio

radio.config(power=7, channel=22)
radio.on()

def move_team(team):
    radio.send(team)
