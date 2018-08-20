import microbit
import radio

microbit.uart.init(115200)

radio.config(power=7, channel=22)
radio.on()

buffer = ""

while True:
    if microbit.uart.any(): #new serial info?
        buffer += str(microbit.uart.read(), 'utf-8') #add it to the buffer, converting to str
    if buffer: #anything in the buffer?
        if buffer[-1] == '\n': #last character a newline?
            for team in buffer[:-1].split('\n'): #see how many other newlines there are
                radio.send(team) #send out the team commands
            buffer = "" #empty the buffer
    if microbit.button_a.was_pressed():
        microbit.uart.write(b'A\n')
    if microbit.button_b.was_pressed():
        microbit.uart.write(b'B\n')
