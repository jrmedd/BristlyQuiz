import microbit

microbit.pin2.write_digital(0)

while True:
    microbit.pin2.write_digital(1)
    microbit.sleep(2000)
    microbit.pin2.write_digital(0)
    microbit.sleep(2000)
