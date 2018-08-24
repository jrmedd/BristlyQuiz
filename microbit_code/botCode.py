import microbit
import radio

#set a device ID
this_device = "B"

radio.config(power=7, channel=22)
radio.on() #start radio comms
microbit.pin0.write_digital(0)

while True:
    if microbit.button_a.is_pressed():
        microbit.display.show(this_device) #display this device's ID if button A is pressed
    elif microbit.button_b.is_pressed():
        microbit.pin0.write_digital(1)
        microbit.sleep(5000)
        microbit.pin0.write_digital(0)
    else:
        microbit.display.clear()
    received_messages = radio.receive() #check for messages over radio
    if received_messages:
        if received_messages == this_device: #first array element will be the ID
            microbit.pin0.write_digital(1)
            microbit.sleep(5000)
            microbit.pin0.write_digital(0)
