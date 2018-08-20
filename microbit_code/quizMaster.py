import microbit
import radio

microbit.uart.init(115200)

radio.config(power=7, channel=22)
radio.on()

buffer = ""

a_state_prev = True
b_state_prev = True

microbit.pin2.set_pull(microbit.pin2.PULL_UP)
microbit.pin13.set_pull(microbit.pin13.PULL_UP)

while True:
    if microbit.uart.any(): #new serial info?
        buffer += str(microbit.uart.read(), 'utf-8') #add it to the buffer, converting to str
    if buffer: #anything in the buffer?
        if buffer[-1] == '\n': #last character a newline?
            for team in buffer[:-1].split('\n'): #see how many other newlines there are
                radio.send(team) #send out the team commands
            buffer = "" #empty the buffer
    a_state = microbit.pin13.read_digital()
    if a_state != a_state_prev:
        if not a_state:
            microbit.uart.write(b'A\n')
    a_state_prev = a_state
    b_state = microbit.pin2.read_digital()
    if b_state != b_state_prev:
        if not b_state:
            microbit.uart.write(b'B\n')
    b_state_prev = b_state
    if microbit.button_a.was_pressed():
        microbit.uart.write(b'A\n')
    if microbit.button_b.was_pressed():
        microbit.uart.write(b'B\n')
