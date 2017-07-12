import microbit
import radio

radio.on()

def move_team(team):
    radio.send(team)
